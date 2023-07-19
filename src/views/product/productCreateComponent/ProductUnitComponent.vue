<template>
  <div>
    <div>
      <div class="row mb-1" v-if="!isUpdate">
        <div class="col-md-12" >
          <h3>Product Unit (Optional)</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-md-5">
          <unit-lazydropdown v-model="singleUnit.name" label="Unit" :addButton="units.length >= 3 ? false : true"
                             placeholder="Select Units" @newCreatedEntity="newCreatedEntity($event)">
          </unit-lazydropdown>
        </div>
        <div class="col-md-5">
          <base-input v-model="singleUnit.value" label="Value" name="value" type="number" min="0"></base-input>
        </div>
        <div class="col-md-2 text-right" style="margin-top:20px;">
          <el-tooltip :content="disabled ?
          'Fill up necessary field to enable this button, then click this button to add product unit in the list, ' +
          'only listed unit will be assigned for this product.' :
          'Click this button, to add product unit in the below list, only listed unit will be assigned for this product.'"
                      placement="top">
            <div style="display: inline-block;">
              <base-button type="success" @click="saveProductUnit()" :disabled="disabled">
            <span class="btn-inner--icon">
              <i class="fas fa-check-circle"></i>
            </span>
              </base-button>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="col-md-12" v-if="unitError">
        <span class="text-warning text-sm">Error: This unit has already been added!</span>
      </div>
      <div class="col-md-12">
        <span v-if="productUnits && productUnits.length <= 0"
              class="text-center"><h4>No product unit selected.</h4></span>
        <span class="mr-4" v-for="(productUnit, index) in productUnits" :key="index">
          <b>{{ units.find(unit => unit.name == productUnit.name) ? units.find(unit => unit.name ==
          productUnit.name).name + ': ' + productUnit.value : '' }}
          </b>
          <el-tooltip content="Delete" placement="top">
                <base-button size="sm" type="danger"
                             @click="deleteUnit(index)"><i class="fas fa-times"/></base-button>
              </el-tooltip>
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator';
import UnitLazydropdown from "@/components/lazyDropdown/UnitLazydropdown.vue";
import Unit from "@/intefaces/Unit";
import { forEach } from "lodash";
import UnitForm from "@/components/products/UnitForm.vue";

@Component({
  components: {
    UnitLazydropdown,
  }
})
export default class ProductUnitComponent extends Vue {
  @Prop({ default: [] }) productUnits!: any;
  @Prop() product!: any;
  @Prop() isUpdate!: boolean;
  private disabled = true;
  private unitError: boolean = false;
  private loading: boolean = false;
  private isActive: boolean = false;
  private units: Unit[] = []
  private singleUnit = {
    value: '',
    name: '',
  }

  @Watch('singleUnit', {deep: true})
  enableAddButton() {
    if (this.singleUnit.value && this.singleUnit.name) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }

  singleUnitReset() {
    this.singleUnit.value = '';
    this.singleUnit.name = '';
  }

  deleteUnit(index: number) {
    this.productUnits.splice(index, 1);
  }

  saveProductUnit() {
    if (this.productUnits.length > 0) {
      if (this.productUnits.find((element: any) => element.name == this.singleUnit.name)) {
        this.unitError = true;
      } else {
        this.productUnits.push({...this.singleUnit});
        this.singleUnitReset();
        this.unitError = false;
      }
    } else {
      this.productUnits.push({...this.singleUnit});
      this.singleUnitReset();
    }
  }

  newCreatedEntity(event: Unit) {
    this.units.unshift(event);
  }


  fetchUnit() {
    this.$http.get(this.$api('/units')).then(response => {
      this.units = response.data.units;
    })
  }

  created() {
    this.fetchUnit();
  }
}
</script>
