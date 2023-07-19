<template>
  <div>
    <modal v-if="loading" :show="isActive" @close="close" class="modal-dialog-scrollable">
      <div class="d-flex justify-content-center align-items-center" style="height: 180px;">
        <span class="h1 font-weight-bold mb-0">
              <i class="el-icon-loading"></i>
        </span>
      </div>
    </modal>
    <modal v-if="isActive && !loading" :show="isActive" @close="close" class="modal-dialog-scrollable" size="lg">
      <template slot="header">
        <h5 class="modal-title"> {{ title }} Details </h5>
      </template>
      <order-department-info :title="title" :current-entity="details" :revision-list="revisionList">
      </order-department-info>
      <base-order-products v-if="!editable" :title="title"
                           :return-product-entity="returnProducts"
                           :current-product-entity="details.latest_revision.invoiced_products">
      </base-order-products>
      <order-edit :current-entity="details" :title="title" @disabledSaveBtn="disabledSaveBtn = $event"
                  :editable.sync="editable" @subTotal="subTotal = $event" @salesReturn="salesReturn = $event"
                  :save-edited-order.sync="saveEditedOrder" :discount.sync="discount"
                  @editedEntity="updateInvoice($event)"
                  @changeStatus="$emit('update:isActive', false)" entity="invoices"
                  :entity-products="details.latest_revision.invoiced_products"
      ></order-edit>
      <hr>
      <div class="row">
        <div class="col-md-6">
          <BaseOrderComment :comment-from-sr="details.comment" :commentor="details.creator_name"
                            :remarks="statuses"></BaseOrderComment>
        </div>
        <div class="col-md-6">
          <base-order-cal :sub-total.sync="subTotal"
                          :badge-percentage.sync="details.badge_percentage"
                          :sales-return.sync="salesReturn" :editable.sync="editable"
                          :discount.sync="details.discount" :grand-total="details.payable"
                          :total-paid="details.total_paid" :total-due="details.remainder"
                          @inputedDiscount="discount= $event"
          ></base-order-cal>
        </div>
      </div>
      <template slot="footer">
        <div class="col-md-4">
          <small v-if="details.total_paid == 0" style="color: red">
            <b> ** Unpaid ** </b> <br>
            Thanks for your {{ title }}.
          </small>
          <small v-else>
            ** {{ details.payable > details.total_paid ? 'Partial' : 'Unpaid' }} **
            Thanks for your {{ title }}
          </small>
        </div>
        <div class="col-md-8" style="display: flex; justify-content: flex-end">
          <order-status cancel="true" readyToDispatch="true" edit="true"
                        :visible="details.latest_status === 'accepted'" :entity-id="details.id"
                        :disabled-save-btn.sync="disabledSaveBtn" @editOrder="editable = $event"
                        @updateStatus="updateStatus($event)" entity="invoices" @triggerSaveBtn="saveEditedOrder = true"
                        :edit-permission="permissionEnum.UPDATE_INVOICE"
                        :status-permission="permissionEnum.APPROVE_INVOICE"
          ></order-status>
          <base-button v-if="!editable" type="secondary" @click="close" class="m-1">Close</base-button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import TaxonomyMixin from "../../../mixins/TaxonomyComponent";
import { Invoice } from "@/intefaces/Invoice";
import OrderDepartmentInfo from "@/views/order/Components/OrderDepartmentInfo.vue";
import OrderRevision from "@/intefaces/OrderRevision";
import BaseOrderProducts from "@/views/order/Components/BaseOrderProducts.vue";
import BaseOrderComment from "@/views/order/BaseOrderComment.vue";
import { OrderStatus as OrderStatusEnum } from "@/enums/OrderStatus";
import BaseOrderCal from "@/views/order/Components/BaseOrderCal.vue";
import OrderStatus from "@/views/order/Components/OrderStatusButtons.vue";
import OrderEdit from "@/views/order/Components/OrderEdit.vue";
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

export default class BaseInvoiceDetails extends Mixins(TaxonomyMixin) {
  @Prop() title: string | undefined;
  @Prop() isActive: boolean | undefined;
  @Prop() currentEntity!: any;
  @Prop() editPermission!: string;
  @Prop() cancelPermission!: string;
  private editable: boolean = false;
  private revisionList: OrderRevision[] = [];
  private statuses: any = [];
  private subTotal: number = 0;
  private salesReturn: number = 0;
  private returnProducts: any = [];
  private discount: number = 0;
  private disabledSaveBtn: boolean = false;
  private saveEditedOrder: boolean = false;
  public loading:boolean = true;
  public details:any = {};

  @Watch('isActive')
  fetchRevisionAndStatusList(newVal: boolean) {
    if (newVal) {
      this.$http.get(this.$api(`/invoices/${this.currentEntity.id}/revisions`)).then(resposne => {
        this.revisionList = resposne.data.revisions;
      })
      this.$http.get(this.$api(`/orders/${this.currentEntity.order_id}/statuses?statuses=
      ${OrderStatusEnum.STATUS_ACCEPTED},${OrderStatusEnum.STATUS_CANCELLED},${OrderStatusEnum.STATUS_DISPATCH}`)).then(response => {
        this.statuses = response.data.statuses;
      })
      this.$http.get(this.$api(`/sales-returns?order_id=${this.currentEntity.order_id}`)).then(resposne => {
        this.returnProducts = resposne.data.salesReturns[0].returned_products;
        this.salesReturn = resposne.data.salesReturns[0].total_amount;
      })
      this.subTotal = this.currentEntity.latest_revision.amount;
    }
  }

  updateStatus(event: any) {
    this.$emit('updatedStatus', event.invoice);
  }

  updateInvoice(event: any) {
    this.$emit('editedEntity', event)
  }

  get permissionEnum() {
    return PermissionEnum;
  }

  close(): void {
    this.$emit('update:isActive', false);
    this.editable = false;
    this.saveEditedOrder = false;
  }

  async mounted() {
    this.subTotal = this.currentEntity.latest_revision.amount;
    this.loading = true;
    let {data} = await this.$http.get(this.$api2(`/invoices/${this.currentEntity.id}`))
    this.details = data.invoice
    this.loading = false;
  }
}
</script>
