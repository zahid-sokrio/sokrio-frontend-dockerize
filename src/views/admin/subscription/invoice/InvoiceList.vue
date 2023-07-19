<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <h3 class="mb-0">Invoices</h3>
        </div>
        <!-- <div class="col-6 text-right">
          <el-tooltip content="Add New Coupon" placement="top">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Create</span>
            </base-button>
          </el-tooltip>
        </div>-->

        <!--                Start of Create & update Modal           -->
        <!-- <create-coupon-form
          :currentEntity="isUpdate ? currentEntity : null"
          :form.sync="form"
          :is-active.sync="isActive"
          :is-update.sync="isUpdate"
          @created="entityCreated($event)"
          @updated="entityUpdated($event)"
        ></create-coupon-form>-->
        <!--                End of Create & update Modal           -->
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="invoices"
    >
      <el-table-column label="Invoice no." min-width="130px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.code }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Client" min-width="150px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.subscription.org.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Package" min-width="120px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <!-- <b
            @click.prevent="currentPackage = row.subscription.scheme_meta, isActivePackageView = true"
            style="cursor: pointer"
          >{{ row.subscription.scheme_meta.package.name }}</b>-->
          <a
            data-toggle="tooltip"
            href="#!"
            @click.prevent="currentPackage = row.subscription.scheme_meta, isActivePackageView = true"
          >
            <b v-if="row.subscription.scheme_meta">{{ row.subscription.scheme_meta.package.name }}</b>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="Created At" min-width="150px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Payment Due Date" min-width="180px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ $moment(row.created_at).add(7, 'd') | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Status" min-width="150px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b style="color: green" v-if="row.payments[0].approved_at !== null">Approved</b>
          <b style="color: #fb6340" v-if="row.payments[0].rejected_at !== null">Rejected</b>
          <b
            style="color: #11cdef"
            v-if="row.payments[0] && (!row.payments[0].rejected_at && !row.payments[0].approved_at )"
          >Payment Requested</b>
          <b style="color: red" v-if="!row.payments[0]">Unpaid</b>
          <!-- <b>{{row.payments[0].approved_at || 'Approved'}}</b> -->
          <!-- <b style="color: green" v-if="row.payments">Approved</b> -->
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center">
        <template slot-scope="scope" class="table-actions">
          <!-- <el-tooltip content="Delete" placement="top">
            <a
              href="#!"
              @click.prevent="(showDeleteModal = true), (currentEntity = row)"
              class="table-action table-action-delete"
              data-toggle="tooltip"
              data-original-title="Delete Territory Type"
            >
              <i class="fas fa-trash"></i>
            </a>
          </el-tooltip>-->
          <el-tooltip content="Invoice Details" placement="top">
            <a
              @click.prevent="isActiveInvoiceDetails = true, invoiceDetails = scope.row"
              class="table-action"
              data-original-title="invoice generate"
              data-toggle="tooltip"
              href="#!"
            >
              <i class="fas fa-link"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Manage Payment" placement="top">
            <a
              href="#!"
              @click.prevent="currentPayment = scope.row, isActivePaymentView = true, currentPaymentIndex = scope.$index "
              class="table-action"
              data-toggle="tooltip"
              data-original-title="Edit product"
            >
              <i class="far fa-credit-card"></i>
            </a>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="invoices.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>

    <!-- Show package details modal -->
    <view-package-feature :is-active.sync="isActivePackageView" :current-package="currentPackage"></view-package-feature>

    <!-- Show invoice details modal -->
    <invoice-details
      :is-active.sync="isActiveInvoiceDetails"
      :invoice-details.sync="invoiceDetails"
    ></invoice-details>

    <!-- Show manage payment modal -->
    <manage-payment
      :is-active.sync="isActivePaymentView"
      :currentPayment="currentPayment"
      @approvedAt="onApproved($event)"
      @rejectedAt="onRejected($event)"
    ></manage-payment>
    <!-- <modal :show.sync="isActivePackageView">
      <template slot="header">
        <card
          header-classes="bg-transparent"
          body-classes="px-lg-7"
          class="card-pricing border-0 text-center mb-4"
        >
          <h5 class="modal-title" id="exampleModalLabel">Package Details</h5>
          <h4
            slot="header"
            class="text-uppercase ls-1 text-primary py-3 mb-0"
          >{{currentEntity.package['name']}}</h4>
          <span class="text-muted">Trial days: {{currentEntity.package['trial_days']}} days</span>
        </card>
      </template>
      <div>...</div>
      <template slot="footer">
        <base-button type="secondary" @click="isActivePackageView = false">Close</base-button>
      </template>
    </modal>-->

    <!--    Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteEntity">Delete</base-button>
      </template>
    </modal>

    <!--        End Delete Modal     -->
  </div>
</template>
<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator';
import ViewPackageFeature from '@/views/admin/subscription/invoice/ViewPackageFeature.vue';
import ManagePayment from '@/views/admin/subscription/invoice/ManagePayment.vue';
import InvoiceDetails from '@/views/admin/subscription/invoice/InvoiceDetails.vue';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag } from 'element-ui';
import OrgInvoice from '@/intefaces/OrgInvoice';
import PaginationComponentMixin from '@/mixins/PaginationComponent';

@Component({
  components: {
    ManagePayment,
    ViewPackageFeature,
    InvoiceDetails,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
  },
})
export default class InvoiceList extends Mixins(PaginationComponentMixin) {
  private invoices: OrgInvoice[] = [];
  private invoiceDetails: OrgInvoice[] = [];
  private showDeleteModal = false;
  private isActive = false;
  private isActivePackageView: boolean = false;
  private isActiveInvoiceDetails: boolean = false;
  private isActivePaymentView: boolean = false;
  private isUpdate = false;
  private currentEntity: any = [];
  private currentPackage: any = [];
  private currentPayment: any = [];
  private currentPaymentIndex: any = null;
  private approved_at: string = '';
  // private form: Coupon = {
  //   code: '',
  //   discount: 0,
  //   expires_at: '',
  // };

  created() {
    this.fetchEntity();
  }

  // entityCreated(entity: Coupon) {
  //   this.invoices.unshift(entity);
  // }

  // entityUpdated(entity: Coupon): void {
  //   this.invoices.splice(
  //     this.invoices.findIndex((type) => type.id == entity.id),
  //     1,
  //     entity
  //   );
  // }

  // onEdit(row: Coupon) {
  //   this.isUpdate = true;
  //   this.currentEntity = row;
  //   this.form = {
  //     code: this.currentEntity.code,
  //     discount: this.currentEntity.discount,
  //     expires_at: this.currentEntity.expires_at,
  //   };
  //   this.isActive = true;
  // }

  // showPackage(row: any) {
  //   this.isActivePackageView = true;
  //   this.currentEntity = row.subscription.scheme_meta;
  // }

  @Watch('pagination.currentPage')
  fetchEntity(): void {
    this.loading = true;
    this.$http.get(this.$landLordApi(`/org-invoices?page=${this.pagination.currentPage}`)).then((response) => {
      this.invoices = response.data.orgInvoices;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  onApproved(approved_at: string) {
    this.invoices[this.currentPaymentIndex].payments[0].approved_at = approved_at;
  }

  onRejected(rejected_at: string) {
    this.invoices[this.currentPaymentIndex].payments[0].rejected_at = rejected_at;
  }
  //   deleteEntity(): void {
  //     this.$http.delete(this.$landLordApi(`/coupons/${this.currentEntity.id}`)).then((response) => {
  //       this.showDeleteModal = false;
  //       this.invoices.splice(
  //         this.invoices.findIndex((value) => value.id == this.currentEntity.id),
  //         1
  //       );
  //       this.$notify({
  //         title: 'Success',
  //         message: 'Successfully Deleted',
  //         duration: 5000,
  //         iconClass: 'ni ni-bell-55',
  //         type: 'success',
  //       });
  //     });
  //   }
}
</script>
