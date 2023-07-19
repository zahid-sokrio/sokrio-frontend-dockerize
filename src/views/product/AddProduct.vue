<template>
  <div>
    <validation-observer ref="formValidator" v-slot="{ handleSubmit }">
      <modal :show="isActive" @close="close" size="lg">
        <template slot="header">
          <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New' }} Product</h5>
        </template>
        <div class="row">
          <div class="col-md-6">
            <base-input label="Name" name="name" placeholder="e.g. Lux" v-model="form.name" prepend-icon="ni ni-basket"></base-input>
            <base-checkbox class="mb-3" v-model="form.is_free">Free Product</base-checkbox>
          </div>
          <div class="col-md-6">
            <base-input label="SKU" name="sku" placeholder="e.g. SKU-1234" v-model="form.sku" prepend-icon="fab fa-codepen"></base-input>
          </div>
          <div class="col-md-4">
            <base-input label="Batch" name="batch" placeholder="e.g. 2" v-model="form.batch" prepend-icon="fa fa-shopping-bag"></base-input>
          </div>
          <div class="col-md-4">
            <base-input label="Qty" name="qty" placeholder="e.g. 100" v-model="form.qty" prepend-icon="fas fa-sort-amount-up"></base-input>
          </div>
          <div class="col-md-4">
            <base-input label="MRP" name="price" placeholder="e.g. 100" v-model="form.mrp" prepend-icon="fas fa-money-bill"></base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <product-brand-lazydropdown
              label="Product Brand"
              placeholder="Select Brand"
              v-model="form.productBrandId"
              name="product_brand_id"
            ></product-brand-lazydropdown>
          </div>
          <div class="col-md-6">
            <product-category-autocomplete
              placeholder="Select Category"
              label="Product Category"
              v-model="form.productCategoryId"
              name="product_category_id"
            ></product-category-autocomplete>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <base-input label="Description (Optional)" name="description">
              <textarea class="form-control" placeholder="Product Description ..." rows="3" v-model="form.description"></textarea>
            </base-input>
          </div>

          <div class="col-md-6">
            <base-input label="USP (Optional)" name="usp">
              <textarea class="form-control" placeholder="Product USP ..." rows="3" v-model="form.usp"></textarea>
            </base-input>
          </div>
          <div class="col-md-6 mt-2 mb-3">
            <base-input label="Image (Optional)" name="image">
              <single-image-uploader
                :img.sync="form.image"
                image-max-height="100px"
                uploadText="Select Image"
                :img-get-url="isUpdate && currentProduct.image_url != null ? currentProduct.image_url : ''"
              ></single-image-uploader>
            </base-input>
          </div>
          <div class="col-md-6 mt-2 mb-2"></div>
        </div>
        <div class="row mb-2">
          <div class="col-md-6">
            <div class="form-inline">
              <h4>Variants</h4>
              <el-tooltip content="Add Variants" placement="top" class="ml-3">
                <base-button size="sm" type="primary" icon @click="isActiveVariant = true">
                  <span class="btn-inner--icon">
                    <i class="fas fa-plus"></i>
                  </span>
                  <span class="btn-inner--text"> Add </span>
                </base-button>
              </el-tooltip>
              <el-tooltip content="Show Variants" placement="top">
                <base-button size="sm" type="primary" icon @click="isActiveViewVariant = true">
                  <span class="btn-inner--icon">
                    <i class="fas fa-eye"></i>
                  </span>
                  <span class="btn-inner--text"> View </span>
                </base-button>
              </el-tooltip>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-inline">
              <base-dropdown>
                <base-button slot="title-container" size="sm" type="primary" class="dropdown-toggle">
                  Set Price For
                </base-button>
                <a class="dropdown-item" @click.prevent="(priceFilter = 'depttype'), onClickSetPrice('Channel')" href="#">Channel</a>
                <a class="dropdown-item" @click.prevent="(priceFilter = 'dept'), onClickSetPrice('Department')" href="#">Department</a>
              </base-dropdown>
              <!--                        <base-dropdown :menuOnRight="true" class="ml-3">-->
              <!--                            <base-button size="sm" slot="title-container" type="primary" class="dropdown-toggle">-->
              <!--                                {{ selectedType.replace(/^\w/, c => c.toUpperCase()) }}-->
              <!--                            </base-button>-->
              <!--                            <a v-for="(status, index) in statuses" :key="index" @click.prevent="selectedType = status.title, priceFilter=status.value" class="dropdown-item" href="#">-->
              <!--                                {{ status.title }}-->
              <!--                            </a>-->
              <!--                        </base-dropdown>-->
              <el-tooltip content="Show product" placement="top">
                <base-button size="sm" type="primary" icon @click="isActiveViewProductPrice = true">
                  <span class="btn-inner--icon">
                    <i class="fas fa-eye"></i>
                  </span>
                  <span class="btn-inner--text">View</span>
                </base-button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <template slot="footer">
          <base-button type="secondary" @click="close">Close</base-button>
          <base-button @click="handleSubmit(save)" type="success" :disabled="disableButton">Save</base-button>
        </template>
      </modal>
    </validation-observer>
    <create-product-price
      :is-active.sync="isActiveProductPrice"
      :is-update.sync="isUpdate"
      :departmentTypes.sync="departmentTypes"
      :product-price.sync="productPrice"
      :current-product="currentProduct"
      :priceFilter.sync="priceFilter"
      :departments="departments"
      @addPrice="addPrice($event)"
    ></create-product-price>
    <view-product-price
      :is-active.sync="isActiveViewProductPrice"
      :is-update.sync="isUpdate"
      :current-product="currentProduct"
      :product-price.sync="productPrice"
      :variant.sync="variant"
      :departmentTypes.sync="departmentTypes"
      :departments="departments"
    ></view-product-price>
    <create-variant
      :is-active.sync="isActiveVariant"
      :is-update.sync="isUpdate"
      :variant-categories="variantCategories"
      :single-variant.sync="singleVariant"
      :current-product="currentProduct"
      @addVariant="addVariant"
    ></create-variant>
    <view-variant
      :is-active.sync="isActiveViewVariant"
      :current-product="currentProduct"
      :is-update.sync="isUpdate"
      :variant.sync="variant"
      :variant-categories="variantCategories"
    ></view-variant>
  </div>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {Dropdown, DropdownItem, DropdownMenu, Upload} from 'element-ui';
import SingleImageUploader from '@/components/ui/SingleImageUploader.vue';
import Productable from '@/intefaces/Productable';
import VariantCategory from '@/intefaces/VariantCategory';
import ProductImage from '@/components/products/ProductImage.vue';
import DepartmentType from '@/intefaces/DepartmentType';
import CreateProductPrice from '@/views/product/productModalComponent/CreateProductPrice.vue';
import ViewProductPrice from '@/views/product/productModalComponent/ViewProductPrice.vue';
import CreateVariant from '@/views/product/productModalComponent/CreateVariant.vue';
import ViewVariant from '@/views/product/productModalComponent/ViewProductVariant.vue';
import ProductBrandLazydropdown from '@/components/lazyDropdown/ProductBrandLazydropdown.vue';
import ProductCategoryAutocomplete from '@/components/lazyDropdown/ProductCategoryLazydropdown.vue';

@Component({
  [Dropdown.name]: Dropdown,
  [DropdownItem.name]: DropdownItem,
  [DropdownMenu.name]: DropdownMenu,
  components: {
    ProductImage,
    SingleImageUploader,
    CreateProductPrice,
    ViewProductPrice,
    CreateVariant,
    ViewVariant,
    ProductBrandLazydropdown,
    ProductCategoryAutocomplete
  }
})
export default class AddProduct extends Vue {
  @Prop() currentProduct!: any;
  @Prop() isActive!: boolean;
  @Prop() isUpdate!: boolean;
  @Prop({
    default: () => ({
      name: '',
      is_free: false,
      productBrandId: '',
      productCategoryId: '',
      description: '',
      usp: '',
      image: '',
      sku: '',
      batch: '',
      qty: 0,
      mrp: ''
    })
  })
  form!: {
    name: string;
    is_free: any;
    productBrandId: any;
    productCategoryId: any;
    description: string;
    usp: string;
    image: any;
    sku: string;
    batch: any;
    qty: any;
    mrp: any;
  };
  @Prop({
    default: () => ({
      variantValues: [],
      variantCategories: [],
      prices: [],
      priceableId: [],
      priceableType: [],
      departmentId: []
    })
  })
  variant!: {
    variantValues: any;
    variantCategories: any;
    prices: any;
    priceableId: any;
    priceableType: any;
    departmentId: any;
  };
  private variantCategories: VariantCategory[] = [];
  private departmentTypes: DepartmentType[] = [];
  private productBrands: Productable[] = [];
  private productCategories: Productable[] = [];
  private loading = true;
  private disableButton = false;
  private isActiveBrand: boolean = false;
  private isActiveCategory: boolean = false;
  private statuses: any = [
    { title: 'Select Price Type', value: 'selected' },
    { title: 'Channel', value: 'depttype' },
    { title: 'Department', value: 'dept' }
  ];
  private selectedType = 'select price type';
  private priceFilter: any = '';
  private isActiveProductPrice: boolean = false;
  private isActiveViewProductPrice: boolean = false;
  private departments: any[] = [];
  private productPrice = {
    priceableId: '',
    price: '',
    priceableType: ''
  };
  private singleVariant = {
    variant: '',
    value: ''
  };
  private isActiveVariant: boolean = false;
  private isActiveViewVariant: boolean = false;
  $refs!: {
    formValidator: HTMLFormElement | Vue;
  };
  brandCreated(productBrand: Productable) {
    this.isActiveBrand = false;
    this.productBrands.unshift(productBrand);
    this.form.productBrandId = productBrand.id;
  }
  brandUpdated(productBrand: Productable) {
    this.isActiveBrand = false;
    this.productBrands.splice(
      this.productBrands.findIndex(brand => brand.id == productBrand.id),
      1,
      productBrand
    );
  }
  categoryCreated(productCategory: Productable) {
    this.isActiveCategory = false;
    this.productCategories.unshift(productCategory);
    this.form.productCategoryId = productCategory.id;
  }
  categoryUpdated(productCategory: Productable) {
    this.isActiveCategory = false;
    this.productCategories.splice(
      this.productCategories.findIndex(category => category.id == productCategory.id),
      1,
      productCategory
    );
  }
  setProductBrandId() {
    if (this.form.productBrandId == 0) {
      this.form.productBrandId = '';
    }
  }
  setProductCategoryId() {
    if (this.form.productCategoryId == 0) {
      this.form.productCategoryId = '';
    }
  }

  addPrice(event: any) {
    this.variant.priceableId.push(event.priceableId);
    this.variant.prices.push(event.price);
    this.variant.priceableType.push(this.priceFilter);
  }

  addVariant(event: any) {
    this.variant.variantCategories.push(event.variant);
    this.variant.variantValues.push(event.value);
  }

  @Watch('form.productBrandId')
  productBrandUpdated(newVal: string) {
    if (newVal == '0') {
      this.isActiveBrand = true;
    }
  }
  @Watch('form.productCategoryId')
  productCategoryUpdated(newVal: string) {
    if (newVal == '0') {
      this.isActiveCategory = true;
    }
  }
  @Watch('selectedType')
  setProductPrice(newVal: any) {
    if (newVal != 'Select Price Type') {
      this.isActiveProductPrice = true;
      this.fetchDepartmentType();
    }
  }

  formReset() {
    this.form.name = '';
    this.form.is_free = '';
    this.form.productBrandId = '';
    this.form.productCategoryId = '';
    this.form.description = '';
    this.form.usp = '';
    this.form.image = '';
    this.form.sku = '';
    this.form.batch = '';
    this.variant.variantValues = [];
    this.variant.variantCategories = [];
    this.variant.priceableId = [];
    this.variant.priceableType = [];
    this.variant.prices = [];
    this.disableButton = false;
  }

  createProduct() {
    this.disableButton = true;
    var form = new FormData();
    form.append('image', this.form.image);
    form.append('name', this.form.name);
    form.append('sku', this.form.sku);
    form.append('batch', this.form.batch);
    form.append('product_brand_id', this.form.productBrandId);
    form.append('product_category_id', this.form.productCategoryId);
    form.append('description', this.form.description);
    form.append('usp', this.form.usp);
    form.append('mrp', this.form.mrp);
    form.append('is_free', this.form.is_free == true ? '1' : '0');
    form.append('qty', this.form.qty);
    this.$http
      .post(
        this.$api('/products'),
        this.form.image != ''
          ? form
          : {
            name: this.form.name,
            sku: this.form.sku,
            batch: this.form.batch,
            product_brand_id: this.form.productBrandId,
            product_category_id: this.form.productCategoryId,
            description: this.form.description,
            usp: this.form.usp,
            is_free: this.form.is_free,
            qty: this.form.qty,
            mrp: this.form.mrp
          }
      )
      .then(response => {
        this.$http.post(this.$api('/product-prices'), {
          product_id: response.data.product.id,
          priceable_type: 'depttype',
          priceable_id: 1,
          price: this.form.mrp
        });
        this.variant.variantCategories.forEach((category: any, index: any) => {
          this.$http.post(this.$api('/product-variants'), {
            product_brand_id: this.form.productBrandId,
            product_id: response.data.product.id,
            value: this.variant.variantValues[index],
            variant_category_id: category
          });
        });
        this.variant.priceableId.forEach((priceableId: any, index: any) => {
          this.$http.post(this.$api('/product-prices'), {
            product_id: response.data.product.id,
            priceable_type: this.variant.priceableType[index],
            priceable_id: priceableId,
            price: this.variant.prices[index]
          });
        });
        this.$notify({
          title: 'Success',
          message: 'Successfully Created',
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.$http.get(this.$api(`/products/${response.data.product.id}`)).then(responseProduct => {
          this.afterCreated(responseProduct.data.product);
        });
        this.formReset();
        this.$nextTick(() => {
          (this.$refs.formValidator as HTMLFormElement).reset();
        });
      })
      .catch(error => {
        this.disableButton = false;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  async afterCreated(responseProduct: any) {
    this.$emit('created', responseProduct);
  }

  updateProduct() {
    this.disableButton = true;
    var form = new FormData();
    form.append('image', this.form.image);
    form.append('name', this.form.name);
    form.append('sku', this.form.sku);
    form.append('batch', this.form.batch);
    form.append('product_brand_id', this.form.productBrandId);
    form.append('product_category_id', this.form.productCategoryId);
    form.append('description', this.form.description);
    form.append('usp', this.form.usp);
    form.append('is_free', this.form.is_free == true ? '1' : '0');
    form.append('qty', this.form.qty);
    form.append('mrp', this.form.mrp);
    form.append('_method', 'patch');
    this.$http
      .post(
        this.$api(`/products/${this.currentProduct.id}`),
        typeof this.form.image != 'string'
          ? form
          : {
            name: this.form.name,
            sku: this.form.sku,
            batch: this.form.batch,
            product_brand_id: this.form.productBrandId,
            product_category_id: this.form.productCategoryId,
            description: this.form.description,
            usp: this.form.usp,
            is_free: this.form.is_free,
            qty: this.form.qty,
            mrp: this.form.mrp,
            _method: 'patch'
          }
      )
      .then(response => {
        this.$notify({
          title: 'Success',
          message: 'Successfully Updated',
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.$http.get(this.$api(`/products/${this.currentProduct.id}`)).then(responseProduct => {
          this.$emit('updated', responseProduct.data.product);
        });
        this.formReset();
        this.$nextTick(() => {
          (this.$refs.formValidator as HTMLFormElement).reset();
        });
      })
      .catch(error => {
        this.disableButton = false;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  save() {
    this.isUpdate ? this.updateProduct() : this.createProduct();
  }

  fetchProductBrand() {
    this.$http.get(this.$api('/product-brands')).then(response => {
      this.productBrands = response.data.productBrands;
    });
  }

  fetchProductCategory() {
    this.$http.get(this.$api('/product-categories')).then(response => {
      this.productCategories = response.data.productCategories;
    });
  }

  fetchVariantCategories() {
    this.$http.get(this.$api('/variant-categories')).then(response => {
      this.variantCategories = response.data.variantCategories;
    });
  }

  fetchDepartmentType() {
    this.$http.get(this.$api('/department-types')).then(response => {
      this.departmentTypes = response.data.departmentTypes;
    });
  }

  fetchDepartment() {
    this.$http.get(this.$api('/departments')).then(response => {
      this.departments = response.data.departments;
    });
  }

  onClickSetPrice(title: string) {
    this.selectedType = '';
    this.$nextTick(() => (this.selectedType = title));
  }

  created() {
    this.fetchVariantCategories();
    this.fetchProductBrand();
    this.fetchProductCategory();
    this.fetchDepartmentType();
    this.fetchDepartment();
  }

  close() {
    this.$parent.$emit('update:isActive', false);
    this.$emit('update:isActive', false);
    this.$emit('update:isUpdate', false);
    this.$emit('update:form', {
      name: '',
      is_free: '',
      productBrandId: '',
      productCategoryId: '',
      description: '',
      usp: '',
      image: '',
      sku: '',
      batch: ''
    });
    this.$emit('update:variant', { variantValues: [], variantCategories: [], departmentTypes: [], prices: [], departmentId: [] });
    this.$emit('onCloseSetId');
    this.disableButton = false;
  }
}
</script>
<style></style>
