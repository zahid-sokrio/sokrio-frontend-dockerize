<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Roles</h3>
            <el-tooltip class="ml-3" content="Manage assignable roles for user, such as Admin, Manager etc" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Add New Role" placement="top" v-can="permissionEnum.CREATE_ROLE">
            <base-button type="primary" icon size="sm" @click="newRole = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
        <create-role
          v-if="newRole"
          :new-role.sync="newRole"
          :isUpdate.sync="isUpdate"
          :form.sync="form"
          :current-role="currentRole"
          @created="roleCreated($event)"
          @updated="roleUpdated($event)"
        ></create-role>
      </div>
    </div>

    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="roles"
    >
      <el-table-column label="Name" min-width="310px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>

      <el-table-column label="Label" min-width="200px" prop="label" sortable>
        <template v-slot="{ row }">
          <b>{{ row.label }}</b>
        </template>
      </el-table-column>

      <el-table-column label="Created At" prop="created_at" min-width="140px" sortable>
        <template v-slot="row">
          <b v-if="row.created_at">{{ row.created_at | datetime('ll') }}</b>
          <b> - </b>
        </template>
      </el-table-column>

      <el-table-column min-width="180px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Permissions" placement="top">
            <a
              @click.prevent="(showRoleAcl = true), (currentRole = row)"
              class="table-action"
              data-toggle="tooltip"
              data-original-title="View Permission List"
              href="#!"
            >
              <i class="fas fa-eye"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Update Role" placement="top" v-can="permissionEnum.UPDATE_ROLE">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit product">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
<!--          <el-tooltip content="Delete" placement="top">-->
<!--            <a-->
<!--              href="#!"-->
<!--              @click.prevent="(showDeleteModal = true), (currentRole = row)"-->
<!--              class="table-action table-action-delete"-->
<!--              data-toggle="tooltip"-->
<!--              data-original-title="Delete product"-->
<!--            >-->
<!--              <i class="fas fa-trash"></i>-->
<!--            </a>-->
<!--          </el-tooltip>-->
        </div>
      </el-table-column>
    </el-table>
    <!--        Role Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="onDelete">Delete</base-button>
      </template>
    </modal>

    <!--        End Role Delete Modal     -->

    <view-role-acl :show-role-acl.sync="showRoleAcl" :current-role="currentRole"></view-role-acl>

    <base-pagination
      v-if="pagination.total > pagination.perPage"
      class="mt-2"
      align="center"
      :total="pagination.total"
      :perPage="pagination.perPage"
      @input="fetchRoles"
      v-model="pagination.currentPage"
      :disabled="loading"
    ></base-pagination>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Role from '@/intefaces/Role';
import CreateRole from '@/views/user/role/CreateRole.vue';
import Permission from '@/intefaces/Permission';
import ViewRoleAcl from '@/views/user/role/ViewRoleAcl.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import { Permission as PermissionEnum } from '@/enums/Permission'

import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip, Tag} from 'element-ui';

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    CreateRole,
    ViewRoleAcl,
    GIFModal
  }
})
export default class RoleList extends Vue {
  private roles: Role[] = [];
  private newRole = false;
  private isUpdate = false;
  private showDeleteModal = false;
  private showRoleAcl = false;
  private currentRole: any = [];
  // private permissions: Permission[] = [];
  private loading = false;
  private showGIF: boolean = false;
  private form = {
    name: '',
    label: '',
    permissions: ''
  };
  private pagination = {
    currentPage: 1,
    total: 0,
    perPage: 0
  };
  private demoTourEntity: string = 'role';
  private GIFs: Array<any> = [
    {
      label: 'Create a role',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a role',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a role',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of role';

  get permissionEnum () {
    return PermissionEnum;
  }

  onEdit(row: Role) {
    this.isUpdate = true;
    this.currentRole = row;
    var userPermission: any = [];
    this.currentRole.permissions.forEach((permission: any) => {
      userPermission.push(permission.id);
    });
    this.form = {
      label: this.currentRole.label,
      name: this.currentRole.name,
      permissions: this.currentRole.permissions ? userPermission : ''
    };
    this.newRole = true;
  }

  onDelete(row: Role) {
    this.$http
      .delete(this.$api(`/roles/${this.currentRole.id}`))
      .then(response => {
        this.showDeleteModal = false;
        this.roles.splice(
          this.roles.findIndex(role => role.id == this.currentRole.id),
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

  fetchRoles() {
    this.loading = true;
    let isFirstPage = this.pagination.currentPage < 2;
    let url = isFirstPage ? '/roles' : `/roles?page=${this.pagination.currentPage}`;

    this.$http.get(this.$api(url)).then(response => {
      this.roles = response.data.roles;
      this.pagination.total = response.data.total;
      this.pagination.perPage = response.data.per_page;
      this.loading = false;
    });
  }

  roleCreated(role: Role) {
    this.newRole = false;
    this.roles.unshift(role);
  }

  roleUpdated(role: Role) {
    this.isUpdate = false;
    this.newRole = false;
    this.roles.splice(
      this.roles.findIndex(userRole => userRole.id == role.id),
      1,
      role
    );
  }

  created() {
    this.fetchRoles();
  }
}
</script>
