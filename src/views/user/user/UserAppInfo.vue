<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Users App Info</h3>
            <el-tooltip class="ml-3" content="Manage active user for your company." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Download User List" placement="top">
            <base-button :loading="downloadingUsers" icon size="sm" type="primary" @click="downloadUser">
              <span class="btn-inner--icon">
                <i class="fas fa-download"></i>
              </span>
              <span class="btn-inner--text">Download</span>
            </base-button>
          </el-tooltip>
          <el-tooltip content="Filters" placement="top">
            <base-button
              icon
              size="sm"
              type="primary"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)"
            >
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
              <span class="btn-inner--text">Filters</span>
            </base-button>
          </el-tooltip>
        </div>
      </div>

      <filter-drawer-component
        v-if="isFilterModelActive"
        :visible.sync="isFilterModelActive"
        direction="rtl"
        title="User Filter"
        @closeBtn="onFilterSubmit"
        @resetBtn="resetBtn"
      >
        <base-input label="User Name" v-model="filters.name" name="name" placeholder="e.g. John Doe"></base-input>
        <base-input label="User Code" v-model="filters.code" name="code" placeholder="e.g. CAD001"></base-input>
        <territory-lazydropdown
          label="Territory"
          v-model="filters.territory_id"
          :add-button="false"
          searchable-key="q"
          class="ml-1"
          placeholder="e.g. Dhaka"
        ></territory-lazydropdown>
      </filter-drawer-component>
    </div>

    <el-table
      v-loading="loading"
      :data="users"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
    >
      <el-table-column label="Name" min-width="210px" prop="name" sortable>
        <template v-slot="{ row }">
          <async-image v-slot="slotProps" v-if="row.propic_url" :url="row.propic_url">
            <img :src="slotProps.imageSrc" class="rounded-circle avatar avatar-lg" alt="Profile Picture" /> <b> {{ ' ' + row.name }}</b>
          </async-image>
          <div v-else>
            <img :src="`${$cdn}/img/avatar.png`" class="rounded-circle avatar avatar-lg " alt="Profile Picture" />
            <b> {{ ' ' + row.name }}</b>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Code" min-width="150px" prop="code" sortable></el-table-column>
      <el-table-column label="Email" min-width="150px" prop="email" sortable></el-table-column>

      <el-table-column label="App Version" min-width="130px" sortable>
        <template v-slot="{ row }">
          <b>{{ row.app_version ? row.app_version : 'Not Yet' }}</b>
        </template>
      </el-table-column>
      <el-table-column label="App Install Place" min-width="200px" sortable>
        <template v-slot="{ row }">
          {{ row.app_install_place ? row.app_install_place : ' ' }}
        </template>
      </el-table-column>
      <el-table-column label="Last Time Login" min-width="150px" prop="last_time_login" sortable>
        <template v-slot="{ row }">
          <span v-if="row.last_time_login">{{ row.last_time_login | datetime('lll') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Territory" min-width="130px" sortable>
        <template v-slot="{ row }">
          <b>{{ row.territory ? row.territory.name : 'None' }}</b>
        </template>
      </el-table-column>
    </el-table>

    <base-pagination
      v-if="users.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      class="mt-3"
      :disabled="loading"
    ></base-pagination>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
import User from '@/intefaces/User.js';
import GIFModal from '@/components/tour/GIFModal.vue';
import ViewUserAcl from '@/views/user/user/ViewUserAcl.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import FilterDrawerComponent from '@/components/FilterDrawerComponent.vue';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import TerritoryLazydropdown from '@/components/lazyDropdown/TerritoryLazydropdown.vue';

import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip } from 'element-ui';
import RoleLazydropdown from '@/components/lazyDropdown/RoleLazydropdown.vue';
import { QueryBuilder } from '@/classes/QueryBuilder';
import AsyncImage from '@/components/AsyncImage.vue';
import { Permission as PermissionEnum } from '@/enums/Permission';

@Component({
  components: {
    AsyncImage,
    RoleLazydropdown,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    ViewUserAcl,
    GIFModal,
    FilterDrawerComponent,
    UserLazydropdown,
    TerritoryLazydropdown
  }
})
export default class UserList extends Mixins(PaginationComponentMixin) {
  private users: User[] = [];
  private downloadingUsers = false;
  private isActive = false;
  private isUpdate = false;
  private showUserAclList = false;
  private currentUser: any = [];
  private showGIF = false;
  private query: any = [];
  private isFilterModelActive = false;
  private afterQuery: boolean = false;
  private statuses = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' }
  ];
  private form = {
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    territory_id: '',
    password: '',
    password_confirmation: '',
    permissions: [],
    roles: [],
    status: true,
    code: '',
    device_id: ''
  };
  private filters: any = {
    name: '',
    code: '',
    territory_id: ''
  };
  private queryBuilder = new QueryBuilder();
  private demoTourEntity: string = 'user';
  private GIFs: Array<any> = [
    {
      label: 'Create a user',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a user',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a user',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of user';

  get permissionEnum() {
    return PermissionEnum;
  }

  get user_id() {
    return this.$store.getters['Auth/user'].id;
  }

  created() {
    this.fetchUser();
  }

  @Watch('filters.name', { deep: true })
  onChangeNameFiler(newVal: string) {
    this.queryBuilder.addListener('q', newVal);
  }

  @Watch('filters.code', { deep: true })
  onChangeCodeFiler(newVal: string) {
    this.queryBuilder.addListener('code', newVal);
  }

  @Watch('filters.territory_id', { deep: true })
  onChangeTerritoryFiler(newVal: string) {
    this.queryBuilder.addListener('t', newVal);
  }

  @Watch('pagination.currentPage')
  onChangePage(newVal: any) {
    this.queryBuilder.addListener('page', newVal);
  }

  resetBtn() {
    this.filters.name = '';
    this.filters.code = '';
    this.filters.territory_id = '';
  }

  onFilterSubmit() {
    this.isFilterModelActive = false;
  }

  @Watch('queryBuilder.watch')
  fetchUser(): void {
    this.loading = true;
    this.$http.get(this.$api(`/users${this.queryBuilder.getFilters(true)}`)).then(response => {
      this.users = response.data.users;
      // eslint-disable-next-line no-console
      console.log('usersss', this.users);
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  async downloadUser() {
    this.downloadingUsers = true;
    try {
      const link = document.createElement('a');
      link.href = this.$api(`/user-app-info-download?download&${this.queryBuilder.getFilters(false)}`);
      link.click();
    } catch (e) {
      this.$notify({ type: 'warning', message: 'Unable to download.', title: 'Something went wrong!' });
    } finally {
      this.downloadingUsers = false;
    }
  }
}
</script>
