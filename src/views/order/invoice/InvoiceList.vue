<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">{{ getTaxonomy('invoice') }}(s)</h3>
            <el-tooltip class="ml-3" :content="'Monitor and get ' + getTaxonomy('invoice') + ' for your business'" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <!--          <el-tooltip v-if="this.selectedRows.length > 0" content="Print" placement="top">-->
          <base-dropdown v-if="selectedRows.length > 0 || allItemSelected" :menuOnRight="true" style="margin: 0 15px">
            <a slot="title-container" class="dropdown-toggle text-primary" href="#!" type="secondary" @click.prevent>
              <i class="fa fa-print"></i>
            </a>
            <a class="dropdown-item" href="#" @click.prevent="printInvoices">Regular Print Invoices</a>
            <a class="dropdown-item" href="#" @click.prevent="printPOSInvoices">POS Print Invoices</a>
            <a class="dropdown-item" href="#" @click.prevent="showGenerateInvoiceModal = !showGenerateInvoiceModal">
              Generate Advance Invoices
            </a>
            <a class="dropdown-item" href="#" @click.prevent="downloadInvoices">Download Invoices</a>
            <!--            <a class="dropdown-item" href="#">Product Product Summary</a>-->
          </base-dropdown>
          <!--          </el-tooltip>-->

          <!--                    <el-tooltip content="Filters" placement="top">-->
          <base-button icon size="sm" type="primary" @click="isFilterModelActive ? (isFilterModelActive = false) : (isFilterModelActive = true)">
            <span class="btn-inner--text">Filters</span>
            <span class="btn-inner--icon">
              <i class="fas fa-filter"></i>
            </span>
          </base-button>
          <!--                    </el-tooltip>-->
        </div>
      </div>
      <FilterDrawer :is-filter-model-active.sync="isFilterModelActive" :title="getTaxonomy('invoice') + ' Filter'" @filters="invoiceFilter = $event">
      </FilterDrawer>
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
      :key="renderKey"
      ref="multipleTable"
      v-loading="loading"
      :data="invoices"
      :row-key="getRowKeys"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      @selection-change="handleSelectionChange"
    >
      <el-table-column :reserve-selection="true" type="selection" width="55"></el-table-column>
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
      <el-table-column label="Paid" min-width="80px" prop="invoice">
        <div slot-scope="{ row }">
          <a data-toggle="tooltip" href="#!" @click.prevent="(isShowPaymentDetails = true), (invoiceDetails = row)">
            <b :style="row.total_paid > 0 ? 'color: green' : ''">
              {{ row.payable - row.remainder }}
            </b>
          </a>
        </div>
      </el-table-column>
      <el-table-column label="Status" min-width="80px" prop="invoice">
        <template v-slot="{ row }">
          <b> {{ _.startCase(row.latest_status) }} </b>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80px">
        <div slot-scope="{ row }" class="table-actions">
          <base-button outline size="sm" @click="(isActive = true), (currentInvoice = row)" type="info">Details </base-button>
        </div>
      </el-table-column>
    </el-table>

    <CursorPagination v-model="currentCursor" :next-page-cursor="nextPageCursor" :prev-page-cursor="prevPageCursor" :disabled="loading" />

    <invoice-amount-details-form
      :invoice-details.sync="invoiceDetails"
      :is-show-amount-details.sync="isShowAmountDetails"
      v-if="isShowAmountDetails"
    ></invoice-amount-details-form>

    <invoice-payment-details-form
      :invoice-details.sync="invoiceDetails"
      :is-show-payment-details.sync="isShowPaymentDetails"
      v-if="isShowPaymentDetails"
    ></invoice-payment-details-form>

    <BaseInvoiceDetails
      v-if="isActive"
      :is-active.sync="isActive"
      :title="getTaxonomy('invoice')"
      @updatedStatus="entityUpdated($event)"
      @editedEntity="updateInvoice($event)"
      :current-entity.sync="currentInvoice"
    >
    </BaseInvoiceDetails>

    <modal :show.sync="generating" :showClose="false">
      <template slot="header">
        <h5 class="modal-title">Printing in progress ....</h5>
      </template>
    </modal>

    <modal :show="showGenerateInvoiceModal" @close="showGenerateInvoiceModal = false">
      <template slot="header">
        <h5 class="modal-title">Generate Report</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <base-input label="Recipient (Optional)" v-model="recipient" :placeholder="$user ? $user.email : ''"></base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="showGenerateInvoiceModal = false" type="secondary">Close</base-button>
        <base-button :loading="loading" type="primary" @click.prevent="generateAdvanceInvoices">
          <i class="fa fa-envelope"></i>
        </base-button>
      </template>
    </modal>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import RequisitionForm from '@/views/order/requisition/RequisitionForm.vue';
import RevisionList from '@/views/order/RevisionList.vue';
import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip } from 'element-ui';
import InvoiceDetails from '@/views/order/invoice/InvoiceDetails.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import InvoiceFilters from '@/views/order/invoice/InvoiceFilters.vue';
import { Invoice } from '@/intefaces/Invoice';
import InvoiceAmountDetailsForm from '@/views/order/invoice/InvoiceAmountDetailsForm.vue';
import InvoicePaymentDetailsForm from '@/views/order/invoice/InvoicePaymentDetailsForm.vue';
import InvoiceFilterDrawer from '@/views/order/invoice/InoviceFilterDrawer.vue';
import OrderRevision from '@/intefaces/OrderRevision';
import GIFModal from '@/components/tour/GIFModal.vue';
import MultiSelectRow from '@/mixins/MultiSelectRow';
import printJS from 'print-js';
import FilterDrawer from '@/components/FilterDrawer.vue';
import { ElTable } from 'element-ui/types/table';
import InvoiceStatusDetails from '@/views/order/invoice/InvoiceStatusDetails.vue';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import { Permission as PermissionEnum } from '@/enums/Permission';
import BaseInvoiceDetails from '@/views/order/invoice/BaseInvoiceDetails.vue';
import InvoiceRevision from '@/intefaces/InvoiceRevision';
import HasCursorPaginationMixin from '@/mixins/HasCursorPagination';
import CursorPagination from '@/components/CursorPagination.vue';
import moment from 'moment';
import { QueryBuilder } from '@/classes/QueryBuilder';

import swal from 'sweetalert2';

@Component({
  components: {
    CursorPagination,
    FilterDrawer,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [ButtonGroup.name]: ButtonGroup,
    [Button.name]: Button,
    [Tag.name]: Tag,
    GIFModal,
    InvoiceDetails,
    InvoiceFilters,
    InvoiceAmountDetailsForm,
    InvoicePaymentDetailsForm,
    InvoiceFilterDrawer,
    RequisitionForm,
    RevisionList,
    InvoiceStatusDetails,
    BaseInvoiceDetails
  }
})
export default class InvoiceList extends Mixins(HasCursorPaginationMixin, MultiSelectRow, TaxonomyMixin) {
  public invoiceFilter: string = '';
  public isInvoiceStatusUpdate: boolean = false;
  public renderKey: number = 0;
  private invoices: Invoice[] = [];
  private invoiceDetails: Invoice[] = [];
  private isShowAmountDetails: boolean = false;
  private isShowPaymentDetails: boolean = false;
  private isActiveInvoiceDetails: boolean = false;
  private isFilterModelActive: boolean = false;
  private isStatusUpdateActive: boolean = false;
  private currentInvoice: any = [];
  private isInvoice: boolean = false;
  private isActive: boolean = false;
  private isUpdate: boolean = false;
  private isViewRevision: boolean = false;
  private updateAmountCount: boolean = false;
  private allRevision: OrderRevision[] = [];
  private lastestRevision: OrderRevision[] = [];
  private isInvoiceForRevision: boolean = false;
  private isDelivery: boolean = false;
  private currentDelivery: any = '';
  private generating: boolean = false;
  private showGIF: boolean = false;
  private demoTourEntity: string = 'invoice';
  private selectedButton: string = 'Today';
  private queryBuilder: QueryBuilder = new QueryBuilder();
  private recipient: string = '';
  private showGenerateInvoiceModal: boolean = false;
  public filterInvoiceList: any = [];
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

  get permissionEnum() {
    return PermissionEnum;
  }

  @Watch('isViewRevision')
  getRevision() {
    this.$http.get(this.$api(`/invoices/${this.currentInvoice.id}/revisions`)).then(response => {
      this.allRevision = response.data.revisions;
      this.lastestRevision = response.data.revisions[0];
    });
  }

  @Watch('invoiceDetails')
  async updateRenderKey() {
    // await this.fetchInvoices(null);
    this.renderKey += 1;
  }

  updateInvoice(event: InvoiceRevision) {
    this.$http.get(this.$api(`/invoices/${event.invoice_id}`)).then(response => {
      this.invoices.splice(
        this.invoices.findIndex((invoice: any) => invoice.id == response.data.invoice.id),
        1,
        response.data.invoice
      );
    });
  }

  entityUpdated(entity: Invoice): void {
    this.invoices.splice(
      this.invoices.findIndex(type => type.id == entity.id),
      1,
      entity
    );
    this.isActive = false;
  }

  createDelivery(event: any) {
    this.isActive = false;
    this.isDelivery = false;
    this.currentDelivery = true;
  }

  @Watch('invoiceFilter')
  onChangeInvoiceFilter() {
    this.fetchInvoices(null);
    (this.$refs.multipleTable as ElTable).clearSelection();
  }

  @Watch('currentCursor')
  async fetchInvoices(cursor: string | null) {
    this.loading = true;
    try {
      let { data } = await this.$http.get(
        this.$api3(`/invoices-info${cursor ? '?cursor=' + cursor + '&' : ''}${cursor ? this.invoiceFilter : '?' + this.invoiceFilter}`)
        // this.$api2(`/invoices?with=payments&page=${this.pagination.currentPage}${this.invoiceFilter ? '&' + this.invoiceFilter : ''}`)
      );
      this.setPagination(data);
      this.invoices = [];
      this.filterInvoiceList = data.data;
      this.filterInvoiceList.map((singleInvoice: any) => {
        if (singleInvoice.payable > 0) {
          this.invoices.push(singleInvoice);
        }
      });
    } catch (e) {
      this.$notify({ title: 'Something Went Wrong!', message: 'Please Try again.', type: 'error' });
    } finally {
      this.loading = false;
    }
  }

  async invoicesObjectUrl(pos = false) {
    let posParams = '';
    if (pos) {
      posParams = this.invoiceFilter ? '&pos=1' : '?pos=1';
    }
    let { data } = await this.$http.post(
      this.$api(`/pdf/invoices${this.invoiceFilter ? '?' + this.invoiceFilter : ''}${posParams}`),
      { invoice_id: this.allItemSelected ? null : this.selectedRows.map(value => value.id).join(',') },
      {
        responseType: 'blob'
      }
    );
    const blob = await new Blob([data], { type: 'application/pdf' });
    let fileURL = await URL.createObjectURL(blob);
    return fileURL;
  }

  async printInvoices() {
    this.generating = true;
    try {
      await printJS({ printable: await this.invoicesObjectUrl() });
    } catch (e) {
      this.$notify({ title: 'Something Wrong!', message: 'Please Try again.', type: 'error' });
    } finally {
      this.generating = false;
    }
  }

  async printPOSInvoices() {
    this.generating = true;
    try {
      await printJS({ printable: await this.invoicesObjectUrl(true) });
    } catch (e) {
      this.$notify({ title: 'Something Wrong!', message: 'Please Try again.', type: 'error' });
    } finally {
      this.generating = false;
    }
  }

  async generateAdvanceInvoices() {
    this.generating = true;
    await this.queryBuilder.setParam('recipient', this.recipient);
    if (!this.allItemSelected) {
      await this.queryBuilder.setParam(
        'invoice_id',
        this.selectedRows.map(invoice => invoice.id)
      );
    }
    try {
      await this.$http.post(this.$api(`/pdf/advance-invoices${this.queryBuilder.getFilters(true)}&${this.invoiceFilter}`));
      await swal.fire('Report Sent', 'You will receive the report within a few minutes.', 'success');
    } catch (e) {
      this.$notify({ title: 'Something Wrong!', message: 'Please Try again.', type: 'error' });
    } finally {
      this.generating = false;
      this.showGenerateInvoiceModal = false;
      await this.queryBuilder.setParam('recipient', null);
      await this.queryBuilder.setParam('invoice_id', null);
    }
  }

  checkPromotionOn(promotion: string, promotion_on: string) {
    if (promotion) {
      if (promotion_on != 'all') {
        return promotion_on;
      } else {
        return 'product';
      }
    } else {
      return 'product';
    }
  }

  async downloadInvoices() {
    this.loading = true;
    try {
      let { data, headers } = await this.$http.get(
        this.$api(
          `/invoice-bulk-download?type=csv${this.allItemSelected ? '' : '&id=' + this.selectedRows.map(value => value.id)}&${
            this.invoiceFilter ? this.invoiceFilter : ''
          }`
        ),
        {
          responseType: 'arraybuffer'
        }
      );
      const blob = await new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = await URL.createObjectURL(blob);
      link.download = this.$getFileNameFromContentDisposition(headers);
      link.click();
    } catch (e) {
      this.$notify({ type: 'warning', message: 'Unable to download.', title: 'Something went wrong!' });
    } finally {
      this.loading = false;
    }
  }
}
</script>
