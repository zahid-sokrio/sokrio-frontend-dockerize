<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Category</h3>
            <el-tooltip class="ml-3" content="Manage product categories that offer similar benefits. Ex: Soup, food etc" placement="right">
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

          <el-tooltip content="Add New Category" placement="top" v-can="permissionEnum.CREATE_PRODUCT_CATEGORY">
            <base-button type="primary" icon size="sm" @click="isActiveCategory = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>

        <!--                Product Category Create and update Modal            -->
        <category-form
          :current-entity="isUpdate ? currentProductCategory : null"
          :is-active.sync="isActiveCategory"
          :is-update.sync="isUpdate"
          :form.sync="form"
          @created="categoryCreated($event)"
          @updated="categoryUpdated($event)"
        >
        </category-form>

        <!--                End Product Category Create and update Modal           -->
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="productCategories"
    >
      <el-table-column label="Name" min-width="200px" prop="label" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Parent" min-width="200px" prop="parent" sortable>
        <template v-slot="{ row }">
          <b v-if="row.parent != null">{{ row.parent.name }}</b>
          <b v-else>-</b>
        </template>
      </el-table-column>
      <el-table-column label="Status" prop="active" min-width="200px">
        <template v-slot="{row}">
          <el-tag :type="`${row.active == 1 ? 'success' : 'danger'}`">
            <span v-text="`${row.active == 1 ? 'Active' : 'Inactive'}`"></span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Created At" min-width="200px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Update Category" placement="top" v-can="permissionEnum.UPDATE_PRODUCT_CATEGORY">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit product">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
<!--          <el-tooltip content="Delete" placement="top">-->
<!--            <a-->
<!--              href="#!"-->
<!--              @click.prevent="(showDeleteCategoryModal = true), (currentProductCategory = row)"-->
<!--              class="table-action table-action-delete"-->
<!--              data-toggle="tooltip"-->
<!--              data-original-title="Delete product category"-->
<!--            >-->
<!--              <i class="fas fa-trash"></i>-->
<!--            </a>-->
<!--          </el-tooltip>-->
        </div>
      </el-table-column>
    </el-table>

    <!--        Product Category Delete Modal-->
    <modal :show.sync="showDeleteCategoryModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteCategoryModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteProductCategory">Delete</base-button>
      </template>
    </modal>
    <!--        End Product Category Delete Modal-->
    <base-pagination
      v-if="productCategories.length > 0"
      class="mt-3"
      align="center"
      :total="pagination.totalEntity"
      :perPage="pagination.entityPerPage"
      v-model="pagination.currentPage"
      :disabled="loading"
    >
    </base-pagination>
   <!--filter drawer-->

    <filter-drawer-component v-if="isFilterModelActive" :visible.sync="isFilterModelActive" direction="rtl"
                             title="Product Category Filter" @closeBtn="onFilterSubmit"
                             @resetBtn="resetBtn">
      <base-input label="Category Name" v-model="filters.name" name="name" placeholder="e.g. ABC Category"></base-input>
      <div class="clr"></div>
      <base-input label="Active Status">
      <el-select  v-model="filters.status" placeholder="Select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </base-input>
      <div class="clr"></div>
      <DateRangeForReport v-model="filters.range" label-prop="Date Range"></DateRangeForReport>

      <div class="clr"></div>
      <br>


    </filter-drawer-component>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Component, Mixins, Vue, Watch} from 'vue-property-decorator';
import Productable from '@/intefaces/Productable';
import CategoryForm from '@/components/products/CategoryForm.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import FilterDrawerComponent from "@/components/FilterDrawerComponent.vue";
import DateRangeForReport from '@/components/DateRangeForReports.vue';
import { QueryBuilder } from '@/classes/QueryBuilder';
import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip, Tag} from 'element-ui';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import { Permission as PermissionEnum } from '@/enums/Permission'

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    CategoryForm,
    GIFModal,
    FilterDrawerComponent,
    DateRangeForReport

  }
})
export default class ProductCategoryList extends Mixins(PaginationComponentMixin) {
  private productCategories: Productable[] = [];
  private currentProductCategory!: Productable;
  private isActiveCategory = false;

  private isFilterModelActive = false;

  private isUpdate = false;
  private showDeleteCategoryModal = false;
  private showGIF: boolean = false;
  private form: { name: string; parent_id: number | string, active: boolean } = {
    name: '',
    parent_id: '',
    active: true,
  };
  private demoTourEntity: string = 'productCategory';
  private queryBuilder = new QueryBuilder();
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

  deleteProductCategory() {
    this.$http.delete(this.$api(`/product-categories/${this.currentProductCategory.id}`)).then(response => {
      this.showDeleteCategoryModal = false;
      this.productCategories.splice(
        this.productCategories.findIndex(productCategory => productCategory.id == this.currentProductCategory.id),
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

  @Watch('filters.name', { deep: true })
  onChangeNameFiler(newVal: string) {
    this.queryBuilder.addListener('name', newVal);
  }
  @Watch('filters.status', { deep: true })
  onChangeStatusFiler(newVal: string) {
    this.queryBuilder.addListener('status', newVal);
  }
  @Watch('filters.range', { deep: true })
  onChangeSubmissionDateRange(value: string) {
    this.queryBuilder.addListener('range', value);
  }
  data() {
    return {
      options: [{
        value: '1',
        label: 'Active'
      }, {
        value: '0',
        label: 'Inactive'
      }],
      value: ''
    }
  }
  private filters: any = {
    name: '',
    status: '',
    range: ''
  };

  resetBtn() {
    this.filters.name= '';
      this.filters.status= '';
      this.filters.range= '';
  }
  onFilterSubmit() {
    this.isFilterModelActive = false;
  }
  get permissionEnum () {
    return PermissionEnum;
  }

  onEdit(row: Productable) {
    this.isUpdate = true;
    this.currentProductCategory = row;
    let parent = this.currentProductCategory.parent_id == null;
    this.form = {
      name: this.currentProductCategory.name,
      parent_id: parent ? '' : this.currentProductCategory.parent_id,
      active: Boolean(this.currentProductCategory.active),
    };
    this.isActiveCategory = true;
  }

  categoryCreated(productCategory: Productable) {
    this.isActiveCategory = false;
    this.productCategories.unshift(productCategory);
  }

  categoryUpdated(productCategory: Productable) {
    this.isActiveCategory = false;
    this.isUpdate = false;
    this.productCategories.splice(
      this.productCategories.findIndex(category => category.id == productCategory.id),
      1,
      productCategory
    );
  }


  @Watch('pagination.currentPage')
  @Watch('queryBuilder.watch')
  fetchProductCategories() {
    this.loading = true;
    this.$http.get(this.$api(`/product-categories${this.queryBuilder.getFilters(true) ? this.queryBuilder.getFilters(true) : '?'}&allStatus&page=${this.pagination.currentPage}`)).then(response => {
      this.productCategories = response.data.productCategories;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  created() {
    this.fetchProductCategories();
  }
}
</script>
<style lang="css">
  .clr{
    clear:both;

  }
</style>
