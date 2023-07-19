<template>
  <modal v-if="isActive" :show="isActive" @close="close" class="modal-dialog-scrollable" size="lg">
    <template slot="header">
      <h5 class="modal-title">{{ title }} Details</h5>
    </template>
    <order-department-info :title="title" :current-entity="currentEntity" :revision-list="revisionList"></order-department-info>
    <base-order-products
      v-if="!editable"
      :title="title"
      :return-product-entity="returnProducts"
      :current-product-entity="currentEntity.latest_revision.ordered_products"
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
      entity="orders"
      :entity-products="currentEntity.latest_revision.ordered_products"
      @changeStatus="$emit('update:isActive', false)"
      @editedEntity="updateOrder($event)"
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
          :discount.sync="currentEntity.latest_revision.discount"
          :grand-total="currentEntity.payable"
          :total-paid="currentEntity.total_paid"
          :total-due="currentEntity.total_due"
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
        <!--        && filterForRequisition === 'Incoming requisitions'-->
        <order-status
          rejected="true"
          make-invoice="true"
          edit="true"
          :visible="currentEntity.status === 'pending'"
          :entity-id="currentEntity.id"
          :edit-permission="editPermission"
          :status-permission="statusPermission"
          :disabled-save-btn.sync="disabledSaveBtn"
          @editOrder="editable = $event"
          @updateStatus="updateStatus($event)"
          @triggerSaveBtn="saveEditedOrder = true"
          entity="orders"
        ></order-status>
        <base-button v-if="!editable" type="secondary" @click="close" class="m-1">Close</base-button>
      </div>
    </template>
  </modal>
</template>
<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import Order from '@/intefaces/Order';
import { Divider } from 'element-ui';
import BaseOrderProducts from '@/views/order/Components/BaseOrderProducts.vue';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import BaseOrderComment from '@/views/order/BaseOrderComment.vue';
import BaseOrderCal from '@/views/order/Components/BaseOrderCal.vue';
import OrderStatus from '@/views/order/Components/OrderStatusButtons.vue';
import OrderDepartmentInfo from '@/views/order/Components/OrderDepartmentInfo.vue';
import OrderEdit from '@/views/order/Components/OrderEdit.vue';
import OrderRevision from '@/intefaces/OrderRevision';
import Statuses from '@/intefaces/Statuses';

@Component({
  components: {
    [Divider.name]: Divider,
    BaseOrderProducts,
    BaseOrderComment,
    BaseOrderCal,
    OrderStatus,
    OrderDepartmentInfo,
    OrderEdit
  }
})
export default class BaseOrderDetails extends Mixins(TaxonomyMixin) {
  @Prop() title: string | undefined;
  @Prop() isActive: boolean | undefined;
  @Prop() currentEntity!: Order;
  @Prop() filterForRequisition!: string;
  @Prop() editPermission!: string;
  @Prop() statusPermission!: string;
  private editable: boolean = false;
  private disabledSaveBtn: boolean = false;
  private subTotal: number = 0;
  private salesReturn: number = 0;
  private returnProducts: any = [];
  private discount: number = 0;
  private saveEditedOrder: boolean = false;
  private revisionList: OrderRevision[] = [];
  private statuses: Statuses[] = [];

  updateOrder(event: any) {
    this.$emit('editedEntity', event);
  }

  @Watch('isActive')
  getTotalValues(newVal: boolean) {
    if (newVal) {
      this.subTotal = this.currentEntity.latest_revision.amount;
    }
  }

  @Watch('isActive')
  fetchList(newVal: boolean) {
    if (newVal) {
      this.$http.get(this.$api(`/orders/${this.currentEntity.id}/revisions`)).then(resposne => {
        this.revisionList = resposne.data.revisions;
      });
      this.$http.get(this.$api(`/orders/${this.currentEntity.id}/statuses`)).then(resposne => {
        this.statuses = resposne.data.statuses;
      });
      this.$http.get(this.$api(`/sales-returns?order_id=${this.currentEntity.id}`)).then(resposne => {
        this.returnProducts = resposne.data.salesReturns[0].returned_products;
        this.salesReturn = resposne.data.salesReturns[0].total_amount;
      });
    }
  }

  updateStatus(event: any) {
    this.$http.get(this.$api(`/orders/${event.status.order.id}`)).then(responseOrder => {
      this.$emit('updatedStatus', responseOrder.data.order);
    });
  }

  close(): void {
    this.$emit('update:isActive', false);
    this.editable = false;
    this.saveEditedOrder = false;
  }
}
</script>
