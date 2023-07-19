<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <form class="needs-validation" @submit.prevent="handleSubmit(save)">
      <div class="card">

        <!--        header of card  -->

        <div class="card-header border-0">
          <div class="row">
            <div class="col-6">
              <ul class="list-group list-group-flush list my--3">
                <li class="list-group-item px-0">
                  <div class="row align-items-center">
                    <div class="col-auto">
                      <el-button
                        circle
                        icon="fa fa-arrow-left"
                        @click="toogleProductOption != '' ? toogleProductOption = '' : $router.back(), dialogOption = '', isPriceShow = false"></el-button>
                    </div>
                    <div class="col ml--2">
                      <div class="form-inline">
                        <h3 class="mb-0">Add Product</h3>
                        <el-tooltip class="ml-3" content="Add batch wise product." placement="right">
                          <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!--  --- End header of card --- -->

        <div class="card-body border-0">

          <!--    landing page design   -->

          <div v-if="toogleProductOption == ''">
            <div class="row text-center">
              <div class="col-md-12">
                <h2>Start Managing Your Products</h2>
                <p><small>Create and update your products, all in one place.</small></p>
                <base-button class="btn mb-2" type="primary" @click="addNewProduct">Add New Product</base-button>
                <br>
                <span>Or,</span><br>
                <base-button class="btn mt-2" type="primary" @click="addNewBatch">Add Product to a Batch</base-button>
              </div>
            </div>
            <hr>
            <div class="row text-center">
              <div class="col-md-12">
                <h2>Add Product Flow</h2>
              </div>
            </div>
            <div class="row mt-4 text-center">
              <div class="col-md-12">
                <img :src="`${$cdn}/img/product-flow.png`">
              </div>
            </div>
            <hr>
            <div class="row text-center">
              <div class="col-md-12">
                <h2>In this section, you can:</h2>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-md-4"></div>
              <div class="col-md-5">
                <ul class="list-unstyled">
                  <li class="ml-5 mb-4">
                    <h4><i class="fas fa-check-circle" style="color: green"></i> Create product with their brand, category and variant. </h4>
                  </li>
                  <li class="ml-5 mb-4">
                    <h4><i class="fas fa-check-circle" style="color: green"></i> Keep track on batch wise product. </h4>
                  </li>
                  <li class="ml-5 mb-4">
                    <h4><i class="fas fa-check-circle" style="color: green"></i> Set product batch price for your organization. </h4>
                  </li>
                  <li class="ml-5">
                    <h4><i class="fas fa-check-circle" style="color: green"></i> View product list and their batches. </h4>
                  </li>
                </ul>
              </div>
              <div class="col-md-3"></div>
            </div>
          </div>

          <!--    End landing page design    -->

          <add-product
            v-if="toogleProductOption != ''"
            :form="form"
            :form-option="formOption"
            :product-form="productForm"
            :toogle-product-option="toogleProductOption"
          ></add-product>

          <add-batch
            v-if="dialogOption == formOption[1]"
            :batch-form="batchForm"
            :dialog-option="dialogOption"
            :form-option="formOption"
          ></add-batch>

          <div v-if="isPriceShow" class="row mt-3">
            <div class="col-md-12">
              <div class=" border shadow p-3">
                <div class="row mb-2">
                  <div class="col-md-6">
                    <h3>Price </h3>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <base-input label="Price For" name="promotion_type">
                      <el-select v-model="singlePrice.priceable_type"
                                 filterable
                                 placeholder="Select Price Type"
                      >
                        <el-option v-for="(type,index) in priceType"
                                   :key="index"
                                   :label="type === 'dept' ? getTaxonomy('department') : 'Channel'"
                                   :value="type"
                        >
                        </el-option>
                      </el-select>
                    </base-input>
                    <department-lazydropdown v-if="singlePrice.priceable_type == 'dept'" v-model="singlePrice.priceable_id"
                                             :label="getTaxonomy('department')" :placeholder="'Select '+ getTaxonomy('department') "
                                             name="priceable_id"></department-lazydropdown>
                    <channel-lazydropdown v-if="singlePrice.priceable_type == 'depttype'" v-model="singlePrice.priceable_id" label="Channel"
                                          name="priceable_id" placeholder="Select Channel"></channel-lazydropdown>
                    <base-input v-model="singlePrice.price" label="Price" name="price" placeholder="Product Price" rules="required"
                                type="number"></base-input>
                    <small class="text-muted"> This is the base price for every
                      <b v-if="singlePrice.priceable_id && departments && departmentTypes">
                        {{
                          singlePrice.priceable_type == 'dept' ? departments.find(department => department.id == singlePrice.priceable_id).name
                            : departmentTypes.find(type => type.id == singlePrice.priceable_id).name
                        }} </b>
                      <b v-else> ?
                      </b>
                      channel. If the product has no price on the specific {{ getTaxonomy('department') }}, this price will be assumed during
                      {{ getTaxonomy('order') }}.
                    </small>
                    <div class="text-right">
                      <base-button :disabled="disabled" :loading="loading" type="success" @click="handleSubmit(savePrice)"> Save</base-button>
                    </div>
                  </div>
                  <div class="col-md-6" style="overflow-y: scroll; height: 60%">
                    <ul class="list-group list-group-flush list my--1">
                      <li class="list-group-item px-0">
                        <div class="row align-items-center">
                          <div class="col-md-3">
                            <b>Name</b>
                          </div>
                          <div class="col-md-3">
                            <b>Type </b>
                          </div>
                          <div class="col-md-3">
                            <b>Price </b>
                          </div>
                          <div class="col-md-3">

                          </div>
                        </div>
                      </li>
                      <div v-if="productPrices.length <= 0" class="text-center">
                        <h5> No Data Found</h5>
                      </div>
                      <div v-if="isActive">
                        <li v-for="(price,index) in productPrices" :key="index" class="list-group-item px-0">
                          <div class="row align-items-center">
                            <div v-if="productPrices" class="col-md-3">
                                                    <span>
                                                        <span
                                                          v-if="price.priceable_type == 'depttype' ">{{
                                                            departmentTypes.find(type => type.id == price.priceable_id).name
                                                          }}</span>
                                                        <span v-else>{{ departments.find(type => type.id == price.priceable_id).name }}</span>
                                                    </span>
                            </div>
                            <div class="col-md-3">
                              <span>{{ price.priceable_type == 'dept' ? getTaxonomy('department') : 'Channel' }}</span>
                            </div>
                            <div class="col-md-3">
                              <span>{{ price.price }}</span>
                            </div>
                            <div class="col-md-3">
                              <el-tooltip content="Edit" placement="top">
                                <base-button size="sm" type="info" @click="onEditPrice(price, index)"><i class="fas fa-edit"/></base-button>
                              </el-tooltip>
                              <el-tooltip content="Delete" placement="top">
                                <base-button size="sm" type="danger" @click="deletePrice(price, index)"><i class="fas fa-times"/></base-button>
                              </el-tooltip>
                            </div>
                          </div>
                        </li>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="dialogOption == formOption[2]" class="row mt-3">
            <div class="col-md-12">
              <div class="border shadow p-3">
                <div class="row mb-2">
                  <div class="col-md-6">
                    <h3>Variant </h3>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <variant-category-lazydropdown v-model="singleVariant.variant" label="Variant Category"
                                                   placeholder="Select Variants"></variant-category-lazydropdown>
                    <base-input v-model="singleVariant.value" :rules="dialogOption == formOption[2] ? 'required' : ''" label="Value" name="value"
                                type="text"></base-input>
                    <div class="text-right">
                      <base-button :disabled="disabled" :loading="loading" type="success" @click="handleSubmit(saveVariant)"> Save</base-button>
                    </div>
                  </div>
                  <div class="col-md-6" style="overflow-y: scroll; height: 60%">
                    <ul class="list-group list-group-flush list my--1">
                      <li class="list-group-item px-0">
                        <div class="row align-items-center">
                          <div class="col-md-5">
                            <b>Variant Category</b>
                          </div>
                          <div class="col-md-4">
                            <b>Value </b>
                          </div>
                          <div class="col-md-3">

                          </div>
                        </div>
                      </li>
                      <div v-if="variantCategories.length <= 0" class="text-center">
                        <h5> No Data Found</h5>
                      </div>
                      <div v-if="isActive">
                        <li v-for="(variantCategory,index) in variantCategories" :key="index" class="list-group-item px-0">

                          <div class="row align-items-center">
                            <div v-if="variantCategories" class="col-md-5">
                              <span>{{ variantCategory.variant_category.name }}</span>
                            </div>
                            <div class="col-md-4">
                              <span>{{ variantCategory.value }}</span>
                            </div>
                            <div class="col-md-3">
                              <el-tooltip content="Edit" placement="top">
                                <base-button size="sm" type="info" @click="onEdit(variantCategory, index)"><i class="fas fa-edit"/></base-button>
                              </el-tooltip>
                              <el-tooltip content="Delete" placement="top">
                                <base-button size="sm" type="danger" @click="deleteVariant(variantCategory, index)"><i class="fas fa-times"/>
                                </base-button>
                              </el-tooltip>
                            </div>
                          </div>
                        </li>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="toogleProductOption != '' && toogleProductOption != formOption[2]" class="row mt-3">
            <div class="col-md-12">
              <div v-if="form.base_product_id != ''" class="text-center">
                <base-button size="sm" type="primary" @click="dialogOption = formOption[1], hideSaveButton = false">Add New Batch</base-button>
                <base-button v-if="form.batch_id != ''" size="sm" type="primary" @click="isPriceShow =  true, hideSaveButton = true">Add Batch Price
                </base-button>
                <base-button size="sm" type="primary" @click="viewVariant">Add Variant</base-button>
              </div>
              <div class="text-right">
                <base-button type="primary" @click="redirectRoute"> Done</base-button>
                <base-button v-if="!hideSaveButton" :disabled="disabled" :loading="loading" type="success" @click="handleSubmit(save)"> Save
                </base-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Mixins, Vue, Watch} from 'vue-property-decorator';
import {Button, Dialog, Switch, Tag} from "element-ui";
import "flatpickr/dist/flatpickr.css";
import SingleImageUploader from "@/components/ui/SingleImageUploader.vue";
import VariantCategoryLazydropdown from "@/components/lazyDropdown/VariantCategoryLazydropdown.vue";
import ViewVariant from "@/views/product/productModalComponent/ViewProductVariant.vue";
import DepartmentLazydropdown from "@/components/lazyDropdown/DepartmentLazydropdown.vue";
import ChannelLazydropdown from "@/components/lazyDropdown/ChannelLazydropdown.vue";
import AddBatch from "@/views/product/productCreateComponent/ProductBatchComponent.vue"
import TaxonomyMixin from "@/mixins/TaxonomyComponent";

const flatPicker = require("vue-flatpickr-component");
@Component({
  components: {
    flatPicker,
    [Switch.name]: Switch,
    [Tag.name]: Tag,
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    SingleImageUploader,
    VariantCategoryLazydropdown,
    ViewVariant,
    DepartmentLazydropdown,
    ChannelLazydropdown,
    AddBatch
  }
})
export default class AddProductBatch extends Mixins(TaxonomyMixin) {
  private productForm = {
    name: '',
    sku: '',
    product_brand_id: '',
    product_category_id: '',
    description: '',
    usp: ''
  }
  private batchForm: any = {
    batch_id: '',
    qty: 0,
    mrp: 0,
    mfg_date: '',
    exp_date: '',
    image: '',
  }
  private form = {
    base_product_id: '',
    product_brand_id: '',
    batch_id: ''
  }
  private singleVariant = {
    value: '',
    variant: '',
    id: '',
  }
  private singlePrice = {
    priceable_id: '',
    price: 0,
    priceable_type: '',
    id: ''
  };
  private priceFilter: any = '';
  private priceType = ['dept', 'depttype'];
  private toogleProductOption: string = '';
  private dialogOption: string = '';
  private isPriceShow: boolean = false;
  private formOption = ['newProduct', 'assignBatch', 'addVariant'];
  private existingProduct: boolean = false;
  private variantCategories: any[] = [];
  private productPrices: any[] = [];
  private isActive: boolean = false;
  private departmentTypes: any[] = [];
  private departments: any[] = [];
  private hideSaveButton: boolean = false;
  private disabled: boolean = false;
  private loading: boolean = false;

  @Watch('form.base_product_id')
  async getProductBrandIdForExistingProduct(newVal: any) {
    if (this.toogleProductOption == this.formOption[1]) {
      this.$http.get(this.$api(`/base-products/${newVal}`))
        .then(response => {
          this.form.product_brand_id = response.data.baseProduct.product_brand_id;
        })
    }
  }

  @Watch('dialogOption')
  resetBatchForm(newVal: any) {
    if (this.dialogOption == this.formOption[2]) {
      this.batchFormReset();
    }
  }

  addNewProduct() {
    this.toogleProductOption = this.formOption[0]
    this.hideSaveButton = false;
    this.dialogOption = ''
  }

  addNewBatch() {
    this.toogleProductOption = this.formOption[1];
    this.dialogOption = this.formOption[1];
    this.existingProduct = true;
    this.hideSaveButton = false;
  }

  viewVariant() {
    this.dialogOption = this.formOption[2];
    this.isPriceShow = false;
    this.form.batch_id = '';
    this.hideSaveButton = true;
  }

  batchFormReset() {
    this.batchForm.exp_date = '';
    this.batchForm.mfg_date = '';
    this.batchForm.mrp = 0;
    this.batchForm.qty = 0;
    this.batchForm.batch_id = '';
  }

  redirectRoute() {
    this.$router.push({name: 'products'});
  }

  onEdit(variantCategory: any, index: any) {
    this.singleVariant.variant = variantCategory.variant_category_id;
    this.singleVariant.value = variantCategory.value;
    this.singleVariant.id = variantCategory.id;
  }

  onEditPrice(price: any, index: any) {
    this.singlePrice.priceable_type = price.priceable_type;
    this.singlePrice.priceable_id = price.priceable_id;
    this.singlePrice.price = price.price;
    this.singlePrice.id = price.id;
  }

  deleteVariant(variantCategory: any, index: any) {
    this.$http.delete(this.$api(`/product-variants/${variantCategory.id}`))
      .then(response => {
        this.$notify({
          title: 'Success',
          message: 'Successfully Deleted',
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.variantCategories.splice(this.variantCategories.findIndex((varaint: any) => varaint.id == variantCategory.id), 1);
      })
  }

  deletePrice(price: any, index: any) {
    this.$http.delete(this.$api(`/product-prices/${price.id}`))
      .then(response => {
        this.$notify({
          title: 'Success',
          message: 'Successfully Deleted',
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.productPrices.splice(this.productPrices.findIndex((product: any) => product.id == price.id), 1);
      })
  }

  saveBtnDisable() {
    this.disabled = true;
    this.loading = true;
  }

  saveBtnEnable() {
    this.disabled = false;
    this.loading = false;
  }

  save() {
    this.saveBtnDisable()
    if (this.toogleProductOption == this.formOption[0] && this.dialogOption == '') {
      this.saveBtnDisable();
      this.$http.post(this.$api(`/base-products`), this.productForm)
        .then(response => {
          this.$notify({
            title: 'Success',
            message: 'Successfully Added',
            duration: 5000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
          this.saveBtnEnable()
          this.form.base_product_id = response.data.baseProduct.id;
          this.form.product_brand_id = response.data.baseProduct.product_brand_id;
        })
        .catch(error => {
          this.saveBtnEnable();
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
    } else if (this.dialogOption == this.formOption[1] || this.toogleProductOption == this.formOption[1]) {
      var form = new FormData();
      form.append('image', this.batchForm.image);
      form.append('mrp', this.batchForm.mrp);
      form.append('qty', this.batchForm.qty);
      form.append('batch_id', this.batchForm.batch_id);
      form.append('base_product_id', this.form.base_product_id);
      form.append('mfg_date', this.batchForm.mfg_date);
      form.append('exp_date', this.batchForm.exp_date);

      this.$http.post(this.$api(`/products`), this.batchForm.image != '' ? form :
        {
          base_product_id: this.form.base_product_id,
          batch_id: this.batchForm.batch_id,
          mrp: this.batchForm.mrp,
          qty: this.batchForm.qty,
          mfg_date: this.batchForm.mfg_date,
          exp_date: this.batchForm.exp_date
        })
        .then(response => {
          this.form.batch_id = response.data.product.id;
          this.saveBtnEnable();
          this.$notify({
            title: 'Success',
            message: 'Successfully Added',
            duration: 5000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
        })
        .catch(error => {
          this.saveBtnEnable();
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
    }
  }

  saveVariant() {
    this.saveBtnDisable();
    if (this.singleVariant.id != '') {
      this.$http.patch(this.$api(`/product-variants/${this.singleVariant.id}`), {
        base_product_id: this.form.base_product_id,
        variant_category_id: this.singleVariant.variant,
        value: this.singleVariant.value,
        product_brand_id: this.form.product_brand_id
      })
        .then(response => {
          this.saveBtnEnable();
          this.variantCategories.splice(this.variantCategories.findIndex((variant: any) => variant.id == this.singleVariant.id), 1, response.data.productVariant);
          this.singleVariant.value = '';
          this.singleVariant.variant = '';
          this.isActive = true;
          this.$notify({
            title: 'Success',
            message: 'Successfully Added',
            duration: 5000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
          this.$nextTick(() => {
            (this.$refs.formValidator as HTMLFormElement).reset();
          })
        })
        .catch(error => {
          this.saveBtnEnable();
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
    } else {
      this.$http.post(this.$api(`/product-variants`), {
        base_product_id: this.form.base_product_id,
        variant_category_id: this.singleVariant.variant,
        value: this.singleVariant.value,
        product_brand_id: this.form.product_brand_id
      })
        .then(response => {
          this.saveBtnEnable();
          this.variantCategories.push(response.data.productVariant);
          this.singleVariant.value = '';
          this.singleVariant.variant = '';
          this.isActive = true;
          this.$notify({
            title: 'Success',
            message: 'Successfully Deleted',
            duration: 5000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
        })
        .catch(error => {
          this.saveBtnEnable();
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
    }
  }

  savePrice() {
    this.saveBtnDisable();
    if (this.singlePrice.id != '') {
      this.$http.patch(this.$api(`/product-prices/${this.singlePrice.id}`), {
        product_id: this.form.batch_id,
        priceable_id: this.singlePrice.priceable_id,
        priceable_type: this.singlePrice.priceable_type,
        price: this.singlePrice.price
      })
        .then(response => {
          this.saveBtnEnable();
          this.productPrices.splice(this.productPrices.findIndex((price: any) => price.id == this.singlePrice.id), 1, response.data.productPrice);
          this.singlePrice.price = 0;
          this.singlePrice.priceable_id = '';
          this.singlePrice.priceable_type = '';
          this.isActive = true;
          this.$notify({
            title: 'Success',
            message: 'Successfully Added',
            duration: 5000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
        })
        .catch(error => {
          this.saveBtnEnable();
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
    } else {
      this.$http.post(this.$api('/product-prices'), {
        product_id: this.form.batch_id,
        priceable_id: this.singlePrice.priceable_id,
        priceable_type: this.singlePrice.priceable_type,
        price: this.singlePrice.price
      }).then(response => {
        this.saveBtnEnable();
        this.productPrices.push(response.data.productPrice);
        this.singlePrice.price = 0;
        this.singlePrice.priceable_id = '';
        this.singlePrice.priceable_type = '';
        this.isActive = true;
        this.$notify({
          title: 'Success',
          message: 'Successfully Added',
          duration: 5000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
      })
        .catch(error => {
          this.saveBtnEnable();
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
    }
  }

  fetchDepartmentTypes() {
    this.$http.get(this.$api('/department-types')).then(response => {
      this.departmentTypes = response.data.departmentTypes;
    })
  }

  fetchDepartment() {
    this.$http.get(this.$api('/departments')).then(response => {
      this.departments = response.data.departments;
    })
  }

  created() {
    this.fetchDepartment();
    this.fetchDepartmentTypes();
  }
}
</script>
