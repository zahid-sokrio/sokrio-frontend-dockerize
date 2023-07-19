<template>
  <modal :show="isActivePr" @close="close">
    <template slot="header">
      <h5 class="modal-title" id="exampleModalLabel">Filter</h5>
    </template>
    <div class="row">
      <div class="col-md-6">
        <base-input>
          <el-select filterable placeholder="Order" v-model="filtersProductRevenue.order" clearable>
            <el-option v-for="(order, index) in orders" :key="index" :label="order.label" :value="order.value"> </el-option>
          </el-select>
        </base-input>
      </div>
      <div class="col-md-6">
        <base-input>
          <el-select filterable placeholder="Value" v-model="filtersProductRevenue.unit_type" clearable>
            <el-option
              v-for="(unit_type, index) in unit_types"
              :key="index"
              :label="_.startCase(unit_type.replace(/([A-Z])/g, ' $1'))"
              :value="unit_type"
            >
            </el-option>
          </el-select>
        </base-input>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 mb-5">
        <base-input prepend-icon="fas fa-calendar">
          <flat-picker
            slot-scope="{ focus, blur }"
            @on-open="focus"
            @on-close="blur"
            :config="{ allowInput: true, mode: 'range' }"
            class="form-control datepicker"
            v-model="filtersProductRevenue.selectedDates"
          >
          </flat-picker>
        </base-input>
      </div>

      <div class="col-md-6 mb-5">
        <territory-lazydropdown
          class="ml-1"
          placeholder="Territory"
          v-model="filtersProductRevenue.territory_id"
          :end-point="'territories'"
          :add-button="false"
          :multiple="true"
        ></territory-lazydropdown>
      </div>
    </div>
    <template slot="footer">
      <base-button @click="closeFilter" type="primary">Done</base-button>
      <base-button @click="close" type="secondary">Close</base-button>
    </template>
  </modal>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import TerritoryLazydropdown from '@/components/lazyDropdown/TerritoryLazydropdown.vue';
import ProductLazydropdown from '@/components/lazyDropdown/ProductLazydropdown.vue';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
// @ts-ignore
const flatPicker = require('vue-flatpickr-component');
import 'flatpickr/dist/flatpickr.css';
@Component({
  components: {
    TerritoryLazydropdown,
    ProductLazydropdown,
    UserLazydropdown,
    flatPicker
  }
})
export default class ProductRevenueFilter extends Vue {
  @Prop() isActivePr!: boolean;
  @Prop() rangePR!: any;
  @Prop({
    default: () => ({
      unit_type: 'amount',
      order: 'fast_moving',
      territories: [],
      territory_id: '',
      rangePR: '',
      selectedDates: ''
    })
  })
  filtersProductRevenue!: {
    unit_type: string;
    order: string;
    territories: any;
    territory_id: any;
    rangePR: any;
    selectedDates: any;
  };

  private orders: any = [
    { label: 'Fast Moving', value: 'fast_moving' },
    { label: 'Slow Moving', value: 'slow_moving' }
  ];

  private unit_types: any = ['amount', 'qty'];

  @Watch('filtersProductRevenue', { immediate: true, deep: true })
  onChangeFilterPR(newVal: any) {
    this.$emit('updateFilterPR', this.filtersProductRevenue);
  }

  closeFilter() {
    this.$emit('update:isActivePr', false);
  }

  close() {
    this.$emit('update:isActivePr', false);
  }
}
</script>
