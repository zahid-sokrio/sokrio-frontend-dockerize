<template>
  <modal :show="isActive" @close="close" size="lg">
    <template slot="header">
      <h5 class="modal-title" id="exampleModalLabel">{{ getTaxonomy('requisition') }} Details | {{ getTaxonomy('requisition') }} No.
        #{{ currentRequisition.code }}</h5>
    </template>
    <div>
      <div class="col-auto mb-3" style="padding: 0">
        <base-button block type="primary" @click="isViewRevision = true, isRequisition = true">View Revisions
        </base-button>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="form-inline">
            <div class="col-md-6">
              <h5 class="h3 mb-0">Current Status</h5>
            </div>
            <div class="col-md-6 text-right" v-if="currentRequisition.statuses"
                 v-can="permissionEnum.APPROVE_REQUISITION">
              <base-button type="success" size="sm" @click="isStatusUpdateActive = true"
                           v-if="filter == 'Incoming requisitions' && ['rejected', 'delivered', 'cancelled'].includes(currentRequisition.statuses[currentRequisition.statuses.length - 1].status) == false ">
                Update
              </base-button>


              <el-popover
                placement="bottom-end"
                width="400"
                trigger="click">

                <template slot="header">
                  <h5 class="modal-title">Status History</h5>
                </template>
                <div id="order-history-modal">
                  <ul class="list-group list-group-flush" data-toggle="checklist">
                    <li class="list-group-item px-0" v-for="(item, index) in statuses" :key="item.id">
                      <el-tooltip :disabled="index !== 0" content="Current Status" placement="left">
                        <div class="checklist-item"
                             :class="`${index == 0 && requisitionPagination.currentPage == 1 ? 'checklist-item-info' : 'checklist-item-warning'}`">
                          <div class="checklist-info">
                            <h5 class="checklist-title mb-0">{{ item.status.toString().toUpperCase() }}</h5>
                            <small>{{ item.remarks }}</small>
                            <br/>
                            <small>Updated At : {{ item.created_at | datetime('ll') }}</small>
                          </div>
                          <div>
                            <i v-if="index == 0 && requisitionPagination.currentPage == 1" class="ni ni-check-bold text-info"></i>
                          </div>
                        </div>
                      </el-tooltip>
                    </li>
                  </ul>
                </div>


                <!--                <base-button type="secondary" @click="isStatusHistoryActive = false">Close</base-button>-->
                <base-button type="info" slot="reference">History</base-button>
              </el-popover>
            </div>
          </div>
        </div>
        <div class="card-body" v-if="currentRequisition.statuses"
             :class="currentRequisition.statuses[currentRequisition.statuses.length - 1].status == 'accepted' || currentRequisition.statuses[currentRequisition.statuses.length - 1].status == 'delivered'? 'bg-gradient-success'
                    : currentRequisition.statuses[currentRequisition.statuses.length - 1].status == 'rejected' || currentRequisition.statuses[currentRequisition.statuses.length - 1].status == 'cancelled'? 'bg-gradient-danger'
                    : 'bg-gradient-primary'">
          <div class="row">
            <div class="col">
                    <span v-if="currentRequisition.statuses" class="h2 font-weight-bold mb-0 text-white">
                        {{
                        currentRequisition.statuses[currentRequisition.statuses.length - 1].status.toString().toUpperCase()
                      }}
                    </span>
              <i v-else class="fa fa-cog fa-spin fa-2x fa-fw text-info"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h5 class="h3 mb-0">Requested Products</h5>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-flush list my--4" v-if="lastestOrderRevision.ordered_products">
          <li v-for="product in lastestOrderRevision.ordered_products" :key="product.id" class="list-group-item px-0">
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
                <h4 class="mb-0">{{ product.product.base_product.name }} ({{ product.product.base_product.sku }})</h4>
                <small>Quantity :{{ product.qty }} | Custom Discount: {{ product.custom_discount }} | Price :{{
                    product.price + ' ' + getCurrency
                  }} </small>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <template slot="footer">
      <base-button type="secondary" @click="close">Close</base-button>
    </template>
    <!--       Status Updating Modal-->
    <validation-observer ref="formValidator" v-slot="{handleSubmit}">
      <modal size="sm" :show.sync="isStatusUpdateActive">
        <template slot="header">
          <h5 class="modal-title">Update Status</h5>
        </template>
        <div class="row justify-content-md-center">
          <div class="col col-10">
            <RequisitionStatusAutocomplete :rules="{ required: true }" name="status"
                                           v-model="form.status"></RequisitionStatusAutocomplete>
            <base-input name="remarks">
              <textarea rows="3" v-model="form.remarks" placeholder="Say something..!" class="form-control"></textarea>
            </base-input>
          </div>
        </div>
        <template slot="footer">
          <base-button type="secondary" @click="isStatusUpdateActive = false">Close</base-button>
          <base-button type="success" @click="handleSubmit(save)" :loading="loading">Update</base-button>
        </template>
      </modal>
    </validation-observer>
    <!--       Status history-->
    <!--    <modal :show.sync="isStatusHistoryActive">-->

    <!--    </modal>-->
    <!--  Revisions List    -->
    <revision-list
      :is-view-revision.sync="isViewRevision"
      :current-entity.sync="currentRequisition"
      :order-revisions="orderRevisions"
      :is-requisition.sync="isRequisition"
    ></revision-list>
  </modal>
</template>
<script lang="ts">
import {Vue, Component, Prop, Watch, Mixins} from 'vue-property-decorator';
import RequisitionStatusAutocomplete from "@/components/resources-autocomplete/RequisitionStatusAutocomplete.vue";
import RequisitionStatuses from "@/data/OrderStatus";
import {AxiosResponse} from "axios";
import OrderRevision from "@/intefaces/OrderRevision";
import RevisionList from "@/views/order/RevisionList.vue";
import AsyncImage from "@/components/AsyncImage.vue";
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import { Permission as PermissionEnum } from '@/enums/Permission'

@Component({
  name: 'RequisitionDetails',
  components: {
    AsyncImage,
    RequisitionStatusAutocomplete,
    RevisionList
  }
})
export default class RequisitionDetails extends Mixins(TaxonomyMixin) {
  @Prop() isActive!: boolean;
  @Prop() currentRequisition!: any;
  @Prop() filter!: any;
  private lastestOrderRevision: OrderRevision[] = [];
  private orderRevisions: OrderRevision[] = [];
  private statuses: any = [];
  private loading = false;
  private isStatusHistoryActive: boolean = false;
  private isViewRevision: boolean = false;
  private isRequisition: boolean = false;
  private requisitionPagination = {
    currentPage: 1,
    total: 0,
    perPage: 0
  };
  private isStatusUpdateActive: boolean = false;
  private form: any = {
    status: '',
    remarks: ''
  }
  private filterStatus: any = '';
  requisitionStatuses = RequisitionStatuses;

  get permissionEnum () {
    return PermissionEnum;
  }

  deleteRejectStatus(status: any) {
    if (status.find((status: any, index: any) => status.status == 'accepted') && this.requisitionStatuses.find(status => status.value == 'rejected')) {
      this.requisitionStatuses.splice(this.requisitionStatuses.findIndex((status: any) => status.value == 'rejected'), 1);
    } else if (!status.find((status: any, index: any) => status.status == 'accepted') && !this.requisitionStatuses.find(status => status.value == 'rejected')) {
      this.requisitionStatuses.splice(3, 0, {title: 'Rejected', value: 'rejected'});
    }
  }

  async fetchImageSrc(image: any) {
    await this.$blob2Url(image).then((response: any) => {
      return response;
    });
  }

  save() {
    this.$http.post(this.$api(`/orders/${this.currentRequisition.id}/statuses`),
      {status: this.form.status, remarks: this.form.remarks})
      .then(response => {
        this.isStatusUpdateActive = false;
        // this.$emit('created',response.data.status);
        this.statuses.unshift(response.data.status);
        this.deleteRejectStatus(this.statuses);
        let data = [...this.statuses];
        this.currentRequisition.statuses = data.reverse();
        this.$emit('update:currentRequistion', this.currentRequisition);
      })
  }

  @Watch('isActive')
  fetchStatus() {
    let isFirstPage = this.requisitionPagination.currentPage < 2;
    let url = isFirstPage
      ? `/orders/${this.currentRequisition.id}/statuses`
      : `/orders/${this.currentRequisition.id}/statuses?page=${this.requisitionPagination.currentPage}`;
    this.$http.get(this.$api(url)).then(response => {
      this.statuses = response.data.statuses;

      this.deleteRejectStatus(this.statuses);

      this.requisitionPagination.total = response.data.total;
      this.requisitionPagination.perPage = response.data.per_page;
    })

    this.$http.get(this.$api(`/orders/${this.currentRequisition.id}/revisions`)).then(response => {
      this.orderRevisions = response.data.revisions
      this.lastestOrderRevision = response.data.revisions[0];
    })
  }

  get getCurrency() {
    return this.$store.getters['Settings/getCurrency']
  }

  // @Watch('requisitionPagination.currentPage')
  // private async fetchStatus(){
  //     let {data} = await this.$http.get(this.$api(`/requisitions/${this.currentRequisition.id}/statuses?page=${this.requisitionPagination.currentPage}`));
  //     this.statuses = data.statuses;
  //     this.requisitionPagination.total = data.total;
  //     this.requisitionPagination.perPage = data.per_page;
  // }

  close() {
    this.$emit('update:isActive', false);
  }
}
</script>
