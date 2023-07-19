<template>
  <!-- <modal :show="isActive" @close="close">
    <h5 class="modal-title mb-3" id="exampleModalLabel">Payment Details</h5>

    <card
      header-classes="bg-transparent"
      body-classes="px-lg-7"
      class="card-pricing border-0 text-center"
    >

      <h4
        slot="header"
        class="text-uppercase ls-1 text-primary py-3 mb-0"
        v-if="currentPackage.package"
      >{{currentPackage.package.name}} / {{currentPackage.cycle}} month</h4>



      <span
        class="text-muted"
        v-if="currentPackage.package"
      >Trial days: {{currentPackage.package.trial_days}} days</span>
      <ul class="list-unstyled my-4">
        <li v-for="feature in currentPackage.features" :key="feature.id">
          <div class="d-flex align-items-center">
            <div>
              <div
                class="icon icon-xs icon-shape bg-gradient-primary text-white shadow rounded-circle"
              >
                <i class="fas fa-terminal"></i>
              </div>
            </div>
            <div>
              <span class="pl-2 text-sm">{{feature.title}}</span>
            </div>
          </div>
        </li>
      </ul>
      <base-button type="primary" class="mb-3" @click="close">Close</base-button>
    </card>
  </modal>-->
  <modal :show="isActive" @close="close">
    <template slot="header">
      <h4 class="modal-title" id="exampleModalLabel">Payment Details</h4>
    </template>
    <div class="row">
      <div class="col-md-8">
        <div class="d-flex justify-content-between">
          <h3>
            <strong>Payment method:</strong>
          </h3>
          <div class="text-right">
            <h3 v-if="currentPayment.payments">{{currentPayment.payments[0].medium}}</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8">
        <div class="d-flex justify-content-between">
          <h3>
            <strong>Amount:</strong>
          </h3>
          <div class="text-right">
            <h3>{{currentPayment.amount}}</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8">
        <div class="d-flex justify-content-between">
          <h3>
            <strong>Transaction Id:</strong>
          </h3>
          <div class="text-right">
            <h3 v-if="currentPayment.payments">{{currentPayment.payments[0].txn_no}}</h3>
          </div>
        </div>
      </div>
    </div>
    <template
      slot="footer"
      v-if="(currentPayment.payments[0].approved_at || currentPayment.payments[0].rejected_at) == null"
    >
      <base-button type="secondary" @click="close">Close</base-button>
      <base-button type="success" @click.prevent="showApproveModal = true">Approve</base-button>
      <base-button type="warning" @click.prevent="showRejectModal = true">Reject</base-button>
    </template>
    <div v-if="currentPayment.payments[0].approved_at">
      <h3 style="font-size: 0.8em">****Payment has been approved****</h3>

      <base-button type="secondary" @click="close">Close</base-button>
    </div>
    <div v-if="currentPayment.payments[0].rejected_at">
      <h3 style="font-size: 0.8em">****Payment has been rejected****</h3>

      <base-button type="secondary" @click="close">Close</base-button>
    </div>
    <modal :show.sync="showApproveModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to approve this ?</h5>
      </template>

      <template slot="footer">
        <base-button type="danger" @click="showApproveModal = false">No</base-button>
        <base-button type="success" @click.prevent="approve(currentPayment.payments[0])">Yes</base-button>
      </template>
    </modal>
    <modal :show.sync="showRejectModal">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to reject this ?</h5>
      </template>
      <div>
        <base-input
          name="reason"
          v-model="reason"
          label="Rejection Reason"
          placeholder="Specify reason.."
        ></base-input>
      </div>
      <template slot="footer">
        <base-button type="danger" @click="showRejectModal = false">No</base-button>
        <base-button type="success" @click.prevent="reject(currentPayment.payments[0])">Yes</base-button>
      </template>
    </modal>
  </modal>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {Invoice} from '@/intefaces/Invoice';
import OrgInvoice from '@/intefaces/OrgInvoice';
@Component({
  components: {},
})
export default class ManagePayment extends Vue {
  @Prop() isActive!: boolean;
  @Prop() currentPayment!: OrgInvoice;
  private showApproveModal = false;
  private showRejectModal = false;
  private reason = '';

  close() {
    this.$emit('update:isActive', false);
  }

  approve(row: OrgInvoice): void {
    let data = {
      payment_id: row.id,
    };
    this.$http.post(this.$landLordApi(`/approved-payments`), data).then((response) => {
      this.showApproveModal = false;
      this.close();
      // this.currentPayment.payments[0] = response.data.payment;
      this.$emit('approvedAt', response.data.payment.approved_at);
      this.$notify({
        title: 'Success',
        message: 'Payment Approved',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success',
      });
    });
  }

  reject(row: OrgInvoice): void {
    let data = {
      payment_id: row.id,
    };
    let rejectionReason = {
      reason: this.reason,
    };
    this.$http.patch(this.$landLordApi(`/approved-payments/${data.payment_id}`), rejectionReason).then((response) => {
      this.showRejectModal = false;
      this.close();
      // this.currentPayment.payments[0] = response.data.payment;
      this.$emit('rejectedAt', response.data.payment.rejected_at);
      this.$notify({
        title: 'Success',
        message: 'Payment Rejected',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'warning',
      });
    });
  }
}
</script>
