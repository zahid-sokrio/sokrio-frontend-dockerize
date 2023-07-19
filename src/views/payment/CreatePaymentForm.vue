<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal size="lg" :show="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">New Payment</h5>
      </template>
      <div>
        <el-row :gutter="15">
          <el-col :span="form.method == paymentTypes.METHOD_MFS ? 6 : 8">
            <base-input :rules="{ required: true }" name="method">
              <el-select placeholder="Payment Method" v-model="form.method" clearable>
                <el-option v-for="option in paymentTypes" :value="option" :label="option.toString().toUpperCase()" :key="option"></el-option>
              </el-select>
            </base-input>
          </el-col>
          <el-col v-show="form.method == paymentTypes.METHOD_MFS" :span="form.method == paymentTypes.METHOD_MFS ? 6 : 8">
            <base-input>
              <el-select placeholder="MFS Vendor" v-model="form.mfs_vendor" filterable default-first-option allow-create clearable>
                <el-option v-for="option in mfsVendors" :value="option" :label="option.toString().toUpperCase()" :key="option"></el-option>
              </el-select>
            </base-input>
          </el-col>

          <el-col :span="form.method == paymentTypes.METHOD_MFS ? 6 : 8">
            <LazyDropdown
              name="department"
              :rules="{ required: true }"
              end-point="/departments"
              searchable-key="name"
              resource-key="departments"
              v-model="form.department_id"
              :placeholder="'Department'"
            ></LazyDropdown>
          </el-col>
          <el-col :span="form.method == paymentTypes.METHOD_MFS ? 6 : 8">
            <el-tooltip
              :disabled="form.department_id && !form.advance ? true : false"
              :content="`${form.department_id ? 'Either you can select invoices or advance.' : 'Select a Department first.'}`"
              placement="top"
            >
              <InvoiceAutocomplete
                :buyer_id="form.department_id"
                :multiple="multipleInvoice"
                :status="'unpaid,partial'"
                :disabled="form.department_id && !form.advance ? false : true"
                v-model="form.invoices"
                @totalAmount="form.amount = $event, invoiceAmount = $event"
              ></InvoiceAutocomplete>
            </el-tooltip>
          </el-col>
        </el-row>

        <!---------------------------    Amount and Date // Common   ------------------------------>
        <el-row :gutter="15">
          <el-col :span="12">
            <base-input
              :rules="{ required: true, regex: /^\d+(\.\d)?\d*$/ }"
              prepend-icon="ni ni-money-coins"
              name="amount"
              v-model="form.amount"
              placeholder="Amount"
            ></base-input>
          </el-col>
          <el-col :span="12">
            <base-input prepend-icon="ni ni-calendar-grid-58" name="expires_at">
              <flat-picker
                placeholder="Paid At"
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-control datepicker"
                :value="form.paid_at"
                @input="form.paid_at = $event + ' 00:00:00'"
              >
              </flat-picker>
            </base-input>
          </el-col>
        </el-row>

        <!------------------------METHOD_CHEQUE  || METHOD_BANK  ||  METHOD_MFS   && METHOD != METHOD_CASH---------------------->
        <transition name="el-fade-in-linear">
          <el-row
            :gutter="15"
            v-show="form.method === paymentTypes.METHOD_CHEQUE || form.method === paymentTypes.METHOD_BANK || form.method === paymentTypes.METHOD_MFS"
          >
            <el-col :span="8">
              <base-input
                prepend-icon="ni ni-circle-08"
                name="txn no"
                :rules="{ required_if: form.method != paymentTypes.METHOD_CASH }"
                v-model="form.ac_holder"
                placeholder="Account Holder"
              ></base-input>
            </el-col>
            <el-col :span="8">
              <base-input
                prepend-icon="fa fa-university"
                name="amount"
                :rules="{ required_if: form.method != paymentTypes.METHOD_CASH }"
                v-model="form.ac_no"
                placeholder="Account No"
              ></base-input>
            </el-col>
            <el-col :span="8">
              <base-input
                prepend-icon="ni ni-spaceship"
                name="txn no"
                :rules="{ required_if: form.method != paymentTypes.METHOD_CASH }"
                v-model="form.txn_no"
                placeholder="Transaction No."
              ></base-input>
            </el-col>
          </el-row>
        </transition>
        <!------------------------METHOD_BANK || METHOD_CHEQUE---------------------->
        <transition name="el-fade-in-linear">
          <el-row :gutter="15" v-show="form.method == paymentTypes.METHOD_CHEQUE || form.method == paymentTypes.METHOD_BANK">
            <el-col :span="12">
              <base-input
                prepend-icon="fa fa-university"
                name="txn no"
                :rules="{ required_if: form.method == paymentTypes.METHOD_CHEQUE || form.method == paymentTypes.METHOD_BANK }"
                v-model="form.bank"
                placeholder="Bank Name"
              ></base-input>
            </el-col>
            <el-col :span="12">
              <base-input
                prepend-icon="fa fa-tag"
                name="txn no"
                :rules="{ required_if: form.method == paymentTypes.METHOD_CHEQUE || form.method == paymentTypes.METHOD_BANK }"
                v-model="form.branch"
                placeholder="Branch"
              ></base-input>
            </el-col>
          </el-row>
        </transition>
        <!------------------------METHOD_CHEQUE---------------------->
        <transition name="el-fade-in-linear">
          <el-row :gutter="15" v-show="form.method && form.method == paymentTypes.METHOD_CHEQUE">
            <el-col :span="12">
              <el-row>
                <base-input
                  prepend-icon="ni ni-money-coins"
                  name="txn no"
                  :rules="{ required_if: form.method == paymentTypes.METHOD_CHEQUE }"
                  v-model="form.cheque_no"
                  placeholder="Cheque No"
                ></base-input>
              </el-row>
              <el-row>
                <base-input
                  prepend-icon="ni ni-money-coins"
                  name="amount"
                  :rules="{ required_if: form.method == paymentTypes.METHOD_CHEQUE }"
                  v-model="form.ac_no"
                  placeholder="deposit_no"
                ></base-input>
              </el-row>
            </el-col>
            <el-col :span="12">
              <base-input name="cheque image" :rules="{ required_if: form.method == paymentTypes.METHOD_CHEQUE }">
                <SingleImageUploader
                  :img.sync="form.image"
                  image-max-height="110px"
                  uploadText="Select Image"
                  :img-get-url="form.deposit_slip"
                ></SingleImageUploader>
              </base-input>
            </el-col>
          </el-row>
        </transition>

        <el-col :span="6">
          <base-checkbox v-model="form.advance">Advance</base-checkbox>
        </el-col>
      </div>
      <template slot="footer">
        <span v-if="!form.advance && form.amount > invoiceAmount" style="color: red; font-size: 12px"> The amount
          should be less
          than or equal to invoice amount</span>
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" :loading="loading" @click="handleSubmit(save)" :disabled="!form.advance &&
        form.amount > invoiceAmount">Save
        </base-button>
      </template>
    </modal>
  </validation-observer>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import BaseCUModalComponent from '@/mixins/BaseCUModalComponent';
import { AxiosInstance, AxiosResponse, AxiosStatic } from 'axios';
import LazyDropdown from '@/components/LazyDropdown.vue';
import Payment from '@/intefaces/Payment';
import { PaymentTypes } from '@/enums/PaymentTypes';

const flatPicker = require('vue-flatpickr-component');
import 'flatpickr/dist/flatpickr.css';
import SingleImageUploader from '@/components/ui/SingleImageUploader.vue';
import { MfsVendors } from '@/enums/MfsVendors';
import InvoiceAutocomplete from '@/components/resources-autocomplete/InvoiceAutocomplete.vue';

@Component({
  components: { InvoiceAutocomplete, SingleImageUploader, LazyDropdown, flatPicker }
})
export default class CreatePaymentForm extends Mixins(BaseCUModalComponent) {
  @Prop()
  currentEntity!: any;
  @Prop({
    default: () => ({
      advance: false,
      amount: null,
      department_id: null,
      method: null,
      paid_at: new Date().toISOString(),
      mfs_vendor: null,
      invoices: [],

      ac_no: '',
      ac_holder: '',
      txn_no: '',

      bank: '',
      branch: '',
      cheque_no: '',
      deposit_no: '',
      deposit_slip: '',
      seller_id: null,
    })
  })
  form!: Payment;

  private totalInvoiceAmount = null;
  private invoiceAmount: number = 0;
  private multipleInvoice: boolean = false;
  // Computed properties +++
  get createApi(): string {
    return '/payments';
  }

  get updateApi(): string {
    return `/payments/${this.currentEntity.id}`;
  }

  get paymentTypes() {
    return PaymentTypes;
  }

  get mfsVendors() {
    return MfsVendors;
  }

  // Computed properties ---
  formReset(): any {
    this.form.method = this.paymentTypes.METHOD_CASH;
    this.form.advance = false;
    this.form.amount = null;
    this.form.department_id = null;
    this.form.invoices = [];
    return this.form;
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.payment);
    if (!this.form.advance) {
      await this.assignPaymentToInvoice(response.data.payment.id);
    }
  }

  private async assignPaymentToInvoice(paymentId: number): Promise<void> {
    let requests: any[] = [];
      requests.push(this.$http.post(this.$api(`/invoices/${this.form.invoices}/payments`), { payment_id: paymentId }));
    await (this.$http as AxiosStatic).all(requests);
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.badge);
  }

  @Watch('form.advance')
  onChangeAdvance(advance: boolean) {
    this.form.amount = null;
  }

  @Watch('form.department_id')
  getSellerIdForAdvancePayment(newVal: number) {
    this.$http.get(this.$api(`/departments/${newVal}`)).then(response => {
      this.form.seller_id = response.data.department.supplier_id;
    });
  }
}
</script>
