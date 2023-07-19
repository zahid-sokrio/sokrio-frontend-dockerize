<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <base-input :rules="{ required: true }" label="Target Type" name="target type">
          <el-select v-model="form.type" filterable placeholder="Select Type" style="border: none">
            <el-option v-for="(type, index) in types" :key="index" :label="type.label" :value="type.value"></el-option>
          </el-select>
        </base-input>
      </div>
      <div class="col-md-6">
        <base-input :rules="{ required: true }" label="Scheme" name="scheme">
          <el-select v-model="form.scheme" filterable placeholder="Select Timespan" style="border: none">
            <el-option v-for="(scheme, index) in schemes" :key="index" :label="scheme.toUpperCase()" :value="scheme"></el-option>
          </el-select>
        </base-input>
      </div>
      <div class="col-md-6">
        <base-input
          :disabled="form.type == 'product' ? true : false"
          v-model="form.amount"
          type="number"
          :rules="{ required: true }"
          min="0"
          label="Amount"
          name="amount"
          placeholder="e.g. 1000"
          prepend-icon="ni ni-money-coins"
        ></base-input>
        <h4 v-if="form.type == 'product'">Has Specific Products</h4>
      </div>
      <div class="col-md-6">
        <base-input :rules="{ required: true }" label="Unit" name="unit">
          <el-select v-model="form.unit" :disabled="form.type == 'visit' ? true : false" filterable placeholder="Select Type" style="border: none">
            <el-option
              v-for="(unit, index) in units"
              :key="index"
              :disabled="form.type != 'visit' && unit == 'visit' ? true : false"
              :label="unit.toUpperCase()"
              :value="unit"
            ></el-option>
          </el-select>
        </base-input>
        <base-button v-if="form.type == 'product'" size="sm" style="float: right" type="success" @click="addNewProduct">
          <span class="btn-inner--icon">
            <i class="fas fa-plus"></i>
          </span>
        </base-button>
      </div>
    </div>
    <div v-if="form.type == 'product'">
      <template v-for="(product,index) in products">
        <SingleProduct
          :product.sync="product"
          :key="index"
          :delete-product-from-array="deleteProductFromArray"
          :delete-product-from-sever="deleteProductFromSever"
          :unit-type.sync="form.unit"
        ></SingleProduct>
      </template>
    </div>
    <div class="row">
      <div class="col-md-6">
        <input type="hidden" class="form-control datepicker" value="2020-02-02" v-on="(form.start_from = '2020-02-02')" />
      </div>
      <div class="col-md-6">
        <input type="hidden" class="form-control datepicker" value="2020-02-03" v-on="(form.expiresDate = '2020-02-03')" />
      </div>
      <div class="col-md-6">
        <user-autocomplete
          v-if="isUpdate"
          v-model="form.assignTo"
          :rules="{ required_if: activeTab == 'regular' }"
          label="Assign To"
          name="assign to"
        ></user-autocomplete>
        <user-autocomplete
          v-else
          v-model="form.assignTo"
          :multiple="true"
          :rules="{ required: true }"
          label="Assign To"
          name="assign to"
        ></user-autocomplete>
      </div>

      <div class="col-md-6">
        <base-input label="Active">
          <base-switch v-model="form.status" class="mr-1 p-1" off-text="No" on-text="Yes"></base-switch>
        </base-input>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from "vue-property-decorator";
import TargetModalData from "@/mixins/TargetModalData";
import { ElSelect } from "element-ui/types/select";
import UnitLazydropdown from "@/components/lazyDropdown/UnitLazydropdown.vue";
import SingleProduct from "@/views/user/target/SingleProduct.vue";

@Component({
  components: {SingleProduct, UnitLazydropdown}
})
export default class RegularTargetComponent extends Mixins(TargetModalData) {}
</script>
<style>
.el-select {
  display: block !important;
}
</style>
