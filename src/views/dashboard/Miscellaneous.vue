<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Miscellaneous Charts</h3>
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
                <div class="col-md-3">
                  <!-- Subtitle -->
                  <h6 class="surtitle">Revenue</h6>
                  <!-- Title -->
                  <h5 class="h3 mb-0">Target Vs Achievement</h5>
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
            </template>
            <div class="chart">
              <div class="text-center">
                <b v-if="data.targets == 0 && data.achievements == 0"> No Data Found. </b>
                <pie-chart
                  v-if="filters.type == 'all' && isFilter"
                  :height="300"
                  :chart-data="revenueTargetVsAchievementPieChart.chartData"
                  :extra-options="revenueTargetVsAchievementPieChart.extraOptions"
                >
                </pie-chart>
                <bar-chart
                  v-else-if="isFilter"
                  :height="350"
                  :chart-data="revenueTargetVsAchievementBarChart.chartData"
                  :extra-options="revenueTargetVsAchievementBarChart.extraOptions"
                >
                </bar-chart>
              </div>
            </div>
          </card>
        </div>
      </div>
    </div>
    <revenue-target-vs-achievement-filter
      :is-active.sync="isActive"
      :filters="filters"
      @updateFilter="filters = $event"
    ></revenue-target-vs-achievement-filter>
  </div>
</template>
<script lang="ts">
import {Component, Mixins, Vue, Watch} from 'vue-property-decorator';
// @ts-ignore
import LineChart from '@/components/argon-core/Charts/LineChart';
// @ts-ignore
import BarChart from '@/components/argon-core/Charts/BarChart';
// @ts-ignore
import PieChart from '@/components/argon-core/Charts/PieChart';
// @ts-ignore
import {Charts} from '@/components/argon-core/Charts/config';
// @ts-ignore
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import RevenueTargetVsAchievementFilter from '@/views/dashboard/Miscellaneous/RevenueTargetVsAchievementFilter.vue';
import TerritoryLazydropdown from '@/components/lazyDropdown/TerritoryLazydropdown.vue';
import ProductLazydropdown from '@/components/lazyDropdown/ProductLazydropdown.vue';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import ReportRepositories from '@/repositories/ReportRepositories';

@Component({
  components: {
    LineChart,
    BarChart,
    DatePicker,
    PieChart,
    TerritoryLazydropdown,
    ProductLazydropdown,
    UserLazydropdown,
    RevenueTargetVsAchievementFilter
  }
})
export default class Miscellaneous extends Vue {
  private selectedType: any = 'All';
  private afterQuery: boolean = false;
  private isActive: boolean = false;
  private query: any = [];
  private data: any = [];
  private isFilter: boolean = false;

  private filters: any = {
    type: 'all',
    territories: [],
    fieldForces: [],
    products: [],
    range: ''

  };
  private types: any = [
    {label: 'All', value: 'all'},
    {label: 'Territory', value: 'region_wise'},
    {label: 'Field Force', value: 'sr_wise'},
    {label: 'Product', value: 'product_wise'}
  ];

  private revenueTargetVsAchievementPieChart: any = {
    chartData: {
      labels: ['Target', 'Achievement'],
      datasets: [
        {
          data: [],
          backgroundColor: [Charts.colors.theme['warning'], Charts.colors.theme['success']],
          label: 'Target Vs Achievement'
        }
      ]
    },
    extraOptions: {
      responsive: true,
      legend: {
        position: 'top'
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  };

  private revenueTargetVsAchievementBarChart: any = {
    chartData: {
      labels: this.data.labels,
      datasets: [
        {
          label: 'Target',
          backgroundColor: Charts.colors.theme['warning'],
          data: this.data.targets
        },
        {
          label: 'Achievements',
          backgroundColor: Charts.colors.theme['success'],
          data: this.data.achievements
        }
      ]
    },
    extraOptions: {
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      scales: {
        xAxes: [
          {
            stacked: true
          }
        ],
        yAxes: [
          {
            stacked: true
          }
        ]
      }
    }
  };

  @Watch('filters', {immediate: true, deep: true})
  onChangeFilter(newVal: any) {
    this.query = [];
    if (newVal.products.length > 0) {
      this.filters.type = 'product';
      this.selectedType = 'Product';
    } else if (newVal.fieldForces.length > 0 && newVal.products.length == 0) {
      this.filters.type = 'field_force';
      this.selectedType = 'Field Force';
    } else if (newVal.territories.length > 0 && newVal.products.length == 0 && newVal.fieldForces.length == 0) {
      this.filters.type = 'territory';
      this.selectedType = 'Territory';
    }
    let range = this.filters.range ? this.filters.range.replace('to', ',').replace(/\s/g, '') : '';
    this.afterQuery = true;
    newVal.type != 'all' ? this.query.push(`type=${newVal.type}`) : '';
    newVal.territories.length > 0 ? this.query.push(`territory_id=${newVal.territories}`) : '';
    newVal.products.length > 0 ? this.query.push(`product_id=${newVal.products}`) : '';
    newVal.fieldForces.length > 0 ? this.query.push(`field_force_id=${newVal.fieldForces}`) : '';
    newVal.range != '' ? this.query.push(`range=${range}`) : '';
    this.fetchTargetVsAchievement();
  }

  fetchTargetVsAchievement() {
    this.isFilter = false;
    this.$http.get(this.$api(`/revenue-target-vs-achievement${this.query.length > 0 ? '?' + this.query.join('&') : ''}`)).then(response => {
      this.data = response.data.revenueTargetVsAchievement;
      if (this.filters.type == 'all') {
        this.revenueTargetVsAchievementPieChart.chartData.datasets[0].data = [this.data.targets, this.data.achievements];
        this.isFilter = true;
      } else {
        this.revenueTargetVsAchievementBarChart.chartData.labels = this.data.labels;
        this.revenueTargetVsAchievementBarChart.chartData.datasets[0].data = this.data.targets;
        this.revenueTargetVsAchievementBarChart.chartData.datasets[1].data = this.data.achievements;
        this.isFilter = true;
      }
    });
  }
}
</script>
