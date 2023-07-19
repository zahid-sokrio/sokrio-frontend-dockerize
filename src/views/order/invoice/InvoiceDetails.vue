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
              <h3>{{ getTaxonomy('order') }} No. # <span v-if="invoiceDetails.order">{{ invoiceDetails.order.code }}</span></h3>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <div class="row">
        <div v-if="invoiceDetails.buyer" class="col-md-6">
          <address>
            <strong>Buyer:</strong><br>
            <div class="mt-3">
              {{ invoiceDetails.buyer.name }} <br>
              <small> {{ invoiceDetails.buyer.address }} </small>
            </div>

          </address>
        </div>
        <div v-if="invoiceDetails.seller" class="col-md-6">
          <address>
            <strong>Seller:</strong><br>
            <div class="mt-3">
              {{ invoiceDetails.seller.name }} <br>
              <small> {{ invoiceDetails.seller.address }} </small>
            </div>
          </address>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <strong>{{ getTaxonomy('invoice') }} Date: </strong>{{ invoiceDetails.created_at | datetime('ll') }}
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
            <div class="col-md-1">
              <small>Qty </small>
            </div>
            <div class="col-md-2">
              <small>Price</small>
            </div>
            <div class="col-md-1">
              <small>P.Discount</small>
            </div>
            <div class="col-md-2">
              <small>Custom Discount</small>
            </div>

            <div class="col-md-2">
              <small>Amount</small>
            </div>
          </div>
        </li>
        <div v-if="invoiceDetails.products != ''">
          <li v-for="(product,index) in isRevisitionDetails ? invoiceDetails.invoiced_products : invoiceDetails.products" :key="index"
              class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-md-2">
                <small v-if="product.product.base_product">{{ product.product.base_product.name }}</small>
                <small v-if="product.free_with!=null"> (free)</small>

              </div>
              <div class="col-md-2">
                <small v-if="product.product">{{ product.product.batch.name }}</small>
              </div>

              <div class="col-md-1">
                <small>{{ product.qty }}</small>
              </div>
              <div class="col-md-2">
                <small v-if="product.free_with!=null">0</small>
                <small v-else>{{ product.price }}</small>
              </div>
              <div class="col-md-1">
                <small v-if="product.free_with!=null">0</small>
                <small v-else>{{ product.promotion_discount ? product.promotion_discount : '0' }}</small>
              </div>
              <div class="col-md-2">
                <small>{{ product.custom_discount }}</small>
              </div>
              <div v-if="product.free_with!=null" class="col-md-2">
                <small>0</small>
              </div>
              <div v-else class="col-md-2">
                <small
                  v-if="product.promotion_discount">{{
                    (product.qty * product.price) - product.promotion_discount - product.custom_discount
                  }}</small>
                <small v-else>{{ (product.qty * product.price) - product.custom_discount }}</small>
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
          v-if="invoiceDetails.order && invoiceDetails.order.sales_return">
          <li class="list-group-item px-0">
            <div class="col-md-12">
              Returned Products
            </div>
          </li>
          <li v-for="(product,index) in invoiceDetails.order.sales_return.returned_products" :key="index"
              class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-md-2">
                <small v-if="product.product.base_product">{{ product.product.base_product.name }}</small>
              </div>
              <div class="col-md-2">
                <small v-if="product.product.base_product">{{ product.product.batch.name }}</small>
              </div>
              <div class="col-md-1">
                <small>{{ product.qty }}</small>
              </div>
              <div class="col-md-2">
                <small>{{ product.return_rate }}</small>
              </div>
              <div class="col-md-1">
                <small>{{ product.promotion_discount ? product.promotion_discount : '0' }}</small>
              </div>
              <div class="col-md-2">
                <small> 0 </small>
              </div>
              <div class="col-md-2">
                <small
                  v-if="product.promotion_discount">{{
                    (product.qty * product.return_rate) - product.promotion_discount
                  }}</small>
                <small v-else>{{ (product.qty * product.return_rate) }}</small>
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
              <small v-if="invoiceDetails.revisions"><b>{{ invoiceDetails.revisions[0].amount }}</b></small>
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
                  invoiceDetails.revisions[0].amount * (invoiceDetails.badge_percentage / 100)
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
              <small v-if="invoiceDetails.revisions"><b>{{ invoiceDetails.revisions[0].discount }}</b></small>
              <small v-else><b>0</b></small>
            </div>
          </div>
        </li>

        <!--        <li class="list-group-item px-0">-->
        <!--          <div class="row align-items-center">-->
        <!--            <div class="col-md-9">-->
        <!--              <small style="float:right;">Due</small>-->
        <!--            </div>-->
        <!--            <div class="col-md-3">-->
        <!--              <small><b>{{ invoiceDetails.revisions[0].amount - totalPayment}}</b></small>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </li>-->
        <!--        <li class="list-group-item px-0">-->
        <!--          <div class="row align-items-center">-->
        <!--            <div class="col-md-9">-->
        <!--              <small style="float:right;">Paid</small>-->
        <!--            </div>-->
        <!--            <div class="col-md-3">-->
        <!--              <small-->
        <!--                :style=" 0 > (totalPayment) ? 'color: green': ''"><b>{{ totalPayment }}</b></small>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </li>-->
        <li class="list-group-item px-0">
          <div class="row align-items-center">


            <div class="col-md-9">
              <small style="float:right;">Grand Total</small>
            </div>
            <div v-if="invoiceDetails.buyer && invoiceDetails.badge_percentage && invoiceDetails.revisions"
                 class="col-md-3">
              <small v-if="invoiceDetails.order && invoiceDetails.order.sales_return"><b>{{
                  invoiceDetails.revisions[0].amount - (invoiceDetails.revisions[0].amount * (invoiceDetails.badge_percentage / 100)) - invoiceDetails.revisions[0].promotion_discount - invoiceDetails.order.sales_return.total_amount - invoiceDetails.revisions[0].discount
                }}</b></small>
              <small v-else><b>{{
                  invoiceDetails.revisions[0].amount - (invoiceDetails.revisions[0].amount * (invoiceDetails.badge_percentage / 100)) - invoiceDetails.revisions[0].promotion_discount - invoiceDetails.revisions[0].discount
                }}</b></small>
            </div>
            <div v-else class="col-md-3">
              <div v-if="invoiceDetails.revisions">
                <small
                  v-if="invoiceDetails.order && invoiceDetails.order.sales_return"><b>{{
                    invoiceDetails.revisions[0].amount - invoiceDetails.revisions[0].promotion_discount - invoiceDetails.order.sales_return.total_amount - invoiceDetails.revisions[0].discount
                  }}</b></small>
                <small
                  v-else><b>{{
                    invoiceDetails.revisions[0].amount - invoiceDetails.revisions[0].promotion_discount - invoiceDetails.revisions[0].discount
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
            <div class="offset-1 col-1">

              <base-button v-can="this.invoiceDetails.latest_status == 'accepted' ? permissionEnum.APPROVE_INVOICE :
                permissionEnum.APPROVE_READY_TO_DISPATCH" v-if="(this.invoiceDetails.latest_status == 'accepted' ||
                this.invoiceDetails.latest_status == 'readyToDispatch') && isUpdate" icon size="sm" type="danger"
                           @click="updateDeliveryStatus(cancelDeliveryStatus)">
                                                <span class="btn-inner--icon">
                                                    <i class="fas fa-times"></i>
                                                </span>
                <span class="btn-inner--text"> Cancel </span>
              </base-button>
            </div>
            <div class="offset-1 col-3">

              <base-button
                v-can="this.invoiceDetails.latest_status == 'accepted' ? permissionEnum.APPROVE_INVOICE :
                permissionEnum.APPROVE_READY_TO_DISPATCH" v-if="(this.invoiceDetails.latest_status == 'accepted' ||
                this.invoiceDetails.latest_status == 'readyToDispatch') && isUpdate" icon size="sm" type="success"
                @click="updateDeliveryStatus(nextDeliveryStatus)"
              >
                                                <span class="btn-inner--icon">
                                                    <i class="fas fa-check"></i>
                                                </span>
                <span class="btn-inner--text"> {{
                    invoiceDetails.latest_status == 'readyToDispatch' ? 'Ready For Delivery' : 'Ready To Dispatch'
                  }}</span>
              </base-button>
            </div>

          </div>
        </li>
      </ul>
    </div>
    <div class="paid">
      <b :style=" 0 > (isRevisitionDetails ? invoiceDetails.invoice.remainder : invoiceDetails.remainder) ? 'color: #357EBD' : 'color: red' "
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
      <span v-if="!isRevisitionDetails && invoiceDetails.seller" style="font-size: 0.8em">*** Thank you for your purchase from {{
          invoiceDetails.seller.name
        }}</span>
      <span v-else style="font-size: 0.8em">*** Thank you for your purchase.</span>

    </div>
    <template slot="footer">
      <!--            <div style="float: left">-->
      <!--            <base-button type="primary" icon size="sm">-->
      <!--                                <span class="btn-inner&#45;&#45;icon">-->
      <!--                                    <i class="fas fa-share-alt"></i>-->
      <!--                                </span>-->
      <!--                <span class="btn-inner&#45;&#45;text">Export</span>-->
      <!--            </base-button>-->
      <!--            <base-button type="primary" icon size="sm">-->
      <!--                                <span class="btn-inner&#45;&#45;icon">-->
      <!--                                    <i class="fas fa-print"></i>-->
      <!--                                </span>-->
      <!--                <span class="btn-inner&#45;&#45;text">Print</span>-->
      <!--            </base-button>-->
      <!--            </div>-->
      <base-button type="secondary" @click="close">Close</base-button>
    </template>
  </modal>
</template>
<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import {Button, Dropdown, DropdownItem, DropdownMenu, Popover, Table, TableColumn, Tag, Tooltip} from "element-ui";
import {Invoice} from "@/intefaces/Invoice";
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import {Permission as PermissionEnum} from '@/enums/Permission'

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    [Popover.name]: Popover,
    [Button.name]: Button
  }
})
export default class InvoiceDetails extends Mixins(TaxonomyMixin) {
  @Prop() isActive!: boolean;
  @Prop() invoiceDetails!: Invoice;
  @Prop() isDeliver!: boolean;
  @Prop() isRevisitionDetails!: boolean;

  private nextDeliveryStatus: string = '';
  private cancelDeliveryStatus = '';
  private isUpdate: boolean = true;

  get permissionEnum() {
    return PermissionEnum;
  }

  // get totalPayment() {
  //   let calculatedDue = 0;
  //   //@ts-ignore
  //   for (var i = 0; i <= this.invoiceDetails.payments.length; i++) {
  //     //@ts-ignore
  //     calculatedDue += this.invoiceDetails.payments[i].amount;
  //   }
  //   return calculatedDue;
  // }

  updateDeliveryStatus(nextDeliveryStatus: string) {
    this.$http.post(this.$api(`/invoices/${this.invoiceDetails.id}/statuses?for=${this.invoiceDetails.latest_status
      == 'readyToDispatch' ? this.permissionEnum.APPROVE_READY_TO_DISPATCH : this.permissionEnum.APPROVE_INVOICE}`),
      {status: nextDeliveryStatus}).then(response => {
      if (response.status == 200 || response.status == 201) {
        this.updateDeliveryStatusNotification(true);
        this.isUpdate = false;
        this.$emit('update:invoiceDetails', response);
        this.$emit('update:isActive', false);
      } else {
        this.updateDeliveryStatusNotification(false);
      }
    });
  }

  updateDeliveryStatusNotification(status: boolean) {
    this.$notify({
      title: status ? 'Success' : 'Failed',
      message: status ? "Delivery Status Updated" : "Failed to Update",
      duration: 5000,
      iconClass: 'ni ni-bell-55',
      // @ts-ignore
      verticalAlign: 'bottom',
      horizontalAlign: 'right',
      type: status ? 'success' : 'warning'
    });
  }

  close() {
    this.$emit('update:isActive', false);
    this.$emit('update:isRevisitionDetails', false);
  }

  mounted() {
    if (this.invoiceDetails.latest_status === 'accepted') {
      this.nextDeliveryStatus = 'readyToDispatch'
    } else {
      this.nextDeliveryStatus = 'ontheway'
    }
    if (this.invoiceDetails.latest_status === 'onTheWay') {
      this.cancelDeliveryStatus = 'deliveryRejected'
    } else {
      this.cancelDeliveryStatus = 'cancelled'
    }
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
