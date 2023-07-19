<template>
  <div class="mt-2">
    <div class="row">
      <div class="col-md-3">
        <territory-lazydropdown placeholder="Region" v-model="form.regionId" :end-point="'territories?parent_id=1'"></territory-lazydropdown>
      </div>
      <div class="col-md-3">
        <territory-lazydropdown placeholder="Area" v-model="form.areaId" :end-point="'territories?parent_id=2'"></territory-lazydropdown>
      </div>
      <div class="col-md-3">
        <user-lazydropdown placeholder="Field Force" v-model="form.userId"></user-lazydropdown>
      </div>
      <div class="col-md-3">
        <outlet-lazydropdown placeholder="Outlet" v-model="form.outletId"></outlet-lazydropdown>
      </div>
      <div class="col-md-3">
        <base-dropdown id="order-filter-dropdown" :menuOnRight="true">
          <base-button size="sm" slot="title-container" type="primary" class="dropdown-toggle">
            {{ timespan.replace(/^\w/, (c) => c.toUpperCase()) }}
          </base-button>
          <a
            v-for="(status, index) in filters"
            @click.prevent="(timespan = status), (filterIndex = index)"
            :key="index"
            class="dropdown-item"
            href="#"
          >
            {{ status }}
          </a>
        </base-dropdown>
      </div>
      <div class="col-md-3">
        <base-input name="date" prepend-icon="fas fa-calendar">
          <flat-picker
            slot-scope="{ focus, blur }"
            @on-open="focus"
            @on-close="blur"
            :config="{ allowInput: true }"
            class="form-control datepicker"
            v-model="form.dateFrom"
            :placeholder="timespan != 'calander' ? 'Date Form' : 'Date'"
          >
          </flat-picker>
        </base-input>
      </div>
      <div class="col-md-3" v-if="timespan != 'calander'">
        <base-input placeholder="Date Range" type="number" v-model="form.dateRange"></base-input>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Tooltip, Button, Dropdown, DropdownItem } from 'element-ui';
import TerritoryLazydropdown from '@/components/lazyDropdown/TerritoryLazydropdown.vue';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import OutletLazydropdown from '@/components/lazyDropdown/OutletLazydropdown.vue';
const flatPicker = require('vue-flatpickr-component');
import 'flatpickr/dist/flatpickr.css';

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Button.name]: Button,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    OutletLazydropdown,
    UserLazydropdown,
    TerritoryLazydropdown,
    flatPicker,
  },
})
export default class GlobalFilter extends Vue {
  private filters = ['weekly', 'monthly', 'quaterly', 'yearly', 'calander'];
  private timespan = 'weekly';
  @Prop({ required: true })
  isFilterModelActive!: boolean;
  private filterIndex: number = 0;
  @Prop({ default: () => ({ territoryId: '', areaId: '', userId: '', outletId: '', dateFrom: '', dateRange: '' }) })
  form!: {
    territoryId: number;
    areaId: number;
    userId: number;
    outletId: number;
    dateFrom: string;
    dateRange: string;
  };

  @Watch('filterIndex')
  updateFilterIndex() {
    this.$emit('update', this.filterIndex);
  }

  close(): void {
    this.$emit('update:isFilterModelActive', false);
  }
}
</script>
