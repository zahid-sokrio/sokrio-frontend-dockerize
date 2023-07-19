<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">{{ getTaxonomy('invoice') }}(s)</h3>
            <el-tooltip class="ml-3" content="Monitor and get invoices for your business" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
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
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
              <span class="btn-inner--text">Filters</span>
            </base-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <filter-drawer-component
      v-if="isFilterModelActive"
      :visible.sync="isFilterModelActive"
      direction="rtl"
      title="Ready To Dispatch FIlter"
      @closeBtn="onFilterSubmit"
      @resetBtn="resetBtn"
    >
      <div class="clr"></div>
      <DateRangeForReport v-model="filters.range" label-prop="Date Range"></DateRangeForReport>
      <div class="clr"></div>
    </filter-drawer-component>
    <el-table
      :key="renderKey"
      v-loading="loading"
      :data="invoices"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
    >
      <el-table-column :label="getTaxonomy('invoice') + ' No.'" min-width="100px" prop="invoice">
        <template v-slot="{ row }">
          <b>#{{ row.invoice_code }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Buyer Department" min-width="100px" prop="invoice">
        <template v-slot="{ row }">
          <b>{{ row.buyer_name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Seller Department" min-width="100px" prop="invoice">
        <template v-slot="{ row }">
          <b>{{ row.seller_name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Total" min-width="80px" prop="invoice">
        <template v-slot="{ row }">
          <a data-toggle="tooltip" href="#!" @click.prevent="(isShowAmountDetails = true), (invoiceDetails = row)">
            <b>{{ row.payable }}</b>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="Due" min-width="80px" prop="invoice">
        <template v-slot="{ row }">
          <b>{{ row.remainder }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Paid" min-width="70px" prop="invoice">
        <div slot-scope="{ row }">
          <a data-toggle="tooltip" href="#!" @click.prevent="(isShowPaymentDetails = true), (invoiceDetails = row)">
            <b :style="row.total_paid > 0 ? 'color: green' : ''">
              {{ row.payable - row.remainder }}
            </b>
          </a>
        </div>
      </el-table-column>
      <el-table-column label="Status" min-width="100px" prop="invoice">
        <template v-slot="{ row }">
          <b v-if="row.latest_status"> {{ _.startCase(row.latest_status.replace(/([A-Z])/g, ' $1').trim()) }} </b>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80px">
        <div slot-scope="{ row }" class="table-actions">
          <base-button outline size="sm" @click="(isActiveInvoiceDetails = true), (currentInvoice = row)" type="info">Details </base-button>
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      v-if="invoices.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      class="mt-3"
      :disabled="loading"
    ></base-pagination>

    <DispatchInvoiceDetails
      :is-active.sync="isActiveInvoiceDetails"
      :title="getTaxonomy('invoice')"
      @updatedStatus="entityUpdated($event)"
      :current-entity.sync="currentInvoice"
    >
    </DispatchInvoiceDetails>

    <invoice-amount-details-form v-if="isShowAmountDetails"
      :invoice-details.sync="invoiceDetails"
      :is-show-amount-details.sync="isShowAmountDetails"
    ></invoice-amount-details-form>

    <invoice-payment-details-form v-if="isShowPaymentDetails"
      :invoice-details.sync="invoiceDetails"
      :is-show-payment-details.sync="isShowPaymentDetails"
    ></invoice-payment-details-form>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip } from 'element-ui';
import GIFModal from '@/components/tour/GIFModal.vue';
import FilterDrawer from '@/components/FilterDrawer.vue';
import InvoiceDetails from '@/views/order/invoice/InvoiceDetails.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import { Invoice } from '@/intefaces/Invoice';
import InvoiceAmountDetailsForm from '@/views/order/invoice/InvoiceAmountDetailsForm.vue';
import InvoicePaymentDetailsForm from '@/views/order/invoice/InvoicePaymentDetailsForm.vue';
import OrderRevision from '@/intefaces/OrderRevision';
import RevisionList from '@/views/order/RevisionList.vue';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import { Permission as PermissionEnum } from '@/enums/Permission';
import DispatchInvoiceDetails from '@/views/order/readyToDispatch/DispatchInvoiceDetails.vue';
import FilterDrawerComponent from '@/components/FilterDrawerComponent.vue';
import DateRangeForReport from '@/components/DateRangeForReports.vue';
import { QueryBuilder } from '@/classes/QueryBuilder';
import moment from 'moment';

@Component({
  components: {
    FilterDrawer,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    GIFModal,
    InvoiceDetails,
    InvoiceAmountDetailsForm,
    InvoicePaymentDetailsForm,
    RevisionList,
    DispatchInvoiceDetails,
    FilterDrawerComponent,
    DateRangeForReport
  }
})
export default class InvoiceList extends Mixins(PaginationComponentMixin, TaxonomyMixin) {
  private invoices: Invoice[] = [];
  private currentInvoice: any = [];
  private allRevision: OrderRevision[] = [];
  private invoiceDetails: Invoice[] = [];
  private showGIF: boolean = false;
  private demoTourEntity: string = 'invoice';
  private isShowAmountDetails: boolean = false;
  private isShowPaymentDetails: boolean = false;
  private isActiveInvoiceDetails: boolean = false;
  private isFilterModelActive = false;
  private renderKey: number = 0;
  private queryBuilder = new QueryBuilder();

  private form = {
    status: '',
    remarks: ''
  };
  private GIFs: Array<any> = [
    {
      label: 'Create a invoice',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a invoice',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a invoice',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of invoice';

  public filters: any = {
    range: moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD')
  };
  get permissionEnum() {
    return PermissionEnum;
  }

  entityUpdated(entity: Invoice): void {
    this.invoices.splice(
      this.invoices.findIndex(type => type.id == entity.id),
      1
    );
    this.isActiveInvoiceDetails = false;
  }
  onFilterSubmit() {
    this.isFilterModelActive = false;
  }
  resetBtn() {
    this.filters.range = '';
  }

  @Watch('invoiceDetails')
  async updateRenderKey() {
    await this.fetchInvoices();
    this.renderKey += 1;
  }

  @Watch('filters.range', { deep: true })
  onChangeSubmissionDateRange(value: string) {
    this.queryBuilder.addListener('created_between', value);
  }

  @Watch('pagination.currentPage')
  @Watch('queryBuilder.watch')
  async fetchInvoices() {
    this.loading = true;
    try {
      let { data } = await this.$http.get(
        this.$api3(
          `/invoices${
            this.queryBuilder.getFilters(true) ? this.queryBuilder.getFilters(true) : '?created_between=' + this.filters.range
          }&latest_status=readyToDispatch&with=payments&page=${this.pagination.currentPage}`
        )
      );
      this.setPagination(data);
      this.invoices = data.invoices;
    } catch (e) {
      this.$notify({ title: 'Something Went Wrong!', message: 'Please Try again.', type: 'error' });
    } finally {
      this.loading = false;
    }
  }

  async created() {
    await this.fetchInvoices();
  }
}
</script>
<style lang="css">
.clr {
  clear: both !important;
}
</style>
