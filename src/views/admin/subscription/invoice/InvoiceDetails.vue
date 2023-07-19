<template>
  <modal :show="isActive" @close="close" size="lg" class="modal-dialog-scrollable">
    <template slot="header">
      <h5 class="modal-title" id="exampleModalLabel">Invoice Details</h5>
    </template>
    <div class="row">
      <div class="col-md-12">
        <div class="d-flex justify-content-between">
          <h3>Invoice No. {{invoiceDetails.code}}</h3>
          <div class="text-right">
            <!-- <h3>
              Order No. #
              <span v-if="invoiceDetails.order">{{invoiceDetails.order.code}}</span>
            </h3>-->
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col-md-6" v-if="invoiceDetails">
        <address>
          <strong>Billed to:</strong>
          <br />Sokrio Technologies
          <br />Uttara, Dhaka
        </address>
      </div>
      <div class="col-md-6" v-if="invoiceDetails.id">
        <address>
          <strong>Customer:</strong>
          <br />
          {{invoiceDetails.subscription.org.name}}
          <br />Kochukhet, Dhaka
        </address>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <strong>Invoice Date:</strong>
        {{invoiceDetails.created_at | datetime('ll')}}
      </div>
      <div class="col-md-6" v-if="invoiceDetails.subscription">
        <strong>Subscription Date:</strong>
        {{invoiceDetails.subscription.created_at | datetime('ll')}}
      </div>
    </div>
    <div class="col-xs-12 heading mt-2">PACKAGE DETAILS</div>
    <div class="pl-2 pr-2 text-center">
      <ul class="list-group list-group-flush list my--1">
        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-3">
              <small>Package Name</small>
            </div>
            <div class="col-md-3">
              <small>Scheme</small>
            </div>
            <div class="col-md-3">
              <small>Price</small>
            </div>
            <div class="col-md-3">
              <small>No. of users</small>
            </div>
          </div>
        </li>
        <div v-if="invoiceDetails.subscription != ''">
          <li class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-md-3">
                <small
                  v-if="invoiceDetails.subscription"
                >{{invoiceDetails.subscription.scheme_meta.package.name}}</small>
              </div>
              <div class="col-md-3">
                <small
                  v-if="invoiceDetails.subscription"
                >{{invoiceDetails.subscription.scheme_meta.cycle}} month</small>
              </div>
              <div class="col-md-3">
                <small
                  v-if="invoiceDetails.subscription"
                >{{invoiceDetails.subscription.scheme_meta.price}}Tk</small>
              </div>
              <div class="col-md-3">
                <small v-if="invoiceDetails.subscription">{{invoiceDetails.subscription.user_quota}}</small>
              </div>
            </div>
          </li>
        </div>
        <li v-else class="list-group-item px-0">
          <div class="col-md-12">No Package Found</div>
        </li>
        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-9">
              <small style="float:right;">Amount Payable</small>
            </div>
            <div class="col-md-3">
              <small>
                <b>{{invoiceDetails.payable}}Tk</b>
              </small>
            </div>
          </div>
        </li>
        <!-- <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-9">
              <small style="float:right;">Due</small>
            </div>
            <div class="col-md-3">
              <small>
                <b>{{invoiceDetails.amount - invoiceDetails.payable == 0 ? invoiceDetails.amount - invoiceDetails.payable : invoiceDetails.payable }}Tk</b>
              </small>
            </div>
          </div>
        </li>-->
        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-9">
              <small style="float:right;">Paid</small>
            </div>
            <div class="col-md-3">
              <small>
                <b>{{invoiceDetails.amount - invoiceDetails.payable == invoiceDetails.amount ? invoiceDetails.amount : invoiceDetails.amount - invoiceDetails.payable }}Tk</b>
              </small>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- {{ 0 >= invoiceDetails.remainder ? 'Paid' : invoiceDetails.payable - invoiceDetails.remainder > 0 ? 'Partially Paid' : 'Unpaid'}} -->
    <div class="paid">
      <b
        style="font-size: 1em"
        :style="invoiceDetails.amount - invoiceDetails.payable == invoiceDetails.amount ? 'color: #357EBD' : 'color: red' "
      >{{ invoiceDetails.amount - invoiceDetails.payable == invoiceDetails.amount ? 'Paid' : 'Unpaid'}}</b>
      <br />
      <span
        style="font-size: 0.8em"
        v-if="invoiceDetails.payable + (invoiceDetails.amount - invoiceDetails.payable) >= invoiceDetails.amount"
      >*** Thank you for your purchase from Sokrio Technologies</span>
    </div>
    <template slot="footer">
      <div style="float: left">
        <base-button type="primary" icon size="sm">
          <span class="btn-inner--icon">
            <i class="fas fa-share-alt"></i>
          </span>
          <span class="btn-inner--text">Export</span>
        </base-button>
        <base-button type="primary" icon size="sm">
          <span class="btn-inner--icon">
            <i class="fas fa-print"></i>
          </span>
          <span class="btn-inner--text">Print</span>
        </base-button>
      </div>
      <base-button class="btn-sm" @click="close" type="secondary">Close</base-button>
    </template>
  </modal>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip, Tag } from 'element-ui';
import OrgInvoice from '@/intefaces/OrgInvoice';

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
  },
})
export default class InvoiceDetails extends Vue {
  @Prop() isActive!: boolean;
  @Prop() invoiceDetails!: OrgInvoice;

  close() {
    this.$emit('update:isActive', false);
  }
}
</script>
<style>
.invoice-title h2,
.invoice-title h3 {
  display: inline-block;
}
.heading {
  background-color: #357ebd;
  color: #fff;
  margin-bottom: 1em;
  text-align: center;
  line-height: 2em;
}
</style>
