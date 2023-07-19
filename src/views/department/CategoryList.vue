<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Categories</h3>
            <el-tooltip class="ml-3" content="Classify department by it's type. Ex: Wholesale, Pharmacy, Supershop etc"
                        placement="right">
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
          <el-tooltip content="Add New Category" placement="top" v-can="permissionEnum.CREATE_DEPARTMENT">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>

        <!--                Start of Create & update Modal           -->
        <CreateCategoryForm
          :currentEntity="isUpdate ? currentEntity : null"
          :form.sync="form"
          :is-active.sync="isActive"
          :is-update.sync="isUpdate"
          @created="entityCreated($event)"
          @updated="entityUpdated($event)"
        >
        </CreateCategoryForm>
        <!--                End of Create & update Modal           -->
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="departmentCategories"
    >
      <el-table-column label="Name" min-width="250px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Created At" min-width="210px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Update Category" placement="top" v-can="permissionEnum.UPDATE_DEPARTMENT">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit product">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Delete" placement="top">
            <a
              href="#!"
              @click.prevent="(showDeleteModal = true), (currentEntity = row)"
              class="table-action table-action-delete"
              data-toggle="tooltip"
              data-original-title="Delete Category"
            >
              <i class="fas fa-trash"></i>
            </a>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="departmentCategories.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>

    <filter-drawer-component v-if="isFilterModelActive" :visible.sync="isFilterModelActive" direction="rtl"
                             title="Department Category Filter" @closeBtn="onFilterSubmit"
                             @resetBtn="resetBtn">
      <base-input label="Category Name" v-model="filters.name" name="name" placeholder="e.g. ABC Category"></base-input>
      <div class="clr"></div>

      <div class="clr"></div>
      <DateRangeForReport v-model="filters.range" label-prop="Date Range"></DateRangeForReport>

      <div class="clr"></div>
      <br>


    </filter-drawer-component>
    <!--    Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">
          Are you sure you want to delete this ?
        </h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteEntity">Delete</base-button>
      </template>
    </modal>

    <!--        End Delete Modal     -->

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Mixins, Watch} from 'vue-property-decorator';
import CreateCategoryForm from '@/views/department/CreateCategoryForm.vue';
import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag} from 'element-ui';
import Category from '@/intefaces/Category';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import GIFModal from '@/components/tour/GIFModal.vue';
import { Permission as PermissionEnum } from '@/enums/Permission'
import FilterDrawerComponent from "@/components/FilterDrawerComponent.vue";
import DateRangeForReport from '@/components/DateRangeForReports.vue';
import { QueryBuilder } from '@/classes/QueryBuilder';

@Component({
  components: {
    CreateCategoryForm,
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    FilterDrawerComponent,
    DateRangeForReport,
  }
})
export default class CategoryList extends Mixins(PaginationComponentMixin) {
  private departmentCategories: Category[] = [];
  private showDeleteModal = false;
  private isActive = false;
  private isUpdate = false;
  private showGIF: boolean = false;
  private isFilterModelActive = false;
  private currentEntity!: Category;
  private queryBuilder = new QueryBuilder();
  protected form = {
    name: ''
  };
  private demoTourEntity: string = 'departmentCategory';
  private GIFs: Array<any> = [
    {
      label: 'Create a category',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a category',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a category',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of category';

  get permissionEnum() {
    return PermissionEnum;
  }

  created() {
    this.fetchEntity();
  }

  entityCreated(entity: Category) {
    this.departmentCategories.unshift(entity);
  }

  entityUpdated(entity: Category): void {
    this.departmentCategories.splice(
      this.departmentCategories.findIndex(type => type.id == entity.id),
      1,
      entity
    );
  }

  onEdit(row: Category) {
    this.isUpdate = true;
    this.currentEntity = row;
    this.form = {
      name: this.currentEntity.name,
    };
    this.isActive = true;
  }
  @Watch('filters.name', { deep: true })
  onChangeNameFiler(newVal: string) {
    this.queryBuilder.addListener('name', newVal);
  }
  @Watch('filters.range', { deep: true })
  onChangeSubmissionDateRange(value: string) {
    this.queryBuilder.addListener('range', value);
  }
  private filters: any = {
    name: '',
    range: ''
  };
  resetBtn() {
    this.filters.name= '';
    this.filters.range= '';
  }
  onFilterSubmit() {
    this.isFilterModelActive = false;
  }
  @Watch('queryBuilder.watch')

  @Watch('pagination.currentPage')
  fetchEntity(): void {
    this.loading = true;
    this.$http.get(this.$api(`/department-categories${this.queryBuilder.getFilters(true) ?this.queryBuilder.getFilters(true): '?'}&allStatus&page=${this.pagination.currentPage}`)).then(response => {
      this.departmentCategories = response.data.departmentCategories;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  deleteEntity(): void {
    this.$http.delete(this.$api(`/department-categories/${this.currentEntity.id}`)).then(response => {
      this.showDeleteModal = false;
      this.departmentCategories.splice(
        this.departmentCategories.findIndex(value => value.id == this.currentEntity.id),
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
}
</script>
