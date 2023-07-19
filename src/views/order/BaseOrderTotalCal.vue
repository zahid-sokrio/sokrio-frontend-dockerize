<template>
  <div>
    <div class="row align-items-center">
      <div class="col-md-9">
        <h5 style="float:right;">Sub-Total</h5>
      </div>
      <div class="col-md-3">
        <h5>{{ currentEntity.latest_revision.amount }}</h5>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-md-9">
        <h5 style="float:right;">Badge Discount {{ ' (' + currentEntity.badge_percentage + '%)' }}</h5>
      </div>
      <div class="col-md-3">
        <h5>{{ calculateBadgePercentage(currentEntity) }}</h5>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-md-9">
        <h5 style="float:right;">{{ getTaxonomy('salesReturn') }}</h5>
      </div>
      <div class="col-md-3">
        <h5>{{ currentEntity.sales_return ? currentEntity.sales_return.total_amount : 0 }}</h5>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-md-9">
        <h5 style="float:right;">Other Disc.</h5>
      </div>
      <div class="col-md-3">
        <h5>{{ currentEntity.discount }}</h5>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-md-9">
        <h5 style="float:right;">Grand Total</h5>
      </div>
      <div class="col-md-3">
        <h5>{{ currentEntity.payable }}</h5>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-md-9">
        <h5 style="float:right;">Total Paid</h5>
      </div>
      <div class="col-md-3">
        <h5>{{ currentEntity.total_paid }}</h5>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-md-9">
        <h5 style="float:right;">Total Due</h5>
      </div>
      <div class="col-md-3">
        <h5>{{ currentEntity.total_due }}</h5>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Order from "@/intefaces/Order";

@Component({})

export default class BaseOrderTotalCal extends Vue {
  @Prop() currentEntity!: Order;

  calculateBadgePercentage(currentEntity: Order) {
    if (currentEntity.badge_percentage == 0) {
      return 0;
    }
    return (currentEntity.latest_revision.amount * currentEntity.badge_percentage) / 100;
  }
}
</script>
