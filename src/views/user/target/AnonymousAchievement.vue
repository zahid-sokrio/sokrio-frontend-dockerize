<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Users</h3>
            <el-tooltip class="ml-3" content="Manage active user for your company." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
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
          <el-tooltip content="Download User List" placement="top">
            <base-button :loading="downloadingUsers" icon size="sm" type="primary" @click="downloadUser">
              <span class="btn-inner--icon">
                <i class="fas fa-download"></i>
              </span>
              <span class="btn-inner--text">Download</span>
            </base-button>
          </el-tooltip>
        </div>
      </div>

      <filter-drawer-component
        v-if="isFilterModelActive"
        :visible.sync="isFilterModelActive"
        direction="rtl"
        title="Anonymous Achievement Filter"
        @closeBtn="onFilterSubmit"
        @resetBtn="resetBtn"
      >
        <base-input label="User Name" v-model="filters.name" name="name" placeholder="e.g. John Doe"></base-input>
        <territory-lazydropdown
          label="Territory"
          v-model="filters.territory_id"
          :add-button="false"
          searchable-key="q"
          class="ml-1"
          placeholder="e.g. Dhaka"
        ></territory-lazydropdown>
        <div class="clr"></div>
        <DateRangeForReport v-model="filters.range" label-prop="Date Range"></DateRangeForReport>
        <div class="clr"></div>
      </filter-drawer-component>
    </div>

    <el-table
      v-loading="loading"
      :data="anonymous_achievements"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
    >
      <el-table-column label="Name" min-width="210px" prop="name" align="center" sortable>
        <template v-slot="{ row }">
          <strong> {{ row.username }} </strong>
        </template>
      </el-table-column>
      <el-table-column label="Territory" min-width="210px" align="center" sortable>
        <template v-slot="{ row }">
          <strong> {{ row.territory_name }} </strong>
        </template>
      </el-table-column>
      <el-table-column label="Product name" min-width="200px" prop="product_name" align="center" sortable></el-table-column>

      <el-table-column label="Quantity" min-width="200px" prop="qty" align="center" sortable></el-table-column>

      <el-table-column label="Achieved" min-width="150px" prop="achieved" align="center" sortable></el-table-column>

      <!-- <el-table-column label="" min-width="200px" prop="created_at" sortable></el-table-column> -->
      <el-table-column label="Create Date" min-width="120px" prop="created_at" align="center" sortable>
        <template v-slot="{ row }">
          <span v-if="row.created_at">{{ row.created_at | datetime('ll') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--        User Delete Modal-->
    <base-pagination
      v-if="anonymous_achievements.length > 0"
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
import CreateUser from '@/views/user/user/CreateUser.vue';
import CreateBulkUsers from '@/views/user/user/CreateBulkUsers.vue';
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
import DateRangeForReport from '@/components/DateRangeForReports.vue';

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
    CreateUser,
    CreateBulkUsers,
    ViewUserAcl,
    GIFModal,
    FilterDrawerComponent,
    UserLazydropdown,
    TerritoryLazydropdown,
    DateRangeForReport
  }
})
export default class AnonymousAchievement extends Mixins(PaginationComponentMixin) {
  private anonymous_achievements: [] = [];
  private downloadingUsers = false;
  private showGIF = false;
  private query: any = [];
  private isFilterModelActive = false;

  private filters: any = {
    name: '',
    territory_id: '',
    range: ''
  };
  private queryBuilder = new QueryBuilder();
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

  @Watch('filters.territory_id', { deep: true })
  onChangeTerritoryFiler(newVal: string) {
    this.queryBuilder.addListener('territory_id', newVal);
  }

  @Watch('filters.range', { deep: true })
  onChangeRoleFiler(newVal: string) {
    this.queryBuilder.addListener('range', newVal);
  }

  @Watch('pagination.currentPage')
  onChangePage(newVal: any) {
    this.queryBuilder.addListener('page', newVal);
  }

  resetBtn() {
    this.filters.name = '';
    this.filters.territory_id = '';
    this.filters.range = '';
  }

  onFilterSubmit() {
    this.isFilterModelActive = false;
  }

  @Watch('queryBuilder.watch')
  fetchUser(): void {
    this.loading = true;
    this.$http.get(this.$api(`/anonymous-achievements${this.queryBuilder.getFilters(true)}`)).then(response => {
      this.anonymous_achievements = response.data.anonymousTargetAchievements;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  async downloadUser() {
    this.downloadingUsers = true;
    try {
      const link = document.createElement('a');
      link.href = this.$api(`/anonymous-achievements-bulk-download?download&${this.queryBuilder.getFilters(false)}`);
      link.click();
    } catch (e) {
      this.$notify({ type: 'warning', message: 'Unable to download.', title: 'Something went wrong!' });
    } finally {
      this.downloadingUsers = false;
    }
  }
}
</script>
<style lang="css">
.clr {
  clear: both;
}
</style>
