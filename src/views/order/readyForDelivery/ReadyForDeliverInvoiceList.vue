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
      v-loading="loading"
      :data="invoices"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
    >
      <el-table-column :label="getTaxonomy('invoice') + ' No.'" min-width="100px" prop="invoice">
        <template v-slot="{ row }">
          <b>#{{ row.invoice_code  }}</b>
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
          <b v-if="row.latest_status"> {{ _.startCase(row.latest_status.replace(/([A-Z])/g, ' $1').trim()) }} </b>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="120px">
        <div slot-scope="{ row }" class="table-actions">
          <base-button outline size="sm" @click="(isActiveInvoiceDetails = true), (currentInvoice = row)" type="info">
            Details
          </base-button>
          <base-button v-if="row.latest_status != `delivered`" outline size="sm" @click="(isDelivery = true), onEdit(row)" v-can="permissionEnum.APPROVE_READY_TO_DELIVERY" type="success">
            Delivery
          </base-button>
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

    <ReadyForDeliveryInvoiceDetails
      :is-active.sync="isActiveInvoiceDetails"
      :title="getTaxonomy('invoice')"
      @updatedStatus="entityUpdated($event)"
      :current-entity.sync="currentInvoice"
      @triggerDeliverBtn="(isDelivery = true), onEdit(currentInvoice)"
    ></ReadyForDeliveryInvoiceDetails>

    <invoice-amount-details-form v-if="isShowAmountDetails"
      :invoice-details.sync="invoiceDetails"
      :is-show-amount-details.sync="isShowAmountDetails"
    ></invoice-amount-details-form>

    <invoice-payment-details-form v-if="isShowPaymentDetails"
      :invoice-details.sync="invoiceDetails"
      :is-show-payment-details.sync="isShowPaymentDetails"
    ></invoice-payment-details-form>

    <requisition-form
      :current-entity="currentInvoice"
      :form="formDelivery"
      :is-active.sync="isActive"
      :is-delivery.sync="isDelivery"
      :is-update.sync="isUpdate"
      :product="product"
      :update-amount-count.sync="updateAmountCount"
      @created="afterCreateDelivery($event)"
    ></requisition-form>

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
import RequisitionForm from '@/views/order/requisition/RequisitionForm.vue';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import { Permission as PermissionEnum } from '@/enums/Permission';
import ReadyForDeliveryInvoiceDetails from '@/views/order/readyForDelivery/ReadyForDeliveryInvoiceDetails.vue';
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
    RequisitionForm,
    ReadyForDeliveryInvoiceDetails,
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
  private isViewRevision: boolean = false;
  private isInvoiceForRevision: boolean = false;
  private isUpdate: boolean = false;
  private isActive: boolean = false;
  private isDelivery: boolean = false;
  private updateAmountCount: boolean = false;
  private isFilterModelActive = false;
  private queryBuilder = new QueryBuilder();

  private form = {
    status: '',
    remarks: ''
  };
  private formDelivery = {
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

  UpdateLatestStatusForInvoice(row: Invoice) {
    this.$http.post(this.$api(`/invoices/${row.id}/statuses`), this.form).then(response => {
      this.$notify({
        title: 'Success',
        message: 'Successfully Changed',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
      this.invoices.splice(
        this.invoices.findIndex(invoice => invoice.id == response.data.invoice.id),
        1
      );
    });
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

  async onEdit(row: any) {
    let { data } = await this.$http.get(this.$api3(`/invoice-products/${row.id}`));

    this.currentInvoice = row;
    this.formDelivery = {
      departmentId: row.buyer_id,
      sellerId: row.seller_id,
      discount: row.discount,
      promotionalDiscount: row.promotional_discount,
      expectedDeliveryDate: row.expected_delivery_date,
      paid: '',
      type: this.checkPromotionOn(
        data.invoiceProducts[0].promotion ? data.invoiceProducts[0].promotion : '',
        data.invoiceProducts[0].promotion && data.invoiceProducts[0].promotion.promotion_on ? data.invoiceProducts[0].promotion.promotion_on : ''
      ),
      productableId: data.invoiceProducts[0].promotion ? data.invoiceProducts[0].promotion.promotionable_id : '',
      badgeDiscount: row.badge_percentage
    };
    this.product = [];
    [data.invoiceProducts].forEach((product: any) => {
      product.map((singleProduct: any) => {
        this.product.push({
          product_id: singleProduct.product_id,
          price: singleProduct.price,
          qty: singleProduct.qty,
          free_with: singleProduct.free_with,
          promotion_discount: singleProduct.promotion_discount,
          promotion_id: singleProduct.promotion != null ? singleProduct.promotion.id : '',
          fullName: singleProduct.product.full_name
        });
      });
    });
    this.isActive = true;
    this.isUpdate = true;
    this.updateAmountCount = true;
  }

  afterCreateDelivery(event: any) {
    this.isActive = false;
    this.isDelivery = false;
    this.form = {
      status: 'delivered',
      remarks: 'Order is Delivered'
    };
    this.UpdateLatestStatusForInvoice(this.currentInvoice);
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
          }&latest_status=ontheway&with=payments,products.product&page=${this.pagination.currentPage}`
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
}
</script>
<style lang="css">
.clr {
  clear: both !important;
}
</style>
