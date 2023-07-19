<template>
  <div>
    <modal v-if="loading" :show="isShowPaymentDetails" @close="close" class="modal-dialog-scrollable">
      <div class="d-flex justify-content-center align-items-center" style="height: 180px;">
        <span class="h1 font-weight-bold mb-0">
              <i class="el-icon-loading"></i>
        </span>
      </div>
    </modal>
    <modal v-else :show="isShowPaymentDetails" @close="close">
      <template slot="header">
        <h5
          class="modal-title"
          id="exampleModalLabel1"
        > Payment Details</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <div v-if="details.payments != ''" class="timeline timeline-one-side" data-timeline-content="axis"
               data-timeline-axis-style="dashed">
            <div v-for="payment in details.payments"
                 :key="payment.id"
                 class="timeline-block">
                            <span class="timeline-step badge-success">
                                <i class="fas fa-credit-card"></i>
                            </span>
              <div class="timeline-content">
                <div class="d-flex justify-content-between pt-1">
                  <div>
                    <span class="text-muted text-sm font-weight-bold">{{ payment.method }}</span>
                  </div>
                  <div class="text-right">
                    <small class="text-muted"><i
                      class="fas fa-clock mr-1"></i>{{ payment.paid_at | datetime('ll') }}</small><br>
                  </div>
                </div>
                <div class="d-flex justify-content-between pt-1">
                  <h6 class="text-sm mt-1 mb-0">Amount : {{ payment.amount }} tk</h6>
                  <div class="text-right">
                    <small class="text-muted"><i class="fas fa-user mr-1"></i>{{ payment.creator.name }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            No payment given.
          </div>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="close" type="secondary">Close</base-button>
      </template>
    </modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Tooltip
} from "element-ui";
import { Invoice } from "@/intefaces/Invoice";

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
  }
})
export default class InvoicePaymentDetailsForm extends Vue {
  @Prop() invoiceDetails!: Invoice;
  @Prop() isShowPaymentDetails!: boolean;
  public details: any = {}
  public loading: boolean = true;

  close() {
    this.$emit('update:isShowPaymentDetails', false);
  }

  async mounted() {
    this.loading = true;
    let {data} = await this.$http.get(this.$api2(`/invoices/${this.invoiceDetails.id}`))
    this.details = data.invoice
    this.loading = false;
  }
}
</script>
