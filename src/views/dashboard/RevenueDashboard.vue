<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-4">
          <div class="form-inline">
            <h3 class="mb-0">Revenue</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row pl-3">
      <div class="col-xl-6 col-md-6 ">
        <card>
          <template slot="header">
            <!-- Subtitle -->
            <h6 class="surtitle">Revenue</h6>
            <div class="form-inline justify-content-between">
              <!-- Title -->
              <h5 class="h3 mb-0">Earned</h5>
              <div class="form-inline">
                <base-dropdown :menuOnRight="true" v-if="selectedGraph == 'trends'">
                  <base-button size="sm" slot="title-container" type="primary" class="dropdown-toggle">
                    {{ timespanFilter.replace(/^\w/, c => c.toUpperCase()) }}
                  </base-button>
                  <a v-for="(timespan, index) in timespans" @click.prevent="timespanFilter = timespan" :key="index" class="dropdown-item" href="#">
                    {{ timespan.replace(/^\w/, c => c.toUpperCase()) }}
                  </a>
                </base-dropdown>
                <base-dropdown :menuOnRight="true" v-if="selectedGraph == 'trends'">
                  <base-button size="sm" slot="title-container" type="primary" class="dropdown-toggle">
                    {{ selectedDate.replace(/^\w/, c => c.toUpperCase()) }}
                  </base-button>
                  <a
                    v-for="(date, index) in dateFilter"
                    @click.prevent="(selectedDate = date), initBigChart(index)"
                    :key="index"
                    class="dropdown-item"
                    href="#"
                  >
                    <span> {{ date.replace(/^\w/, c => c.toUpperCase()) }} </span>
                  </a>
                </base-dropdown>
                <el-tooltip content="Toggle between graphs" placement="top">
                  <base-dropdown :menuOnRight="true">
                    <base-button size="sm" slot="title-container" type="primary" class="dropdown-toggle">
                      {{ selectedGraph.replace(/^\w/, c => c.toUpperCase()) }}
                    </base-button>
                    <a v-for="(option, index) in toogleGraphs" @click.prevent="selectedGraph = option" :key="index" class="dropdown-item" href="#">
                      {{ option.replace(/^\w/, c => c.toUpperCase()) }}
                    </a>
                  </base-dropdown>
                </el-tooltip>
              </div>
            </div>
          </template>
          <div class="cardStyle" v-if="selectedGraph == 'absolate number'">
            <a href="#" @click.prevent="expandState('overAllCountry')" v-if="!previousRegion">
              <dashboard-stats-card title="Total Revenue" type="gradient-green" sub-title="24" icon="ni ni-money-coins">
                <template slot="footer">
                  <span class="text-nowrap">{{ todaysDate() | datetime('ll') }}</span>
                </template>
              </dashboard-stats-card>
            </a>
            <a v-if="previousRegion">
              <dashboard-stats-card :title="previousRegion" type="gradient-green" sub-title="41" icon="ni ni-money-coins">
                <template slot="footer">
                  <span class="text-nowrap"></span>
                </template>
              </dashboard-stats-card>
            </a>
            <div class="row">
              <div class="col-md-12" v-if="this.currentState != 'overAllCountry'">
                <div class="form-inline mb-1 mr-2" style="float: right">
                  <el-tooltip content="Back to Previous State" placement="top">
                    <base-button type="primary" icon size="sm" @click="backOnPreviousState(currentState, 'lineChart')">
                      <span class="btn-inner--icon">
                        <i class="fas fa-arrow-left"></i>
                      </span>
                      <span class="btn-inner--text">Back</span>
                    </base-button>
                  </el-tooltip>
                  <el-tooltip content="Top State" placement="top">
                    <base-button type="primary" icon size="sm" @click="TopState('lineChart')">
                      <span class="btn-inner--icon">
                        <i class="fas fa-arrow-up"></i>
                      </span>
                      <span class="btn-inner--text">Top</span>
                    </base-button>
                  </el-tooltip>
                  <dashboard-territory-lazy-dropdown
                    class="ml-2"
                    :placeholder="currentState.replace(/^\w/, c => c.toUpperCase())"
                    v-model="form.regionId"
                    :end-point="currentState == 'region' ? 'territories?parent_id=1' : 'territories?parent_id=2'"
                  ></dashboard-territory-lazy-dropdown>
                </div>
              </div>
              <div class="col-md-12" v-if="currentState != ''">
                <div class="text-center mb-3" v-if="currentEntities == '' && currentState != 'overAllCountry'">
                  <b>No Data Found</b>
                </div>
                <div class="form-inline mb-1 ">
                  <div class="col-xl-6 col-md-6" v-for="territory in currentEntities" :key="territory.id">
                    <a @click.prevent="expandState(territory)">
                      <dashboard-stats-card :title="territory.name" type="gradient-red" sub-title="41" icon="ni ni-shop">
                        <template slot="footer">
                          <span class="text-nowrap">{{ territory.name }}</span>
                        </template>
                      </dashboard-stats-card>
                    </a>
                  </div>
                </div>
                <base-pagination
                  class="mt-3 offset-md-4 col-md-4"
                  v-if="currentEntities.length > 0"
                  v-model="pagination.currentPage"
                  :perPage="pagination.entityPerPage"
                  :total="pagination.totalEntity"
                  align="center"
                  :disabled="loading"
                ></base-pagination>
              </div>
            </div>
          </div>
          <div class="cardStyle" v-if="selectedGraph == 'trends'">
            <line-chart :height="350" :chart-data="bigLineChart.chartData"> </line-chart>
            <modal :show.sync="selectCustomDate">
              <div class="card">
                <base-input label="Range picker">
                  <flat-picker
                    slot-scope="{ focus, blur }"
                    @on-open="focus"
                    @on-close="blur"
                    :config="{ allowInput: true, mode: 'range' }"
                    class="form-control datepicker"
                    v-model="form.dateRange"
                  >
                  </flat-picker>
                </base-input>
              </div>
              <div class="text-right">
                <base-button @click="close" type="success">Select</base-button>
                <base-button @click="close('close')" type="secondary">Close</base-button>
              </div>
            </modal>
          </div>
        </card>
      </div>
      <div class="col-xl-6 col-md-6">
        <card>
          <template slot="header">
            <!-- Subtitle -->
            <h6 class="surtitle">Revenue</h6>
            <div class="form-inline justify-content-between">
              <!-- Title -->
              <h5 class="h3 mb-0">Comparison</h5>
              <div class="form-inline">
                <base-dropdown :menuOnRight="true">
                  <base-button size="sm" slot="title-container" type="primary" class="dropdown-toggle">
                    {{ currentComparisonState.replace(/^\w/, c => c.toUpperCase()) }}
                  </base-button>
                  <a
                    v-for="(type, index) in searchTypes"
                    @click.prevent="(currentComparisonState = type), initBigChart(index)"
                    :key="index"
                    class="dropdown-item"
                    href="#"
                  >
                    {{ type.replace(/^\w/, c => c.toUpperCase()) }}
                  </a>
                </base-dropdown>
                <dashboard-territory-lazy-dropdown
                  v-if="currentComparisonState != 'overAllCountry'"
                  class="ml-2"
                  :placeholder="currentComparisonState.replace(/^\w/, c => c.toUpperCase())"
                  v-model="form.regionId"
                  :end-point="currentComparisonState == 'region' ? 'territories?parent_id=1' : 'territories?parent_id=2'"
                ></dashboard-territory-lazy-dropdown>
              </div>
            </div>
          </template>
          <div class="cardStyle">
            <bar-chart :chart-data="ordersChart.chartData" :height="350" />
          </div>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12 col-md-12 ">
        <target-vs-achievement
          :pie-chart.sync="pieChart"
          :search-types="searchTypes"
          @expandTargetVsAchieve="expandTargetVsAchieve"
        ></target-vs-achievement>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
// @ts-ignore
import LineChart from '@/components/argon-core/Charts/LineChart.vue';
// @ts-ignore
import * as chartConfigs from '@/components/argon-core/Charts/config';
import GlobalFilter from '@/views/dashboard/GlobalFilter.vue';
// @ts-ignore
import { Charts } from '@/components/argon-core/Charts/config.vue';
import DashboardStatsCard from '@/components/DashboardStatsCard.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
// @ts-ignore
import BarChart from '@/components/argon-core/Charts/BarChart';
import ClickablePieChart from '@/components/ClickablePieChart.vue';
const flatPicker = require('vue-flatpickr-component');
import 'flatpickr/dist/flatpickr.css';
import DashboardTerritoryLazyDropdown from '@/components/lazyDropdown/DashboardTerritoryLazyDropdown.vue';
import TargetVsAchievement from '@/views/dashboard/pieChart/TargetVsAchievement.vue';

@Component({
  components: {
    LineChart,
    GlobalFilter,
    DashboardStatsCard,
    DashboardTerritoryLazyDropdown,
    BarChart,
    ClickablePieChart,
    flatPicker,
    TargetVsAchievement
  }
})
export default class RevenueDashboard extends Mixins(PaginationComponentMixin) {
  private isFilterModelActive: boolean = false;
  private currentState: string = 'overAllCountry';
  private currentComparisonState: string = 'overAllCountry';
  private previousRegion: string = '';
  private overallCountry: boolean = true;
  private toogleGraphs: any = ['absolate number', 'trends'];
  private searchTypes: any = ['region', 'area', 'SR', 'Route Plan', 'Outlet', 'overAllCountry'];
  private selectedGraph: any = 'absolate number';
  private timespans: any = ['daily', 'weekly', 'monthly', 'quaterly', 'yearly'];
  private timespanFilter: any = 'daily';
  private dateFilter: any = ['last 7 days', 'last 15 days', 'last 30 days', 'last 90 days', 'last 180 days', 'last 365 days', 'custom'];
  private selectedDate: any = 'last 7 days';
  private selectCustomDate: boolean = false;
  private currentEntities: any = [];
  private currentPieEntities: any = [];
  private currentPieState: string = '';
  private previousPie: any = '';
  private pieEntities: any = [];
  private form: any = {
    startDate: '',
    endDate: '',
    dateRange: ''
  };
  private filterIndex: number = 0;
  private paginationPie = {
    currentPage: 1,
    entityPerPage: 0,
    totalEntity: 0
  };

  updateFilterIndex($event: any) {
    this.filterIndex = $event;
    this.initBigChart(this.filterIndex);
  }

  private bigLineChart: any = {
    allData: [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ],
    activeIndex: 0,
    chartData: {
      datasets: [
        {
          label: 'over all country',
          data: [0, 20, 10, 30, 15, 40, 20, 60, 60]
        },
        {
          label: 'region',
          data: [10, 30, 10, 30, 15, 40, 20, 60, 60]
        }
      ],
      labels: ['29-09-2020', '28-09-2020', '27-09-2020', '26-09-2020', '25-09-2020', '24-09-2020', '23-09-2020']
    },
    extraOptions: chartConfigs.blueChartOptions
  };

  @Watch('selectedDate')
  customDate(date: any) {
    if (date == 'custom') {
      this.selectCustomDate = true;
    }
  }

  @Watch('timespanFilter')
  filterDate(timespan: any) {
    var tempDateFilter = [];
    if (this.dateFilter.length == 7) {
      tempDateFilter = this.dateFilter;
    }
    if (timespan == 'weekly') {
      this.dateFilter = tempDateFilter;
      this.dateFilter.splice(0, 2);
    } else if (timespan == 'monthly') {
      this.dateFilter = tempDateFilter;
    }
  }

  expandState(event: any) {
    this.previousRegion = event.name;
    this.currentEntities = [];
    var type: any = '';
    this.overallCountry = false;
    if (event != 'overAllCountry') {
      type = this.searchTypes.findIndex((type: any) => type == this.currentState);
      this.currentState = this.searchTypes[type + 1];
    } else {
      this.currentState = 'region';
    }
    this.fetchCurrentEntity();
  }

  backOnPreviousState(currentState: any, chartType: any) {
    var type: any = '';
    type = this.searchTypes.findIndex((type: any) => type == currentState);
    if (type != 0) {
      if (chartType == 'lineChart') {
        this.currentState = this.searchTypes[type - 1];
        this.fetchCurrentEntity();
      } else {
        this.currentPieState = this.searchTypes[type - 1];
        this.fetchPieEntity();
      }
    } else {
      if (chartType == 'lineChart') {
        this.currentState = 'overAllCountry';
        this.currentEntities = [];
      } else {
        this.currentPieState = 'overAllCountry';
        this.pieEntities = [];
      }
    }
    if (currentState == 'region') {
      if (chartType == 'lineChart') {
        this.previousRegion = '';
      } else {
        this.previousPie = '';
      }
    }
  }

  TopState(chartType: any) {
    if (chartType == 'lineChart') {
      this.currentState = 'overAllCountry';
      this.currentEntities = [];
      this.previousRegion = '';
    } else {
      this.currentPieState = 'overAllCountry';
      this.pieEntities = [];
      this.previousPie = '';
    }
  }

  @Watch('pagination.currentPage')
  fetchCurrentEntity() {
    this.$http
      .get(
        this.$api(
          this.currentState == 'region'
            ? `/territories?parent_id=1&page=${this.pagination.currentPage}`
            : `/territories?parent_id=2&page=${this.pagination.currentPage}`
        )
      )
      .then(response => {
        this.currentEntities = response.data.territories;
        this.setPagination(response.data);
      });
  }

  @Watch('paginationPie.currentPage')
  fetchPieEntity() {
    this.$http
      .get(
        this.$api(
          this.currentPieState == 'region'
            ? `/territories?parent_id=1&page=${this.paginationPie.currentPage}`
            : `/territories?parent_id=2&page=${this.paginationPie.currentPage}`
        )
      )
      .then(response => {
        this.pieEntities = response.data.territories;

        this.paginationPie.currentPage = response.data.current_page;
        this.paginationPie.entityPerPage = response.data.per_page;
        this.paginationPie.totalEntity = response.data.total;
      });
  }

  close(btnName: any) {
    if (btnName == 'close') {
      this.form.dateRange = '';
    }
    this.selectCustomDate = false;
    this.selectedDate = 'last 7 days';
  }

  initBigChart(index: any) {
    let chartData = {
      datasets: [
        {
          label: 'Performance',
          data: this.bigLineChart.allData[index]
        }
      ],
      labels:
        index == 1
          ? ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          : index == 0
          ? ['29-09-2020', '28-09-2020', '27-09-2020', '26-09-2020', '25-09-2020', '24-09-2020', '23-09-2020']
          : index == 2
          ? ['Jan-April', 'May-August', 'September-December']
          : ''
    };
    this.bigLineChart.chartData = chartData;
    this.bigLineChart.activeIndex = index;
  }

  private ordersChart: any = {
    chartData: {
      labels: ['Aug, 2020', 'Aug, 2019'],
      datasets: [
        {
          label: 'Target',
          data: [25000, 20000],
          backgroundColor: [Charts.colors.theme['warning'], Charts.colors.theme['warning']]
        },
        {
          label: 'Achievement',
          data: [15000, 30000],
          backgroundColor: [Charts.colors.theme['success'], Charts.colors.theme['success']]
        }
      ]
    }
  };

  private pieChart: any = {
    chartData: {
      labels: ['Target', 'Achievement'],
      datasets: [
        {
          data: [2500, 2000],
          backgroundColor: [Charts.colors.theme['warning'], Charts.colors.theme['success']],
          label: 'Dataset 1'
        }
      ]
    }
  };

  expandTargetVsAchieve() {
    this.fetchPieEntity();
  }

  updatePieChart(event: any) {}
  randomScalingFactor() {
    return Math.round(Math.random() * 100);
  }

  todaysDate() {
    var currentDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return currentDate;
  }
}
</script>
<style>
.cardStyle {
  min-height: 500px;
  position: relative;
}
</style>
