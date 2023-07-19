<template>
  <section>
    <div class="card">
      <div class="card-header border-0">
        <div class="row">
          <div class="col-6">
            <div class="form-inline">
              <h3 class="mb-0">Payments</h3>
              <el-tooltip class="ml-3" content="Manage advance and invoice payment for your company" placement="right">
                <i class="fas fa-info-circle" style="color: #808080; font-size: 18px"></i>
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
            <el-tooltip content="Add New Payment" placement="top" v-can="permissionEnum.CREATE_PAYMENT">
              <base-button icon size="sm" type="primary" @click="isActive = true">
                <span class="btn-inner--icon">
                  <i class="fas fa-plus"></i>
                </span>
                <span class="btn-inner--text">Create</span>
              </base-button>
            </el-tooltip>
          </div>
          <filter-drawer-component
            v-if="isFilterModelActive"
            :visible.sync="isFilterModelActive"
            direction="rtl"
            title="Payment Invoice FIlter"
            @closeBtn="onFilterSubmit"
            @resetBtn="resetBtn"
          >
            <div class="clr"></div>
            <base-input label="Invoice Code" v-model="filters.invoiceCode" name="invoicecode" placeholder="e.g. CAD003"></base-input>
            <DateRangeForReport v-model="filters.range" label-prop="Date Range"></DateRangeForReport>
            <!-- <base-input label="Order Code" v-model="filters.orderCode" name="ordercode" placeholder="e.g. CAD002"></base-input> -->
            <div class="clr"></div>
          </filter-drawer-component>
          <!--                Create and update Modal            -->
          <CreatePaymentForm :is-active.sync="isActive"></CreatePaymentForm>
          <!--               Create and update Modal           -->
        </div>
      </div>
      <el-table v-loading="loading" :data="entities" class="table-responsive  table-flush table-striped" header-row-class-name="thead-light">
        <el-table-column label="SL" min-width="100px" prop="name" sortable type="index"> </el-table-column>
        <el-table-column :label="getTaxonomy('invoice') + 'Code'" align="center" min-width="150px" prop="code" sortable>
          <template v-slot="{ row }">
            {{ row.code }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Last Payment Date" min-width="180px" prop="territory" sortable>
          <template v-slot="{ row }">
            {{ row.lastPaymentTimeStamp }}
            <br />
          </template>
        </el-table-column>
        <el-table-column :label="getTaxonomy('invoice') + ' Date'" align="center" min-width="180px" prop="department_type">
          <template v-slot="{ row }">{{ row.invoice_date }}</template>
        </el-table-column>
        <el-table-column align="center" label="Collected By" min-width="180px" prop="badge">
          <template v-slot="{ row }">
            <b>{{ row.creator_name }}</b>
          </template>
        </el-table-column>
        <el-table-column :label="getTaxonomy('department') + ' Id'" align="center" min-width="180px" prop="created_at" sortable>
          <template v-slot="{ row }">
            <b v-if="row.buyer_meta">{{ row.buyer.code }}</b>
            <b v-else>-</b>
          </template>
        </el-table-column>
        <el-table-column :label="getTaxonomy('department') + ' Name'" align="center" min-width="180px" prop="created_at" sortable>
          <template v-slot="{ row }">
            <b v-if="row.buyer_meta">{{ row.buyer.name }}</b>
            <b v-else>-</b>
          </template>
        </el-table-column>

        <el-table-column :label="getTaxonomy('invoice') + ' Amt.'" align="center" min-width="180px" prop="created_at" sortable>
          <template v-slot="{ row }">
            <b v-if="row.payable">{{ row.payable }}</b>
            <b v-else> - </b>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Paid Amt." min-width="180px" prop="created_at" sortable>
          <template v-slot="{ row }">
            <b v-if="row.payable">{{ row.payable - row.remainder }}</b>
            <b v-else> - </b>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Due" min-width="180px" prop="created_at" sortable>
          <template v-slot="{ row }">
            <b v-if="row.remainder || row.remainder == 0.0">{{ row.remainder }}</b>
            <b v-else> - </b>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Status" min-width="180px" prop="created_at" sortable>
          <template v-slot="{ row }">
            <b v-if="row.status">{{ row.status }}</b>
            <b v-else> - </b>
          </template>
        </el-table-column>

        <!-- <el-table-column align="center" label="Action" min-width="180px" prop="created_at" sortable>
          <template v-slot="{ row }">
            <a class="table-action" data-original-title="View Permission List" data-toggle="tooltip" href="#!" @click.prevent="onDetails(row)">
              <i class="fas fa-eye"></i>
            </a>
          </template>
        </el-table-column> -->
      </el-table>
      <base-pagination
        v-if="entities.length > 0"
        v-model="pagination.currentPage"
        :perPage="pagination.entityPerPage"
        :total="pagination.totalEntity"
        align="center"
        class="mt-3"
        :disabled="loading"
      ></base-pagination>
      <!--        Payment Confirm Modal-->

      <modal :show.sync="showConfirmModal">
        <template>
          <h5 id="exampleModalLabel1" class="modal-title">Are you sure you want to delete this ?</h5>
        </template>
        <template slot="footer">
          <base-button type="secondary" @click="showConfirmModal = false">Close</base-button>
          <base-button type="danger" @click.prevent="deleteEntity">Confirm</base-button>
        </template>
      </modal>

      <!--        End Payment Confirm Modal     -->

      <!--        Demo Tour GIF Modal-->
      <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
    </div>
  </section>
</template>

<script lang="ts">
//@ts-ignore
import { Component, Mixins, Watch } from 'vue-property-decorator';
import Payment from '@/intefaces/Payment';
import CreatePaymentForm from '@/views/payment/CreatePaymentForm.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import GIFModal from '@/components/tour/GIFModal.vue';
import { InvoiceDTO } from '@/intefaces/Invoice';
import moment from 'moment';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import { Permission as PermissionEnum } from '@/enums/Permission';
import { QueryBuilder } from '@/classes/QueryBuilder';
import FilterDrawer from '@/components/FilterDrawer.vue';
import FilterDrawerComponent from '@/components/FilterDrawerComponent.vue';
import DateRangeForReport from '@/components/DateRangeForReports.vue';

@Component({
  components: {
    CreatePaymentForm,
    GIFModal,
    FilterDrawer,
    FilterDrawerComponent,
    DateRangeForReport
  }
})
export default class InvoiceList extends Mixins(PaginationComponentMixin, TaxonomyMixin) {
  loading = false;
  private entities: InvoiceDTO[] = [];
  private showConfirmModal: boolean = false;
  private isActive: boolean = false;
  private currentEntity!: InvoiceDTO;
  private isFilterModelActive = false;
  private form: Payment = {
    advance: false,
    amount: null,
    created_by: 0,
    department_id: null,
    invoices: [],
    method: null,
    paid_at: null,
    seller_id: null
  };
  private filters: any = {
    invoiceCode: '',
    orderCode: '',
    range: ''
  };
  private showGIF: boolean = false;
  private demoTourEntity: string = 'paymentList';
  private GIFs: Array<any> = [
    {
      label: 'Create a payment',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a payment',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a payment',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of payment';
  private queryBuilder = new QueryBuilder();

  get permissionEnum() {
    return PermissionEnum;
  }

  mounted() {
    this.fetchEntity();
  }

  onDetails(row: any) {
    this.$router.push({ name: 'invoice-payments', params: { invoiceId: row.id, currentInvoice: row } });
  }
  onFilterSubmit() {
    this.isFilterModelActive = false;
  }
  resetBtn() {
    this.filters.invoiceCode = '';
    // this.filters.orderCode = '';
    this.filters.range = '';
  }
  @Watch('filters.invoiceCode', { deep: true })
  onChangePhoneFiler(newVal: string) {
    this.queryBuilder.addListener('invoicecode', newVal);
  }
  @Watch('filters.range', { deep: true })
  onChangeSubmissionDateRange(value: string) {
    this.queryBuilder.addListener('created_between', value);
  }

  @Watch('pagination.currentPage')
  @Watch('queryBuilder.watch')
  async fetchEntity() {
    this.loading = true;
    let { data } = await this.$http.get(
      this.$api(
        `/invoices${this.queryBuilder.getFilters(true) ? this.queryBuilder.getFilters(true) : '?'}&page=${
          this.pagination.currentPage
        }&with=payments,buyer`
      )
    );
    this.entities = data.invoices.map(
      (e: any) =>
        new InvoiceDTO(
          e.amount,
          e.buyer_id,
          e.buyer,
          e.code,
          e.delivered,
          e.discount,
          e.id,
          e.invoiceable_id,
          e.payable,
          e.promotion_discount,
          e.remainder,
          e.seller_id,
          e.created_at,
          e.status,
          e.latest_status,
          e.payments.length > 0 ? moment(e.payments[0].paid_at).fromNow() : '',
          e.initiator,
          e.order_id,
          e.latest_revision,
          e.sales_return,
          e.buyer_meta,
          e.seller_meta,
          e.creator_meta,
          e.buyer_name,
          e.seller_name,
          e.creator_name
        )
    );
    // moment().diff(moment(lastCheckinTime).format('lll'), 'minute');
    this.setPagination(data);
    this.loading = false;
  }
}
</script>
