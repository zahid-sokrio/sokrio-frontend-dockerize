<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">{{ getTaxonomy('department') }} (s)</h3>
            <el-tooltip class="ml-3" content="Manage stores for your business." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                 @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Download" placement="top">
            <base-button
              type="primary"
              icon
              size="sm"
              @click="download"
              :loading="downloading"
            >
              <span class="btn-inner--text">Bulk Download</span>
              <span class="btn-inner--icon">
                <i class="fas fa-download"></i>
              </span>
            </base-button>
          </el-tooltip>
          <el-tooltip content="Filters" placement="top">
            <base-button
              type="primary"
              icon
              size="sm"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)"
            >
              <span class="btn-inner--text">Filters</span>
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
            </base-button>
          </el-tooltip>
          <el-tooltip :content="`Add ${getTaxonomy('department')}`" placement="top"
                      v-can="permissionEnum.CREATE_DEPARTMENT">
            <base-dropdown :menu-on-right="true">
              <base-button icon size="sm" slot="title-container" type="primary" class="dropdown-toggle">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
                <span class="btn-inner--text">Add</span>
              </base-button>
              <a class="dropdown-item" @click.prevent="isActive = true">New {{ getTaxonomy('department') }}</a>
              <a class="dropdown-item" @click.prevent="showBulkDepartmentsModal = true">Bulk {{
                  getTaxonomy('department')
                }}s</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" :href="$api('/bulk-departments-sample')">Download Bulk Format</a>
            </base-dropdown>
          </el-tooltip>
        </div>
        <create-bulk-departments
          :show-bulk-departments-modal.sync="showBulkDepartmentsModal"
          @created="entityCreated($event)"
        ></create-bulk-departments>
        <!--                Create and update Modal            -->
        <CreateDepartmentForm
          :currentEntity="isUpdate ? currentEntity : null"
          :form.sync="form"
          :is-active.sync="isActive"
          :is-update.sync="isUpdate"
          v-if="isUpdate || isActive"
          @created="entityCreated($event)"
          @updated="entityUpdated($event)"
        ></CreateDepartmentForm>
        <!--               Create and update Modal           -->
      </div>
      <DepartmentFilterDrawer
        :is-filter-model-active.sync="isFilterModelActive"
        @filters="filterQuery = $event"
      ></DepartmentFilterDrawer>
      <!--      <transition name="el-zoom-in-top">-->
      <!--        <DepartmentFilters-->
      <!--          class="transition-box"-->
      <!--          :loading.sync="loading"-->
      <!--          :entity-current-page.sync="pagination.currentPage"-->
      <!--          :entity-per-page.sync="pagination.entityPerPage"-->
      <!--          :total-entity.sync="pagination.totalEntity"-->
      <!--          v-show="isFilterModelActive"-->
      <!--          :is-filter-model-active="isFilterModelActive"-->
      <!--          @update="departments = $event"-->
      <!--        ></DepartmentFilters>-->
      <!--      </transition>-->
    </div>
    <el-table v-loading="loading" class="table-responsive  table-flush table-striped"
              header-row-class-name="thead-light" :data="departments">
      <el-table-column label="Name" min-width="220px" prop="name" sortable>
        <template v-slot="{ row }">
          <async-image v-slot="slotProps" v-if="row.photo_url"
                       :url="row.photo_url">
            <img :src="slotProps.imageSrc" class="rounded-circle avatar avatar-lg"
                 alt="Profile Picture"/> <b> {{ ' ' + row.name ? row.name : '-' }}</b>
          </async-image>
          <div v-else>
            <img :src="`${$cdn}/img/store.png`" class="rounded-circle avatar avatar-lg"
                 alt="Department"/>
            <b> {{ row.name ? row.name : '-' }}</b>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Code" align="center" min-width="130px" prop="code" sortable>
        <template v-slot="{ row }">
          {{ row.code }}
        </template>
      </el-table-column>
      <el-table-column label="Territory" align="center" min-width="180px" prop="territory" sortable>
        <template v-slot="{ row }">
          <span v-if="row.territory">{{ row.territory.name }} | {{ row.territory.code }}</span>
          <br/>
          {{ row.te }}
        </template>
      </el-table-column>
      <el-table-column label="Type" align="center" min-width="120px" prop="department_type">
        <template v-slot="{ row }">
          <span v-if="row.department_type">{{ row.department_type.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Badge" min-width="120px" prop="badge" align="center">
        <template v-slot="{ row }">{{ row.badge ? row.badge.name : '-' }}</template>
      </el-table-column>
      <el-table-column label="Staff" min-width="120px" prop="badge" align="center">
        <template v-slot="{ row }">
          <StaffList :department="row"></StaffList>
        </template>
      </el-table-column>
      <el-table-column label="Created At" min-width="220px" prop="created_at" align="center" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Visitable" min-width="120px" prop="is_visitable" align="center" sortable>
        <template v-slot="{ row }">
          <el-tag class="ml-3" :type="row.is_visitable === 1 ? 'success' : 'danger'">
            <span>{{ row.is_visitable == 1 ? 'Yes' : 'No' }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Update Department" placement="top" v-if="row.id != 1"
                      v-can="permissionEnum.UPDATE_DEPARTMENT">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip"
               data-original-title="Edit department">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
          <!--          <el-tooltip content="Delete" placement="top" v-if="row.id != 1">-->
          <!--            <a-->
          <!--              href="#!"-->
          <!--              @click.prevent="(showDeleteModal = true), (currentEntity = row)"-->
          <!--              class="table-action table-action-delete"-->
          <!--              data-toggle="tooltip"-->
          <!--              data-original-title="Delete department"-->
          <!--            >-->
          <!--              <i class="fas fa-trash"></i>-->
          <!--            </a>-->
          <!--          </el-tooltip>-->
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="departments.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>
    <!--        Department Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteEntity">Delete</base-button>
      </template>
    </modal>
    <ViewDepartmentUser
      v-if="isActiveStaff"
      :is-active.sync="isActiveStaff"
      :department-staffs="departmentStaff"
    ></ViewDepartmentUser>

    <!--        End Department Delete Modal     -->

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"
              :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator';
import Department from '@/intefaces/Department';
import CreateDepartmentForm from './CreateDepartmentForm.vue';
import CreateBulkDepartments from './CreateBulkDepartments.vue';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Row, Col, Tag } from 'element-ui';
import DepartmentFilters from '@/views/department/DepartmentFilters.vue';
import DepartmentFilterDrawer from '@/views/department/DeparmentFilterDrawer.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import GIFModal from '@/components/tour/GIFModal.vue';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import { AxiosResponse } from "axios";
import { Permission as PermissionEnum } from '@/enums/Permission'
import User from "@/intefaces/User";
import ViewDepartmentUser from "@/views/department/ViewDepartmentUser.vue";
import AsyncImage from "@/components/AsyncImage.vue";
import StaffList from "@/views/department/StaffList.vue";
import { QueryBuilder } from "@/classes/QueryBuilder";

@Component({
  components: {
    AsyncImage,
    StaffList,
    DepartmentFilters,
    CreateDepartmentForm,
    CreateBulkDepartments,
    DepartmentFilterDrawer,
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [Row.name]: Row,
    [Col.name]: Col,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    ViewDepartmentUser,
  }
})
export default class DepartmentList extends Mixins(PaginationComponentMixin, TaxonomyMixin) {
  private departments: Department[] = [];
  private showBulkDepartmentsModal: boolean = false;
  private showDeleteModal: boolean = false;
  private isActive: boolean = false;
  private isUpdate: boolean = false;
  private isFilterModelActive: boolean = false;
  private showGIF: boolean = false;
  private departmentStaff: User[] = [];
  private isActiveStaff: boolean = false;
  private currentEntity: any = [];
  loading = false;
  downloading = false;
  public filterQuery: string = '';
  private form: any = {
    address: '',
    created_by: null,
    lat: null,
    long: null,
    owner_name: '',
    phone_no: '',
    photo: '',
    photo_url: '',
    name: '',
    code: '',
    department_type_id: null,
    territory_id: null,
    territory: null,
    credit_limit: 0,
    outstanding_balance: 0,
    badge_id: null,
    supplier: null,
    supplier_id: null,
    users: null,
    is_visitable: true,
    staff: [],
    department_category_id: null,
    department_location_type_id: null,
    owner_dob: null,
  };
  private demoTourEntity: string = 'department';
  private GIFs: Array<any> = [
    {
      label: 'Create a department',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a department',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a department',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of department';

  get permissionEnum() {
    return PermissionEnum;
  }

  created() {
    this.fetchDepartments();
  }

  entityCreated(department: Department) {
    this.departments.unshift(department);
  }

  onEdit(row: Department) {
    this.isUpdate = true;
    this.currentEntity = row;
    var routePlan: any = [];
    var userList: any = [];
    if (this.currentEntity.users) {
      this.currentEntity.users.forEach((user: User) => {
        userList.push(user.id);
      });
    }
    this.form = {
      id: this.currentEntity.id,
      address: this.currentEntity.address,
      created_by: Number(this.currentEntity.created_by),
      lat: this.currentEntity.lat,
      long: this.currentEntity.long,
      owner_name: this.currentEntity.owner_name,
      phone_no: this.currentEntity.phone_no,
      photo: this.currentEntity.photo,
      photo_url: this.currentEntity.photo_url,
      name: this.currentEntity.name,
      code: this.currentEntity.code,
      department_type_id: Number(this.currentEntity.department_type_id),
      territory_id: Number(this.currentEntity.territory_id),
      territory: this.currentEntity.territory,
      credit_limit: this.currentEntity.credit_limit,
      outstanding_balance: this.currentEntity.outstanding_balance,
      badge_id: this.currentEntity.badge_id ? Number(this.currentEntity.badge_id) : null,
      supplier_id: Number(this.currentEntity.supplier_id),
      supplier: this.currentEntity.supplier,
      staffs: userList,
      is_visitable: Boolean(this.currentEntity.is_visitable),
      department_category_id: this.currentEntity.department_category_id,
      department_location_type_id: this.currentEntity.department_location_type_id,
      owner_dob: this.currentEntity.owner_dob,
    };
    this.isActive = true;
  }

  entityUpdated(department: Department) {
    this.departments.splice(
      this.departments.findIndex(value => value.id == department.id),
      1,
      department
    );
  }

  @Watch('pagination.currentPage')
  fetchDepartments() {
    this.loading = true
    this.$http.get(this.$api(`/departments?page=${this.pagination.currentPage}${this.filterQuery ?
      '&' + this.filterQuery : ''}`))
      .then((response: AxiosResponse) => {
        this.departments = response.data.departments;
        this.setPagination(response.data);
      })
      .finally(() => this.loading = false);
  }

  @Watch('filterQuery')
  onChangeFilterQuery() {
    this.pagination.currentPage = 1
    this.fetchDepartments();
  }

  deleteEntity(): void {
    this.$http.delete(this.$api(`/departments/${this.currentEntity.id}`)).then(response => {
      this.showDeleteModal = false;
      this.departments.splice(
        this.departments.findIndex(value => value.id == this.currentEntity.id),
        1
      );
      this.$notify({
        title: 'Success',
        message: 'Successfully Deleted',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
    });
  }

  async download() {
    const link = document.createElement("a");
    link.href = this.$api(`/department-bulk-download?download${this.filterQuery ? '&' + this.filterQuery : ''}`);
    link.target = '_blank';
    link.click();
  }
}
</script>
