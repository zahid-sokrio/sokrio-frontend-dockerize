<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Sales Growth</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="row pl-3">
        <div class="col-xl-12">
          <card>
            <template slot="header">
              <div class="form-inline">
                <div class="col-md-3 mb-5">
                  <!-- Subtitle -->
                  <h6 class="surtitle">Sales</h6>
                  <!-- Title -->
                  <h5 class="h3 mb-0">Sales Growth</h5>
                </div>
                <div class="col-md-9 text-right">
                  <base-button type="primary" icon size="sm" @click="isActive = true">
                    <span class="btn-inner--text">Filters</span>
                    <span class="btn-inner--icon">
                    <i class="fas fa-filter"></i>
                  </span>
                  </base-button>
                </div>
              </div>
              <div class="chart" v-if="isFilter">
                <line-chart :height="350" :chart-data="salesGrowth.chartData" :extra-options="salesGrowth.extraOptions"> </line-chart>
              </div>
            </template>
          </card>
        </div>
      </div>

      <div class="row pl-3">
        <div class="col-xl-12">
          <card>
            <template slot="header">
              <div class="form-inline">
                <div class="col-md-3 mb-5">
                  <!-- Subtitle -->
                  <h6 class="surtitle">Revenue</h6>
                  <!-- Title -->
                  <h5 class="h3 mb-0">Product Revenue</h5>
                </div>
                <div class="col-md-9 text-right">
                  <base-button type="primary" icon size="sm" @click="isActivePr = true">
                    <span class="btn-inner--text">Filters</span>
                    <span class="btn-inner--icon">
                    <i class="fas fa-filter"></i>
                  </span>
                  </base-button>
                </div>
              </div>
              <div class="chart" v-if="isFilterPR">
                <HorizontalBar :height="350" :chart-data="productRevenue.chartData"> </HorizontalBar>
              </div>
            </template>
          </card>
        </div>
      </div>
    </div>

    <sales-growth-filter :is-active.sync="isActive" :filters.sync="filters" :range="range" @updateFilter="filters = $event"></sales-growth-filter>

    <product-revenue-filter
      :is-active-pr.sync="isActivePr"
      :filtersProductRevenue.sync="filtersProductRevenue"
      @updateFilter="filtersProductRevenue = $event"
    ></product-revenue-filter>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
import SalesGrowthFilter from '@/views/dashboard/salesGrowth/SalesGrowthFilter.vue';
import ProductRevenueFilter from '@/views/dashboard/salesGrowth/ProductRevenueFilter.vue';
// @ts-ignore
import LineChart from '@/components/argon-core/Charts/LineChart';
// @ts-ignore
import BarChart from '@/components/argon-core/Charts/BarChart';
// @ts-ignore
import HorizontalBar from '@/components/argon-core/Charts/HorizontalBarChart';

@Component({
  components: {
    SalesGrowthFilter,
    ProductRevenueFilter,
    LineChart,
    BarChart,
    HorizontalBar
  }
})
export default class SalesGrowth extends Vue {
  private isActive: boolean = false;
  private isActivePr: boolean = false;
  private query: any = [];
  private afterQuery: any = [];
  private isFilter = false;
  private isFilterPR = false;
  private data: any = [];
  private PRdata: any = [];
  private range: any = '';
  private rangePR: any = '';
  private filters: any = {
    type: 'territory',
    interval: 'daily',
    territories: [],
    fieldForces: [],
    products: [],
    range: ''
  };

  private filtersProductRevenue: any = {
    order: 'fast_moving',
    unit_type: 'amount',
    territories: [],
    territory_id: '',
    rangePR: '',
    selectedDates: ''
  };

  private salesGrowth: any = {
    chartData: {
      labels: [],
      datasets: []
    },
    extraOptions: {}
  };

  private productRevenue: any = {
    chartData: {},
    extraOptions: {}
  };

  @Watch('filters', { immediate: true, deep: true })
  onChangeFilter(newVal: any) {
    this.query = [];
    if (newVal.products.length > 0) {
      this.filters.type = 'product';
    } else if (newVal.fieldForces.length > 0 && newVal.products.length == 0) {
      this.filters.type = 'field_force';
    } else if (newVal.territories.length > 0 && newVal.products.length == 0 && newVal.fieldForces.length == 0) {
      this.filters.type = 'territory';
    }
    let range = newVal.range ? newVal.range.replace('to', ',').replace(/\s/g, '') : '';
    this.afterQuery = true;
    newVal.type ? this.query.push(`type=${newVal.type}`) : '';
    newVal.interval ? this.query.push(`interval=${newVal.interval}`) : '';
    newVal.range ? this.query.push(`range=${range}`) : '';
    newVal.territories.length > 0 ? this.query.push(`territory_id=${newVal.territories}`) : '';
    newVal.products.length > 0 ? this.query.push(`product_id=${newVal.products}`) : '';
    newVal.fieldForces.length > 0 ? this.query.push(`field_force_id=${newVal.fieldForces}`) : '';
    this.fetchSalesGrowth();
  }

  @Watch('filtersProductRevenue', { immediate: true, deep: true })
  onChangeFilterProductRevenue(newValue: any) {
    this.query = [];
    let selectedDates = newValue.selectedDates ? newValue.selectedDates.replace('to', ',').replace(/\s/g, '') : '';
    this.afterQuery = true;
    newValue.order ? this.query.push(`order=${newValue.order}`) : '';
    newValue.unit_type ? this.query.push(`unit_type=${newValue.unit_type}`) : '';
    newValue.selectedDates ? this.query.push(`range=${selectedDates}`) : '';
    newValue.territory_id ? this.query.push(`territory_id=${newValue.territory_id}`) : '';
    this.fetchProductRevenue();
  }

  fetchSalesGrowth() {
    this.isFilter = false;
    this.$http.get(this.$api(`/sale-growth${this.query.length > 0 ? '?' + this.query.join('&') : ''}`)).then(response => {
      this.data = response.data.salesGrowth;
      this.salesGrowth.chartData.labels = this.data.labels;
      this.data.datasets.forEach((data: any) => {
        data['borderColor'] = data['pointBackgroundColor'] = this.randomBorderColor();
      });
      this.salesGrowth.chartData.datasets = this.data.datasets;
      this.isFilter = true;
    });
  }

  fetchProductRevenue() {
    this.isFilterPR = false;
    this.$http.get(this.$api(`/products-revenue-contribution${this.query.length > 0 ? '?' + this.query.join('&') : ''}`)).then(response => {
      let borderColor: any = [];
      let backgroundColor: any = [];
      response.data.products.data.forEach((data: any) => {
        borderColor.push(this.randomBorderColor());
        backgroundColor.push(this.randomBorderColor());
      });

      this.productRevenue.chartData = {
        labels: response.data.products.labels,
        datasets: [{ data: response.data.products.data, borderColor: borderColor, backgroundColor: backgroundColor }]
      };

      this.isFilterPR = true;
    });
  }

  currentDate() {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '-');
    var lastDay = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '-');
    this.filters.range = firstDay + ' to ' + lastDay;
    this.filtersProductRevenue.selectedDates = firstDay + ' to ' + lastDay;
    this.range = firstDay + ' to ' + lastDay;
  }

  randomBorderColor() {
    var o = Math.round,
      r = Math.random,
      s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')';
  }

  created() {
    this.currentDate();
  }
}
</script>
