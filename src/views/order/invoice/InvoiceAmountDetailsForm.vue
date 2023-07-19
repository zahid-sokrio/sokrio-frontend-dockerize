<template>
  <modal :show="isShowAmountDetails" @close="close">
    <template slot="header">
      <h5
        class="modal-title"
        id="exampleModalLabel"
      > Amount Details</h5>
    </template>
    <div class="card">
      <div class="card-body">
        <ul class="list-group list-group-flush list my--4">
          <li class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-auto">
                <a href="#" class="avatar rounded-circle">
                  <i class="ni ni-money-coins"></i>
                </a>
              </div>
              <div class="col ml--2">
                <h4 class="mb-0">Amount Payable</h4>
                <!--                                <small> {{invoiceDetails.revisions[0].amount }} tk</small>-->
                <small> <span>{{ invoiceDetails.payable + ' ' + currency }}</span></small>
              </div>
            </div>
          </li>
          <li class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-auto">
                <a href="#" class="avatar rounded-circle">
                  <i class="fas fa-percent"></i>
                </a>
              </div>
              <div class="col ml--2">
                <h4 class="mb-0">Discount</h4>
                <small> {{ invoiceDetails.discount }} {{ ' ' + currency }}</small>
              </div>
            </div>
          </li>
          <li class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-auto">
                <a href="#" class="avatar rounded-circle">
                  <i class="fas fa-bullhorn"></i>
                </a>
              </div>
              <div class="col ml--2">
                <h4 class="mb-0">Promotion Discount</h4>
                <small> {{ invoiceDetails.promotion_discount}} {{ currency }}</small>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <template slot="footer">
      <base-button @click="close" type="secondary">Close</base-button>
    </template>
  </modal>
</template>
<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Tooltip
} from "element-ui";
import {Invoice} from "@/intefaces/Invoice";

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
  }
})
export default class InvoiceAmountDetailsForm extends Vue {
  @Prop() invoiceDetails!: Invoice;
  @Prop() isShowAmountDetails!: boolean;

  get currency() {
    return this.$store.getters['Settings/getCurrency']
  }

  close() {
    this.$emit('update:isShowAmountDetails', false);
  }
  
}

</script>
