<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Promotion</h3>
            <el-tooltip class="ml-3" content="Manage special offers for your product." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                 @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Add New Promotion" placement="top" v-can="permissionEnum.CREATE_PROMOTION">
            <base-button icon size="sm" type="primary" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
      </div>
      <promotion-form
        :current-promotion="isUpdate ? currentPromotion : ''"
        :form.sync="form"
        :is-active.sync="isActive"
        :is-update.sync="isUpdate"
        :loading.sync="loading"
        :product-brands="productBrands"
        :product-categories="productCategories"
        :product-category-pagination="productCategoryPagination"
        :product-pagination="productPagination"
        :productBrand="productBrand"
        :products="products"
        :user-pagination="userPagination"
        :users="users"
        @brandList="fetchProductBrand"
        @categoryList="fetchProductCategory"
        @created="pomotionCreated($event)"
        @productList="fetchProduct"
        @updated="promotionUpdated($event)"
        @userList="fetchUser"
      ></promotion-form>
    </div>
    <el-table
      v-loading="loading"
      :data="promotions"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
    >
      <el-table-column label="title" min-width="200px" prop="title" sortable>
        <template v-slot="{ row }">
          <b>{{ row.title }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Offer Type" min-width="200px" prop="title" sortable>
        <template v-slot="{ row }">
          <b>{{ _.capitalize(row.offer_type) }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Expires At" min-width="200px" prop="expires_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.expires_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Assigned To" min-width="250px" prop="assignees" sortable>
        <template v-slot="{ row }">
          <span v-if="row.assignees">
            <el-tag v-for="assigne in row.assignees" :key="assigne.id" class="mr-1" type="success">
              <span>{{ assigne.name }}</span>
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Banner" min-width="200px" prop="image" sortable>
        <template v-slot="{ row }">
          <span v-if="row.banner_url == null">No Banner Available</span>
          <div v-else>
            <product-image :image="row.banner_url"></product-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150px">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Promotion Details" placement="top">
            <a
              class="table-action"
              data-original-title="Edit product"
              data-toggle="tooltip"
              href="#!"
              @click.prevent="(isView = true), (currentPromotion = row)"
            >
              <i class="fas fa-eye"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Update Promotion" placement="top" v-can="permissionEnum.UPDATE_PROMOTION">
            <a class="table-action" data-original-title="Edit product" data-toggle="tooltip" href="#!"
               @click.prevent="onEdit(row)">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
          <!--          <el-tooltip content="Delete" placement="top">-->
          <!--            <a-->
          <!--              @click.prevent="(showDeleteModal = true), (currentPromotion = row)"-->
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
      v-if="pagination.total > pagination.perPage"
      v-model="pagination.currentPage"
      :perPage="pagination.perPage"
      :total="pagination.total"
      align="center"
      class="mt-2"
      @input="fetchPromotion"
      :disabled="loading"
    ></base-pagination>

    <promotion-view-form v-if="isView" :current-promotion="currentPromotion"
                         :is-view.sync="isView"></promotion-view-form>

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 id="exampleModalLabel1" class="modal-title">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button :disabled="disableButton" type="danger" @click.prevent="deletePromotion">Delete</base-button>
      </template>
    </modal>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"
              :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PromotionForm from '@/components/products/PromotionForm.vue';
import ProductImage from '@/components/products/ProductImage.vue';
import PromotionViewForm from '@/components/products/PromotionViewForm.vue';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip } from 'element-ui';
import Productable from '@/intefaces/Productable';
import GIFModal from '@/components/tour/GIFModal.vue';
import { Permission as PermissionEnum } from '@/enums/Permission'

@Component({
  components: {
    ProductImage,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    PromotionForm,
    PromotionViewForm,
    GIFModal
  }
})
export default class Promotion extends Vue {
  private isActive = false;
  private isUpdate = false;
  private isView = false;
  private showDeleteModal = false;
  private users: any = [];
  private productBrands: Productable[] = [];
  private productCategories: Productable[] = [];
  private products: any = [];
  private promotions: any = [];
  private currentPromotion: any = [];
  private disableButton = false;
  private loading = false;
  private showGIF: boolean = false;
  private form = {
    title: '',
    type: 'all',
    date: '',
    users: [],
    offerType: '',
    promotionValue: '',
    image: '',
    promotionableId: '',
    offerProduct: '',
    offerValue: '',
    promotionType: '',
    startDate: ''
  };
  private pagination = {
    currentPage: 1,
    total: 0,
    perPage: 0
  };
  private userPagination = {
    currentPage: 1,
    total: 0,
    perPage: 0
  };
  private productBrand = {
    currentPage: 1,
    total: 0,
    perPage: 0
  };
  private productCategoryPagination = {
    currentPage: 1,
    total: 0,
    perPage: 0
  };
  private productPagination = {
    currentPage: 1,
    total: 0,
    perPage: 0
  };
  private demoTourEntity: string = 'productPromotion';
  private GIFs: Array<any> = [
    {
      label: 'Create a promotion',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a promotion',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a promotion',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of promotion';

  get permissionEnum () {
    return PermissionEnum;
  }

  pomotionCreated(promotion: any) {
    this.isActive = false;
    this.promotions.unshift(promotion);
  }

  promotionUpdated(promotion: any) {
    this.isUpdate = false;
    this.isActive = false;
    this.promotions.splice(
      this.promotions.findIndex((promotion: any) => promotion.id == this.currentPromotion.id),
      1,
      promotion
    );
  }

  deletePromotion() {
    this.disableButton = true;
    this.$http
      .delete(this.$api(`/promotions/${this.currentPromotion.id}`))
      .then(response => {
        this.disableButton = false;
        this.showDeleteModal = false;
        this.promotions.splice(
          this.promotions.findIndex((promotion: any) => promotion.id == this.currentPromotion.id),
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
        this.disableButton = false;
      });
  }

  onEdit(row: any) {
    this.isUpdate = true;
    this.currentPromotion = row;
    var users: any = [];
    this.currentPromotion.assignees.forEach((assigne: any) => {
      users.push(assigne.id);
    });
    this.form = {
      title: this.currentPromotion.title,
      type: this.currentPromotion.promotion_on,
      date: this.currentPromotion.expires_at,
      users: users,
      offerType: this.currentPromotion.offer_type,
      promotionValue: this.currentPromotion.promotion_value,
      image: this.isUpdate ? this.currentPromotion.banner_url : '',
      promotionableId: this.currentPromotion.promotionable_id != null ? this.currentPromotion.promotionable_id : '',
      offerProduct: this.currentPromotion.offer_product_id != null ? this.currentPromotion.offer_product_id : '',
      offerValue: this.currentPromotion.offer_value,
      promotionType: this.currentPromotion.promotion_type,
      startDate: this.currentPromotion.start_from,
    };
    this.isActive = true;
  }

  fetchUser() {
    let isFirstPage = this.userPagination.currentPage < 2;
    let url = isFirstPage ? '/users' : `/users?page=${this.userPagination.currentPage}`;
    this.$http.get(this.$api(url)).then(response => {
      this.users = response.data.users;
      this.userPagination.total = response.data.total;
      this.userPagination.perPage = response.data.per_page;
    });
  }

  fetchProductBrand() {
    let isFirstPage = this.productBrand.currentPage < 2;
    let url = isFirstPage ? '/product-brands' : `/product-brands?page=${this.productBrand.currentPage}`;
    this.$http.get(this.$api(url)).then(response => {
      this.productBrands = response.data.productBrands;
      this.productBrand.total = response.data.total;
      this.productBrand.perPage = response.data.per_page;
    });
  }

  fetchProductCategory() {
    let isFirstPage = this.productCategoryPagination.currentPage < 2;
    let url = isFirstPage ? '/product-categories' : `/product-categories?page=${this.productCategoryPagination.currentPage}`;
    this.$http.get(this.$api(url)).then(response => {
      this.productCategories = response.data.productCategories;
      this.productCategoryPagination.total = response.data.total;
      this.productCategoryPagination.perPage = response.data.per_page;
    });
  }

  fetchProduct() {
    let isFirstPage = this.productPagination.currentPage < 2;
    let url = isFirstPage ? '/products' : `/products?page=${this.productPagination.currentPage}`;
    this.$http.get(this.$api(url)).then(response => {
      this.products = response.data.products;
      this.productPagination.total = response.data.total;
      this.productPagination.perPage = response.data.per_page;
    });
  }

  fetchPromotion() {
    this.loading = true;
    let isFirstPage = this.pagination.currentPage < 2;
    let url = isFirstPage ? '/promotions' : `/promotions?page=${this.pagination.currentPage}`;
    this.$http.get(this.$api(url)).then(response => {
      this.promotions = response.data.promotions;
      this.pagination.total = response.data.total;
      this.pagination.perPage = response.data.per_page;
      this.loading = false;
    });
  }

  created() {
    this.fetchUser();
    this.fetchProductBrand();
    this.fetchProductCategory();
    this.fetchProduct();
    this.fetchPromotion();
    // this.todaysDate();
  }
}
</script>
