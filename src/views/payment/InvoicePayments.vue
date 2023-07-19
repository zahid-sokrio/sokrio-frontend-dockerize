<template>
  <section>
    <div class="card">
      <div class="card-header border-0">
        <div class="row justify-content-between">
          <div class="col-6">
            <ul class="list-group list-group-flush list my--3">
              <li class="list-group-item px-0">
                <div class="row align-items-center">
                  <div class="col-auto ">
                    <el-button @click="$router.back()" icon="fa fa-arrow-left" circle> </el-button>
                  </div>
                  <div class="col ml--2">
                    <h4 class="mb-0">{{ currentInvoice ? currentInvoice.code : '' }}</h4>
                    <small>List of Payments</small>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="col-auto ">
            <div class="row mr-5">
              <el-button @click="showInvoiceDetails">{{ getTaxonomy('invoice') }} Details</el-button>
              <el-button @click="showLastDues">Last 5 Dues List</el-button>

            </div>
          </div>

        </div>
      </div>


      <div class="row " >


        <div  class="col-5 card mx-6 mt-3">


          <div class="pt-4">

            <b class="text-primary">{{ getTaxonomy('department') }} Info</b>
          </div>

          <hr class="dashed">
            <div class="row  px-4 pb-5 ">
              <div class="col-3" style="font-weight: 600;">
                ID:
              </div>
                <div  class="ml-4 col-auto" v-if="currentInvoice.buyer">
                  {{  currentInvoice? currentInvoice.buyer.code :''}}
                </div>


            </div>
          <div class="row  px-4 pb-5">
            <div class="col-3" style="font-weight: 600;">
              Name:
            </div>
            <div class="ml-4 col-auto" v-if="currentInvoice.buyer">
              {{ currentInvoice.buyer ? currentInvoice.buyer.name : '' }}
            </div>
          </div>
          <div class="row  px-4 pb-5">
            <div class="col-3" style="font-weight: 600;">
              Address:
            </div>
            <div class="ml-4 col-auto" v-if="currentInvoice.buyer">
              {{currentInvoice ? currentInvoice.buyer.address : ''}}
            </div>
          </div>
          <div class="row  px-4 pb-5">
            <div class="col-3" style="font-weight: 600;">
              Type:
            </div>
            <div class="ml-4 col-auto">
              {{loading==false?  departmentType: ''}}

            </div>
          </div>

          <div class="row  px-4 pb-5">
            <div class="col-3" style="font-weight: 600;">
              Territory:
            </div>
            <div class="ml-4 col-auto" v-if="currentInvoice.buyer">
              {{ currentInvoice.buyer ? currentInvoice.buyer.territory.name : '-' }}

            </div>
          </div>

          <div class="row  px-4 pb-5">
            <div class="col-3" style="font-weight: 600;">
              Badge Type:
            </div>
            <div class="ml-4 col-auto" v-if="currentInvoice.buyer">
              {{ currentInvoice.buyer.badge ? currentInvoice.buyer.badge.name : '' }}
            </div>
          </div>

          <div class="row  px-4 pb-5">
            <div class="col-3" style="font-weight: 600; font-size: 14px;">
              Badge Discount:
            </div>
            <div class="ml-4 col-auto" v-if="currentInvoice.buyer">
              {{ currentInvoice.buyer.badge ? currentInvoice.buyer.badge.mrp_discount : '' }} %

            </div>
          </div>
        </div>

        <div class="col-5 card mx-6 mt-3">

          <div class="pt-4">

            <b class="text-primary">Credit Info</b>

          </div>

          <hr class="dashed">

          <div class="row  px-4 pb-5">
            <div class="col-4" style="font-weight: 600; ">
              Credit Limit:
            </div>
            <div class="ml-4 col-auto" v-if="currentInvoice.buyer">
              {{currentInvoice ?  currentInvoice.buyer.credit_limit : ''}} <span class="text-primary" >{{currency}}</span>
            </div>
          </div>


          <div class="row  px-4 pb-5">
            <div class="col-4" style="font-weight: 600; ">
              Credit Used:
            </div>
            <div class="ml-4 col-auto" v-if="currentInvoice.buyer">
              {{currentInvoice ?  currentInvoice.buyer.outstanding_balance : ''}} <span class="text-primary" >{{currency}}</span>

            </div>
          </div>


          <div class="row  px-4 pb-5">
            <div class="col-4" style="font-weight: 600; ">
              Available Credit:
            </div>
            <div class="ml-4 col-auto" v-if="currentInvoice.buyer">
              {{ currentInvoice ? currentInvoice.buyer.credit_limit - currentInvoice.buyer.outstanding_balance : '' }}
              <span class="text-primary">{{ currency }}</span>

            </div>
          </div>

        </div>

      </div>

      <div class="m-2"></div>
      <el-table v-loading="loading" class="table-responsive  table-flush table-striped"
                header-row-class-name="thead-light" :data="entities">
        <el-table-column label="Method" min-width="100px" prop="name" sortable>
          <template v-slot="{ row }">
            <b>{{ row.payment ? row.payment.method.toUpperCase() : '-' }}</b>
          </template>
        </el-table-column>

        <el-table-column label="Amount" min-width="100px" prop="name" sortable>
          <template v-slot="{ row }">
            <b>{{ row.paid }}</b>
          </template>
        </el-table-column>

        <el-table-column label="Advance" align="center" min-width="100px" prop="code" sortable>
          <template v-slot="{ row }">
            {{ row.payment ? row.payment.advance ? 'Yes' : 'No' : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="Receivable" min-width="100px" prop="receivable" sortable>
          <template v-slot="{ row }">
            <b>{{ row.payment ? row.payment.receivable : '-' }}</b>
          </template>
        </el-table-column>

        <el-table-column label="Created By" align="center" min-width="180px" prop="territory" sortable>
          <template v-slot="{ row }">
            {{ row.payment.creator ? row.payment.creator.name : '' }}
            <br/>
          </template>
        </el-table-column>
        <el-table-column label="Buyer" align="center" min-width="180px" prop="department_type">
          <template v-slot="{ row }">{{ row.payment ? row.payment.department.name : '-' }}</template>
        </el-table-column>
        <el-table-column label="Paid At" min-width="180px" prop="badge" align="center">
          <template v-slot="{ row }">
            <b v-if="row.payment.paid_at">{{ row.payment.paid_at | datetime('ll') }}</b>
            <b v-else> - </b>
          </template>
        </el-table-column>

        <el-table-column label="Cheque No" min-width="180px" prop="created_at" align="center" sortable>
          <template v-slot="{ row }">
            <b v-if="row.payment.cheque_payment">{{ row.payment.cheque_payment.cheque_no }}</b>
            <b v-else> - </b>
          </template>
        </el-table-column>


        <el-table-column label="Bank Name" min-width="180px" prop="created_at" align="center" sortable>
          <template v-slot="{ row }">
            <b v-if="row.payment.bank_payment">{{ row.payment.bank_payment.bank }}</b>
            <b> - </b>
          </template>
        </el-table-column>

        <el-table-column label="Branch Name" min-width="180px" prop="created_at" align="center" sortable>
          <template v-slot="{ row }">
            <b v-if="row.payment.bank_payment">{{ row.payment.bank_payment.branch }}</b>
            <b> - </b>
          </template>
        </el-table-column>



        <el-table-column label="Deposit Slip" min-width="180px" prop="created_at" align="center" sortable>
          <template v-slot="{ row }">
            <div v-if="row.payment.cheque_payment!=null">
              <async-image v-slot="slotProps" v-if="row.payment.cheque_payment"
                           :url="row.payment.cheque_payment.deposit_slip_url">
                <img :src="slotProps.imageSrc"/>
              </async-image>

            </div>
          </template>
        </el-table-column>


        <el-table-column min-width="120px" align="center" label="Status" sortable>
          <template v-slot="{ row }">

            <badge class="badge-dot mr-4" type="">
              <i
                :class="
                `bg-${row.status == 'pending' ? 'info': row.status== 'accepted' ? 'success': 'warning'}`"></i>
              <span class="status"> <b> {{ row.status }} </b></span>
            </badge>
          </template>
        </el-table-column>


        <el-table-column min-width="120px" align="center" prop="acceptModel">
          <div class="table-actions" slot-scope="{row}" >


            <el-popover
              placement="left"
              width="200"
              v-if="row.status == 'pending'"
              v-model='row.showPopOver'
              :disabled="row.status ==1"
              v-can="permissionEnum.APPROVE_PAYMENT"
            >
              <b class="text-sm">Are you sure to accept this?</b>

              <el-input
                type="textarea"
                :rows="2"
                placeholder="Remarks..."
                class="mt-4"

                v-model="row.remark">
              </el-input>

              <div style="text-align: right; margin: 0" class="row mt-4 justify-content-around ">

                <el-button size="mini" type="text"  @click="((row.showPopOver = false), (onSelectAction(row, 'rejected')))">Reject</el-button>
                <el-button type="primary" size="mini" @click.prevent="((row.showPopOver =false),  (onSelectAction(row, 'accepted')))">Accept</el-button>
              </div>
              <a  class="table-action"  slot="reference"   data-original-title="Edit Status">
                <i class="fas fa-edit " :style="row.status==1?'color:#cfd4e5; cursor:not-allowed;':'color:#70768e;'" ></i>
              </a>
            </el-popover>

          </div>
        </el-table-column>

      </el-table>



      <base-pagination
        class="mt-3"
        v-if="entities.length > 0"
        v-model="pagination.currentPage"
        :perPage="pagination.entityPerPage"
        :total="pagination.totalEntity"
        align="center"
        :disabled="loading"
      ></base-pagination>

      <invoice-details v-if="tInvoice!=null" :is-active.sync="isActive" :invoice-details="tInvoice" :revision="revision" :invoiced-product="tInvoiceProducts" ></invoice-details>


      <last-due-invoices v-if="lastDues!=null && isDueModalActive" :is-active.sync="isDueModalActive" :dues="lastDues"></last-due-invoices>
      <!--        Payment Confirm Modal-->

      <modal :show.sync="showConfirmModal">
        <template>
          <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
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
  import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator';
  import Payment from '@/intefaces/Payment';
  import CreatePaymentForm from '@/views/payment/CreatePaymentForm.vue';
  import PaginationComponentMixin from '@/mixins/PaginationComponent';
  import GIFModal from '@/components/tour/GIFModal.vue';
  import {Invoice, InvoiceDTO} from "@/intefaces/Invoice";
  import {Button} from "element-ui";
  import InvoiceDetails from "@/views/payment/InvoiceDetails.vue";
  import {PROPOSAL_STATUS, ProposedRoutePlanEntity} from "@/intefaces/ProposedRoutePlanModel";
  import Swal from "sweetalert2";
  import LastDueInvoices from "@/views/payment/LastDueInvoices.vue";
  import AsyncImage from "@/components/AsyncImage.vue";
  import TaxonomyMixin from "@/mixins/TaxonomyComponent";
  import { Permission as PermissionEnum } from '@/enums/Permission'

  @Component({
    components: {
      AsyncImage,
      LastDueInvoices, CreatePaymentForm, GIFModal,     [Button.name]: Button,
      InvoiceDetails,
    }
  })
  export default class InvoicePayments extends Mixins(PaginationComponentMixin, TaxonomyMixin) {

    @Prop()
    private currentInvoice?: InvoiceDTO;
    private tInvoice?: Invoice |null =null ;
    private tInvoiceProducts?: any |null =null ;
    private revision?: any | null = null;

    private entities: Payment[] = [];
    private showConfirmModal: boolean = false;
    private isActive: boolean = false;
    private isDueModalActive: boolean = false;
    private lastDues?: any|null = null;
    private currentEntity!: Payment;
    private form: Payment = {
      advance: false,
      amount: null,
      created_by: 0,
      department_id: null,
      invoices: [],
      method: null,
      paid_at: null,
      showPopOver: false
    };
    loading = false;
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
    currency:String= 'BDT';
     mounted() {
       this.fetchEntity();
       this.fetchInvoiceDetails();
       this.fetchLast5Invoices();
       this.fetchDepartmentType();
       var j = localStorage.getItem('settings')
       this.currency= j!==null?JSON.parse(j).currency : 'BDT';
    }

    get permissionEnum () {
      return PermissionEnum;
    }

    @Watch('pagination.currentPage')
    async fetchEntity() {
      this.loading = true;
      let {data} = await
        this.$http.get(this.$api(`/invoices/${this.currentInvoice?.id}/payments?page=${this.pagination.currentPage}&with=payments`));
      this.entities = data.invoicePayments;
      this.setPagination(data);
      this.loading = false;
    }

    async fetchLast5Invoices() {
      this.loading = true;
      let {data} = await this.$http.get(this.$api(`/departments/${this.currentInvoice?.buyer.id}/due-invoices`));
      this.lastDues = data;
      this.loading = false;
    }

    async fetchInvoiceDetails() {
      this.loading = true;
      let {data} = await this.$http.get(this.$api(`/invoices/${this.currentInvoice?.id}/revisions`));
      this.tInvoice = data.revisions[0].invoice;
      this.tInvoiceProducts= data.revisions[0].invoiced_products;
      this.revision = data.revisions[0];

      this.loading = false;
    }
     departmentType:String|null = null;
    async fetchDepartmentType() {
      this.loading = true;
      let {data} = await this.$http.get(this.$api(`/department-types/${this.currentInvoice?.buyer?.department_type_id}`));
      this.departmentType = data?.departmentType?.name;

      this.loading = false;
    }

    onSelectAction(row: any, status: string) {
      if (row != null) {
        this.submitPaymentApproval(status, row.invoice_id, row.payment_id, row?.remark ?? '').then(
          value => {
            this.$notify({
              title: 'Success!',
              message: 'Your operation has been succeed',
            });
            this.updatePayment(value, status);

          }
        ).catch(
          reason => {
            this.$notify({
              title: 'Failed!',
              message: "Payment is already processed",

              type: "warning"
            });
          }
        )

      }


    }


    _updatePayment(updatedPayment: any) {
      this.entities.splice(
        this.entities.findIndex(route => route.id == updatedPayment.id),
        1,
        updatedPayment
      );
    }

    updatePayment(updatedPayment: any, status: string) {
     let objIndex   = this.entities.findIndex(e=>e.id ==updatedPayment.id);
      this.entities[objIndex].status=  status;
    }

    async submitPaymentApproval(status: string, invoiceId ?: number, paymentId ?: number, remark?: string,) {
      let response = await this.$http.post(
        this.$api(`/approved-invoice-payments`), {
          "remarks": remark,
          "status": status,
          "payment_id": paymentId,
          "invoice_id": invoiceId,
        }
      );
      return response.data.approvedPayment;
    }

    entityCreated(department: Payment) {
      this.entities.unshift(department);
    }

    showInvoiceDetails(){
      this.isActive=true;

    }

    showLastDues(){
      this.isDueModalActive=true;

    }
  }
</script>
