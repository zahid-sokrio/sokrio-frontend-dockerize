<template>
  <modal :show="isView" size="lg" @close="close">
    <template slot="header">
      <h5
        id="exampleModalLabel"
        class="modal-title"
      >Promotion Details</h5>
    </template>
    <div>
      <h3 class="hr mb-3">Promotion running for
        <span v-if="currentPromotion.promotion_on == 'product' && product.base_product">
          {{ product.base_product.name }}
        </span>
        <span v-else>
          {{
            currentPromotion.promotionable ? currentPromotion.promotionable.name : ''
          }} {{ currentPromotion.promotion_on }}
        </span>
      </h3>
      <div class="row">
        <div class="col-md-6" v-if="currentPromotion.promotion_type">
          <b>Promotion Type: </b>
          <span>{{
              currentPromotion.promotion_type == 'qty' ? 'Quantity' : _.capitalize(currentPromotion.promotion_type)
            }}</span>
        </div>
        <div class="col-md-6" v-if="currentPromotion.offer_type">
          <b>Offer Type: </b>
          <span>{{
              currentPromotion.offer_type == 'qty' ? 'Quantity' : _.capitalize(currentPromotion.offer_type)
            }}</span>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-6" v-if="currentPromotion.promotion_value">
          <b>Promotion Value: </b>
          <span>{{ currentPromotion.promotion_value }}</span>
        </div>
        <div class="col-md-6" v-if="currentPromotion.offer_value">
          <b>Offer Value: </b>
          <span>{{ currentPromotion.offer_value }}</span>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-6"></div>
        <div class="col-md-6" v-if="currentPromotion.offer_product && currentPromotion.offer_product.base_product">
          <b>Offer Product: </b>
          <span>{{ currentPromotion.offer_product.base_product.name }}</span>
        </div>
      </div>
      <hr>
      <div class="col-md-12">
               <span class="information"><i class="fas fa-info-circle"></i>
                   {{ currentPromotion.promotion_on != 'all' ? 'Buy' : '' }}
                   {{ currentPromotion.promotion_value }}
                   {{
                   currentPromotion.promotion_type == 'amount' ? 'Tk product from' : currentPromotion.promotion_type == 'qty' ? 'products from' : ''
                 }}
                   <span v-if="currentPromotion.promotion_on == 'product' && product.base_product">
                     {{ product.base_product.name }}
                   </span>
                 <span v-else>
                 {{
                     currentPromotion.promotion_on == 'brand' && currentPromotion.promotionable ? currentPromotion.promotionable.name
                       : currentPromotion.promotion_on == 'category' && currentPromotion.promotionable ? currentPromotion.promotionable.name
                       : ''
                   }}
               </span>
        {{
                   currentPromotion.promotion_on == 'product' ? '' : currentPromotion.promotion_on == 'all' ? 'all product' : currentPromotion.promotion_on
                 }}
        <span v-if="currentPromotion.promotion_on != 'all'">
                            & get
                            {{ currentPromotion.offer_value }}
                        {{
            currentPromotion.offer_type == 'amount' ? 'Tk Discount' : currentPromotion.offer_type == 'percent' ? '% Discount' : currentPromotion.offer_type == 'qty' ? 'product from' : ''
          }}
                        <span v-if="currentPromotion.offer_type == 'qty'">
                            {{ currentPromotion.offer_product != null ? currentPromotion.offer_product.name : '?' }}
                        </span>
                        {{ currentPromotion.offer_type == 'qty' ? 'free' : '' }}
                    </span>
        </span>
      </div>
    </div>
    <template slot="footer">
      <base-button type="secondary" @click="close">Close</base-button>
    </template>
  </modal>
</template>
<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
  name: 'PromotionViewForm'
})
export default class PromotionViewForm extends Vue {
  @Prop() isView!: boolean;
  @Prop() currentPromotion!: any;
  private product: any = [];


  fetchProduct() {
    if (this.currentPromotion.promotion_on == "product") {
      this.$http.get(this.$api(`/products/${this.currentPromotion.promotionable_id}`)).then(response => {
        this.product = response.data.product
      })
    }
  }

  created() {
    this.fetchProduct();
  }

  close() {
    this.$emit('update:isView', false);
  }
}
</script>
<style>
.hr {
  display: inline-block;
}

.hr:after {
  content: '';
  display: block;
  border-top: 1px solid lightgray;
  margin-top: 0.5em;
}
</style>
