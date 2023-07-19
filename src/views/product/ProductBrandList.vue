<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Brand</h3>
            <el-tooltip class="ml-3" content="Manage individual products brands for your company. Ex: Coca-cola, Nutella" placement="right">
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
          <el-tooltip content="Add New Brand" placement="top" v-can="permissionEnum.CREATE_PRODUCT_BRAND">
            <base-button type="primary" icon size="sm" @click="isActiveBrand = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>

        <!--                Product Band Create and update Modal            -->
        <brand-form
          :current-entity="isUpdate ? currentProductBrand : null"
          :form.sync="form"
          :is-active.sync="isActiveBrand"
          :is-update.sync="isUpdate"
          @created="brandCreated($event)"
          @updated="brandUpdated($event)"
        >
        </brand-form>
        <!--                End Product Brand and update Modal           -->
      </div>
    </div>
    <el-table
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      v-loading="loading"
      :data="productBrands"
    >
      <el-table-column label="Name" min-width="310px" prop="label" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Parent" min-width="310px" prop="parent" sortable>
        <template v-slot="{ row }">
          <b v-if="row.parent != null">{{ row.parent.name }}</b>
          <b v-else>-</b>
        </template>
      </el-table-column>
      <el-table-column label="Created At" min-width="310px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Update Brand" placement="top" v-can="permissionEnum.UPDATE_PRODUCT_BRAND">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit product">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
          <!--          <el-tooltip content="Delete" placement="top">-->
          <!--            <a-->
          <!--              href="#!"-->
          <!--              @click.prevent="(showDeleteModal = true), (currentProductBrand = row)"-->
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
    <base-pagination
      class="mt-3"
      v-if="productBrands.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>

    <!--brand drawer-->

    <filter-drawer-component v-if="isFilterModelActive" :visible.sync="isFilterModelActive" direction="rtl"
                             title="Product Brand Filter" @closeBtn="onFilterSubmit"
                             @resetBtn="resetBtn">
      <base-input label="Brand Name" v-model="filters.name" name="name" placeholder="e.g. ABC Brand"></base-input>
      <div class="clr"></div>

      <div class="clr"></div>
      <DateRangeForReport v-model="filters.range" label-prop="Date Range"></DateRangeForReport>

      <div class="clr"></div>
      <br>


    </filter-drawer-component>

    <!--        Product Brand Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteProductBrand">Delete</base-button>
      </template>
    </modal>

    <!--        End Product Brand Delete Modal     -->

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
  import {Component, Mixins, Vue, Watch} from 'vue-property-decorator';
  import Productable from '@/intefaces/Productable';
  import BrandForm from '@/components/products/BrandForm.vue';
  import GIFModal from '@/components/tour/GIFModal.vue';
  import FilterDrawerComponent from "@/components/FilterDrawerComponent.vue";
  import DateRangeForReport from '@/components/DateRangeForReports.vue';
  import { QueryBuilder } from '@/classes/QueryBuilder';
  import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip} from 'element-ui';
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
      BrandForm,
      GIFModal,
      FilterDrawerComponent,
      DateRangeForReport,

    }
  })
  export default class ProductBrandList extends Mixins(PaginationComponentMixin) {
    private productBrands: Productable[] = [];
    private showDeleteModal = false;
    private isActiveBrand = false;
    private isUpdate = false;
    private isFilterModelActive = false;

    private currentProductBrand!: Productable;
    private showGIF: boolean = false;
    private form: { name: string; parent_id: number | string } = {
      name: '',
      parent_id: ''
    };
    private demoTourEntity: string = 'brand';
    private queryBuilder = new QueryBuilder();
    private GIFs: Array<any> = [
      {
        label: 'Create a brand',
        url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
      },
      {
        label: 'Update a brand',
        url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
      },
      {
        label: 'Delete a brand',
        url: 'https://www.youtube.com/embed/LeAltgu_pbM'
      }
    ];
    private demoTourTitle: string = 'A quick demo of brand';

    get permissionEnum () {
      return PermissionEnum;
    }

    onEdit(row: Productable) {
      this.isUpdate = true;
      this.currentProductBrand = row;
      let parent = this.currentProductBrand.parent_id == null;
      this.form = {
        name: this.currentProductBrand.name,
        parent_id: parent ? '' : this.currentProductBrand.parent_id
      };
      this.isActiveBrand = true;
    }

    deleteProductBrand() {
      this.$http.delete(this.$api(`/product-brands/${this.currentProductBrand.id}`)).then(response => {
        this.showDeleteModal = false;
        this.productBrands.splice(
          this.productBrands.findIndex(productBrand => productBrand.id == this.currentProductBrand.id),
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

    @Watch('filters.range', { deep: true })
    onChangeSubmissionDateRange(value: string) {
      this.queryBuilder.addListener('range', value);
    }
    data() {
      return {

      }
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

    @Watch('pagination.currentPage')
    @Watch('queryBuilder.watch')
    /*fetchProductBrands() {
      this.loading = true;
      this.$http.get(this.$api(`/product-brands?page=${this.queryBuilder.pagination.currentPage}`)).then(response => {
        this.productBrands = response.data.productBrands;
        this.setPagination(response.data);
        this.loading = false;
      });
    }*/
    fetchProductBrands() {
      this.loading = true;
      this.$http.get(this.$api(`/product-brands${this.queryBuilder.getFilters(true) ? this.queryBuilder.getFilters(true) : '?'}&allStatus&page=${this.pagination.currentPage}`)).then(response => {
        this.productBrands = response.data.productBrands;
        this.setPagination(response.data);
        this.loading = false;
      });
    }

    brandCreated(productBrand: Productable) {
      this.isActiveBrand = false;
      this.productBrands.unshift(productBrand);
    }

    brandUpdated(productBrand: Productable) {
      this.isActiveBrand = false;
      this.productBrands.splice(
        this.productBrands.findIndex(brand => brand.id == productBrand.id),
        1,
        productBrand
      );
    }

    created() {
      this.fetchProductBrands();
    }
  }
</script>
<style lang="css">
  .clr{
    clear:both;

  }
</style>
