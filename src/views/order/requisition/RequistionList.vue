<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0"> {{ getTaxonomy('requisition') }}(s)</h3>
            <el-tooltip class="ml-3" :content="'Manage and monitor on your '+getTaxonomy('requisition')"
                        placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                 @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Filters" placement="top">
            <base-button
              icon
              size="sm"
              type="primary"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)"
            >
              <span class="btn-inner--text">Filters</span>
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
            </base-button>
          </el-tooltip>
          <el-tooltip v-if="selectedFilter == 'Outgoing requisitions'" :content="'Add New '+
          getTaxonomy('requisition')" placement="top" v-can="permissionEnum.CREATE_REQUISITION">
            <base-button icon size="sm" type="primary" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
        <el-drawer :before-close="handleClose" :visible.sync="isFilterModelActive" v-if="isFilterModelActive"
                   direction="rtl"
                   :title="getTaxonomy('requisition')+' Filter'">
          <div class="col-md-12 m-2">
            <base-input label="Type">
              <el-select v-model="selectedFilter" clearable filterable placeholder="Type">
                <el-option v-for="(type, index) in filter" :key="index"
                           :label="type.title" :value="type.value"></el-option>
              </el-select>
            </base-input>
          </div>
          <div class="col-md-12 m-2">
            <base-input label="Status">
              <el-select v-model="selectedRequisition" clearable filterable placeholder="Type">
                <el-option
                  v-for="(type, index) in statuses"
                  :key="index"
                  :label="type.title.replace(/^\w/, c => c.toUpperCase())"
                  :value="type.value"
                >
                </el-option>
              </el-select>
            </base-input>
          </div>
          <div class="col-md-12 text-left">
            <base-button icon type="primary" @click="closeBtn">
              <span class="btn-inner--text">Done</span>
            </base-button>
            <base-button icon type="primary" @click="resetBtn">
              <span class="btn-inner--text">Reset</span>
            </base-button>
          </div>
        </el-drawer>
      </div>
      <requisition-form
        :current-entity="isUpdate ? currentRequisition : ''"
        :form.sync="form"
        :is-active.sync="isActive"
        :is-update.sync="isUpdate"
        :product.sync="product"
        :sales-returns.sync="salesReturns"
        :update-amount-count.sync="updateAmountCount"
        @created="createRequisition($event)"
        @updated="updateRequisition($event)"
        v-if="isActive"
      ></requisition-form>
    </div>
    <el-table
      v-loading="loading"
      :data="requisitions"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
    >
      <el-table-column align="center" :label="getTaxonomy('order')+' Date'" min-width="130px" prop="id">
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column :label="getTaxonomy('requisition')+' No.'" align="center" min-width="100px" prop="code" sortable>
        <template v-slot="{ row }">
          <b>#{{ row.code }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Created By" min-width="150px" prop="creator" sortable>
        <template v-slot="{ row }">
          <b>{{ row.creator ? row.creator.name : '-' }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Delivery Date" min-width="90px" prop="expected_delivery_date" sortable>
        <template v-slot="{ row }">
          <b v-if="row.expected_delivery_date">{{ row.expected_delivery_date | datetime('ll') }}</b>
          <b v-else> - </b>
        </template>
      </el-table-column>
      <el-table-column :label="getTaxonomy('department')" align="center" min-width="150px" prop="department" sortable>
        <template v-slot="{ row }">
          <b v-if="row.buyer">{{ row.buyer.name }} | {{ row.buyer.code }}</b>
          <b v-else> - </b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Territory" min-width="150px" prop="buyer" sortable>
        <template v-slot="{ row }">
          <b v-if="row.buyer"> {{ row.buyer.territory ? row.buyer.territory.name : '-' }} | {{
              row.buyer.territory.code
            }}
          </b>
          <b v-else> - </b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Amount" min-width="100px" prop="amount" sortable>
        <template v-slot="{ row }">
          <b>{{ row.payable }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Due" min-width="100px" prop="amount">
        <template v-slot="{ row }">
          <b>{{ row.total_due }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Paid" min-width="100px" prop="amount">
        <template v-slot="{ row }">
          <b>{{ row.total_paid }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" min-width="80px" prop="statuses" sortable>
        <template v-slot="{ row }">
          <b>{{ _.startCase(row.status) }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="140px" prop="id">
        <template v-slot="{ row }">
          <base-button outline size="sm" type="info"
                       @click="(isActiveRequisitionDetails = true), (currentRequisition = row)">Details
          </base-button>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="requisitions.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>
    <BaseOrderDetails :is-active.sync="isActiveRequisitionDetails" :title="getTaxonomy('order')"
                      @editedEntity="updateEditedOrder($event)" :current-entity.sync="currentRequisition"
                      @updatedStatus="entityUpdated($event)" :filter-for-requisition.sync="selectedFilter"
                      :edit-permission="requisitionEditPermission" :status-permission="requisitionApprovePermission"
    ></BaseOrderDetails>
    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"
              :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import RequisitionForm from '@/views/order/requisition/RequisitionForm.vue';
import statuses from '@/data/OrderStatus';
import RequisitionDetails from '@/views/order/requisition/RequisitionDetails.vue';
import { Drawer, Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip } from 'element-ui';
import Order from '@/intefaces/Order';
import OrderDetailsForm from '@/views/order/OrderDetailsForm.vue';
import { mixins } from 'vue-class-component';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import GIFModal from '@/components/tour/GIFModal.vue';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import {Permission as PermissionEnum} from '@/enums/Permission'
import BaseOrderDetails from "@/views/order/BaseOrderDetails.vue";

@Component({
  components: {
    OrderDetailsForm,
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Drawer.name]: Drawer,
    RequisitionForm,
    RequisitionDetails,
    BaseOrderDetails
  },
  filters: {
    currentStatus: function (value: Order) {
      if (!value) return '';
      return value.statuses[value.statuses.length - 1].status;
    }
  }
})
export default class RequisitionList extends mixins(PaginationComponentMixin, TaxonomyMixin) {
  private isActive = false;
  private isUpdate = false;
  private updateAmountCount: boolean = false;
  private isActiveRequisitionDetails = false;
  private departments: any[] = [];
  private requisitions: any[] = [];
  private isFilterModelActive: boolean = false;
  // private loading = false;
  private currentRequisition: any[] = [];
  private requisitionEditPermission: string = '';
  private requisitionApprovePermission: string = '';

  private form = {
    departmentId: '',
    sellerId: '',
    discount: 0,
    promotionalDiscount: 0,
    expectedDeliveryDate: '',
    paid: '',
    type: 'product',
    productableId: '',
    badgeDiscount: 0
  };
  private product: any = [
    {
      product_id: '',
      price: 0,
      qty: 0,
      free_with: '',
      promotion_discount: 0,
      promotion_id: '',
      fullName: ''
    }
  ];
  private salesReturns: any = [
    {
      product_id: '',
      qty: '',
      amount: '',
      return_rate: 0,
      paid: 0,
      reason: ''
    }
  ];
  private filter = [{
    title: 'Outgoing ' + this.getTaxonomy('requisition'),
    value: 'Outgoing requisitions'
  }, {title: 'Incoming ' + this.getTaxonomy('requisition'), value: 'Incoming requisitions'}];
  private selectedFilter = 'Outgoing requisitions';
  private selectedRequisition = 'all requisitions';
  private showGIF: boolean = false;
  private demoTourEntity: string = 'requisition';
  private GIFs: Array<any> = [
    {
      label: 'Create a requisition',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a requisition',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a requisition',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of requisition';

  get permissionEnum() {
    return PermissionEnum;
  }

  get statuses() {
    let data = [...statuses];
    data.unshift({title: 'All', value: 'all requisitions'});
    return data;
  }

  @Watch('selectedFilter')
  getFilter(newVal: any) {
    this.fetchRequisition();
  }

  @Watch('isActive')
  getPermission(newVal: boolean) {
    this.requisitionApprovePermission = this.permissionEnum.APPROVE_REQUISITION;
    this.requisitionEditPermission = this.permissionEnum.UPDATE_REQUISITION;
  }

  createRequisition(requisition: any) {
    this.isActive = false;
    this.requisitions.unshift(requisition);
  }

  updateRequisition(requisitionUpdate: any) {
    this.isUpdate = false;
    // this.requisitions.splice(this.requisitions.findIndex((requisiton: any) => requisiton.id == requisitionUpdate.id), 1, requisitionUpdate);
    this.isActive = false;
  }

  updateEditedOrder(event: Order) {
    this.$http.get(this.$api(`/orders/${event.id}`)).then(response => {
      this.requisitions.splice(this.requisitions.findIndex((order: any) => order.id == response.data.order.id), 1, response.data.order);
    })
  }

  entityUpdated(entity: Order): void {
    this.requisitions.splice(
      this.requisitions.findIndex(type => type.id == entity.id),
      1,
      entity
    );
    this.isActiveRequisitionDetails = false;
  }

  requistionStatus() {
    this.fetchRequisition();
  }

  @Watch('selectedRequisition')
  requisitionFilter() {
    this.fetchRequisition();
  }

  @Watch('pagination.currentPage')
  fetchRequisition() {
    this.loading = true;
    if (this.selectedFilter == 'Outgoing requisitions') {
      let url = `/requisitions?created_by=me${this.selectedRequisition !== 'all requisitions' ? '&status=' + this.selectedRequisition : ''}&page=${
        this.pagination.currentPage
      }`;
      this.$http.get(this.$api(url)).then(response => {
        this.requisitions = response.data.requisitions;
        this.setPagination(response.data);
        this.loading = false;
      });
    } else if (this.selectedFilter == 'Incoming requisitions') {
      let url = `/requisitions?seller_id=me${this.selectedRequisition !== 'all requisitions' ? '&status=' + this.selectedRequisition : ''}&page=${
        this.pagination.currentPage
      }`;
      this.$http.get(this.$api(url)).then(response => {
        this.requisitions = response.data.requisitions;
        this.setPagination(response.data);
        this.loading = false;
      });
    }
  }

  created() {
    this.fetchRequisition();
  }

  closeBtn() {
    this.isFilterModelActive = false;
  }

  handleClose(done: any) {
    done();
  }

  resetBtn() {
    this.selectedFilter = 'Outgoing requisitions';
    this.selectedRequisition = 'all requisitions';
  }
}
</script>
<style>
#order-filter-dropdown .dropdown-menu {
  min-width: 155px;
  text-align: center;
}
</style>
