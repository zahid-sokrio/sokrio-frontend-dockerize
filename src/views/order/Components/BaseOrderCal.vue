<template>
  <div>
    <div class="row align-items-center">
      <div class="col-md-8">
        <h5 style="float:right;">Sub-Total</h5>
      </div>
      <div class="col-md-4">
        <h5>{{ subTotal }}</h5>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-md-8">
        <h5 style="float:right;">Badge Discount {{ ' (' + badgePercentage + '%)' }}</h5>
      </div>
      <div class="col-md-4">
        <h5>{{ calculateBadgePercentage(subTotal, badgePercentage) }}</h5>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-md-8">
        <h5 style="float:right;">{{ getTaxonomy('salesReturn') }}</h5>
      </div>
      <div class="col-md-4">
        <h5>{{ salesReturn }}</h5>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-md-8">
        <h5 style="float:right;">Other Disc.</h5>
      </div>
      <div class="col-md-4">
        <base-input v-model="manualDiscount" v-if="editable" type="number" name="discount" min="0"></base-input>
        <h5 v-else>{{ discount ? discount : '0'}}</h5>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-md-8">
        <h5 style="float:right;">Grand Total</h5>
      </div>
      <div class="col-md-4">
        <h5>{{ calculateGrandTotal() + ' ' + getCurrency }}</h5>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-md-8">
        <h5 style="float:right;">Total Paid</h5>
      </div>
      <div class="col-md-4">
        <h5>{{ totalPaid + ' ' + getCurrency }}</h5>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-md-8">
        <h5 style="float:right;">Total Due</h5>
      </div>
      <div class="col-md-4">
        <h5>{{ calculateTotalDue() + ' ' + getCurrency }}</h5>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Mixins, Watch} from 'vue-property-decorator';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";

@Component({})

export default class BaseOrderCal extends Mixins(TaxonomyMixin) {
  @Prop() subTotal!: number;
  @Prop() badgePercentage!: number;
  @Prop({default: 0}) salesReturn!: number;
  @Prop() discount!: number;
  @Prop() grandTotal!: number;
  @Prop() totalPaid!: number;
  @Prop() totalDue!: number;
  @Prop() editable!: boolean;
  public manualDiscount: number = 0;

  calculateBadgePercentage(subTotal: number, badgePercentage: number) {
    if (badgePercentage == 0) {
      return 0;
    }
    return (subTotal * badgePercentage) / 100;
  }

  calculateGrandTotal() {
    if (this.editable) {
      return this.subTotal - this.salesReturn - this.manualDiscount;
    } else {
      return this.grandTotal;
    }
  }

  @Watch('editable')
  getDiscountInInput(newVal: boolean) {
    this.manualDiscount = this.discount;
  }

  @Watch('manualDiscount')
  getInputedManualDiscount(value: number) {
    if (this.editable) {
      this.$emit('inputedDiscount', this.manualDiscount);
    }
  }

  calculateTotalDue() {
    if (this.editable) {
      return this.calculateGrandTotal() - this.totalPaid;
    } else {
      return this.totalDue;
    }
  }

  get getCurrency() {
    return this.$store.getters['Settings/getCurrency']
  }
}
</script>
