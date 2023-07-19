<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <form class="needs-validation" @submit.prevent="handleSubmit(save)">
      <modal :show="isActive" v-if="isActive" size="lg" @close="close">
        <template slot="header">
          <h5
            id="exampleModalLabel"
            class="modal-title"
          >{{ isUpdate ? 'Update' : 'Add New' }} Promotion</h5>
        </template>
        <div class="row">
          <div class="col-md-6">
            <base-input id="promotionTitle" v-model="form.title" label="Promotion Title"
                        name="title"
                        placeholder="e.g. Eid-Ul-Adha Promotion" prepend-icon="ni ni-spaceship"></base-input>
          </div>
          <div class="col-md-6">
            <base-input label="Start From" name="start_from" prepend-icon="fas fa-calendar">
              <flat-picker slot-scope="{focus, blur}"
                           v-model="form.startDate"
                           :config="{allowInput: true}"
                           class="form-control datepicker"
                           @on-open="focus"
                           @on-close="blur"
              >
              </flat-picker>
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input label="Expires At" name="expires_at" prepend-icon="fas fa-calendar">
              <flat-picker slot-scope="{focus, blur}"
                           v-model="form.date"
                           :config="{allowInput: true}"
                           class="form-control datepicker"
                           @on-close="blur"
                           @on-open="focus"
              >
              </flat-picker>
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input label="Promotion On" name="promotion_on">
              <el-select v-model="form.type"
                         filterable
                         placeholder="Type"
                         @change="setNullPromotionableId"
              >
                <el-option v-for="(type,index) in promotionOn"
                           :key="index"
                           :label="type.label"
                           :selected="index[0]"
                           :value="type.name"
                >
                </el-option>
              </el-select>
            </base-input>
          </div>
          <div v-if="form.type != 'all'" class="col-md-6">
            <base-input label="Promotion Type" name="promotion_type">
              <el-select v-model="form.promotionType"
                         filterable
                         placeholder="Select Promotion Type"
              >
                <el-option
                  v-for="(offerType,index) in promotionTypes"
                  :key="index"
                  :label="offerType.label"
                  :value="offerType.name"
                >
                </el-option>
              </el-select>
            </base-input>
          </div>
          <div v-if="form.type == 'brand'" class="col-md-6">
            <product-brand-lazydropdown v-model="form.promotionableId" label="Product Brand"
                                        placeholder="Select Product Brand"></product-brand-lazydropdown>
          </div>
          <div v-if="form.type == 'category'" class="col-md-6">
            <product-category-lazydropdown v-model="form.promotionableId" label="Product Category"
                                           placeholder="Select Product Category"></product-category-lazydropdown>
          </div>
          <div v-if="form.type == 'product'" class="col-md-6">
            <product-lazydropdown v-model="form.promotionableId" :add-button="false" :end-point="'/products?is_free=0'"
                                  item-text="full_name" item-value="id"
                                  label="Select Product" placeholder="Select Product"></product-lazydropdown>
          </div>
          <div v-if="form.type != 'all'" class="col-md-6">
            <base-input v-model="form.promotionValue" label="Promotion Value" name="promotion_value"
                        prepend-icon="ni ni-money-coins" style="margin-bottom: 10px"></base-input>
          </div>
          <div class="col-md-6">
            <base-input label="Offer Type" name="offer_type">
              <el-select v-model="form.offerType"
                         filterable
                         placeholder="Select Promotion Type"
              >
                <el-option v-for="(offerType,index) in offerTypes"
                           :key="index"
                           :disabled="form.type == 'all' && offerType.name == 'qty' ? true : false"
                           :label="offerType.label"
                           :value="offerType.name"
                >
                </el-option>
              </el-select>
            </base-input>
          </div>
          <div v-if="form.type != 'all' && form.offerType == 'qty'" class="col-md-6">
            <product-lazydropdown v-model="form.offerProduct" :end-point="'products?is_free=1'"
                                  item-text="full_name"
                                  item-value="id"
                                  label="Offer Product"></product-lazydropdown>
          </div>
          <div class="col-md-6">
            <base-input v-model="form.offerValue" label="Offer Value" name="offer_value"
                        prepend-icon="ni ni-money-coins"></base-input>
          </div>
          <div class="col-md-6">
            <label>Image (Optional)</label>
            <single-image-uploader
              :img-get-url="isUpdate && currentPromotion.banner_url != null ? currentPromotion.banner_url : ''"
              :img.sync="form.image"
              image-max-height="100px"
              uploadText="Change Promotional Image"
            ></single-image-uploader>
          </div>
          <div class="col-md-6">
            <user-lazydropdown v-model="form.users" :multiple="true" label="Assign To" name="assign to"
                               rules="required" @remove-tag="onRemoveUser"></user-lazydropdown>
          </div>
        </div>
        <template slot="footer">
          <div style="float: left">
                        <span class="information"><i class="fas fa-info-circle"></i>
                        {{ form.type != 'all' ? 'Buy' : '' }}
                         {{ form.promotionValue != '' ? form.promotionValue : 0 }}
                         <span v-if="form.type == 'all'">
                             {{ form.promotionType == 'amount' ? 'Tk discount on' : '?' }}
                         </span>
                         <span v-if="form.type != 'all'">
                            {{
                             form.promotionType == 'amount' ? 'Tk product from' : form.promotionType == 'qty' ? 'products from' : '?'
                           }}
                         </span>
                        {{
                            form.type == 'brand' && form.promotionableId != '' && form.promotionableId != 0
                            && form.promotionableId != null ? productBrands.find(brand => brand.id ==
                                form.promotionableId).name
                              : form.type == 'category' && form.promotionableId != '' && form.promotionableId != 0
                              && form.promotionableId != null ? productCategories.find(category => category.id == form.promotionableId).name
                                : form.type == 'product' && form.promotionableId != '' && form.promotionableId != null ?
                                  products.find(product =>
                                    product.id == form.promotionableId).full_name + ' - ' + products.find(product =>
                                    product.id == form.promotionableId).base_product.sku
                                  : form.type == 'all' ? '' : '?'
                          }}
                        {{
                            form.type != 'product' ? promotionOn.find(type => type.name == form.type).label : form.type == 'product' ? '' : '?'
                          }}
                        <span v-if="form.type != 'all'">
                            & get
                             {{ form.offerValue != '' ? form.offerValue : 0 }}
                            {{
                            form.offerType == 'amount' ? 'Tk discount' : form.offerType == 'qty' ? '' : form.offerType == 'percent' ? '% Discount' : '?'
                          }}
                            <span v-if="form.offerType == 'qty'">
                                {{
                                form.offerProduct != '' ? products.find(product => product.id == form.offerProduct).base_product.name + ' - ' + products.find(product => product.id == form.offerProduct).base_product.sku : '?'
                              }}
                            </span>
                            {{ form.offerType == 'qty' ? 'free' : '' }}
                        </span>
                    </span>
          </div>
          <base-button type="secondary" @click="close">Close</base-button>
          <base-button :disabled="disableButton" :loading="loading" type="success" @click="handleSubmit(save)">Save
          </base-button>
        </template>
      </modal>
    </form>
  </validation-observer>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import "flatpickr/dist/flatpickr.css";
import SingleImageUploader from "@/components/ui/SingleImageUploader.vue";
import BrandForm from "@/components/products/BrandForm.vue";
import CategoryForm from "@/components/products/CategoryForm.vue";
import AddProduct from "@/views/product/AddProduct.vue";
import ProductBrandLazydropdown from "@/components/lazyDropdown/ProductBrandLazydropdown.vue";
import ProductCategoryLazydropdown from "@/components/lazyDropdown/ProductCategoryLazydropdown.vue";
import ProductLazydropdown from "@/components/lazyDropdown/ProductLazydropdown.vue";
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import { Dropdown, DropdownItem, DropdownMenu, Form, Tooltip, } from 'element-ui';
import Productable from "@/intefaces/Productable";
import { PromotionFormRequest } from "@/classes/PromotionFormRequest";

const flatPicker = require("vue-flatpickr-component");

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    flatPicker,
    SingleImageUploader,
    BrandForm,
    CategoryForm,
    AddProduct,
    ProductBrandLazydropdown,
    ProductCategoryLazydropdown,
    ProductLazydropdown,
    UserLazydropdown
  },
})
export default class PromotionForm extends Vue {
  @Prop() isActive!: boolean;
  @Prop() isUpdate!: boolean;
  @Prop() form!: {
    title: string,
    type: string,
    date: string,
    users: any,
    offerType: string,
    promotionValue: string,
    image: any,
    promotionableId: any,
    offerProduct: any,
    offerValue: any,
    promotionType: any,
    startDate: string
  }
  @Prop() users!: any;
  @Prop() productBrands!: any;
  @Prop() productCategories!: any;
  @Prop() products!: any;
  @Prop() currentPromotion!: any;
  @Prop() userPagination!: any;
  @Prop() productBrand!: any;
  @Prop() productCategoryPagination!: any;
  @Prop() productPagination!: any;

  $refs!: {
    formValidator: HTMLFormElement | Vue
  }
  private disableButton = false;
  private loading = false;
  private is_remove_permission = false;
  private departmentTypes: any = [];
  private variantCategories: any = [];
  private promotionOn = [
    {'label': 'All Product', 'name': 'all'},
    {'label': 'Product Brand', 'name': 'brand'},
    {'label': 'Product Category', 'name': 'category'},
    {'label': 'Single Product', 'name': 'product'}
  ]
  private offerTypes = [
    {'label': 'Discount-Amount', 'name': 'amount'},
    {'label': 'Quantity', 'name': 'qty'},
    {'label': 'Discount-Percent', 'name': 'percent'}]

  private promotionTypes = [
    {'label': 'Discount-Amount', 'name': 'amount'},
    {'label': 'Quantity', 'name': 'qty'},
  ]

  private isActiveBrand: boolean = false;

  private isActiveCategory: boolean = false;

  private variantForm: any = {
    variantValues: [],
    variantCategories: [],
    prices: [],
    departmentTypes: [],
    departmentId: []
  }
  private isActiveProduct: boolean = false;

  brandCreated(productBrand: Productable) {
    this.isActiveBrand = false;
    this.productBrands.unshift(productBrand);
    this.form.promotionableId = productBrand.id;
  }

  onRemoveUser(remove: any) {
    if (this.isUpdate == true) {
      this.is_remove_permission = true;
      this.$http
        .delete(this.$api(`/promotions/${this.currentPromotion.id}/assignees/${remove}`))
        .then(response => {
          this.is_remove_permission = false;
        })
    }
  }

  fetchUser() {
    this.$emit('userList', null);
  }

  fetchProductBrand() {
    this.$emit('brandList', null);
  }

  fetchProductCategory() {
    this.$emit('categoryList', null);
  }

  fetchProduct() {
    this.$emit('productList', null);
  }

  setProductBrandId() {
    if (this.form.promotionableId == 0) {
      this.form.promotionableId = '';
    }
  }

  categoryCreated(productCategory: Productable) {
    this.isActiveCategory = false;
    this.productCategories.unshift(productCategory);
    this.form.promotionableId = productCategory.id;
  }

  setProductCategoryId() {
    if (this.form.promotionableId == 0) {
      this.form.promotionableId = '';
    }
  }

  @Watch('form.promotionableId')
  productBrandUpdated(newVal: string) {
    if (newVal == '0' && this.form.type == 'brand') {
      this.isActiveBrand = true;
    } else if (newVal == '0' && this.form.type == 'category') {
      this.isActiveCategory = true;
    }
  }

  @Watch('form.users')
  setAssigne(old: any, current: any) {
    if (this.isUpdate == true && this.is_remove_permission == false && this.currentPromotion.assignees.findIndex((assigne: any) => assigne.id == old) == -1) {
      var newUser = '';
      if (this.form.users != '' && current != '') {
        newUser = old.filter((item: any) => {
          return current.indexOf(item) === -1
        })
      }
      if (current.length == 0 && old.length == 1) {
        this.$http
          .post(this.$api(`/promotions/${this.currentPromotion.id}/assignees`), {user_id: old[0]})
      }
      if (newUser != '') {
        this.$http
          .post(this.$api(`/promotions/${this.currentPromotion.id}/assignees`), {user_id: newUser[0]})
      }
    }
  }

  setNullPromotionableId(type: any) {
    this.form.promotionableId = '';
  }

  formReset() {
    this.form.title = '';
    this.form.type = 'all';
    this.form.date = '';
    this.form.offerProduct = '';
    this.form.image = '';
    this.form.promotionableId = '';
    this.form.promotionValue = '';
    this.form.offerValue = '';
    this.form.offerType = '';
    this.form.users = [];
    this.form.startDate = '';
    this.disableButton = false;
    this.$nextTick(() => {
      (this.$refs.formValidator as HTMLFormElement).reset();
    })
  }

  getForm() {
    let request = new PromotionFormRequest(this.form);
    if (this.form.type == 'all' && this.form.image) {
      return request.except([
        'promotion_value', 'promotionable_id', 'promotion_type', 'offer_product_id'
      ]);
    } else if (this.form.image && this.form.type != 'all') {
      return request.except([]);
    } else if (this.form.type == 'all' && this.form.image == '') {
      return request.except([
        'banner', 'promotion_value', 'promotionable_id', 'promotion_type', 'offer_product_id'
      ]);
    } else {
      return request.except([
        'banner'
      ]);
    }
  }

  getCurrentPromotionForm() {
    let request = new PromotionFormRequest(this.form, {_method: 'patch'});
    if (this.form.type == 'all') {
      if (typeof this.form.image != 'string') {
        return request.except([
          'promotion_value', 'promotionable_id', 'promotion_type', 'offer_product_id'
        ]);
      } else {
        return request.except(['banner', 'promotion_value', 'promotionable_id', 'promotion_type', 'offer_product_id'])
      }
    } else {
      if (typeof this.form.image != 'string') {
        return request.except([]);
      } else {
        return request.except(['banner'])
      }
    }
  }

  createPromotion() {
    this.disableButton = true;
    this.$http.post(this.$api("/promotions"), this.getForm())
      .then(response => {
        this.form.users.forEach((user: any) => {
          this.loading = true
          this.$http.post(this.$api(`/promotions/${response.data.promotion.id}/assignees`), {
            'user_id': user
          })
            .then(response => {
              this.loading = false;
            })
        })
        this.$notify({
          title: 'Success',
          message: 'Successfully Created',
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        if (this.loading) {
          this.$http.get(this.$api(`/promotions/${response.data.promotion.id}`)).then(responsePromotion => {
            this.$emit('created', responsePromotion.data.promotion)
          })
        }
        this.formReset();
      })
      .catch(error => {
        this.disableButton = false;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  updatePromotion() {
    this.disableButton = true;
    this.loading == true;
    this.$http.post(this.$api(`/promotions/${this.currentPromotion.id}`), this.getCurrentPromotionForm())
      .then(response => {
        this.$notify({
          title: 'Success',
          message: 'Successfully Updated',
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.$http.get(this.$api(`/promotions/${this.currentPromotion.id}`)).then(responsePromotion => {
          this.$emit('updated', response.data.promotion)
        })
        this.formReset();
      })
      .catch(error => {
        this.disableButton = false;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  save() {
    this.isUpdate ? this.updatePromotion() : this.createPromotion();
  }

  fetchDepartmentType() {
    this.$http.get(this.$api("/department-types")).then(response => {
      this.departmentTypes = response.data.departmentTypes;
    })
  }

  fetchVariantCategories() {
    this.$http.get(this.$api("/variant-categories")).then(response => {
      this.variantCategories = response.data.variantCategories;
    })
  }

  created() {
    this.fetchDepartmentType();
    this.fetchVariantCategories();
  }

  close() {
    this.$emit('update:isActive', false);
    this.$emit('update:isUpdate', false);
    this.$emit('update:form',
      {
        title: '',
        type: 'all',
        date: '',
        users: [],
        offerType: '',
        productValue: '',
        image: '',
        promotionableId: '',
        offerProduct: '',
        offerValue: ''
      })
    this.$nextTick(() => {
      (this.$refs.formValidator as HTMLFormElement).reset();
    })
  }
}
</script>
<style>
.information {
  font-size: 14px;
  color: blue
}
</style>
