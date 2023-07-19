<template>
  <div v-if="editable">
    <div class="col-xs-12 heading mt-2 text-uppercase">
      {{ title }}ED PRODUCTS
    </div>
    <div class="pl-2 pr-2 text-center">
      <ul class="list-group list-group-flush list my--1">
        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-2">
              <h5>Name</h5>
            </div>
            <div class="col-md-2">
              <h5>Qty</h5>
            </div>
            <div class="col-md-1">
              <h5>Unit Price</h5>
            </div>
            <div class="col-md-2">
              <h5>P.Discount</h5>
            </div>
            <div class="col-md-2">
              <h5>Custom Discount</h5>
            </div>
            <div class="col-md-2">
              <h5>Total</h5>
            </div>
            <div class="col-md-1">
              <h5><i @click="addNewProduct()" class="fas fa-plus-circle" style="color: green; font-size: 25px"></i></h5>
            </div>
          </div>
        </li>
        <li v-for="(orderedProduct, index) in products" :key="index" class="list-group-item px-0"
            :style="orderedProduct.message ? 'background-color: #F5DDDD' : ''">
          <div class="row align-items-center">
            <div class="col-md-2">
              <small v-if="orderedProduct.is_free">{{ orderedProduct.name }} (Free)</small>
              <small v-else>
                <el-tooltip :content="orderedProduct.message" placement="top" style="float: left"
                            :disabled="orderedProduct.message ? false : true">
                  <stock-lazydropdown
                    v-model="orderedProduct.product_id"
                    :end-point="`/stocks?distinct&department_id=${currentEntity.seller_id}`"
                    item-text="product.full_name"
                    item-value="product.id"
                    placeholder="Select Product"
                    @change="getPrice(orderedProduct), getProductPromotion(orderedProduct, index),
                    checkForExistingPromotion(), getProductQtyForSeller(orderedProduct.product_id, orderedProduct)"
                  ></stock-lazydropdown>
                </el-tooltip>
              </small>
              <!--              <small v-if="currentEntity.hasOwnProperty('is_requisition')">Avail. Qty: {{ orderedProduct.availableQty }}</small>-->
            </div>
            <div class="col-md-2">
              <small v-if="orderedProduct.is_free">{{ orderedProduct.qty }}</small>
              <base-input v-else v-model="orderedProduct.qty" name="qty" type="number" min="0"
                          @change="getProductPromotion(orderedProduct, index), calculateOrderTotalCal()"></base-input>
            </div>
            <div class="col-md-1">
              <small>{{ orderedProduct.price }}</small>
            </div>
            <div class="col-md-2">
              <small>{{ orderedProduct.promotion_discount }}</small>
            </div>
            <div class="col-md-2">
              <small v-if="orderedProduct.is_free">{{ orderedProduct.custom_discount }}</small>
              <base-input v-else v-model="orderedProduct.custom_discount" name="custom_discount" type="number"
                          min="0" @change="getProductPromotion(orderedProduct, index), calculateOrderTotalCal()"></base-input>
            </div>
            <div class="col-md-2">
              <small v-if="orderedProduct.is_free">0</small>
              <small v-else>
                {{ calculateProductAmount(orderedProduct) }}
              </small>
            </div>
            <div class="col-md-1">
              <i class="fas fa-times-circle" style="color: red; font-size: 20px"
                 @click="deleteProductFromArray(index)"></i>
            </div>
          </div>
        </li>
      </ul>
      <div class="col-xs-12 heading mt-2 text-uppercase text-center">
        Returned Products
        <span style="float: right">
          <i @click="addNewReturnedProduct()" class="fas fa-plus-circle" style="color: green; font-size: 25px"></i>
        </span>
      </div>
      <div class="pl-2 pr-2 text-center">
        <ul class="list-group list-group-flush list my--1">
          <div v-if="salesReturns == ''">
            <span>No Item Available</span>
          </div>
          <div v-else>
            <li v-for="(salesReturn, index) in salesReturns" :key="index" class="list-group-item px-0"
                :style="salesReturn.message ? 'background-color: #F5DDDD' : ''">
              <div class="row align-items-center">
                <div class="col-md-2">
                  <small>
                    <el-tooltip :content="salesReturn.message" placement="top" style="float: left"
                                :disabled="salesReturn.message ? false : true">
                      <stock-lazydropdown
                        v-model="salesReturn.product_id"
                        :end-point="`/stocks?distinct&department_id=${currentEntity.seller_id}`"
                        item-text="product.full_name"
                        item-value="product.id"
                        placeholder="Select Product"
                        @change="getPrice(salesReturn)"
                      ></stock-lazydropdown>
                    </el-tooltip>
                  </small>
                </div>
                <div class="col-md-2">
                  <base-input v-model="salesReturn.qty" name="qty" type="number" min="0"
                              @change="calculateOrderTotalCal()"></base-input>
                </div>
                <div class="col-md-1">
                  <small>{{ salesReturn.return_rate }}</small>
                </div>
                <div class="col-md-2">
                  <small>{{ salesReturn.promotion_discount }}</small>
                </div>
                <div class="col-md-2">
                  <small>{{ salesReturn.custom_discount }}</small>
                </div>
                <div class="col-md-2">
                  <small>
                    {{ calculateReturnProductAmount(salesReturn) }}
                  </small>
                </div>
                <div class="col-md-1">
                  <i class="fas fa-times-circle" style="color: red; font-size: 20px"
                     @click="deleteReturnedProductFromArray(index)"></i>
                </div>
              </div>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {Divider} from "element-ui";
import OrderProduct from '@/intefaces/OrderProduct';
import StockLazydropdown from "@/components/lazyDropdown/StockLazydropdown.vue";
import Order from "@/intefaces/Order";
import AsyncRender from "@/components/AsyncRender.vue";

@Component({
  components: {
    [Divider.name]: Divider,
    StockLazydropdown,
    AsyncRender
  }
})

export default class OrderEdit extends Vue {
  @Prop() title!: string;
  @Prop() currentEntity!: Order;
  @Prop({default: false}) editable!: boolean;
  @Prop() saveEditedOrder!: boolean;
  @Prop() discount!: number;
  private subTotal: number = 0;
  private salesReturn: number = 0;
  @Prop() entity!: string;
  @Prop() entityProducts!: OrderProduct[];
  private qty = 0;

  private products: any = [{
    id: '',
    product_id: '',
    qty: 0,
    price: 0,
    promotion_discount: 0,
    custom_discount: 0,
    promotion_id: '',
    freeWith: '',
    offerId: '',
    offerQty: 0,
    is_free: 0,
    promotion: {},
    message: '',
    availableQty: 0
  }]

  private salesReturns: any = [{
    product_id: '',
    qty: 0,
    return_rate: 0,
    promotion_discount: 0,
    custom_discount: 0,
    message: '',
    is_free: 0,
    reason: 'damage',
    amount: 0,
  }]

  addNewReturnedProduct() {
    this.salesReturns.push({
      product_id: '',
      qty: 0,
      return_rate: 0,
      promotion_discount: 0,
      custom_discount: 0,
      message: '',
      is_free: 0,
      reason: 'damage',
      amount: 0,
    })
  }

  addNewProduct() {
    this.products.push({
      id: '',
      product_id: '',
      qty: 0,
      price: 0,
      promotion_discount: 0,
      custom_discount: 0,
      promotion_id: '',
      freeWith: '',
      offerId: '',
      offerQty: 0,
      is_free: 0,
      promotion: {},
      message: '',
    })
  }

  deleteProductFromArray(index: number) {
    this.products.splice(index, 1);
    this.calculateOrderTotalCal();
    this.checkForExistingPromotion();
    this.$emit('disabledSaveBtn', false)
  }

  deleteReturnedProductFromArray(index: number) {
    this.salesReturns.splice(index, 1);
    this.calculateOrderTotalCal();
    this.checkForExistingPromotion();
    this.$emit('disabledSaveBtn', false)

  }

  calculateProductAmount(orderedProduct: any) {
    return (orderedProduct.qty * orderedProduct.price) - orderedProduct.promotion_discount - orderedProduct.custom_discount;
  }

  calculateReturnProductAmount(returnProduct: any) {
    return returnProduct.qty * returnProduct.return_rate;
  }

  getProductQtyForSeller(productId: number, product: any) {
    if (this.currentEntity.hasOwnProperty('is_requisition')) {
      this.$http.get(this.$api(`/stocks?distinct&department_id=${this.currentEntity.seller_id}&product_id=${productId}`))
        .then(response => {
          product.availableQty = response.data.stocks[0].qty;
        })

    }
  }

  calculateOrderTotalCal() {
    let subTotal = 0;
    let salesReturn = 0;
    this.products.forEach((product: any) => {
      if (!product.is_free) {
        subTotal += (product.qty * product.price) - product.promotion_discount - product.custom_discount;
      }
    })
    this.salesReturns.forEach((product: any) => {
      if (!product.is_free) {
        salesReturn += product.qty * product.return_rate;
      } else {
        salesReturn += 0
      }
    })
    this.subTotal = subTotal;
    this.salesReturn = salesReturn;
    this.$emit('subTotal', subTotal);
    this.$emit('salesReturn', salesReturn);
  }


  async getPrice(selectedProduct: any) {
    await this.$http.get(this.$api(`/products/${selectedProduct.product_id}?with=prices`)).then(response => {
      response.data.product?.prices.forEach((productPrice: any) => {
        if (productPrice.priceable_id == (productPrice.priceable_type == 'depttype' ? this.currentEntity.seller!.department_type_id
          : this.currentEntity.seller_id)) {
          selectedProduct.message = '';
          if (selectedProduct.hasOwnProperty('return_rate')) {
            selectedProduct.return_rate = productPrice.price;
          }
          selectedProduct.price = productPrice.price;
          this.$emit('disabledSaveBtn', false)
        } else {
          selectedProduct.price = 0;
          selectedProduct.message = "Product Price is not associated with supplier departments."
          selectedProduct.qty = 0;
          selectedProduct.promotion_discount = 0;
          selectedProduct.custom_discount = 0;
          this.$emit('disabledSaveBtn', true);
        }
      });
    })
    this.calculateOrderTotalCal();
  }

  getProductPromotion(selectedProduct: any, index: number) {
    this.$http.get(this.$api(`/promotions?promotionable_id=product,${selectedProduct.product_id}`)).then(response => {
      //TODO: response will be changed as product will have single promotion.
      selectedProduct.promotion = response.data.promotions[0];
      if (response.data.promotions.length > 0) {
        this.calculatePromotion(selectedProduct, index)
      }
    })
  }

  checkForExistingPromotion() {
    this.products.forEach((product: any, index: number) => {
      if (product.is_free && Object.values(product.freeWith)) {
        this.products.splice(index, 1);
      }
    });
  }

  calculatePromotion(selectedProduct: any, index: number) {
    var amount = selectedProduct.qty * selectedProduct.price;
    if (selectedProduct.promotion.promotion_type == 'qty') {
      this.calculatePromotionForQtyType(selectedProduct, amount);
    } else if (selectedProduct.promotion.promotion_type == 'amount') {
      this.calculationPromotionForAmountType(selectedProduct, amount);
    }
  }

  calculatePromotionForQtyType(selectedProduct: any, amount: number) {
    if (selectedProduct.promotion!.offer_type == 'qty' && selectedProduct.promotion!.promotion_value <= selectedProduct.qty) {
      if (this.products.some((product: any) => product.product_id == selectedProduct.promotion.offer_product!.id)) {
        this.products.splice(this.products.findIndex((product: any) => product.product_id == selectedProduct.promotion.offer_product!.id, 1));
      }
      this.products.push({
        product_id: selectedProduct.promotion.offer_product!.id,
        name: selectedProduct.promotion.offer_product!.full_name,
        qty: selectedProduct.promotion.offer_value *
          Math.floor(selectedProduct.qty / selectedProduct.promotion.promotion_value),
        price: 0,
        promotion_discount: 0,
        custom_discount: 0,
        promotion_id: selectedProduct.promotion.id,
        freeWith: selectedProduct.promotion.promotionalbe_id,
        is_free: 1
      })
    } else if (selectedProduct.promotion!.offer_type == 'amount' &&
      selectedProduct.promotion!.promotion_value <= selectedProduct.qty) {
      selectedProduct.promotion_discount = selectedProduct.promotion.offer_value *
        Math.floor(selectedProduct.qty / selectedProduct.promotion.promotion_value);
    } else if (selectedProduct.promotion!.offer_type == 'percent' &&
      selectedProduct.promotion!.promotion_value <= selectedProduct.qty) {
      selectedProduct.promotion_discount = (amount * selectedProduct.promotion.offer_value) / 100
    }
  }

  calculationPromotionForAmountType(selectedProduct: any, amount: number) {
    if (selectedProduct.promotion!.offer_type == 'qty' && selectedProduct.promotion!.promotion_value <= amount) {
      if (this.products.some((product: any) => product.product_id == selectedProduct.promotion.offer_product!.id)) {
        this.products.splice(this.products.findIndex((product: any) => product.product_id == selectedProduct.promotion.offer_product!.id, 1));
      }
      this.products.push({
        product_id: selectedProduct.promotion.offer_product!.id,
        name: selectedProduct.promotion.offer_product!.full_name,
        qty: selectedProduct.promotion.offer_value *
          Math.floor(selectedProduct.qty / selectedProduct.promotion.promotion_value),
        price: 0,
        promotion_discount: 0,
        custom_discount: 0,
        freeWith: selectedProduct.promotion.promotionalbe_id,
        is_free: 1
      })
    } else if (selectedProduct.promotion!.offer_type == 'amount' &&
      selectedProduct.promotion!.promotion_value <= amount) {
      selectedProduct.promotion_discount = selectedProduct.promotion.offer_value *
        Math.floor(amount / selectedProduct.promotion.promotion_value);
    } else if (selectedProduct.promotion!.offer_type == 'percent' &&
      selectedProduct.promotion!.promotion_value <= amount) {
      selectedProduct.promotion_discount = (amount * selectedProduct.promotion.offer_value) / 100
    }
  }

  @Watch('editable')
  getExistingOrderedProducts(newVal: boolean) {
    if (newVal) {
      this.products = [];
      this.salesReturns = [];
      this.entityProducts.forEach((orderedProduct: OrderProduct, index: number) => {
        this.products.push({
          id: orderedProduct.id,
          product_id: orderedProduct.product.id,
          name: orderedProduct.product!.hasOwnProperty("full_name") ?
            orderedProduct.product!.full_name : orderedProduct.product.base_product!.name,
          qty: orderedProduct.qty,
          price: orderedProduct.price,
          promotion_discount: orderedProduct.promotion_discount,
          custom_discount: orderedProduct.hasOwnProperty('custom_discount') ? orderedProduct.custom_discount : 0,
          freeWith: orderedProduct.is_free ? orderedProduct.promotion!.promotionable_id : '',
          is_free: orderedProduct.is_free,
          promotion: orderedProduct.promotion,
          promotion_id: orderedProduct.promotion ? orderedProduct.promotion!.id : '',
        });
        this.getProductQtyForSeller(orderedProduct.product.id, this.products[index]);
      });
      if (this.currentEntity.sales_return != null) {
        this.currentEntity.sales_return.returned_products.forEach((returnedProduct: any) => {
          this.salesReturns.push({
            product_id: returnedProduct.product_id,
            return_rate: returnedProduct.return_rate,
            qty: returnedProduct.qty,
            promotion_discount: 0,
            custom_discount: 0,
            is_free: returnedProduct.is_free,
            reason: returnedProduct.reason,
            amount: returnedProduct.amount,
          });
        });
      }
    }
    this.calculateOrderTotalCal();
  }

  @Watch('saveEditedOrder')
  editOrder(newVal: boolean) {
    if (newVal) {
      this.$http.post(this.$api(`/${this.entity}/${this.currentEntity.id}/revisions`), {
        buyer_id: this.currentEntity.buyer_id,
        seller_id: this.currentEntity.seller_id,
        amount: this.subTotal > 0 ? this.subTotal : 0,
        promotion_discount: this.currentEntity.promotion_discount,
        discount: this.discount ? this.discount : 0,
        is_requisition: this.currentEntity.hasOwnProperty('is_requisition') ? this.currentEntity.is_requisition : '',
        products: this.products,
      }).then(response => {
        if (this.salesReturns.length > 0) {
          this.$http.post(this.$api('/sales-returns'), {
            order_id: response.data.revision.order_id,
            buyer_id: this.currentEntity.buyer_id,
            seller_id: this.currentEntity.seller_id,
            from_delivery: 0,
            products: this.salesReturns
          }).catch(error => {
            this.$notify({
              title: 'Warning',
              message: 'Something went wrong for sales return.',
              type: 'warning'
            });
          });
        }
        this.$emit('update:editable', false);
        this.$emit('changeStatus');
        this.$emit('update:saveEditedOrder', false);
        this.$emit('editedEntity', response.data.revision);
        this.$notify({
          title: 'Success',
          message: 'Order successfully updated.',
          type: 'success'
        });
      }).catch(error => {
        this.$emit('update:saveEditedOrder', false);
        this.$emit('update:editable', false);
        this.$notify({
          title: 'Warning',
          message: 'Something went wrong.',
          type: 'warning'
        });
      });
    }
  }
}
</script>
<style scoped>
.heading {
  background-color: #b5b3b3;
  color: #FFF;
  margin-bottom: 1em;
  text-align: center;
  line-height: 2em;
}
</style>
