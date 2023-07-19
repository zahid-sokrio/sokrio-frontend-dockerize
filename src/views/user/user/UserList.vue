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
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                 @click="showGIF = true"></i>
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
          <el-tooltip content="Add User" placement="top" v-can="permissionEnum.CREATE_USER">
            <base-dropdown :menu-on-right="true">
              <base-button icon size="sm" slot="title-container" type="primary" class="dropdown-toggle">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
                <span class="btn-inner--text">Add</span>
              </base-button>
              <a class="dropdown-item" @click.prevent="isActive = true">New User</a>
              <a class="dropdown-item" @click.prevent="showBulkUsersModal = true">Bulk Users</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" :href="$api('/bulk-users-sample')">Download Bulk Format</a>
            </base-dropdown>
          </el-tooltip>
        </div>
      </div>
      <create-bulk-users :show-bulk-users-modal.sync="showBulkUsersModal"></create-bulk-users>
      <create-user
        v-if="isActive"
        :current-user="currentUser"
        :form.sync="form"
        :is-active.sync="isActive"
        :is-update.sync="isUpdate"
        @created="userCreated($event)"
        @updated="userUpdated($event)"
      ></create-user>
      <filter-drawer-component v-if="isFilterModelActive" :visible.sync="isFilterModelActive" direction="rtl"
                               title="User Filter" @closeBtn="onFilterSubmit"
                               @resetBtn="resetBtn">
        <base-input label="User Name" v-model="filters.name" name="name" placeholder="e.g. John Doe"></base-input>
        <base-input label="User Code" v-model="filters.code" name="code" placeholder="e.g. CAD001"></base-input>
        <base-input label="User Email" v-model="filters.email" name="email" placeholder="e.g. abc@gmail.com"></base-input>
        <base-input label="User Phone" v-model="filters.phone" name="phone" placeholder="e.g. 01710000000"></base-input>
        <territory-lazydropdown label="Territory" v-model="filters.territory_id" :add-button="false" searchable-key="q"
                                class="ml-1"
                                placeholder="e.g. Dhaka"></territory-lazydropdown>
        <role-lazydropdown label="Role" v-model="filters.role" :add-button="false" class="ml-1"
                           placeholder="e.g. Field Officer"></role-lazydropdown>
        <base-input label="Status">
          <el-select v-model="filters.status" clearable filterable placeholder="e.g. Active">
            <el-option v-for="(type, index) in statuses"
                       :key="index" :label="type.label"
                       :value="type.value"></el-option>
          </el-select>
        </base-input>
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
          <async-image v-slot="slotProps" v-if="row.propic_url"
                       :url="row.propic_url">
            <img :src="slotProps.imageSrc" class="rounded-circle avatar avatar-lg"
                 alt="Profile Picture"/> <b> {{ ' ' + row.name }}</b>
          </async-image>
          <div v-else>
            <img :src="`${$cdn}/img/avatar.png`" class="rounded-circle avatar avatar-lg "
                 alt="Profile Picture"/>
            <b> {{ ' ' + row.name }}</b>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Code" min-width="200px" prop="code" sortable></el-table-column>

      <el-table-column label="Email" min-width="200px" prop="email" sortable></el-table-column>

      <el-table-column label="Phone No" min-width="150px" prop="phone" sortable></el-table-column>

      <el-table-column label="Address" min-width="200px" prop="address" sortable></el-table-column>

      <el-table-column label="Territory" min-width="130px" sortable>
        <template v-slot="{ row }">
          <b>{{ row.territory ? row.territory.name : 'None' }}</b>
        </template>
      </el-table-column>

      <el-table-column label="Status" min-width="100px" prop="active" sortable>
        <template v-slot="{ row }">
          <el-tag :type="`${row.active == 1 ? 'success' : 'danger'}`">
            <span v-text="`${row.active == 1 ? 'Active' : 'Inactive'}`"></span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Created At" min-width="120px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <span v-if="row.created_at">{{ row.created_at | datetime('ll') }}</span>
          <span> - </span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="110px">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Reset Device" placement="top" v-if="row.is_owner != 1 && row.id != user_id"
                      v-can="permissionEnum.UPDATE_USER">
            <a class="table-action" data-original-title="Edit User" data-toggle="tooltip" href="#!"
               @click.prevent="onClickResetUserDevice(row)">
              <i class="fas fa-recycle"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Roles & Permissions" placement="top">
            <a
              class="table-action"
              data-original-title="View User Details"
              data-toggle="tooltip"
              href="#!"
              @click.prevent="(showUserAclList = true), (currentUser = row)"
            >
              <i class="fas fa-eye"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Update User" placement="top" v-if="row.is_owner != 1 && row.id != user_id"
                      v-can="permissionEnum.UPDATE_USER">
            <a class="table-action" data-original-title="Edit User" data-toggle="tooltip" href="#!"
               @click.prevent="onEdit(row)">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <!--        User Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 id="exampleModalLabel1" class="modal-title">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click.prevent="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="onDelete">Delete</base-button>
      </template>
    </modal>

    <!--        End User Delete Modal     -->
    <view-user-acl :current-user="currentUser" :show-user-acl-list.sync="showUserAclList"></view-user-acl>
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
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"
              :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
  import {Component, Mixins, Vue, Watch} from 'vue-property-decorator';
  import User from '@/intefaces/User.js';
  import CreateUser from '@/views/user/user/CreateUser.vue';
  import CreateBulkUsers from '@/views/user/user/CreateBulkUsers.vue';
  import GIFModal from '@/components/tour/GIFModal.vue';
  import ViewUserAcl from '@/views/user/user/ViewUserAcl.vue';
  import PaginationComponentMixin from '@/mixins/PaginationComponent';
  import FilterDrawerComponent from "@/components/FilterDrawerComponent.vue";
  import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
  import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown.vue";

  import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip} from 'element-ui';
  import RoleLazydropdown from "@/components/lazyDropdown/RoleLazydropdown.vue";
  import {QueryBuilder} from "@/classes/QueryBuilder";
  import AsyncImage from "@/components/AsyncImage.vue";
  import {Permission as PermissionEnum} from '@/enums/Permission'

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
    }
  })
  export default class UserList extends Mixins(PaginationComponentMixin) {
    private users: User[] = [];
    private downloadingUsers = false;
    private isActive = false;
    private isUpdate = false;
    private showBulkUsersModal = false;
    private showDeleteModal = false;
    private showUserAclList = false;
    private currentUser: any = [];
    private showGIF = false;
    private query: any = [];
    private isFilterModelActive = false;
    private afterQuery: boolean = false;
    private statuses = [{label: 'Active', value: '1'}, {label: 'Inactive', value: '0'}]
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
      device_id: '',
      is_report: 0
    };
    public filters: any = {
      name: '',
      code: '',
      email:'',
      phone: '',
      territory_id: '',
      role: '',
      status: '',
    }
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

    onEdit(row: User) {
      this.isUpdate = true;
      this.currentUser = row;
      var userPermission: any = [];
      var userRole: any = [];
      this.currentUser.permissions.forEach((permission: any) => {
        userPermission.push(permission.id);
      });
      this.currentUser.roles.forEach((role: any) => {
        userRole.push(role.id);
      });
      this.form = {
        name: this.currentUser.name,
        email: this.currentUser.email,
        phone: this.currentUser.phone,
        address: this.currentUser.address,
        gender: this.currentUser.gender,
        territory_id: this.currentUser.territory ? this.currentUser.territory.id : null,
        password: '',
        password_confirmation: '',
        permissions: this.currentUser.permissions.length > 0 ? userPermission : [],
        roles: this.currentUser.roles ? userRole : '',
        status: this.currentUser.active == 1 ? true : false,
        code: this.currentUser.code,
        device_id: this.currentUser.device_id || '',
        is_report: this.currentUser.is_report || 0,
      };
      this.isActive = true;
    }

    get user_id() {
      return this.$store.getters['Auth/user'].id;
    }

    created() {
      this.fetchUser();
    }

    onDelete() {
      this.$http
        .delete(this.$api(`/users/${this.currentUser.id}`))
        .then(response => {
          this.showDeleteModal = false;
          this.users.splice(
            this.users.findIndex(user => user.id == this.currentUser.id),
            1
          );
          this.$notify({
            title: 'Success',
            message: 'Successfully Deleted',
            duration: 5000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
        })
        .catch(error => {
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
    }

    userCreated(user: any) {
      this.isActive = false;
      this.users.unshift(user);
    }

    userUpdated(updatedUser: any) {
      this.isUpdate = false;
      this.users.splice(
        this.users.findIndex(user => user.id == updatedUser.id),
        1,
        updatedUser
      );
      this.isActive = false;
    }

    onChangeNameFiler(newVal: string) {
      this.queryBuilder.addListener('q', newVal);
    }

    onChangeCodeFiler(newVal: string) {
      this.queryBuilder.addListener('code', newVal);
    }

    onChangeEmailFiler(newVal: string) {
      this.queryBuilder.addListener('email', newVal);
    }

    onChangePhoneFiler(newVal: string) {
      this.queryBuilder.addListener('phone', newVal);
    }

    onChangeTerritoryFiler(newVal: string) {
      this.queryBuilder.addListener('t', newVal);
    }

    onChangeRoleFiler(newVal: string) {
      this.queryBuilder.addListener('role', newVal);
    }

    onChangeStatusPhoneFiler(newVal: string) {
      this.queryBuilder.addListener('active', newVal);
    }

    @Watch('pagination.currentPage')
    onChangePage(newVal: any) {
      this.queryBuilder.addListener('page', newVal);
    }

    resetBtn() {
      this.filters.name = '';
      this.filters.email = '';
      this.filters.code = '';
      this.filters.phone = '';
      this.filters.territory_id = '';
      this.filters.role = '';
      this.filters.status = ''
    }

    onFilterSubmit() {
      this.onChangeNameFiler(this.filters.name);
      this.onChangeCodeFiler(this.filters.code);
      this.onChangeEmailFiler(this.filters.email);
      this.onChangePhoneFiler(this.filters.phone);
      this.onChangeTerritoryFiler(this.filters.territory_id);
      this.onChangeRoleFiler(this.filters.role);
      this.onChangeStatusPhoneFiler(this.filters.status);
      
      this.fetchUser();
      this.isFilterModelActive = false;
    }

    @Watch('queryBuilder.watch')
    fetchUser(): void {
      this.loading = true;
      this.$http.get(this.$api(`/users${this.queryBuilder.getFilters(true)}`)).then(response => {
        this.users = response.data.users;
        this.setPagination(response.data);
        this.loading = false;
      });
    }

    async onClickResetUserDevice(row: any) {
      await this.$http.patch(this.$api("/users/" + row.id + '/reset-device'))
      let index = await this.users.findIndex(user => user.id == row.id);
      this.users[index].device_id = null
      this.$notify({title: 'Success', message: 'Device reset successfully.', type: 'success'})
    }

    async downloadUser(){
      this.downloadingUsers = true;
      try {
        const link = document.createElement("a");
        link.href = this.$api(`/user-bulk-download?download&${this.queryBuilder.getFilters(false)}`);
        link.click();
      } catch (e) {
        this.$notify({type: 'warning', message: 'Unable to download.', title: 'Something went wrong!'});
      } finally {
        this.downloadingUsers = false;
      }
    }
  }
</script>

