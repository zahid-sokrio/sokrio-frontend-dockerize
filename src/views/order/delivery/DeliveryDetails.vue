<template>
  <modal :show="isActive" size="lg" @close="close">
    <template slot="header">
      <div class="form-inline">
        <h5 id="exampleModalLabel" class="modal-title">{{ getTaxonomy('invoice') }} Details</h5>
        <el-tag class="ml-3" type="success">
          <span>Delivered</span>
        </el-tag>
      </div>
    </template>
    <div class="row">
      <div class="col-md-12">
        <div class="d-flex justify-content-between">
          <h3 v-if="invoiceDetails.order">{{ getTaxonomy('invoice') }} No. #{{ invoiceDetails.order.invoice.code }}</h3>
          <div class="text-right">
            <h3>{{ getTaxonomy('order') }} No. # <span v-if="invoiceDetails.order">{{ invoiceDetails.order.code }}</span></h3>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="col-md-6">
        <strong>Delivery Date: </strong>{{ invoiceDetails.created_at | datetime('ll') }}
      </div>
    </div>
    <div class="col-xs-12 heading mt-2">
      DELIVERED PRODUCTS
    </div>
    <div class="pl-2 pr-2 text-center">
      <ul class="list-group list-group-flush list my--1">
        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-3">
              <small>Product Name</small>
            </div>
            <div class="col-md-2">
              <small>Qty </small>
            </div>
            <div class="col-md-2">
              <small>Price</small>
            </div>
            <div class="col-md-2">
              <small>Custom Discount</small>
            </div>
            <div class="col-md-3">
              <small>Amount</small>
            </div>
          </div>
        </li>
        <div v-if="invoiceDetails.products != ''">
          <!-- < v-for="(product,index) in invoiceDetails.products" :key="index" class="list-group-item px-0"> -->
          <!-- <li v-for="(product,index) in invoiceDetails.order.invoice.latest_revision.invoiced_products" :key="index" class="list-group-item px-0"> -->
          <li v-for="(product,index) in invoiceDetails.order.latest_revision.ordered_products" :key="index" class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-md-3">
                <small v-if="product.product.base_product">{{ product.product.base_product.name }} |
                  {{ product.product.base_product.sku }}</small>
              </div>
              <div class="col-md-2">
                <small>{{ product.qty }}</small>
              </div>
              <div class="col-md-2">
                <small>{{ product.price }}</small>
              </div>
              <div class="col-md-2">
                <small>{{ product.custom_discount }}</small>
              </div>
              <div class="col-md-3">
                <small>{{ Number(product.qty * product.price - product.custom_discount).toFixed(2) }}</small>
              </div>
            </div>
          </li>
        </div>
        <li v-else class="list-group-item px-0">
          <div class="col-md-12">
            No Product Found
          </div>
        </li>
        <li class="list-group-item px-0 custom-pad">
            <div class="row align-items-center">
              <div class="col-md-9">
                <small style="float:right;">Sub-Total</small>
              </div>
              <div class="col-md-3">
                <small><b>{{ invoiceDetails.amount }}</b></small>
              </div>
            </div>
          </li>
          <li class="list-group-item px-0 custom-pad">
            <div class="row align-items-center">
              <div class="col-md-9">
                <small style="float:right;">Discount</small>
              </div>
              <div class="col-md-3">
                <small><b>{{ invoiceDetails.discount }}</b></small>
              </div>
            </div>
          </li>
          <li class="list-group-item px-0 custom-pad">
            <div class="row align-items-center">
              <div class="col-md-9">
                <small style="float:right;">Promotion Discount</small>
              </div>
              <div class="col-md-3">
                <small><b>{{ invoiceDetails.promotion_discount }}</b></small>
              </div>
            </div>
          </li>
          <li class="list-group-item px-0 custom-pad">
            <div class="row align-items-center">
              <div class="col-md-9">
                <small style="float:right;">Grand Total</small>
              </div>
              <div class="col-md-3">
                <small><b>{{ Number(invoiceDetails.order.payable).toFixed(2) }}</b></small>
              </div>
            </div>
          </li>
          <li class="list-group-item px-0 custom-pad">
            <div class="row align-items-center">
              <div class="col-md-9">
                <small style="float:right;">Paid</small>
              </div>
              <div v-if="invoiceDetails.order" class="col-md-3">
                <small
                  :style="0 > invoiceDetails.order.invoice.remainder ? 'color: green' : ''"><b>{{ Number(invoiceDetails.order.invoice.remainder >= 0 ? invoiceDetails.order.invoice.payable - invoiceDetails.order.invoice.remainder : invoiceDetails.order.invoice.payable).toFixed(2) }}</b></small>
              </div>
            </div>
          </li>
          <li class="list-group-item px-0 custom-pad">
            <div class="row align-items-center">
              <div class="col-md-9">
                <small style="float:right;">Due</small>
              </div>
              <div class="col-md-3">
                <!-- <small><b>{{ invoiceDetails.amount - invoiceDetails.discount - invoiceDetails.promotion_discount }}</b></small> -->
                <small><b>{{ invoiceDetails.order.invoice.remainder }}</b></small>
              </div>
            </div>
          </li>
      </ul>
    </div>
    <div v-if="invoiceDetails.order" class="paid">
      <b :style=" 0 > invoiceDetails.order.invoice.remainder ? 'color: #357EBD' : 'color: red' " style="font-size: 1em">
        {{ 0 >= invoiceDetails.order.invoice.remainder ? 'Paid' : invoiceDetails.order.invoice.payable - invoiceDetails.order.invoice.remainder > 0 ? 'Partially Paid' : 'Unpaid' }}
      </b><br>
      <span style="font-size: 0.8em">*** Thank you for your purchase.</span>
    </div>
    <template slot="footer">
      <base-button type="secondary" @click="close">Close</base-button>
    </template>
  </modal>
</template>
<script lang="ts">
import {Component, Mixins, Prop, Vue} from "vue-property-decorator";
import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip,} from "element-ui";
import {Invoice} from "@/intefaces/Invoice";
import TaxonomyMixin from "@/mixins/TaxonomyComponent";

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag
  }
})
export default class InvoiceDetails extends Mixins(TaxonomyMixin) {
  @Prop() isActive!: boolean;
  @Prop() invoiceDetails!: Invoice;
  @Prop() isDeliver!: boolean;

  close() {
    this.$emit('update:isActive', false);
  }
}
</script>
<style>
.invoice-title h2, .invoice-title h3 {
  display: inline-block;
}

.heading {
  background-color: #357EBD;
  color: #FFF;
  margin-bottom: 1em;
  text-align: center;
  line-height: 2em;
}
.custom-pad {
      padding: 0.5rem 0.5rem !important;
}
</style>
