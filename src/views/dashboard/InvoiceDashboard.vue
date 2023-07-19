<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-4">
          <div class="form-inline">
            <h3 class="mb-0">Invoice</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row pl-3">
      <div class="col-xl-6 col-md-6">
        <card>
          <template slot="header">
            <!-- Subtitle -->
            <h6 class="surtitle">Invoice</h6>
            <div class="form-inline justify-content-between">
              <!-- Title -->
              <h5 class="h3 mb-0">Avg. Invoice / Memo Size</h5>

              <div class="form-inline">
                <base-dropdown :menuOnRight="true" v-if="selectedGraph == 'trends'">
                  <base-button size="sm" slot="title-container" type="primary" class="dropdown-toggle">
                    {{ timespanFilter.replace(/^\w/, (c) => c.toUpperCase()) }}
                  </base-button>
                  <a
                    v-for="(timespan, index) in timespans"
                    @click.prevent="(timespanFilter = timespan), initBigChart(index)"
                    :key="index"
                    class="dropdown-item"
                    href="#"
                  >
                    {{ timespan.replace(/^\w/, (c) => c.toUpperCase()) }}
                  </a>
                </base-dropdown>
                <base-dropdown :menuOnRight="true" v-if="selectedGraph == 'trends'">
                  <base-button size="sm" slot="title-container" type="primary" class="dropdown-toggle">
                    {{ selectedDate.replace(/^\w/, (c) => c.toUpperCase()) }}
                  </base-button>
                  <a v-for="(date, index) in dateFilter" @click.prevent="selectedDate = date" :key="index" class="dropdown-item" href="#">
                    {{ date.replace(/^\w/, (c) => c.toUpperCase()) }}
                  </a>
                </base-dropdown>
                <el-tooltip content="Toggle between graphs" placement="top">
                  <base-dropdown :menuOnRight="true">
                    <base-button size="sm" slot="title-container" type="primary" class="dropdown-toggle">
                      {{ selectedGraph.replace(/^\w/, (c) => c.toUpperCase()) }}
                    </base-button>
                    <a v-for="(option, index) in toogleGraphs" @click.prevent="selectedGraph = option" :key="index" class="dropdown-item" href="#">
                      {{ option.replace(/^\w/, (c) => c.toUpperCase()) }}
                    </a>
                  </base-dropdown>
                </el-tooltip>
              </div>
            </div>
          </template>
          <div class="cardStyle" v-if="selectedGraph == 'absolute number'">
            <a href="#" @click.prevent="expandState('overAllCountry')" v-if="!previousRegion">
              <dashboard-stats-card title="Avg. Invoice / Memo Size" type="gradient-green" sub-title="24" icon="ni ni-money-coins">
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
                <div class="offset-col-md-3 col-md-9 form-inline mb-1 mr-2" style="margin: 0 auto">
                  <el-tooltip content="Back to Previous State" placement="top">
                    <base-button type="primary" icon size="sm" @click="backOnPreviousState">
                      <span class="btn-inner--icon">
                        <i class="fas fa-arrow-left"></i>
                      </span>
                      <span class="btn-inner--text">Back</span>
                    </base-button>
                  </el-tooltip>
                  <el-tooltip content="Top State" placement="top">
                    <base-button type="primary" icon size="sm" @click="TopState">
                      <span class="btn-inner--icon">
                        <i class="fas fa-arrow-up"></i>
                      </span>
                      <span class="btn-inner--text">Top</span>
                    </base-button>
                  </el-tooltip>
                  <territory-lazydropdown
                    class="ml-2"
                    :placeholder="currentState.replace(/^\w/, (c) => c.toUpperCase())"
                    v-model="form.regionId"
                    :end-point="currentState == 'region' ? 'territories?parent_id=1' : 'territories?parent_id=2'"
                  ></territory-lazydropdown>
                </div>
              </div>
              <div class="col-md-12" v-if="currentState != ''">
                <div class="text-center mb-3" v-if="currentEntities == '' && currentState != 'overAllCountry'">
                  <b>No Data Found</b>
                </div>
                <div class="form-inline mb-1">
                  <div class="col-xl-6 col-md-6" v-for="territory in currentEntities" :key="territory.id">
                    <a href="#" @click.prevent="expandState(territory)">
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
              <div class="card" v-if="timespanFilter == 'daily'">
                <base-input label="Select Date Range">
                  <date-picker v-model="date" type="date" range placeholder="Pick a date range" value-type="YYYY-MM-DD"></date-picker>
                </base-input>
              </div>
              <div class="card" v-if="timespanFilter == 'weekly'">
                <div class="row">
                  <div class="col-6">
                    <base-input label="Start Week">
                      <date-picker v-model="week.from" type="week" placeholder="Pick a week" value-type="YYYY-MM-DD"></date-picker>
                    </base-input>
                  </div>
                  <div class="col-6">
                    <base-input label="End Week">
                      <date-picker v-model="week.to" type="week" placeholder="Pick a week" value-type="YYYY-MM-DD"></date-picker>
                    </base-input>
                  </div>
                </div>
              </div>
              <div class="card" v-if="timespanFilter == 'monthly'">
                <div class="row">
                  <div class="col-6">
                    <base-input label="Start Month">
                      <date-picker v-model="month.from" type="month" placeholder="Pick a month" value-type="YYYY-MM-DD"></date-picker>
                    </base-input>
                  </div>
                  <div class="col-6">
                    <base-input label="End Month">
                      <date-picker v-model="month.to" type="month" placeholder="Pick a month" value-type="YYYY-MM-DD"></date-picker>
                    </base-input>
                  </div>
                </div>
              </div>
              <div class="card" v-if="timespanFilter == 'quarterly'">
                <div class="row">
                  <div class="col-7">
                    <base-input label="Start Year">
                      <date-picker v-model="quarter.yearFrom" type="year" placeholder="Pick a year" value-type="YYYY"></date-picker>
                    </base-input>
                  </div>
                  <div class="col-5">
                    <base-input label="Start Quarter" v-if="quarter.yearFrom">
                      <base-dropdown id="order-filter-dropdown" :menuOnRight="true">
                        <base-button size="sm" slot="title-container" type="secondary" class="dropdown-toggle">
                          {{ quarter.quarterFrom.replace(/^\w/, (c) => c.toUpperCase()) }}
                        </base-button>
                        <a
                          v-for="(status, index) in quarterFilters"
                          @click.prevent="quarterStartDate(status)"
                          :key="index"
                          class="dropdown-item"
                          href="#"
                        >
                          {{ status }}
                        </a>
                      </base-dropdown>
                    </base-input>
                  </div>
                </div>
              </div>
              <div class="card" v-if="timespanFilter == 'quarterly'">
                <div class="row">
                  <div class="col-7">
                    <base-input label="End Year">
                      <date-picker v-model="quarter.yearTo" type="year" placeholder="Pick a year" value-type="YYYY"></date-picker>
                    </base-input>
                  </div>
                  <div class="col-5">
                    <base-input label="End Quarter" v-if="quarter.yearTo">
                      <base-dropdown id="order-filter-dropdown" :menuOnRight="true">
                        <base-button size="sm" slot="title-container" type="secondary" class="dropdown-toggle">
                          {{ quarter.quarterTo.replace(/^\w/, (c) => c.toUpperCase()) }}
                        </base-button>
                        <a
                          v-for="(status, index) in quarterFilters"
                          @click.prevent="quarterEndDate(status)"
                          :key="index"
                          class="dropdown-item"
                          href="#"
                        >
                          {{ status }}
                        </a>
                      </base-dropdown>
                    </base-input>
                  </div>
                </div>
              </div>
              <div class="card" v-if="timespanFilter == 'yearly'">
                <div class="row">
                  <div class="col-6">
                    <base-input label="Start Year">
                      <date-picker v-model="year.from" type="year" placeholder="Pick a year" value-type="YYYY-MM-DD"></date-picker>
                    </base-input>
                  </div>
                  <div class="col-6">
                    <base-input label="End Year">
                      <date-picker v-model="year.to" type="year" placeholder="Pick a year" value-type="YYYY-MM-DD"></date-picker>
                    </base-input>
                  </div>
                </div>
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
            <h6 class="surtitle">Invoice</h6>
            <!-- Title -->
            <h5 class="h3 mb-0">No. of Invoices vs Shops</h5>
          </template>
          <div class="cardStyle">
            <clickable-pie-chart :height="300" :chart-data="pieChart.chartData" @onReceive="updatePieChart($event)"></clickable-pie-chart>
          </div>
          <div class="row">
            <div class="col-md-12" v-if="this.currentPieState != 'overAllCountry'">
              <div class="form-inline mb-1 mr-2" style="float: right">
                <el-tooltip content="Back to Previous State" placement="top">
                  <base-button type="primary" icon size="sm" @click="backOnPreviousState">
                    <span class="btn-inner--icon">
                      <i class="fas fa-arrow-left"></i>
                    </span>
                    <span class="btn-inner--text">Back</span>
                  </base-button>
                </el-tooltip>
                <el-tooltip content="Top State" placement="top">
                  <base-button type="primary" icon size="sm" @click="TopState">
                    <span class="btn-inner--icon">
                      <i class="fas fa-arrow-up"></i>
                    </span>
                    <span class="btn-inner--text">Top</span>
                  </base-button>
                </el-tooltip>
                <territory-lazydropdown
                  class="ml-2"
                  :placeholder="currentPieState.replace(/^\w/, (c) => c.toUpperCase())"
                  v-model="form.regionId"
                  :end-point="currentPieState == 'region' ? 'territories?parent_id=1' : 'territories?parent_id=2'"
                ></territory-lazydropdown>
              </div>
            </div>
            <div class="col-md-12" v-if="currentPieState != ''">
              <div class="text-center mb-3" v-if="currentPieEntities == '' && currentPieState != 'overAllCountry'">
                <b>No Data Found</b>
              </div>
              <div class="form-inline mb-1">
                <div class="col-xl-6 col-md-6" v-for="territory in currentPieEntities" :key="territory.id">
                  <a>
                    <clickable-pie-chart :height="200" :chart-data="pieChart.chartData" @onReceive="updatePieChart($event)"></clickable-pie-chart>
                    <h5 class="text-center mb-2">{{ territory.name }}</h5>
                  </a>
                </div>
              </div>
              <base-pagination
                class="mt-3 offset-md-4 col-md-4"
                v-if="currentPieEntities.length > 0"
                v-model="pagination.currentPage"
                :perPage="pagination.entityPerPage"
                :total="pagination.totalEntity"
                align="center"
                :disabled="loading"
              ></base-pagination>
            </div>
          </div>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-6 col-md-6">
        <!--                <card>-->
        <!--                    <template slot="header">-->
        <!--                        &lt;!&ndash; Subtitle &ndash;&gt;-->
        <!--                        <h6 class="surtitle">Revenue</h6>-->
        <!--                        &lt;!&ndash; Title &ndash;&gt;-->
        <!--                        <h5 class="h3 mb-0">Target VS Achiement</h5>-->
        <!--                    </template>-->
        <!--                    <div class="chart">-->
        <!--                        <pie-chart-->
        <!--                                :height="350"-->
        <!--                                :chart-data="pieChart.chartData"-->
        <!--                                :extra-options="pieChart.extraOptions"-->
        <!--                                @on-receive="update"-->
        <!--                        >-->
        <!--                        </pie-chart>-->
        <!--                    </div>-->
        <!--                </card>-->
      </div>
      <div class="col-xl-6 col-md-6">
        <card>
          <template slot="header">
            <!-- Subtitle -->
            <h6 class="surtitle">Revenue</h6>
            <!-- Title -->
            <h5 class="h3 mb-0">Comparison</h5>
          </template>
          <div class="chart">
            <bar-chart :chart-data="ordersChart.chartData" :height="350" />
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
// @ts-ignore
import LineChart from '@/components/argon-core/Charts/LineChart';
// @ts-ignore
import * as chartConfigs from '@/components/argon-core/Charts/config';
import GlobalFilter from '@/views/dashboard/GlobalFilter.vue';
// @ts-ignore
import { Charts } from '@/components/argon-core/Charts/config';
import DashboardStatsCard from '@/components/DashboardStatsCard.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import TerritoryLazydropdown from '@/components/lazyDropdown/TerritoryLazydropdown.vue';
// @ts-ignore
import BarChart from '@/components/argon-core/Charts/BarChart';
import ClickablePieChart from '@/components/ClickablePieChart.vue';
const flatPicker = require('vue-flatpickr-component');
import 'flatpickr/dist/flatpickr.css';
// @ts-ignore
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
@Component({
  components: {
    LineChart,
    GlobalFilter,
    DashboardStatsCard,
    TerritoryLazydropdown,
    BarChart,
    ClickablePieChart,
    flatPicker,
    DatePicker,
  },
})
export default class InvoiceDashboard extends Mixins(PaginationComponentMixin) {
  private isFilterModelActive: boolean = false;
  private currentState: string = 'overAllCountry';
  private currentPieState: string = 'overAllCountry';
  private previousRegion: string = '';
  private overallCountry: boolean = true;
  private searchTypes: any = ['region', 'area', 'SR', 'Route Plan', 'Outlet'];
  private toogleGraphs: any = ['absolute number', 'trends'];
  private selectedGraph: any = 'absolute number';
  private timespans: any = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
  private timespanFilter: any = 'daily';
  private dateFilter: any = ['last 7 days', 'last 15 days', 'last 30 days', 'last 90 days', 'last 180 days', 'last 365 days', 'custom'];
  private quarterFilters = ['Q1 (Jan - Mar)', 'Q2 (Apr - Jun)', 'Q3 (Jul - Sep)', 'Q4 (Oct - Dec)'];
  private selectedDate: any = 'last 7 days';
  private selectCustomDate: boolean = false;
  private currentEntities: any = [];
  private currentPieEntities: any = [];
  private finalQuarterStartDate: string = '';
  private finalQuarterEndDate: string = '';
  private date: any = null;
  private week: any = {
    from: null,
    to: null,
  };
  private month: any = {
    from: null,
    to: null,
  };
  private quarter: any = {
    yearFrom: null,
    quarterFrom: 'Select Quarter',
    yearTo: null,
    quarterTo: 'Select Quarter',
  };
  private year: any = {
    from: null,
    to: null,
  };
  private form: any = {
    startDate: '',
    endDate: '',
    dateRange: '',
  };
  private filterIndex: number = 0;
  updateFilterIndex($event: any) {
    this.filterIndex = $event;
    this.initBigChart(this.filterIndex);
  }
  private bigLineChart: any = {
    allData: [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 30, 50, 25, 10, 30, 15, 40, 30],
      [0, 10, 20, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40],
      [0, 30, 25, 35, 10, 15, 20, 40, 30],
    ],
    activeIndex: 0,
    chartData: {
      datasets: [
        {
          label: 'over all country',
          data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
        },
        {
          label: 'region',
          data: [10, 30, 10, 30, 15, 40, 20, 60, 60],
        },
      ],
      labels: ['29-09-2020', '28-09-2020', '27-09-2020', '26-09-2020', '25-09-2020', '24-09-2020', '23-09-2020'],
    },
    extraOptions: chartConfigs.blueChartOptions,
  };
  @Watch('selectedDate')
  customDate(date: any) {
    if (date == 'custom') {
      this.selectCustomDate = true;
    }
  }
  @Watch('quarter.quarterFrom')
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

  @Watch('timespanFilter')
  filterDate(timespan: any) {
    var allDateFilter = ['last 7 days', 'last 15 days', 'last 30 days', 'last 90 days', 'last 180 days', 'last 365 days', 'custom'];
    if (this.dateFilter.length == 7 || timespan == 'daily') {
      this.dateFilter = allDateFilter;

      this.selectedDate = this.dateFilter[0];
    }
    if (timespan == 'weekly') {
      this.dateFilter = allDateFilter;
      this.dateFilter.splice(0, 2);
      this.selectedDate = this.dateFilter[0];
    } else if (timespan == 'monthly') {
      this.dateFilter = allDateFilter;
      this.dateFilter.splice(0, 3);
      this.selectedDate = this.dateFilter[0];
    } else if (timespan == 'quarterly') {
      this.dateFilter = allDateFilter;
      this.dateFilter.splice(0, 5);
      this.selectedDate = this.dateFilter[0];
    } else if (timespan == 'yearly') {
      this.dateFilter = allDateFilter;
      this.dateFilter.splice(0, 6);
      const today = new Date();
      const year = today.getFullYear();
      this.dateFilter.unshift('Select year');
      this.selectedDate = this.dateFilter[0];
    }
  }
  backOnPreviousState() {
    var type: any = '';
    type = this.searchTypes.findIndex((type: any) => type == this.currentState);
    if (type != 0) {
      this.currentState = this.searchTypes[type - 1];
      this.fetchCurrentEntity();
    } else {
      this.currentState = 'overAllCountry';
      this.currentEntities = [];
    }
    if (this.currentState == 'region') {
      this.previousRegion = '';
    }
  }
  TopState() {
    this.currentState = 'overAllCountry';
    this.currentEntities = [];
    this.previousRegion = '';
  }
  @Watch('pagination.currentPage')
  fetchCurrentEntity() {
    this.$http
      .get(
        this.$api(
          this.currentState == 'region'
            ? `/territories?parent_id=1&page=${this.pagination.currentPage}`
            : this.currentState == 'area'
            ? `/territories?parent_id=2&page=${this.pagination.currentPage}`
            : ''
        )
      )
      .then((response) => {
        this.currentEntities = response.data.territories;
        this.setPagination(response.data);
      });
  }
  fetchPieEntity() {
    this.$http
      .get(
        this.$api(
          this.currentPieState == 'region'
            ? `/territories?parent_id=1&page=${this.pagination.currentPage}`
            : this.currentPieState == 'area'
            ? `/territories?parent_id=2&page=${this.pagination.currentPage}`
            : ''
        )
      )
      .then((response) => {
        this.currentPieEntities = response.data.territories;
        // this.setPagination(response.data);
      });
  }
  close(btnName: any) {
    if (btnName == 'close') {
      this.form.dateRange = '';
    }
    this.selectCustomDate = false;
    if (this.timespanFilter == 'daily') {
      this.selectedDate = 'last 7 days';
    }
    if (this.timespanFilter == 'weekly') {
      this.selectedDate = 'last 30 days';
    }
    if (this.timespanFilter == 'monthly') {
      this.selectedDate = 'last 90 days';
    }
    if (this.timespanFilter == 'quarterly') {
      this.selectedDate = 'last 365 days';
    }
    if (this.timespanFilter == 'yearly') {
      this.selectedDate = 'Select year';
    }
  }
  initBigChart(index: any) {
    let chartData = {
      datasets: [
        {
          label: 'Performance',
          data: this.bigLineChart.allData[index],
        },
      ],
      labels:
        index == 2
          ? ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          : index == 0
          ? ['29-09-2020', '28-09-2020', '27-09-2020', '26-09-2020', '25-09-2020', '24-09-2020', '23-09-2020']
          : index == 1
          ? ['First Week', 'Second Week', 'Third week', 'Fourth Week']
          : index == 3
          ? ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec']
          : index == 4
          ? ['2018', '2019', '2020', '2021']
          : '',
    };
    this.bigLineChart.chartData = chartData;
    this.bigLineChart.activeIndex = index;
  }
  timespanChart(index: any) {
    let chartData = {
      datasets: [
        {
          label: 'Performance',
          data: this.bigLineChart.allData[index],
        },
      ],
      labels:
        index == 2
          ? ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          : index == 0
          ? ['29-09-2020', '28-09-2020', '27-09-2020', '26-09-2020', '25-09-2020', '24-09-2020', '23-09-2020']
          : index == 1
          ? ['First Week', 'Second Week', 'Third week', 'Fourth Week']
          : index == 3
          ? ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec']
          : index == 4
          ? ['2018', '2019', '2020', '2021']
          : '',
    };
    this.bigLineChart.chartData = chartData;
    this.bigLineChart.activeIndex = index;
  }
  private ordersChart: any = {
    chartData: {
      labels: ['Aug', 'Aug, 2019'],
      datasets: [
        {
          label: 'Sales',
          data: [25000, 20000],
        },
      ],
    },
  };
  private pieChart: any = {
    chartData: {
      labels: ['Target', 'Achievement'],
      datasets: [
        {
          data: [this.randomScalingFactor(), this.randomScalingFactor()],
          backgroundColor: ['#5e72e4', '#2dce89'],
          label: 'Dataset 1',
        },
      ],
    },
  };
  updatePieChart(event: any) {
    this.currentPieEntities = [];
    var type: any = '';
    this.overallCountry = false;
    if (event != 'overAllCountry') {
      type = this.searchTypes.findIndex((type: any) => type == this.currentPieState);
      this.currentPieState = this.searchTypes[type + 1];
    } else {
      this.currentPieState = 'region';
    }
    this.fetchPieEntity();
  }
  randomScalingFactor() {
    return Math.round(Math.random() * 100);
  }
  todaysDate() {
    var currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    return currentDate;
  }
  quarterStartDate(status: any) {
    this.quarter.quarterFrom = status;
    if (status == 'Q1 (Jan - Mar)') {
      this.finalQuarterStartDate = this.quarter.yearFrom + '-01-01';
    }
    if (status == 'Q2 (Apr - Jun)') {
      this.finalQuarterStartDate = this.quarter.yearFrom + '-04-01';
    }
    if (status == 'Q3 (Jul - Sep)') {
      this.finalQuarterStartDate = this.quarter.yearFrom + '-07-01';
    }
    if (status == 'Q4 (Oct - Dec)') {
      this.finalQuarterStartDate = this.quarter.yearFrom + '-10-01';
    }
  }
  quarterEndDate(status: any) {
    this.quarter.quarterTo = status;
    if (status == 'Q1 (Jan - Mar)') {
      this.finalQuarterEndDate = this.quarter.yearTo + '-01-01';
    }
    if (status == 'Q2 (Apr - Jun)') {
      this.finalQuarterEndDate = this.quarter.yearTo + '-04-01';
    }
    if (status == 'Q3 (Jul - Sep)') {
      this.finalQuarterEndDate = this.quarter.yearTo + '-07-01';
    }
    if (status == 'Q4 (Oct - Dec)') {
      this.finalQuarterEndDate = this.quarter.yearTo + '-10-01';
    }
  }
}
</script>
<style>
.cardStyle {
  min-height: 500px;
  position: relative;
}
</style>
