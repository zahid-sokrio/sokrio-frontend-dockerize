<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal v-if="isActive" :show="isActive" @close="close" class="modal-dialog-scrollable">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{getTaxonomy('order')}} Details | {{getTaxonomy('order')}} No. #{{ currentEntity.code }}</h5>
      </template>
      <div>
        <div class="col-auto mb-3" style="padding: 0">
          <base-button block type="primary" @click="isViewRevision = true">View Revisions</base-button>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="form-inline">
              <div class="col-md-6">
                <h5 class="h3 mb-0">Current Status</h5>
              </div>
              <div class="col-md-6 text-right" v-can="permissionEnum.APPROVE_ORDER">
                <base-button type="success" size="sm" @click="isStatusUpdateActive = true"
                             v-if="['rejected', 'delivered', 'cancelled'].includes(currentEntity.statuses[currentEntity.statuses.length - 1].status) == false ">
                  Update
                </base-button>
                <base-button type="info" size="sm" @click="isStatusHistoryActive = true">History</base-button>
              </div>
            </div>
          </div>
          <div class="card-body" :class="currentEntity.statuses[currentEntity.statuses.length - 1].status == 'accepted' || currentEntity.statuses[currentEntity.statuses.length - 1].status == 'delivered'? 'bg-gradient-success'
                        : currentEntity.statuses[currentEntity.statuses.length - 1].status == 'rejected' || currentEntity.statuses[currentEntity.statuses.length - 1].status == 'cancelled'? 'bg-gradient-danger'
                        : 'bg-gradient-primary'">
            <!--            <stats-card id="order-status-card" v-if="currentEntity.statuses"-->
            <!--                        :class="currentEntity.statuses[currentEntity.statuses.length - 1].status == 'accepted' || currentEntity.statuses[currentEntity.statuses.length - 1].status == 'delivered'? 'bg-gradient-success'-->
            <!--                        : currentEntity.statuses[currentEntity.statuses.length - 1].status == 'rejected' || currentEntity.statuses[currentEntity.statuses.length - 1].status == 'cancelled'? 'bg-gradient-danger'-->
            <!--                        : 'bg-gradient-primary'">-->
            <div class="row">
              <div class="col">
                <span v-if="statuses.length > 0" class="h2 font-weight-bold mb-0 text-white">{{
                    statuses[0].status.toString().toUpperCase()
                  }}</span>
                <i v-else class="fa fa-cog fa-spin fa-2x fa-fw text-info"></i>
              </div>
            </div>
            <!--            </stats-card>-->
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h5 class="h3 mb-0" v-if="lastestOrderRevision">Requested Products (Revised on
              {{ lastestOrderRevision.created_at | datetime('ll') }})</h5>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush list my--4" v-if="lastestOrderRevision">
              <li v-for="product in lastestOrderRevision.ordered_products" :key="product.id"
                  class="list-group-item px-0">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <a href="#" class="avatar rounded-circle">
                      <async-image v-slot="slotProps" v-if="product.product.image_url"
                                   :url="product.product.image_url">
                        <img :src="slotProps.imageSrc"/>
                      </async-image>
                      <i v-else class="ni ni-image"></i>
                    </a>
                  </div>
                  <div class="col ml--2">
                    <h4 class="mb-0">{{ product.product.base_product.name }}
                      ({{ product.product.base_product.sku }})</h4>
                    <small>Quantity :{{ product.qty }} | Custom Discount: {{ product.custom_discount }} | Price :{{
                        product.price
                      }}</small>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
      </template>
      <!--       Status Updating Modal-->
      <modal size="sm" :show.sync="isStatusUpdateActive">
        <template slot="header">
          <h5 class="modal-title">Update Status</h5>
        </template>
        <div class="row justify-content-md-center">
          <div class="col col-10">
            <OrderStatusAutocomplete :rules="{ required: true }" name="status"
                                     v-model="form.status"></OrderStatusAutocomplete>
            <base-input name="remarks">
              <textarea rows="3" v-model="form.remarks" placeholder="Say something..!" class="form-control"></textarea>
            </base-input>
          </div>
        </div>
        <template slot="footer">
          <base-button type="secondary" @click="isStatusUpdateActive = false">Close</base-button>
          <base-button type="success" :loading="loading" @click="handleSubmit(save)">Update</base-button>
        </template>
      </modal>
      <!--       Status history-->
      <modal :show.sync="isStatusHistoryActive">
        <template slot="header">
          <h5 class="modal-title">Status History</h5>
        </template>
        <div>
          <el-timeline>
            <el-timeline-item :timestamp="item.status.toString().toUpperCase()" :color="index==0? '#8ce5b5' : '#a9b4c1'"
                              placement="top"
                              v-for="(item, index) in statuses" :key="item.id">

                <span class="text-sm text-primary">{{ item.created_at | datetime('lll') }}</span><br>
              <p style="color: #0b90a8;"><small>{{ item.remarks ? item.remarks : '' }}</small></p>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="mt-2">
          <base-pagination v-model="currentHistoryPage" :perPage="historyPerPage" :total="totalHistory"
                           align="center"></base-pagination>
        </div>
        <template slot="footer">
          <base-button type="secondary" @click="isStatusHistoryActive = false">Close</base-button>
        </template>
      </modal>
    </modal>

    <!--  Revisions List    -->
    <revision-list
      :is-view-revision.sync="isViewRevision"
      :current-entity.sync="currentEntity"
      :order-revisions="orderRevisions"
    ></revision-list>


  </validation-observer>
</template>

<script lang="ts">
import {Vue, Component, Prop, Mixins, Watch} from 'vue-property-decorator';
import BaseCUModalComponent from '@/mixins/BaseCUModalComponent';
import {AxiosResponse} from 'axios';
import Order from '@/intefaces/Order.js';
import OrderStatusAutocomplete from '@/components/resources-autocomplete/OrderStatusAutocomplete.vue';
import RequisitionStatuses from "@/data/OrderStatus";
import OrderRevision from "@/intefaces/OrderRevision";
import RevisionList from "@/views/order/RevisionList.vue";
import AsyncImage from "@/components/AsyncImage.vue";
import {
  Tooltip,
  Timeline,
  TimelineItem,
  Card
} from 'element-ui';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import { Permission as PermissionEnum } from '@/enums/Permission'

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Timeline.name]: Timeline,
    [TimelineItem.name]: TimelineItem,
    [Card.name]: Card,
    AsyncImage,
    OrderStatusAutocomplete,
    RevisionList
  }
})
export default class OrderDetailsForm extends Mixins(BaseCUModalComponent, TaxonomyMixin) {
  isStatusUpdateActive: Boolean = false;
  isStatusHistoryActive: Boolean = false;
  private statuses: any = [];
  private historyPerPage = 0;
  private totalHistory = 0;
  private currentHistoryPage = 1;
  private lastestOrderRevision: OrderRevision[] = [];
  private orderRevisions: OrderRevision[] = [];
  private isViewRevision: boolean = false;
  requisitionStatuses = RequisitionStatuses;

  @Prop()
  currentEntity!: Order;

  @Prop({
    type: Object,
    default: function () {
      return {remarks: '', status: ''};
    }
  })
  form!: {
    remarks: string;
    status: string;
  };

  get permissionEnum () {
    return PermissionEnum;
  }

  @Watch('isActive')
  getRevision() {
    this.$http.get(this.$api(`/orders/${this.currentEntity.id}/revisions`)).then(response => {
      this.orderRevisions = response.data.revisions
      this.lastestOrderRevision = response.data.revisions[0];
    })
  }

  @Watch('currentEntity')
  onChangeCurrentEntity(value: any) {
    if (value == null) {
      return;
    }
    this.fetchStatus();
  }

  formReset(): any {
    this.form.remarks = '';
    this.form.status = '';
    return this.form;
  }

  deleteRejectStatus(status: any) {
    if (status.find((status: any, index: any) => status.status == 'accepted') && this.requisitionStatuses.find(status => status.value == 'rejected')) {
      this.requisitionStatuses.splice(this.requisitionStatuses.findIndex((status: any) => status.value == 'rejected'), 1);
    } else if (!status.find((status: any, index: any) => status.status == 'accepted') && !this.requisitionStatuses.find(status => status.value == 'rejected')) {
      this.requisitionStatuses.splice(3, 0, {title: 'Rejected', value: 'rejected'});
    }
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.status);
    this.statuses.unshift(response.data.status);
    this.deleteRejectStatus(this.statuses);
    let data = [...this.statuses];
    this.currentEntity.statuses = data.reverse();
    this.$emit('update:currentEntity', this.currentEntity);
  }

  afterUpdate(response: AxiosResponse<any>): void {
  }

  get createApi(): string {
    return `/orders/${this.currentEntity.id}/statuses`;
  }

  get updateApi(): string {
    return `/orders/${this.currentEntity.id}/statuses`;
  }

  protected createNotification() {
    this.notification('Updated');
  }

  @Watch('currentHistoryPage')
  private async fetchStatus() {
    let {data} = await this.$http.get(this.$api(`/orders/${this.currentEntity.id}/statuses?page=${this.currentHistoryPage}`));
    this.statuses = data.statuses;

    this.deleteRejectStatus(this.statuses);

    this.totalHistory = data.total;
    this.historyPerPage = data.per_page;
  }

  close(): void {
    if (this.isStatusUpdateActive) {
      this.formReset();
      this.isStatusUpdateActive = false;
      return;
    }
    this.$emit('update:isActive', false);
  }
}
</script>
<style>
#order-status-card p {
  margin-top: 0 !important;
}
</style>
<style>
#order-history-modal {
  max-height: 450px;
  overflow-y: scroll;
  background-color: #f5f5f5;
}

#order-history-modal::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

#order-history-modal::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.44, rgb(122, 153, 217)),
    color-stop(0.72, rgb(73, 125, 189)),
    color-stop(0.86, rgb(28, 58, 148))
  );
}

.el-timeline-item__timestamp.is-top {
  color: #c50e83;
}
</style>
