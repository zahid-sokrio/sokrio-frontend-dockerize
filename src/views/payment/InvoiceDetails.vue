<template>
  <modal :show="isActive" class="modal-dialog-scrollable" size="lg" @close="close">
    <template slot="header">
      <div class="form-inline">
        <h5 id="exampleModalLabel" class="modal-title">{{ getTaxonomy('invoice') }} Details</h5>
        <el-tag v-if="isDeliver" class="ml-3" type="success">
          <span>Delivered</span>
        </el-tag>
      </div>
    </template>
    <div v-if="!isRevisitionDetails">
      <div class="row">
        <div class="col-md-12">
          <div class="d-flex justify-content-between">
            <h3>{{ getTaxonomy('invoice') }} No. #{{ invoiceDetails.code }}</h3>
            <div class="text-right">
              <h3>Order No. # <span v-if="invoiceDetails.order">{{ invoiceDetails.order.code }}</span></h3>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <div class="row">
        <div v-if="invoiceDetails.buyer" class="col-md-6">
          <address>
            <strong>Department:</strong><br>
            {{ invoiceDetails.buyer.name }} <br>
            {{ invoiceDetails.buyer.address }}
          </address>
        </div>
        <div v-if="invoiceDetails.seller" class="col-md-6">
          <address>
            <strong>Purchased Form:</strong><br>
            {{ invoiceDetails.seller.name }} <br>
            {{ invoiceDetails.seller.address }}
          </address>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <strong>Invoice Date: </strong>{{ invoiceDetails.created_at | datetime('ll') }}
        </div>
        <div v-if="isDeliver" class="col-md-6">
          <strong>Order Date: </strong><span
          v-if="invoiceDetails.order">{{ invoiceDetails.order.created_at | datetime('ll') }}</span>
        </div>
      </div>
    </div>
    <div class="col-xs-12 heading mt-2 text-uppercase">
      {{ getTaxonomy('invoice') }} PRODUCTS
    </div>
    <div class="pl-2 pr-2 text-center">
      <ul class="list-group list-group-flush list my--1">
        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-2">
              <small>Product Name</small>
            </div>

            <div class="col-md-2">
              <small>Product Batch</small>
            </div>
            <div class="col-md-2">
              <small>Qty </small>
            </div>
            <div class="col-md-2">
              <small>Price</small>
            </div>
            <div class="col-md-2">
              <small>P.Discount</small>
            </div>

            <div class="col-md-2">
              <small>Amount</small>
            </div>
          </div>
        </li>
        <div v-if="invoicedProduct.length >0 ">
          <li v-for="(product,index) in invoicedProduct" :key="index" class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-md-2">
                <small v-if="product.product.base_product">{{ product.product.base_product.name }}</small>
                <b v-if="product.free_with!=null">free</b>

              </div>
              <div class="col-md-2">
                <small v-if="product.product">{{ product.product.batch_id }}</small>
              </div>

              <div class="col-md-2">
                <small>{{ product.qty }}</small>
              </div>
              <div class="col-md-2">
                <small>{{ product.price }}</small>
              </div>

              <div class="col-md-2">
                <small>{{ product.promotion_discount }}</small>
              </div>

              <div class="col-md-2">
                <small>{{ product.qty * product.price }}</small>
              </div>
            </div>
          </li>
        </div>
        <li v-else class="list-group-item px-0">
          <div class="col-md-12">
            No Product Found
          </div>
        </li>

        <div
          v-if=" invoiceDetails.order.sales_return !=null?invoiceDetails.order.sales_return.returned_products.length >0 : false">
          <li v-for="(product,index) in invoiceDetails.order.sales_return.returned_products" :key="index"
              class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-md-2">
                <small v-if="product.product.base_product">{{ product.product.base_product.name }}</small>
                <small v-if="product.free_with!=null"> (free)</small>

              </div>
              <div class="col-md-2">
                <small v-if="product.product">{{ product.product.batch_id }}</small>
              </div>

              <div class="col-md-2">
                <small>{{ product.qty }}</small>
              </div>
              <div class="col-md-2">
                <small v-if="product.free_with!=null">0</small>
                <small v-else>{{ product.price }}</small>
              </div>
              <div class="col-md-2">
                <small v-if="product.free_with!=null">0</small>
                <small v-else>{{ product.promotion_discount ? product.promotion_discount : '0' }}</small>
              </div>
              <div v-if="product.free_with!=null" class="col-md-2">
                <small>0</small>
              </div>
              <div v-else class="col-md-2">
                <small
                  v-if="product.promotion_discount">{{
                    (product.qty * product.price) - product.promotion_discount
                  }}</small>
                <small v-else>{{ (product.qty * product.price) }}</small>
              </div>
            </div>
          </li>
        </div>
        <li v-else class="list-group-item px-0">
          <div class="col-md-12">
            No Return Product Found
          </div>
        </li>

        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-9">
              <small style="float:right;">Sub-Total</small>
            </div>
            <div class="col-md-3">
              <small v-if="revision"><b>{{ revision.amount }}</b></small>
              <small v-else><b>0</b></small>
            </div>
          </div>
        </li>
        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-9">
              <small style="float:right;">Badge
                Discount{{
                  invoiceDetails.badge_percentage ? ' (' + invoiceDetails.badge_percentage + '%)' : ''
                }}</small>
            </div>
            <div v-if="invoiceDetails.badge_percentage" class="col-md-3">
              <small><b>{{
                  revision.amount * (invoiceDetails.badge_percentage / 100)

                }}</b></small>
            </div>
            <div v-else class="col-md-3">
              <small><b>0</b></small>
            </div>
          </div>
        </li>
        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-9">
              <small style="float:right;">{{ getTaxonomy('salesReturn') }}</small>
            </div>
            <div v-if="invoiceDetails.order && invoiceDetails.order.sales_return" class="col-md-3">
              <small><b>{{ invoiceDetails.order.sales_return.total_amount }}</b></small>
            </div>
            <div v-else class="col-md-3">
              <small><b>0</b></small>
            </div>
          </div>
        </li>
        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-9">
              <small style="float:right;">Other Discounts</small>
            </div>
            <div class="col-md-3">
              <small v-if="revision"><b>{{ revision.discount }}</b></small>
              <small v-else><b>0</b></small>
            </div>
          </div>
        </li>
        <li class="list-group-item px-0">
          <div class="row align-items-center">


            <div class="col-md-9">
              <small style="float:right;">Grand Total</small>
            </div>
            <div v-if="invoiceDetails.badge_percentage && revision"
                 class="col-md-3">
              <small v-if="invoiceDetails.order && invoiceDetails.order.sales_return"><b>{{
                  revision.amount - (revision.amount * (invoiceDetails.badge_percentage / 100)) - revision.promotion_discount - invoiceDetails.order.sales_return.total_amount - revision.discount
                }}</b></small>
              <small v-else><b>{{
                  revision.amount - (revision.amount * (invoiceDetails.badge_percentage / 100)) - revision.promotion_discount - revision.discount
                }}</b></small>
            </div>
            <div v-else class="col-md-3">
              <div v-if="revision">
                <small
                  v-if="invoiceDetails.order && invoiceDetails.order.sales_return"><b>{{
                    revision.amount - revision.promotion_discount - invoiceDetails.order.sales_return.total_amount - revision.discount
                  }}</b></small>
                <small
                  v-else><b>{{
                    revision.amount - revision.promotion_discount - revision.discount
                  }}</b></small>
              </div>
            </div>
          </div>
        </li>
        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="offset-1 col-2">
              <el-popover
                placement="top-start"
                trigger="hover"
                width="250">
                {{
                  invoiceDetails.order && invoiceDetails.order.comment ? invoiceDetails.order.comment : 'No comment found'
                }}
                <el-button slot="reference" plain round size="small" type="info">Comments from SR</el-button>
              </el-popover>

            </div>
            <div class="offset-1 col-">
              <el-popover
                placement="top"
                trigger="hover"
                width="400">
                <el-table :data="invoiceDetails.payments">
                  <el-table-column label="Name" property="name" width="100">
                    <template v-slot="{ row }">
                      <b>{{ row.creator ? row.creator.name : '' }}</b>
                    </template>
                  </el-table-column>
                  <el-table-column label="Date" property="date" width="100">
                    <template v-slot="{ row }">
                      <b v-if="row.created_at">{{ row.created_at | datetime('lll') }}</b>
                    </template>
                  </el-table-column>
                  <el-table-column label="Comment" property="comment" width="195">
                    <template v-slot="{ row }">
                      <b>{{ row.remarks ? row.remarks : '' }}</b>
                    </template>
                  </el-table-column>

                </el-table>
                <el-button slot="reference" plain round size="small" type="info">Remarks</el-button>
              </el-popover>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="paid">
      <b
        :style=" 0 > (isRevisitionDetails ? invoiceDetails.invoice.remainder : invoiceDetails.remainder) ? 'color: #357EBD' : 'color: red' "
        style="font-size: 1em">
        <span
          v-if="!isRevisitionDetails">{{
            0 >= invoiceDetails.remainder ? 'Paid' : invoiceDetails.payable - invoiceDetails.remainder > 0 ? 'Partially Paid' : 'Unpaid'
          }}</span>
        <span
          v-else>{{
            0 >= invoiceDetails.invoice.remainder ? 'Paid' : invoiceDetails.invoice.payable - invoiceDetails.invoice.remainder > 0 ? 'Partially Paid' : 'Unpaid'
          }}</span>
      </b><br>
      <span v-if="!isRevisitionDetails && invoiceDetails.seller"
            style="font-size: 0.8em">*** Thank you for your purchase from {{ invoiceDetails.seller.name }}</span>
      <span v-else style="font-size: 0.8em">*** Thank you for your purchase.</span>

    </div>
    <template slot="footer">
      <base-button type="secondary" @click="close">Close</base-button>
    </template>
  </modal>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip, Button, Popover } from "element-ui";
import { Invoice } from "@/intefaces/Invoice";
import TaxonomyMixin from "@/mixins/TaxonomyComponent";

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    [Button.name]: Button,
    [Popover.name]: Popover
  }
})
export default class InvoiceDetails extends Mixins(TaxonomyMixin) {
  @Prop() isActive!: boolean;
  @Prop() invoiceDetails!: Invoice;
  @Prop() invoicedProduct!: any;
  @Prop() isDeliver!: boolean;
  @Prop() isRevisitionDetails!: boolean;

  @Prop() revision!: any;


  close() {
    this.$emit('update:isActive', false);
    this.$emit('update:isRevisitionDetails', false);
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
</style>
