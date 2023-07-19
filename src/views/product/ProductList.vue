<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Product</h3>
            <el-tooltip class="ml-3" content="Manage product for your company, products will added to warehouse." placement="right">
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
          <el-tooltip content="Add New Product" placement="top" v-can="permissionEnum.CREATE_PRODUCT">
            <base-button type="primary" icon size="sm" @click="onAddProduct">
                <span class="btn-inner--icon">
                  <i class="fas fa-plus"></i>
                </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
        <product-filter-drawer
          :loading.sync="loading"
          :is-filter-model-active.sync="isFilterModelActive"
          :entity-current-page.sync="pagination.currentPage"
          :entity-per-page.sync="pagination.entityPerPage"
          :total-entity.sync="pagination.totalEntity"
          @update="products = $event"
        ></product-filter-drawer>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="products"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.products">
            <el-table-column label="Batch" prop="batch">
              <template v-slot="{row}">
                <b>{{ row.batch ? row.batch.name : '' }}</b>
              </template>
            </el-table-column>
            <el-table-column label="MRP" prop="mrp">
              <template v-slot="{row}">
                <b>{{ row.mrp }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Purchase Amount" prop="mrp">
              <template v-slot="{row}">
                <b>{{ row.purchase_amount }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Qty" prop="qty">
              <template v-slot="{row}">
                <b>{{ row.qty }}</b>
              </template>
            </el-table-column>
            <el-table-column label="MFG Date" prop="batch">
              <template v-slot="{row}">
                <b v-if="row.mfg_date != null">{{ row.mfg_date | datetime('ll') }}</b>
                <b v-else> - </b>
              </template>
            </el-table-column>
            <el-table-column label="Expires Date" prop="batch">
              <template v-slot="{row}">
                <b v-if="row.exp_date != null ">{{ row.exp_date | datetime('ll') }}</b>
                <b v-else> - </b>
              </template>
            </el-table-column>
            <el-table-column label="Free Product" prop="variants">
              <template v-slot="{row}">
                <b>{{ row.is_free ? 'Yes' : 'No' }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Status" prop="active">
              <template v-slot="{row}">
                <el-tag :type="`${row.active == 1 ? 'success' : 'danger'}`">
                  <span v-text="`${row.active == 1 ? 'Active' : 'Inactive'}`"></span>
                </el-tag>
              </template>
            </el-table-column>
            <!-- TODO : Call Product Price api on button click -->
            <el-table-column label="Prices" prop="prices">
              <template v-slot="{row}">
                <base-button type="primary" @click="isActivePrices = true, product = row" size="sm">Show
                  Prices
                </base-button>
              </template>
            </el-table-column>
            <el-table-column label="Variant" prop="variants">
              <template v-slot="{row}">
                <base-button type="primary" @click.prevent="isActiveVariant = true, product = row" size="sm">
                  Show Variants
                </base-button>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="80px">
              <div class="table-actions" slot-scope="{ row }">
                <el-tooltip content="Update Product Batch" placement="top">
                  <a class="table-action" @click.prevent="onEditBatch(row)" data-original-title="Edit product" data-toggle="tooltip" href="#!">
                    <i class="fas fa-edit"></i>
                  </a>
                </el-tooltip>
                <!--                <el-tooltip content="Delete" placement="top">-->
                <!--                  <a-->
                <!--                    @click.prevent="showDeleteModalBatch = true, currentProduct = row"-->
<!--                    class="table-action table-action-delete"-->
<!--                    data-original-title="Delete batch"-->
<!--                    data-toggle="tooltip"-->
<!--                    href="#!"-->
<!--                  >-->
<!--                    <i class="fas fa-trash"></i>-->
<!--                  </a>-->
<!--                </el-tooltip>-->
              </div>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="Name" min-width="110px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="SKU" min-width="110px" prop="sku" sortable>
        <template v-slot="{ row }">
          <b>{{ row.sku }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Brand" min-width="110px" prop="product_brand" sortable>
        <template slot-scope="{ row }">
          <b>{{ row.product_brand ? row.product_brand.name : '' }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Category" min-width="100px" prop="product_category" sortable>
        <template v-slot="{ row }">
          <b>{{ row.product_category ? row.product_category.name : '' }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Status" prop="active">
        <template v-slot="{row}">
          <el-tag :type="`${row.is_active == 1 ? 'success' : 'danger'}`">
            <span v-text="`${row.is_active == 1 ? 'Active' : 'Inactive'}`"></span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80px">
        <div class="table-actions" slot-scope="{ row }">
          <el-tooltip content="Product Details" placement="top">
            <a
              @click.prevent="(isActiveProductDetails = true), (currentProduct = row)"
              class="table-action"
              data-original-title="View product"
              data-toggle="tooltip"
              href="#!"
            >
              <i class="fas fa-eye"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Update Product" placement="top" v-can="permissionEnum.UPDATE_PRODUCT">
            <a class="table-action" @click.prevent="onEdit(row)" data-original-title="Edit product" data-toggle="tooltip" href="#!">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
<!--          <el-tooltip content="Delete" placement="top">-->
<!--            <a-->
<!--              @click.prevent="(showDeleteModal = true), (currentProduct = row)"-->
<!--              class="table-action table-action-delete"-->
<!--              data-original-title="Delete product"-->
<!--              data-toggle="tooltip"-->
<!--              href="#!"-->
<!--            >-->
<!--              <i class="fas fa-trash"></i>-->
<!--            </a>-->
<!--          </el-tooltip>-->
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      v-if="products.length > 0"
      class="mt-3"
      align="center"
      :total="pagination.totalEntity"
      :perPage="pagination.entityPerPage"
      v-model="pagination.currentPage"
      :disabled="loading"
    ></base-pagination>
    <!--                Variant update Modal            -->
    <product-details-modal v-if="isActiveProductDetails" :is-active.sync="isActiveProductDetails"
                           :current-base-product="currentProduct"></product-details-modal>
    <view-product-price
      v-if="isActivePrices"
      :is-active.sync="isActivePrices"
      :product.sync="product"
    ></view-product-price>

    <view-product-variant
      v-if="isActiveVariant"
      :is-active.sync="isActiveVariant"
      :product.sync="product"
    ></view-product-variant>
    <!--                Variant update Modal            -->

    <update-product-modal
      v-if="isActive"
      :is-update.sync="isUpdate"
      :is-active.sync="isActive"
      :current-product="currentProduct"
      :form.sync="form"
      @updated="updateProduct($event)"
    ></update-product-modal>

    <update-batch
      v-if="isActiveBatch"
      :is-active.sync="isActiveBatch"
      :current-product="currentProduct"
      :batch-form.sync="batchForm"
      @updateBatch="updateBatch($event)"
    ></update-batch>

    <!--        Product Brand Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button @click="showDeleteModal = false" type="secondary">Close</base-button>
        <base-button @click.prevent="deleteProduct" type="danger">Delete</base-button>
      </template>
    </modal>

    <modal :show.sync="showDeleteModalBatch">
      <template>
        <h5 class="modal-title">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button @click="showDeleteModalBatch = false" type="secondary">Close</base-button>
        <base-button @click.prevent="deleteBatch" type="danger">Delete</base-button>
      </template>
    </modal>

    <!--        End Product Brand Delete Modal     -->

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import ProductDetailsModal from '@/views/product/productModalComponent/ProductDetailsModal.vue';
import ProductImage from '@/components/products/ProductImage.vue';
import AddProduct from '@/views/product/AddProduct.vue';
import ViewProductPrice from "@/views/product/productModalComponent/ViewProductPrice.vue";
import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip, Tag} from 'element-ui';
import Product from '@/intefaces/Product';
import ProductFilterDrawer from '@/views/product/ProductFilterDrawer.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import UpdateProductModal from "@/views/product/productModalComponent/UpdateProductModal.vue";
import UpdateBatch from "@/views/product/productModalComponent/UpdateBatch.vue";
import ViewProductVariant from "@/views/product/productModalComponent/ViewProductVariant.vue";
import {Permission as PermissionEnum} from '@/enums/Permission'

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    ProductDetailsModal,
    ProductImage,
    AddProduct,
    ProductFilterDrawer,
    GIFModal,
    ViewProductPrice,
    UpdateProductModal,
    UpdateBatch,
    ViewProductVariant
  }
})
export default class ProductList extends Vue {
  private products: Product[] = [];
  private isUpdate = false;
  private isActive = false;
  private isActiveProductDetails = false;
  private isActiveBatch: boolean = false;
  private showDeleteModal = false;
  private currentProduct: any = [];
  private loading = false;
  private isFilterModelActive: boolean = false;
  private isActivePrices: boolean = false;
  private showDeleteModalBatch: boolean = false;
  private isActiveVariant: boolean = false;
  private isUpdateVariant: boolean = false;
  private product: any = [];
  private showGIF: boolean = false;
  private form: any = {
    name: '',
    productBrandId: '',
    productCategoryId: '',
    description: '',
    usp: '',
    sku: ''
  };

  private batchForm: any = {
    batch_id: '',
    qty: 0,
    mrp: 0,
    mfg_date: '',
    exp_date: '',
    image: '',
    is_free: false,
  }

  private variant: any = {
    variantValues: [],
    variantCategories: [],
    prices: [],
    priceableId: [],
    priceableType: [],
    departmentId: [],
    variantNames: [],
    variantId: [],
    priceId: []
  };
  private name: string = '';
  private pagination = {
    currentPage: 1,
    totalEntity: 0,
    entityPerPage: 0
  };
  private demoTourEntity: string = 'product';
  private GIFs: Array<any> = [
    {
      label: 'Create a product',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a product',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a product',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of product';

  get permissionEnum () {
    return PermissionEnum;
  }

  onAddProduct() {
    this.$router.push({name: 'create'});
  }

  onEdit(row: any) {
    this.currentProduct = row;
    this.form = {
      name: this.currentProduct.name,
      is_free: Boolean(this.currentProduct.is_free),
      productBrandId: this.currentProduct.product_brand_id,
      productCategoryId: this.currentProduct.product_category_id,
      description: this.currentProduct.description != 'null' ? this.currentProduct.description : '',
      usp: this.currentProduct.usp != 'null' ? this.currentProduct.usp : '',
      sku: this.currentProduct.sku,
    };
    this.isActive = true;
  }

  onEditBatch(row: any) {
    this.currentProduct = row;
    this.batchForm = {
      batch_id: this.currentProduct.batch_id,
      qty: this.currentProduct.qty,
      mrp: this.currentProduct.mrp,
      mfg_date: this.currentProduct?.mfg_date ?? '',
      exp_date: this.currentProduct?.exp_date ?? '',
      purchase_amount: this.currentProduct.purchase_amount,
      active: Boolean(this.currentProduct.active),
    };
    this.isActiveBatch = true;
  }

  updateProduct(updatedProduct: any) {
    this.isUpdate = false;
    this.products.splice(
      this.products.findIndex(product => product.id == updatedProduct.id),
      1,
      updatedProduct
    );
    this.isActive = false;
  }

  updateBatch(updateBatch: any) {
    this.products.splice(
      this.products.findIndex(product => product.id == updateBatch.id),
      1,
      updateBatch
    );
    this.isActiveBatch = false;
  }

  deleteProduct() {
    this.$http.delete(this.$api(`/base-products/${this.currentProduct.id}`)).then(response => {
      this.showDeleteModal = false;
      this.products.splice(
        this.products.findIndex(baseProduct => baseProduct.id == this.currentProduct.id),
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

  deleteBatch() {
    this.$http.delete(this.$api(`/products/${this.currentProduct.id}`)).then(response => {
      this.$http.get(this.$api(`/base-products/${this.currentProduct.base_product_id}`)).then(response => {
        this.products.splice(
          this.products.findIndex(baseProduct => baseProduct.id == response.data.baseProduct.id),
          1,
          response.data.baseProduct
        );
      })
      this.$notify({
        title: 'Success',
        message: 'Successfully Deleted',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
      this.showDeleteModalBatch = false;
    });
  }
}
</script>
<style>
.hide {
  display: none;
}
</style>
