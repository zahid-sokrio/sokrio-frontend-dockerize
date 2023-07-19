<template>
  <div>
    <modal v-if="loading" :show="isActive" @close="close" class="modal-dialog-scrollable" size="lg">
      <div class="d-flex justify-content-center align-items-center" style="height: 680px;">
        <span class="h1 font-weight-bold mb-0">
          <i class="el-icon-loading"></i>
        </span>
      </div>
    </modal>
    <modal v-if="isActive && !loading" :show="isActive && !loading" @close="close" class="modal-dialog-scrollable" size="lg">
      <template slot="header">
        <h5 class="modal-title">{{ title }} Details</h5>
      </template>

      <order-department-info v-if="!loading" :title="title" :current-entity="fetchedEntity" :revision-list="revisionList"></order-department-info>
      <base-order-products
        v-if="!editable && !loading"
        :title="title"
        :return-product-entity="returnProducts"
        :current-product-entity="fetchedEntity.latest_revision ? fetchedEntity.latest_revision.ordered_products : ''"
      >
      </base-order-products>
      <order-edit
        v-if="!loading"
        :current-entity="fetchedEntity"
        :title="title"
        @disabledSaveBtn="disabledSaveBtn = $event"
        :editable.sync="editable"
        @subTotal="subTotal = $event"
        @salesReturn="salesReturn = $event"
        :save-edited-order.sync="saveEditedOrder"
        :discount.sync="discount"
        entity="orders"
        :entity-products="fetchedEntity.latest_revision ? fetchedEntity.latest_revision.ordered_products : ''"
        @changeStatus="$emit('update:isActive', false)"
        @editedEntity="updateOrder($event)"
      ></order-edit>
      <hr />
      <div class="row">
        <div class="col-md-6">
          <BaseOrderComment :comment-from-sr="fetchedEntity.comment" :commentor="fetchedEntity.creator_name" :remarks="statuses"></BaseOrderComment>
        </div>
        <div class="col-md-6">
          <base-order-cal
            :sub-total.sync="fetchedEntity.latest_revision.amount"
            :badge-percentage.sync="fetchedEntity.badge_percentage"
            :sales-return.sync="salesReturn"
            :editable.sync="editable"
            :discount="fetchedEntity.latest_revision && fetchedEntity.latest_revision.discount ? fetchedEntity.latest_revision.discount : ''"
            :grand-total="
              fetchedEntity.latest_revision.amount -
                (fetchedEntity.latest_revision && fetchedEntity.latest_revision.discount ? fetchedEntity.latest_revision.discount : 0)
            "
            :total-paid="fetchedEntity.total_paid"
            :total-due="fetchedEntity.total_due"
            @inputedDiscount="discount = $event"
          ></base-order-cal>
        </div>
      </div>

      <template slot="footer">
        <div class="col-md-4">
          <small v-if="fetchedEntity.total_paid == 0" style="color: red">
            <b> ** Unpaid ** </b> <br />
            Thanks for your {{ title }}.
          </small>
          <div v-else>
            <small v-if="fetchedEntity.payable > fetchedEntity.total_paid" style="color: greenyellow;font-weight: 700;">
              ** Partial ** Thanks for your {{ title }}
            </small>
            <small v-else style="color: green;font-weight: 700;"> ** Paid ** Thanks for your {{ title }} </small>
          </div>
        </div>
        <div class="col-md-8" style="display: flex; justify-content: flex-end">
          <!--        && filterForRequisition === 'Incoming requisitions'-->
          <order-status
            rejected="true"
            make-invoice="true"
            edit="true"
            :visible="fetchedEntity.status === 'pending'"
            :entity-id="fetchedEntity.id"
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
  </div>
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
import OrderRevision from '@/intefaces/OrderRevision';
import Statuses from '@/intefaces/Statuses';
import OrderEdit from '@/views/order/Components/OrderEdit.vue';

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
  @Prop() currentEntityId!: number;
  @Prop() currentEntityAmount!: any;
  @Prop() filterForRequisition!: string;
  @Prop() editPermission!: string;
  @Prop() statusPermission!: string;
  private editable: boolean = false;
  private disabledSaveBtn: boolean = false;
  public subTotal: number = 0;
  private salesReturn: number = 0;
  private returnProducts: any = [];
  private discount: number = 0;
  private saveEditedOrder: boolean = false;
  private revisionList: OrderRevision[] = [];
  private statuses: Statuses[] = [];
  private fetchedEntity: any = {};
  private loading: boolean = true;

  updateOrder(event: any) {
    this.$emit('editedEntity', event);
  }

  @Watch('isActive')
  fetchList(newVal: boolean) {
    if (newVal) {
      this.$http.get(this.$api(`/orders/${this.currentEntityId}/revisions`)).then(resposne => {
        this.revisionList = resposne.data.revisions;
      });
      this.$http.get(this.$api(`/orders/${this.currentEntityId}/statuses`)).then(resposne => {
        this.statuses = resposne.data.statuses;
      });
      this.$http.get(this.$api(`/sales-returns?order_id=${this.currentEntityId}`)).then(resposne => {
        this.returnProducts = resposne.data.salesReturns.length ? resposne.data.salesReturns[0].returned_products : '';
        this.salesReturn = resposne.data.salesReturns.length ? resposne.data.salesReturns[0].total_amount : 0;
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

  fetchEntity(): void {
    this.loading = true;
    this.$http
      .get(this.$api(`/orders/${this.currentEntityId}`))
      .then(response => {
        this.fetchedEntity = response.data.order;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  mounted() {
    this.fetchEntity();
  }
}
</script>
