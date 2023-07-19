<template>
  <div class="row">
    <div class="col-md-3">
      <product-lazydropdown
        v-model="product.product"
        :add-button="false"
        :end-point="'/products'"
        item-sub-text="batch.name"
        item-text="base_product.name"
        item-value="id"
        label="Product" placeholder="Select Product"
        rules="required"
        name="product"
        @selected-item="product.productObject = $event"
      ></product-lazydropdown>
    </div>

    <div class="col-md-2">
      <base-input
        v-model="product.amount"
        :rules="{
          required:true,
          numeric:true
        }"
        label="Amount" name="amount"
        placeholder="e.g. 100"
        type="number" min="0">
      </base-input>
    </div>

    <div v-if="product.productObject && unitType == 'qty'" class="col-md-2">
      <base-input
        :value="product.selectedUnitValue ? product.amount * product.selectedUnitValue : product.amount"
        @input="product.selectedUnitValue?product.amount = ($event/product.selectedUnitValue):product.amount=$event"
        label="Total"
        name="total"
        placeholder="Total"
        type="number"
        min="0">
      </base-input>
    </div>

    <div v-if="product.productObject && unitType == 'qty'" class="col-md-2">
      <base-input label="Unit">
        <el-select
          :value="product.selectedUnitName"
          @input="product.selectedUnitName =$event.name,product.selectedUnitValue = $event.value"
        >
          <el-option :value="unit"
                     v-for="unit in JSON.parse(product.productObject.base_product.units)"
                     :key="unit.name">
            {{ unit.name }}
          </el-option>
        </el-select>
      </base-input>
    </div>

    <div class="col-md-2">
      <base-input label="Action On" name="action on" :rules="{required: true}">
        <el-select v-model="product.targetOn" clearable filterable placeholder="Action on">
          <el-option v-for="(action, index) in actionOn" :key="index"
                     :label="action.label" :value="action.value"></el-option>
        </el-select>
      </base-input>
    </div>
    <div class="col-md-1">
      <base-button
        size="sm"
        style="float: left; margin-top: 25px"
        type="danger"
        @click="product.existingProduct == 1 ? deleteProductFromSever(product.id) : deleteProductFromArray(index)"
      >
        <span class="btn-inner--icon">
            <i class="fas fa-times"></i>
        </span>
      </base-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from "vue-property-decorator";
import ProductLazydropdown from "@/components/lazyDropdown/ProductLazydropdown.vue";
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import { TargetActiveOn } from "@/enums/TargetActiveOn";

@Component({
  components: {ProductLazydropdown}
})
export default class SingleProduct extends Mixins(TaxonomyMixin) {
  @Prop()
  public product: any
  @Prop()
  public index: any
  @Prop()
  public deleteProductFromArray: any
  @Prop()
  public deleteProductFromSever: any
  @Prop()
  public unitType: any

  private actionOn = [
    {label: this.getTaxonomy('invoice'), value: this.targetActiveOn.ON_INVOICE},
    {label: this.getTaxonomy('order'), value: this.targetActiveOn.ON_ORDER},
    {label: 'Delivery', value: this.targetActiveOn.ON_DELIVERY}
  ];

  get targetActiveOn() {
    return TargetActiveOn;
  }

}
</script>
