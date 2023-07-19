<template>
  <modal v-if="isActive" :show="isActive" @close="close" class="modal-dialog-scrollable" size="lg">
    <template slot="header">
      <h5 class="modal-title">{{ title }} Details</h5>
    </template>
    <order-department-info :title="title" :current-entity="currentEntity" :revision-list="revisionList"> </order-department-info>
    <base-order-products
      v-if="!editable"
      :title="title"
      :return-product-entity="returnProducts"
      :current-product-entity="currentEntity.latest_revision.invoiced_products"
    >
    </base-order-products>
    <order-edit
      :current-entity="currentEntity"
      :title="title"
      @disabledSaveBtn="disabledSaveBtn = $event"
      :editable.sync="editable"
      @subTotal="subTotal = $event"
      @salesReturn="salesReturn = $event"
      :save-edited-order.sync="saveEditedOrder"
      :discount.sync="discount"
      @changeStatus="$emit('update:isActive', false)"
      entity="invoices"
      :entity-products="currentEntity.latest_revision.invoiced_products"
    ></order-edit>
    <hr />
    <div class="row">
      <div class="col-md-6">
        <BaseOrderComment :comment-from-sr="currentEntity.comment" :commentor="currentEntity.creator_name" :remarks="statuses"></BaseOrderComment>
      </div>
      <div class="col-md-6">
        <base-order-cal
          :sub-total.sync="subTotal"
          :badge-percentage.sync="currentEntity.badge_percentage"
          :sales-return.sync="salesReturn"
          :editable.sync="editable"
          :discount.sync="currentEntity.discount"
          :grand-total="currentEntity.payable"
          :total-paid="currentEntity.total_paid"
          :total-due="currentEntity.remainder"
          @inputedDiscount="discount = $event"
        ></base-order-cal>
      </div>
    </div>
    <template slot="footer">
      <div class="col-md-4">
        <small v-if="currentEntity.total_paid == 0" style="color: red">
          <b> ** Unpaid ** </b> <br />
          Thanks for your {{ title }}.
        </small>
        <small v-else> ** {{ currentEntity.payable > currentEntity.total_paid ? 'Partial' : 'Unpaid' }} ** Thanks for your {{ title }} </small>
      </div>
      <div class="col-md-8" style="display: flex; justify-content: flex-end">
        <order-status
          deliveryBtn="true"
          deliveryReject="true"
          :visible="currentEntity.latest_status === 'ontheway'"
          :entity-id="currentEntity.id"
          @updateStatus="updateStatus($event)"
          entity="invoices"
          :status-permission="permissionEnum.APPROVE_READY_TO_DELIVERY"
        ></order-status>
        <base-button type="secondary" @click="close" class="m-1">Close</base-button>
      </div>
    </template>
  </modal>
</template>
<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import TaxonomyMixin from '../../../mixins/TaxonomyComponent';
import { Invoice } from '@/intefaces/Invoice';
import OrderDepartmentInfo from '@/views/order/Components/OrderDepartmentInfo.vue';
import OrderRevision from '@/intefaces/OrderRevision';
import BaseOrderProducts from '@/views/order/Components/BaseOrderProducts.vue';
import BaseOrderComment from '@/views/order/BaseOrderComment.vue';
import { OrderStatus as OrderStatusEnum } from '@/enums/OrderStatus';
import BaseOrderCal from '@/views/order/Components/BaseOrderCal.vue';
import OrderStatus from '@/views/order/Components/OrderStatusButtons.vue';
import OrderEdit from '@/views/order/Components/OrderEdit.vue';
import { Permission as PermissionEnum } from '@/enums/Permission';

@Component({
  components: {
    OrderDepartmentInfo,
    BaseOrderProducts,
    BaseOrderComment,
    OrderStatus,
    BaseOrderCal,
    OrderEdit
  }
})
export default class ReadyForDeliveryInvoiceDetails extends Mixins(TaxonomyMixin) {
  @Prop() title: string | undefined;
  @Prop() isActive: boolean | undefined;
  @Prop() currentEntity!: any;
  private editable: boolean = false;
  private revisionList: OrderRevision[] = [];
  private statuses: any = [];
  private subTotal: number = 0;
  private salesReturn: number = 0;
  private discount: number = 0;
  private returnProducts: any = [];
  private saveEditedOrder: boolean = false;

  @Watch('isActive')
  fetchRevisionAndStatusList(newVal: boolean) {
    if (newVal) {
      this.$http.get(this.$api(`/invoices/${this.currentEntity.id}/revisions`)).then(resposne => {
        this.revisionList = resposne.data.revisions;
      });
      this.$http
        .get(
          this.$api(`/orders/${this.currentEntity.order_id}/statuses?statuses=
      ${OrderStatusEnum.STATUS_ACCEPTED},${OrderStatusEnum.STATUS_CANCELLED}`)
        )
        .then(response => {
          this.statuses = response.data.statuses;
        });
      this.$http.get(this.$api(`/sales-returns?order_id=${this.currentEntity.id}`)).then(resposne => {
        this.returnProducts = resposne.data.salesReturns[0].returned_products;
        this.salesReturn = resposne.data.salesReturns[0].total_amount;
      });
      // this.subTotal = JSON.parse(this.currentEntity.latest_revision).amount;
      this.subTotal = this.currentEntity.latest_revision.amount;
    }
  }

  updateStatus(event: any) {
    this.$emit('updatedStatus', event.invoice);
  }

  get permissionEnum() {
    return PermissionEnum;
  }

  close(): void {
    this.$emit('update:isActive', false);
    this.editable = false;
    this.saveEditedOrder = false;
  }
}
</script>
