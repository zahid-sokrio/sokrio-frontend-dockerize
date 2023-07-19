<template>
  <validation-observer ref="formValidator" v-slot="{ handleSubmit }">
    <form class="needs-validation" @submit.prevent="handleSubmit(save)">
      <modal v-if="isActive" :show="isActive" size="lg" @close="close" class="modal-dialog-scrollable">
        <template slot="header">
          <h5 id="exampleModalLabel" class="modal-title">
            {{ isUpdate ? 'Update' : 'Add New' }} {{ isInvoice ? getTaxonomy('invoice') : isDelivery ? 'Delivery' : getTaxonomy('requisition') }}
          </h5>
        </template>
        <div class="row">
          <div class="col-md-6">
            <div v-if="isUpdate && departmentLists && form.departmentId != ''" class="mb-4">
              <h4>Buyer {{ getTaxonomy('department') }}</h4>
              {{
                departmentLists.find(department => department.id == form.departmentId)
                  ? departmentLists.find(department => department.id == form.departmentId).name
                  : ''
              }}
            </div>

            <department-lazydropdown
              v-else
              v-model="form.departmentId"
              :label="'Buyer ' + getTaxonomy('department')"
              :placeholder="'Select Buyer ' + getTaxonomy('department')"
              endPoint="departments?except_id=1&has_outlet=0"
              @change="getSupplierId(form.departmentId)"
            ></department-lazydropdown>

            <!--                    <department-lazydropdown label="Purchased Form" placeholder="Select Purchased Deparment" v-model="form.requestTo"></department-lazydropdown>-->
            <base-input label="Product Type">
              <el-select v-model="form.type" filterable>
                <el-option v-for="(type, index) in types" :key="index" :label="type.replace(/^\w/, c => c.toUpperCase())" :value="type"></el-option>
              </el-select>
            </base-input>
            <product-brand-lazydropdown
              v-if="form.type == 'brand'"
              v-model="form.productableId"
              :label="'Product ' + form.type.replace(/^\w/, c => c.toUpperCase())"
              placeholder="Select Product Brand"
            ></product-brand-lazydropdown>
            <product-category-lazydropdown
              v-if="form.type == 'category'"
              v-model="form.productableId"
              :label="'Product ' + form.type"
              placeholder="Select Product Category"
            ></product-category-lazydropdown>

            <base-input v-if="!isInvoice && !isDelivery" label="Expected Delivery Date" name="expected_delivery_date" prepend-icon="fas fa-calendar">
              <flat-picker
                slot-scope="{ focus, blur }"
                v-model="form.expectedDeliveryDate"
                :config="{ allowInput: true }"
                class="form-control datepicker"
                @on-close="blur"
                @on-open="focus"
              >
              </flat-picker>
            </base-input>

            <el-tooltip v-if="!isInvoice && !isDelivery" content="Return Product" placement="top">
              <base-button class="text-left" icon size="sm" type="primary" @click="(salesReturn = true), updatedSalesReturn()">
                <span class="btn-inner--icon">
                  <i class="fas fa-undo-alt"></i>
                </span>
                <span class="btn-inner--text"> Return Product </span>
              </base-button>
            </el-tooltip>

            <!--                    <base-checkbox v-if="!isInvoice" class="text-left" v-model="salesReturn">Return Product</base-checkbox>-->
          </div>
          <div class="col-md-6">
            <!--                    <base-input label="Amount Payable" name="amount" placeholder="e.g. 00" prepend-icon="fas fa-credit-card" v-model="form.paid"/>-->
            <div class="timeline timeline-one-side" data-timeline-axis-style="dashed" data-timeline-content="axis">
              <div class="timeline-block">
                <span class="timeline-step badge-success">
                  <i class="fas fa-percent"></i>
                </span>
                <div class="timeline-content">
                  <div class="d-flex justify-content-between pt-1">
                    <div>
                      <span class="text-muted text-sm font-weight-bold">Badge Discount</span>
                    </div>
                  </div>
                  <h6 class="text-sm mt-1 mb-0">{{ form.badgeDiscount }}</h6>
                </div>
              </div>
              <div v-if="!isInvoice" class="timeline-block">
                <span class="timeline-step badge-success">
                  <i class="ni ni-money-coins"></i>
                </span>
                <div class="timeline-content">
                  <div class="d-flex justify-content-between pt-1">
                    <div>
                      <span class="text-muted text-sm font-weight-bold">{{ getTaxonomy('salesReturn') }}</span>
                    </div>
                  </div>
                  <h6 class="text-sm mt-1 mb-0">{{ Number(calculateSalesReturn).toFixed(2) }}</h6>
                </div>
              </div>
              <div class="timeline-block">
                <span class="timeline-step badge-success">
                  <i class="ni ni-money-coins"></i>
                </span>
                <div class="timeline-content">
                  <div class="d-flex justify-content-between pt-1">
                    <div>
                      <span class="text-muted text-sm font-weight-bold">Amount Payable</span>
                    </div>
                  </div>
                  <h6 class="text-sm mt-1 mb-0">{{ Number(amount).toFixed(2) + ' ' + getCurrency }}</h6>
                </div>
              </div>
              <div class="timeline-block">
                <span class="timeline-step badge-success">
                  <i class="ni ni-money-coins"></i>
                </span>
                <div class="timeline-content">
                  <div class="d-flex justify-content-between pt-1">
                    <div>
                      <span class="text-muted text-sm font-weight-bold">Net Amount</span>
                    </div>
                  </div>
                  <h6 class="text-sm mt-1 mb-0">{{ calculateNetAmount().toFixed(2) + ' ' + getCurrency }}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--            <div class="row">-->
        <div v-if="form.sellerId && form.departmentId" class="col-md-12">
          <h4 class="heading-margin text-align">Products</h4>
          <br />
        </div>
        <!--            </div>-->
        <div v-if="form.sellerId && form.departmentId" class="pl-2 pr-2 text-center">
          <ul class="list-group list-group-flush list my--1">
            <li class="list-group-item px-0">
              <div class="row align-items-center">
                <div class="col-md-3">
                  <small>Product Name</small>
                </div>
                <div class="col-md-2">
                  <small>Qty </small>
                </div>
                <div class="col-md-1">
                  <small>Price</small>
                </div>
                <div class="col-md-2">
                  <small>Amount</small>
                </div>
                <div class="col-md-2">
                  <small>Free Product </small>
                </div>
                <div class="col-md-2"></div>
              </div>
            </li>
            <li v-for="(pro, index) in product" :key="index" class="list-group-item px-0">
              <div class="row">
                <div v-if="index == product.length - 1" class="col-md-3">
                  <stock-lazydropdown
                    v-if="form.type == 'product'"
                    v-model="pro.product_id"
                    :end-point="`/stock-lists?distinct&department_id=${form.sellerId}`"
                    item-text="product.full_name"
                    item-value="product.id"
                    placeholder="Select Product"
                    @change="getPrice($event, pro), getProductPromotion(pro), (isChangeProduct = !isChangeProduct)"
                  ></stock-lazydropdown>

                  <h4 v-if="form.type == 'product'" class="text-muted text-sm text-bold font-weight-bold text-left ml-2">
                    <span v-if="pro.product_id && form.sellerId">
                      Available Qty:
                      <async-render
                        :key="isChangeProduct"
                        :callback="
                          response => {
                            return response.data.stocks.length ? response.data.stocks[0].qty : '0';
                            isChangeProduct = false;
                          }
                        "
                        :url="`/stocks?distinct&department_id=${form.departmentId}&product_id=${pro.product_id}`"
                      >
                      </async-render>
                    </span>
                  </h4>

                  <stock-lazydropdown
                    v-if="form.productableId && form.type != 'product'"
                    v-model="pro.product_id"
                    :end-point="`/stocks?distinct&department_id=${form.sellerId}&${form.type + '_id=' + form.productableId}`"
                    item-text="product.full_name"
                    item-value="product.id"
                    placeholder="Select Product"
                    @change="getPrice($event, pro), getProductPromotion(pro), isChangeProduct != isChangeProduct"
                  ></stock-lazydropdown>

                  <h4 v-if="form.productableId && form.type != 'product'" class="text-muted text-sm text-bold font-weight-bold text-left ml-2">
                    <span v-if="pro.product_id && form.sellerId">
                      Available Qty:
                      <async-render
                        :key="isChangeProduct"
                        :callback="response => (response.data.stocks.length > 0 ? response.data.stocks[0].qty : '0')"
                        :url="`/stocks?distinct&department_id=${form.departmentId}&product_id=${pro.product_id}`"
                      ></async-render>
                    </span>
                  </h4>
                </div>
                <div v-else class="col-md-3">
                  <b>{{ pro.fullName }}</b>
                </div>
                <div class="col-md-2">
                  <base-input
                    v-model="pro.qty"
                    alternative
                    min="0"
                    name="qty"
                    rules="required"
                    type="number"
                    @change="totalAmount(), compairPromotion(pro, index)"
                  ></base-input>
                  <div v-if="pro.qty == 0 && flag">
                    <h5 style="color:red;font-size: 9px;">Qty must not to be zero</h5>
                  </div>
                </div>
                <div class="col-md-1">
                  <b>{{ pro.price }}</b>
                </div>
                <div class="col-md-2">
                  <b v-if="productPromotionalPrice[index]">
                    <a
                      data-toggle="tooltip"
                      href="#!"
                      @click.prevent="(isShowPromotion = true), (promotionalDiscount = pro.qty * pro.price - productPromotionalPrice[index])"
                    >
                      {{ productPromotionalPrice[index].toFixed(2) }}
                    </a>
                  </b>
                </div>
                <div class="col-md-2">
                  <small v-if="freeProduct[index]">{{ freeProduct[index] }}</small>
                  <small v-else-if="isUpdate && pro.free_with">{{ fullProductList.find(product => product.id == pro.free_with).name }}</small>
                  <small v-else>No Free Product</small>
                </div>
                <div class="col-md-2">
                  <el-tooltip v-if="product.length - 1 == index" content="Add Requisition" placement="top">
                    <i class="fas fa-plus-circle mr-1" style="font-size:30px; color: #1aae6f" @click="addNewProduct"></i>
                  </el-tooltip>
                  <el-tooltip v-if="product.length != 1" content="Delete Requisition" placement="top">
                    <i class="fas fa-times-circle" style="font-size:30px; color: red" @click="deleteProduct(index)"></i>
                  </el-tooltip>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <sales-return-add
          v-if="salesReturn"
          :buyer-department="buyerDepartment"
          :calculate-sales-return.sync="calculateSalesReturn"
          :entity-amount.sync="amount"
          :form.sync="form"
          :full-product-list="fullProductList"
          :is-active.sync="salesReturn"
          :product.sync="product"
          :sales-returns="salesReturns"
          @updateSalesReturn="updateSalesReturn"
        ></sales-return-add>

        <modal :show.sync="isShowPromotion">
          <template slot="header">
            <h5 id="exampleModalLabel1" class="modal-title">Payment Details</h5>
          </template>
          <div class="card">
            <div class="card-body">
              <div class="timeline timeline-one-side" data-timeline-axis-style="dashed" data-timeline-content="axis">
                <div class="timeline-block">
                  <span class="timeline-step badge-success">
                    <i class="fas fa-bullhorn"></i>
                  </span>
                  <div class="timeline-content">
                    <div class="d-flex justify-content-between pt-1">
                      <div>
                        <span class="text-muted text-sm font-weight-bold">Promotional Discount</span>
                      </div>
                    </div>
                    <h6 class="text-sm mt-1 mb-0">{{ promotionalDiscount ? promotionalDiscount : 0 }} tk</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </modal>
        <template slot="footer">
          <span v-if="productPriceTooltip != ''" style="color: red; font-size: 13px"
            ><i class="fas fa-info-circle"></i>
            {{ productPriceTooltip }}
          </span>
          <base-button type="secondary" @click="close">Close</base-button>
          <base-button v-if="form.type == 'product'" :disabled="flag" :loading="loading" type="success" @click="handleSubmit(save)"
            >Save
          </base-button>
          <base-button v-if="form.type != 'product'" :disabled="disableBtn" :loading="loading" type="success" @click="handleSubmit(save)"
            >Save
          </base-button>
        </template>
      </modal>
    </form>
  </validation-observer>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator';
import 'flatpickr/dist/flatpickr.css';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip } from 'element-ui';
import CreateDepartmentForm from '@/views/department/CreateDepartmentForm.vue';
import BrandForm from '@/components/products/BrandForm.vue';
import CategoryForm from '@/components/products/CategoryForm.vue';
import SalesReturnAdd from '@/views/order/salesReturn/SalesReturnAdd.vue';
import DepartmentLazydropdown from '@/components/lazyDropdown/DepartmentLazydropdown.vue';
import ProductBrandLazydropdown from '@/components/lazyDropdown/ProductBrandLazydropdown.vue';
import ProductCategoryLazydropdown from '@/components/lazyDropdown/ProductCategoryLazydropdown.vue';
import ProductLazydropdown from '@/components/lazyDropdown/ProductLazydropdown.vue';
import StockLazydropdown from '@/components/lazyDropdown/StockLazydropdown.vue';
import Department from '@/intefaces/Department';
import AsyncRender from '@/components/AsyncRender.vue';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';

const flatPicker = require('vue-flatpickr-component');

@Component({
  name: 'RequisitionForm',
  components: {
    AsyncRender: AsyncRender,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    flatPicker,
    CreateDepartmentForm,
    BrandForm,
    CategoryForm,
    DepartmentLazydropdown,
    ProductBrandLazydropdown,
    ProductCategoryLazydropdown,
    ProductLazydropdown,
    SalesReturnAdd,
    StockLazydropdown
  }
})
export default class RequisitionForm extends Mixins(TaxonomyMixin) {
  @Prop() isActive!: boolean;
  @Prop() isUpdate!: boolean;
  @Prop() currentEntity!: any;
  @Prop() updateAmountCount!: boolean;
  @Prop({ default: false }) isInvoice!: boolean;
  @Prop() isDelivery!: boolean;
  @Prop() form!: {
    departmentId: any;
    sellerId: any;
    discount: any;
    expectedDeliveryDate: any;
    paid: any;
    type: string;
    productableId: any;
    promotionalDiscount: any;
    badgeDiscount: any;
  };
  @Prop() product!: any[];
  @Prop() salesReturns!: any[];

  private count = 0;
  private isShowPromotion: boolean = false;
  private promotionalDiscount: number = 0;
  private departmentLists: any[] = [];
  private products: any[] = [];
  private types = ['brand', 'category', 'product'];
  private fullProductList: any[] = [];
  private productable: any[] = [];
  private loading = false;
  private productPromotion: any = [];
  private salesReturn: boolean = false;
  private freeProduct: any = [];
  private disableDept: boolean = false;
  private isActiveRequestForm = false;
  private isActiveProducable = false;
  private stockChangeFlag = false;
  private calculateSalesReturn: any = 0;
  private amount = 0;
  private netTotalAmount: number = 0;
  private productPromotionalPrice: any = [];
  private productPriceTooltip = '';
  private buyerDepartment: any = [];
  private badgeDiscountAmount: number = 0;
  private isChangeProduct = 0;
  private flag: boolean = true;

  private brandForm: { name: string; parentId: number | string } = {
    name: '',
    parentId: ''
  };
  private categoryForm: { name: string; parentId: number | string } = {
    name: '',
    parentId: ''
  };
  private disableBtn = false;
  private netAmount: any = 0;

  get getCurrency() {
    return this.$store.getters['Settings/getCurrency'];
  }

  @Watch('form.type')
  nullProductableId() {
    this.form.productableId = '';
  }

  @Watch('form.departmentId')
  addNewDepartment(newVal: string) {
    if (newVal == '0') {
      this.isActiveRequestForm = true;
    }
  }

  @Watch('form.requestTo')
  addDepartment(newVal: string) {
    if (newVal == '0') {
      this.isActiveRequestForm = true;
    }
    this.product = [
      {
        product_id: '',
        price: '',
        qty: '',
        free_with: '',
        promotion_discount: 0,
        promotion_id: '',
        fullName: ''
      }
    ];
    this.productPriceTooltip = '';
  }

  @Watch('form.productableId')
  addNewProductable(newVal: string) {
    if (newVal == '0') {
      this.isActiveProducable = true;
    }
  }

  @Watch('isUpdate')
  setProductandSalesReturnValue(newVal: any) {
    if (newVal && !this.isInvoice && !this.isDelivery) {
      this.calculateSalesReturn = 0;
      // if (this.currentEntity.sales_return) {
      //     this.salesReturn = true
      // }

      this.salesReturns.forEach(salesReturn => {
        this.calculateSalesReturn = this.calculateSalesReturn + salesReturn.amount;
      });
    }
    this.netTotalAmount = this.currentEntity.amount;

    this.totalAmount();
  }

  @Watch('updateAmountCount')
  setTotalAmountForUpdate() {
    this.totalAmount();
    // this.freeProduct[index] =
  }

  updatedSalesReturn() {
    if (this.isUpdate && this.currentEntity.returned_products) {
      this.currentEntity.returned_products.forEach((product: any) => {
        this.calculateSalesReturn = product.qty * product.return_rate;
      });
    }
  }

  getProductPromotion(product: void) {
    if (this.form.type == 'product') {
      this.getPromotion(product);
    }
  }

  @Watch('form.departmentId')
  getSupplierId(departmentId: any) {
    if (departmentId) {
      this.$http.get(this.$api(`/departments/${departmentId}`)).then(response => {
        this.form.sellerId = response.data.department.supplier_id;
        this.form.badgeDiscount = response.data.department.badge ? response.data.department.badge.mrp_discount : 0;
      });
    }
  }

  calculateNetAmount() {
    return this.netTotalAmount - this.calculateSalesReturn;
  }

  updateSalesReturn() {
    if (!this.isUpdate) {
      this.$emit('update:salesReturns', [
        {
          product_id: '',
          qty: '',
          amount: '',
          return_rate: 0,
          paid: 0,
          reason: ''
        }
      ]);
    }
  }

  totalAmount() {
    this.amount = 0;
    this.product.forEach((product: any, index: any) => {
      if (product.qty < 1) {
        this.flag = true;
      } else {
        if (index > 0) {
          this.product.forEach((eachProduct: any) => {
            if (eachProduct.qty < 1) {
              this.flag = true;
            }
          });
        } else {
          this.flag = false;
        }
      }
    });

    if (this.updateAmountCount) {
      this.product.forEach((product: any, index: any) => {
        this.productPromotionalPrice[index] = this.amount + (product.qty * product.price - product.promotion_discount);
      });
      this.productPromotionalPrice.forEach((product: any) => {
        this.amount = this.amount + product;
      });
      this.$emit('update:updateAmountCount', false);
    } else {
      this.productPromotionalPrice.forEach((product: any) => {
        this.amount = this.amount + product;
      });
    }
    if (this.form.badgeDiscount) {
      this.netTotalAmount = this.amount - (this.form.badgeDiscount * this.amount) / 100;
    } else {
      this.netTotalAmount = this.amount;
    }
  }

  compairPromotion(product: any, index: any) {
    var amount = product.qty * product.price;
    this.productPromotionalPrice[index] = amount;
    var currentPromotion = this.productPromotion != '' ? this.productPromotion[this.productPromotion.length - 1] : '';
    if (currentPromotion != '' && currentPromotion.promotion_type == 'qty') {
      this.conditionForQtyPromotions(currentPromotion, index, amount, product);
    } else if (currentPromotion != '' && currentPromotion.promotion_type == 'amount') {
      this.conditionForPromotions(currentPromotion, index, amount, product);
    }
    this.product[index].promotion_id = currentPromotion != '' ? currentPromotion.id : '';
    this.totalAmount();
  }

  // TODO - reduce promotion calculation

  conditionForPromotions(currentPromotion: any, index: any, amount: any, product: any) {
    if (currentPromotion.offer_type == 'amount' && currentPromotion.promotion_value <= amount) {
      this.productPromotionalPrice[index] = amount - currentPromotion.offer_value * Math.floor(amount / currentPromotion.promotion_value);
      this.product[index].promotion_discount = currentPromotion.offer_value * Math.floor(amount / currentPromotion.promotion_value);
    } else if (currentPromotion.offer_type == 'qty' && currentPromotion.promotion_value <= amount) {
      this.freeProduct[index] =
        currentPromotion.offer_product.name +
        '-' +
        currentPromotion.offer_value * Math.floor(product.qty / currentPromotion.promotion_value) +
        ' qty';
      this.product[index].free_with = currentPromotion.promotionable_id;
      this.productPromotionalPrice[index] = amount;
    } else if (currentPromotion.offer_type == 'percent' && currentPromotion.promotion_value <= amount) {
      this.productPromotionalPrice[index] = amount - (amount * currentPromotion.offer_value) / 100;
      this.product[index].promotion_discount = (amount * currentPromotion.offer_value) / 100;
    }
  }

  conditionForQtyPromotions(currentPromotion: any, index: any, amount: any, product: any) {
    if (currentPromotion.offer_type == 'amount' && currentPromotion.promotion_value <= product.qty) {
      this.productPromotionalPrice[index] = amount - currentPromotion.offer_value * Math.floor(product.qty / currentPromotion.promotion_value);
      this.product[index].promotion_discount = currentPromotion.offer_value * Math.floor(product.qty / currentPromotion.promotion_value);
    } else if (currentPromotion.offer_type == 'qty' && currentPromotion.promotion_value <= product.qty) {
      this.freeProduct[index] =
        currentPromotion.offer_product.name +
        '-' +
        currentPromotion.offer_value * Math.floor(product.qty / currentPromotion.promotion_value) +
        ' qty';
      this.product[index].free_with = currentPromotion.offer_product_id;
      this.productPromotionalPrice[index] = amount;
    } else if (currentPromotion.offer_type == 'percent' && currentPromotion.promotion_value <= product.qty) {
      this.productPromotionalPrice[index] = amount - (amount * currentPromotion.offer_value) / 100;
      this.product[index].promotion_discount = (amount * currentPromotion.offer_value) / 100;
    }
  }

  //--------

  getPromotion(product: any) {
    this.$http
      .get(this.$api(`/promotions?promotionable_id=${this.form.type},${this.form.type == 'product' ? product.product_id : this.form.productableId}`))
      .then(response => {
        this.productPromotion = response.data.promotions;
      });
  }

  setDepartmentId() {
    if (this.form.departmentId == 0) {
      this.form.departmentId = '';
    }
  }

  setProductableId() {
    if (this.form.productableId == 0) {
      this.form.productableId = '';
    }
  }

  addNewProduct() {
    this.product.push({
      product_id: '',
      price: 0,
      qty: 0,
      free_with: '',
      promotion_discount: 0,
      promotion_id: ''
    });
  }

  deleteProduct(index: number) {
    this.product.splice(index, 1);
    this.freeProduct.splice(index, 1);
    this.productPromotionalPrice.splice(index, 1);
    this.totalAmount();
    this.productPriceTooltip = '';
  }

  @Watch('product.product_id')
  public async getPrice(selectedProduct: any, row: any) {
    row.price = 0;
    row.qty = 0;
    row.amount = 0;
    this.totalAmount();
    this.productPriceTooltip = '';

    await this.$http.get(this.$api(`/departments/${this.form.departmentId}`)).then(resposneDepartment => {
      this.buyerDepartment = resposneDepartment.data.department;
    });

    this.$http.get(this.$api(`/products/${selectedProduct}?with=prices`)).then(responseProductPrice => {
      row.fullName = responseProductPrice.data.product.full_name;
      responseProductPrice.data.product.prices.forEach((price: any) => {
        if (
          this.buyerDepartment &&
          price.priceable_id == (price.priceable_type == 'depttype' ? this.buyerDepartment.department_type_id : this.buyerDepartment.id)
        ) {
          row.price = price.price;
        }
      });
    });
  }

  createRequisition() {
    this.$http
      .post(this.$api('/requisitions'), {
        buyer_id: this.form.departmentId,
        seller_id: this.form.sellerId,
        expected_delivery_date: this.form.expectedDeliveryDate,
        amount: this.amount,
        discount: 0,
        promotion_discount: this.form.promotionalDiscount,
        products: this.product
      })
      .then(response => {
        if (this.salesReturns[0].product_id != '') {
          this.$http.post(this.$api('/sales-returns'), {
            order_id: response.data.requisition.id,
            buyer_id: this.form.departmentId,
            seller_id: this.form.sellerId,
            from_delivery: 0,
            products: this.salesReturns
          });
        }
        this.$emit('created', response.data.requisition);
        this.$notify({
          title: 'Success',
          message: 'Successfully Created',
          duration: 5000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        (this.amount = 0),
          (this.form.departmentId = ''),
          (this.form.sellerId = ''),
          (this.form.discount = 0),
          (this.promotionalDiscount = 0),
          (this.form.expectedDeliveryDate = ''),
          (this.form.paid = ''),
          (this.form.type = 'product'),
          (this.form.productableId = ''),
          (this.amount = 0);
        this.disableBtn = false;
        this.loading = false;
        this.$emit('update:product', [
          {
            product_id: '',
            price: '',
            qty: '',
            free_with: '',
            promotion_discount: 0,
            promotion_id: ''
          }
        ]);
        this.$emit('update:salesRetrun', [
          {
            product_id: '',
            qty: '',
            amount: '',
            paid: 0,
            return_rate: 0,
            reason: ''
          }
        ]);
        this.$nextTick(() => {
          (this.$refs.formValidator as HTMLFormElement).reset();
        });
      })
      .catch(error => {
        if (error.response.data.errors.expected_delivery_date) {
          this.notification('Warning', error.response.data.errors.expected_delivery_date[0], 'warning');
        }
        this.disableBtn = false;
        this.loading = false;
        this.productPriceTooltip = error.response.data.errors['products.0.product_id'][0];
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  notification(title: string, message: string, type: 'success' | 'warning' | 'info' | 'error' | undefined) {
    this.$notify({
      title: title,
      message: message,
      duration: 3000,
      iconClass: 'ni ni-bell-55',
      type: type
    });
  }

  updateRequisition() {
    this.disableBtn = true;
    this.loading = true;
    if (this.isDelivery) {
      this.$http
        .post(this.$api(`/orders/${this.currentEntity.order_id}/deliveries`), {
          buyer_id: this.form.departmentId,
          seller_id: this.form.sellerId,
          amount: this.amount,
          discount: 0,
          promotion_discount: 0,
          products: this.product
        })
        .then(response => {
          (this.amount = 0),
            (this.form.departmentId = ''),
            (this.form.sellerId = ''),
            (this.form.discount = 0),
            (this.promotionalDiscount = 0),
            (this.form.paid = ''),
            (this.form.type = 'product'),
            (this.form.productableId = '');
          this.disableBtn = false;
          this.loading = false;
          this.$emit('created', response.data.delivery);
          this.$notify({
            title: 'Success',
            message: 'Successfully Created',
            duration: 5000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
        })
        .catch(error => {
          this.disableBtn = false;
          this.loading = false;
          this.productPriceTooltip = error.response.data.errors['products.0.product_id'][0];
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
    } else {
      this.$http
        .post(
          this.$api(`/${this.isInvoice ? 'invoices' : 'orders'}/${this.isInvoice ? this.currentEntity.id : this.currentEntity.order_id}/revisions`),
          {
            buyer_id: this.form.departmentId,
            seller_id: this.form.sellerId,
            expected_delivery_date: this.isInvoice ? '' : this.form.expectedDeliveryDate,
            amount: this.amount,
            discount: 0,
            promotion_discount: 0,
            products: this.product
          }
        )
        .then(response => {
          if (this.currentEntity.sales_return) {
            this.$http
              .patch(this.$api(`/sales-returns/${this.currentEntity.sales_return.id}`), {
                order_id: this.currentEntity.order_id,
                buyer_id: this.form.departmentId,
                seller_id: this.form.sellerId,
                from_delivery: 0,
                products: this.salesReturns
              })
              .then(resposne => {})
              .catch(error => {
                this.disableBtn = false;
                this.loading = false;
                this.productPriceTooltip = error.response.data.errors['products.0.product_id'][0];
                (this.$refs.formValidator as Vue & {
                  setErrors: (errors: []) => any;
                }).setErrors(error.response.data.errors);
              });
          } else if (!this.isInvoice) {
            this.$http
              .post(this.$api('/sales-returns'), {
                order_id: this.currentEntity.order_id,
                buyer_id: this.form.departmentId,
                seller_id: this.form.sellerId,
                from_delivery: 0,
                products: this.salesReturns
              })
              .then(resposne => {})
              .catch(error => {
                this.disableBtn = false;
                this.loading = false;
                (this.$refs.formValidator as Vue & {
                  setErrors: (errors: []) => any;
                }).setErrors(error.response.data.errors);
              });
          }
          this.$http
            .get(
              this.$api(
                `/${this.isInvoice ? 'invoices' : 'orders'}/${
                  this.isInvoice ? response.data.revision.invoice_id : response.data.revision.order_id
                }/revisions`
              )
            )
            .then(responseRevision => {
              this.$emit('updated', responseRevision.data.revisions[0]);
            });

          this.$notify({
            title: 'Success',
            message: 'Successfully Created',
            duration: 5000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
          (this.amount = 0),
            (this.form.departmentId = ''),
            (this.form.sellerId = ''),
            (this.form.discount = 0),
            (this.promotionalDiscount = 0),
            (this.form.expectedDeliveryDate = ''),
            (this.form.paid = ''),
            (this.form.type = 'product'),
            (this.form.productableId = '');
          this.disableBtn = false;
          this.loading = false;
          this.$emit('update:product', [
            {
              product_id: '',
              price: '',
              qty: '',
              free_with: '',
              promotion_discount: 0,
              promotion_id: ''
            }
          ]);
          this.$emit('update:salesRetrun', [
            {
              product_id: '',
              qty: '',
              amount: '',
              paid: 0,
              reason: ''
            }
          ]);
          this.$nextTick(() => {
            (this.$refs.formValidator as HTMLFormElement).reset();
          });
        })
        .catch(error => {
          this.disableBtn = false;
          this.loading = false;
          this.productPriceTooltip = error.response.data.errors['products.0.product_id'][0];
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
    }
  }

  save() {
    if (this.isUpdate || this.isInvoice) {
      this.updateRequisition();
    } else {
      this.createRequisition();
    }
  }

  fetchProducts() {
    this.$http.get(this.$api('/products')).then(response => {
      this.fullProductList = response.data.products;
    });
  }

  fetchDepartment() {
    this.$http.get(this.$api('/departments')).then(response => {
      this.departmentLists = response.data.departments;
    });
  }

  @Watch('isActive')
  callAPI(newVal: boolean) {
    if (newVal) {
      this.fetchProducts();
      this.fetchDepartment();
    }
  }

  close() {
    this.$nextTick(() => {
      (this.$refs.formValidator as HTMLFormElement).reset();
    });
    this.amount = 0;
    this.productPromotionalPrice = [];
    this.netTotalAmount = 0;
    this.salesReturn = false;
    this.$emit('update:isActive', false);
    this.$emit('update:isUpdate', false);
    this.$emit('update:isInvoice', false);
    this.$emit('update:updateAmountCount', false);
    this.$emit('update:form', {
      departmentId: '',
      sellerId: '',
      discount: 0,
      expectedDeliveryDate: '',
      paid: '',
      type: 'product',
      productableId: '',
      badgeDiscount: 0
    });
    this.$emit('update:product', [
      {
        product_id: '',
        price: 0,
        qty: 0,
        free_with: '',
        promotion_discount: 0,
        promotion_id: ''
      }
    ]);
    this.$emit('update:salesReturns', [
      {
        product_id: '',
        qty: '',
        amount: '',
        return_rate: 0,
        paid: 0,
        reason: ''
      }
    ]);
    this.disableBtn = false;
    this.productPriceTooltip = '';
  }
}
</script>
<style>
.el-table tr input[type='checkbox'] {
  height: 20px;
}

.heading-margin {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-family: sans-serif;
  margin: 1em 0;
}

.heading-margin:after {
  content: '';
  /*border-bottom: 1px solid gray;*/
  height: 1px;
  margin-left: 0.75em;
  flex-grow: 1;
}

.heading-margin:before {
  content: '';
  /*border-bottom: 1px solid gray;*/
  height: 1px;
  margin-right: 0.75em;
  flex-grow: 1;
}
</style>
