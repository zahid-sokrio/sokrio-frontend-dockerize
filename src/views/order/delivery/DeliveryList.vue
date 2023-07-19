<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Delivery</h3>
            <el-tooltip class="ml-3" content="List of delivered products for your organization." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <base-button
            v-if="selectedRows.length > 0 || allItemSelected"
            type="primary"
            size="sm"
            @click.prevent="showDownloadModal = !showDownloadModal"
          >
            <i class="fa fa-download"></i>Bulk Download
          </base-button>
          <el-tooltip content="Filters" placement="top">
            <base-button
              type="primary"
              icon
              size="sm"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)"
            >
              <span class="btn-inner--text">Filters</span>
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
            </base-button>
          </el-tooltip>
        </div>
        <filter-drawer-component
          v-if="isFilterModelActive"
          :visible.sync="isFilterModelActive"
          direction="rtl"
          :title="getTaxonomy('Order Delivery') + ' Filter'"
          @closeBtn="closeBtn"
          @resetBtn="resetBtn"
        >
          <div class="clr"></div>
          <div @click="selectedButton = ''">
            <DateRange v-model="filters.deliveryDateRange" label-prop="Delivery Dates"></DateRange>
          </div>
          <div class="clr"></div>
          <!-- <base-input label="Status">
            <el-select filterable v-model="filters.status" clearable>
              <el-option v-for="(type, index) in statuses" :key="index" :label="type.title.replace(/^\w/, c => c.toUpperCase())" :value="type.value">
              </el-option>
            </el-select>
          </base-input> -->
        </filter-drawer-component>
      </div>
    </div>
    <div class="pb-4 pt-2 row justify-content-center">
      <el-button-group :key="selectedButton">
        <el-button :type="selectedButton == 'Today' ? 'info' : ''" @click="updateDateRange('Today')">Today</el-button>
        <el-button :type="selectedButton == 'WTD' ? 'info' : ''" @click="updateDateRange('WTD')">WTD</el-button>
        <el-button :type="selectedButton == 'MTD' ? 'info' : ''" @click="updateDateRange('MTD')">MTD</el-button>
        <el-button :type="selectedButton == 'QTD' ? 'info' : ''" @click="updateDateRange('QTD')">QTD</el-button>
        <el-button :type="selectedButton == 'YTD' ? 'info' : ''" @click="updateDateRange('YTD')">YTD</el-button>
      </el-button-group>
    </div>
    <div v-show="selectedRows.length > 0 || allItemSelected">
      <p v-if="allItemSelected" class="text-center">
        All items are selected.
        <a href="#" @click.prevent="deselectAllItems">Deselect All items.</a>
      </p>
      <p v-else class="text-center">
        {{ selectedRows.length == 1 ? '1 item' : `${selectedRows.length} items are` }} selected.
        <a href="#" @click.prevent="selectAllItems">Select all items.</a>
      </p>
    </div>
    <el-table
      v-loading="loading"
      :data="deliveries"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      :row-key="getRowKeys"
    >
      <template v-slot:empty>
        <p v-text="loading ? 'Loading data . . .' : filterApplied ? 'No Data Found' : 'Please apply filters to get your desired data.'"></p>
      </template>

      <el-table-column type="selection" width="60" :reserve-selection="true"></el-table-column>
      <el-table-column :label="getTaxonomy('invoice') + ' No.'" min-width="100px" prop="invoice">
        <template v-slot="{ row }">
          <b> #{{ row.order.invoice ? row.order.invoice.code : '' }}</b>
        </template>
      </el-table-column>
       <el-table-column label="Buyer Department" min-width="100px" prop="invoice">
        <template v-slot="{ row }">
          <b>{{ row.order.buyer_name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Amount" min-width="100px" prop="invoice">
        <template v-slot="{ row }">
          <b> {{ row.amount }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Discount" min-width="100px" prop="invoice">
        <template v-slot="{ row }">
          <b> {{ row.discount }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Deliver At" min-width="100px" prop="invoice">
        <template v-slot="{ row }">
          <b v-if="row.created_at != null"> {{ row.created_at | datetime('ll') }}</b>
          <b v-else> - </b>
        </template>
      </el-table-column>
      <el-table-column label="Details" min-width="100px" prop="invoice">
        <template v-slot="{ row }">
          <base-button outline size="sm" type="info" @click="invoiceDetails(row)">View {{ getTaxonomy('invoice') }}</base-button>
        </template>
      </el-table-column>
    </el-table>
    <CursorPagination v-model="currentCursor" :next-page-cursor="nextPageCursor" :prev-page-cursor="prevPageCursor" :disabled="loading" />

    <delivery-details :invoice-details="invoiceDetail" :is-active.sync="isActiveInvoice" :is-deliver.sync="isDeliver"></delivery-details>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
    <modal :show="showDownloadModal" @close="showDownloadModal = false">
      <template slot="header">
        <h5 class="modal-title">Download Delivery List</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <base-input label="Recipient (Optional)" v-model="recipient" :placeholder="$user ? $user.email : ''"></base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="showDownloadModal = false" type="secondary">Close</base-button>
        <base-button :loading="loading" type="primary" @click.prevent="downloadDeliveryList">
          <i class="fa fa-envelope"></i>
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import Delivery from '@/intefaces/Delivery';
import DeliveryDetails from '@/views/order/delivery/DeliveryDetails.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
// import InvoiceDetails from "@/views/order/invoice/InvoiceDetails.vue";
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip, Drawer, ButtonGroup, Button } from 'element-ui';
import CursorPagination from '@/components/CursorPagination.vue';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import { QueryBuilder } from '@/classes/QueryBuilder';
import MultiSelectRow from '@/mixins/MultiSelectRow';
import HasCursorPaginationMixin from '@/mixins/HasCursorPagination';
import DateRange from '@/components/DateRange.vue';
import FilterDrawerComponent from '@/components/FilterDrawerComponent.vue';
import moment from 'moment';
import swal from 'sweetalert2';

@Component({
  components: {
    GIFModal,
    CursorPagination,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    [ButtonGroup.name]: ButtonGroup,
    [Button.name]: Button,
    FilterDrawerComponent,
    DateRange,
    DeliveryDetails
  }
})
export default class DeliveryList extends Mixins(HasCursorPaginationMixin, MultiSelectRow, TaxonomyMixin) {
  private deliveries: Delivery[] = [];
  private isActiveInvoice: boolean = false;
  private invoiceDetail: any = [];
  private isDeliver: boolean = false;
  private showGIF: boolean = false;
  private demoTourEntity: string = 'delivery';
  private showDownloadModal: boolean = false;
  private recipient: string = '';
  private queryBuilder: QueryBuilder = new QueryBuilder();
  private isFilterModelActive: boolean = false;
  private filterApplied: boolean = false;
  private selectedButton: string = 'Today';
  private GIFs: Array<any> = [
    {
      label: 'Create a delivery',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a delivery',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a delivery',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of delivery';

  private filters: any = {
    deliveryDateRange: '',
    status: 'unpaid'
  };

  async updateDateRange(range: string) {
    this.selectedButton = range;
    if (range === 'Today') {
      await this.queryBuilder.setParam('created_between', moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD'));
    }
    if (range === 'WTD') {
      await this.queryBuilder.setParam(
        'created_between',
        moment()
          .day(-1)
          .format('YYYY-MM-DD') +
          ',' +
          moment().format('YYYY-MM-DD')
      );
    }
    if (range === 'MTD') {
      await this.queryBuilder.setParam(
        'created_between',
        moment()
          .startOf('month')
          .format('YYYY-MM-DD') +
          ',' +
          moment().format('YYYY-MM-DD')
      );
    }
    if (range === 'QTD') {
      await this.queryBuilder.setParam(
        'created_between',
        moment()
          .startOf('quarter')
          .format('YYYY-MM-DD') +
          ',' +
          moment().format('YYYY-MM-DD')
      );
    }
    if (range === 'YTD') {
      await this.queryBuilder.setParam(
        'created_between',
        moment()
          .startOf('year')
          .format('YYYY-MM-DD') +
          ',' +
          moment().format('YYYY-MM-DD')
      );
    }
    this.$nextTick(function() {
      this.applyFilter();
    });
  }
  closeBtn() {
    this.isFilterModelActive = false;
    this.applyFilter();
  }

  async mounted() {
    await this.queryBuilder.setParam('created_between', moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD'));
    // await this.queryBuilder.setParam('status', 'unpaid');
    this.$nextTick(function() {
      this.applyFilter();
    });
  }

  @Watch('filters.deliveryDateRange', { deep: true })
  onChangeSubmissionDateRange(value: string) {
    this.queryBuilder.addListener('created_between', value);
  }

  @Watch('currentCursor')
  async fetchDelivery(cursor: string | null) {
    this.loading = true;
    try {
      let { data } = await this.$http.get(
        this.$api(`/deliveries${cursor ? '?cursor=' + cursor + '&' : ''}${this.queryBuilder.getFilters(cursor == null)}`)
      );
      this.setPagination(data);
      this.deliveries = data.data;
      // eslint-disable-next-line no-console
      console.log('testttt', this.deliveries);
    } catch (e) {
      this.$notify({ title: 'Something Went Wrong!', message: 'Please Try again.', type: 'error' });
    } finally {
      this.loading = false;
    }
  }

  async downloadDeliveryList(status: string) {
    this.loading = true;
    await this.queryBuilder.setParam('recipient', this.recipient);
    await this.queryBuilder.setParam('type', 'csv');
    if (!this.allItemSelected) {
      await this.queryBuilder.setParam(
        'id',
        this.selectedRows.map(order => order.id)
      );
    }
    try {
      let { data, headers } = await this.$http.get(this.$api(`/download/bulk-delivery${this.queryBuilder.getFilters(true)}`));
      await swal.fire('Delivery List Sent', 'You will receive the report within a few minutes.', 'success');
    } catch (e) {
      this.$notify({ title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.' });
    } finally {
      this.loading = false;
      this.showDownloadModal = false;
      await this.queryBuilder.setParam('recipient', null);
      await this.queryBuilder.setParam('type', null);
      await this.queryBuilder.setParam('id', null);
      this.recipient = '';
    }
  }

  invoiceDetails(row: any) {
    this.isActiveInvoice = true;
    this.invoiceDetail = row;
    this.isDeliver = true;
    // eslint-disable-next-line no-console
    console.log(this.invoiceDetail);
  }

  applyFilter() {
    this.filterApplied = true;
    this.fetchDelivery(null);
  }

  resetBtn() {
    this.filters.deliveryDateRange = '';
    this.filters.status = 'unpaid';
    this.fetchDelivery(null);
  }
}
</script>
<style>
.clr {
  clear: both;
}
</style>
