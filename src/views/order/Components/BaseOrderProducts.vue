<template>
  <div>
    <div class="col-xs-12 heading mt-2 text-uppercase">
      {{ title }}ED PRODUCTS
    </div>
    <div class="pl-2 pr-2 text-center">
      <ul class="list-group list-group-flush list my--1">
        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-3">
              <h5>Name</h5>
            </div>
            <div class="col-md-1">
              <h5>Qty</h5>
            </div>
            <div class="col-md-2">
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
          </div>
        </li>
        <div v-if="currentProductEntity == ''">
          <b>No Item Available</b>
        </div>
        <div v-else>
          <li v-for="orderedProduct in currentProductEntity" :key="orderedProduct.id"
              class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-md-3">
                <small v-if="orderedProduct.product">{{
                    orderedProduct.product.hasOwnProperty("full_name") ?
                      orderedProduct.product.full_name : orderedProduct.product.base_product.name
                  }}
                  {{ orderedProduct.is_free ? '(Free)' : '' }}</small>
              </div>
              <div class="col-md-1">
                <small>{{ orderedProduct.qty }}</small>
              </div>
              <div class="col-md-2">
                <small>{{ orderedProduct.price }}</small>
              </div>
              <div class="col-md-2">
                <small>{{ orderedProduct.promotion_discount }}</small>
              </div>
              <div class="col-md-2">
                <small>{{
                    orderedProduct.hasOwnProperty('custom_discount') ? orderedProduct.custom_discount :
                      0
                  }}</small>
              </div>
              <div class="col-md-2">
                <small v-if="orderedProduct.is_free">0</small>
                <small v-else>
                  {{
                    (orderedProduct.qty * orderedProduct.price) - orderedProduct.promotion_discount -
                    (orderedProduct.hasOwnProperty('custom_discount') ? orderedProduct.custom_discount : 0)
                  }}
                </small>
              </div>
            </div>
          </li>
        </div>
      </ul>
    </div>
    <div class="col-xs-12 heading mt-2 text-uppercase text-center">
      Returned Products
    </div>
    <div class="pl-2 pr-2 text-center">
      <ul class="list-group list-group-flush list my--1">
        <div v-if="returnProductEntity.length == 0">
          <span>No Item Available</span>
        </div>
        <div v-else>
          <li v-for="returnProduct in returnProductEntity" :key="returnProduct.id"
              class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-md-3">
                <small>{{ returnProduct.product ? returnProduct.product.full_name : '-' }}
                  {{ returnProduct.is_free ? '(Free)' : '' }}</small>
              </div>
              <div class="col-md-1">
                <small>{{ returnProduct.qty }}</small>
              </div>
              <div class="col-md-2">
                <small>{{ returnProduct.return_rate != 0 ? returnProduct.return_rate : returnProduct.price }}</small>
              </div>
              <div class="col-md-2">
                <small> 0 </small>
              </div>
              <div class="col-md-2">
                <small>0</small>
              </div>
              <div class="col-md-2">
                <small v-if="returnProduct.is_free">0</small>
                <small v-else> {{
                    returnProduct.amount
                  }} </small>
              </div>
            </div>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Divider } from "element-ui";
import OrderRevision from "@/intefaces/OrderRevision";

@Component({
  components: {
    [Divider.name]: Divider,
  }
})

export default class BaseOrderProducts extends Vue {
  @Prop() currentProductEntity!: any;
  @Prop() returnProductEntity!: any;
  @Prop() title!: string;
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
