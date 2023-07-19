<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-2">
          <TerritoryTypeAutocomplete v-model="selectedTerritoryType" label="Territory Type"></TerritoryTypeAutocomplete>
        </div>
        <div class="col-3">
          <TerritoryAutocomplete
            :disabled="!selectedTerritoryType"
            v-model="selectedTerritory"
            :fetch-on-change-disable="false"
            :end-point="`territories${selectedTerritoryType ? '?territory_type=' + selectedTerritoryType : ''}`"
            label="Territory"
          >
          </TerritoryAutocomplete>
        </div>
        <div class="col-3">
          <MemberAutocomplete
            :disabled="!selectedTerritory"
            label="User"
            :fetch-on-change-disable="false"
            :end-point="`users${selectedTerritoryType ? '?t=' + selectedTerritory : ''}`"
            v-model="selectedUser"
          >
          </MemberAutocomplete>
        </div>
        <div class="col-4" @click="selectedButton = ''">
          <DateRange label-prop="Date Range" :key="selectedDateRange" v-model="selectedDateRange"></DateRange>
        </div>
      </div>
      <div class="row justify-content-center">
        <el-button-group :key="selectedButton">
          <el-button :type="selectedButton == 'Today' ? 'info' : ''" @click="updateDateRange('Today')">Today</el-button>
          <el-button :type="selectedButton == 'WTD' ? 'info' : ''" @click="updateDateRange('WTD')">WTD</el-button>
          <el-button :type="selectedButton == 'MTD' ? 'info' : ''" @click="updateDateRange('MTD')">MTD</el-button>
          <el-button :type="selectedButton == 'QTD' ? 'info' : ''" @click="updateDateRange('QTD')">QTD</el-button>
          <el-button :type="selectedButton == 'YTD' ? 'info' : ''" @click="updateDateRange('YTD')">YTD</el-button>
        </el-button-group>
      </div>
      <div class="row">
        <div v-show="error" class="col-6 offset-3">
          <div class="error-notice">
            <div class="oaerror danger">
              <div class="form-inline">
                <strong><small class="mr-2" style="font-size: x-small">❌</small> {{ error }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="row pl-3">
        <ScheduleCall
          :territory-id="selectedTerritory"
          :user-id="selectedUser"
          :date-range="selectedDateRange"
          v-on:scheduleResult="scheduleCallFunction($event)"
        />
        <OutletVisit
          :territory-id="selectedTerritory"
          :user-id="selectedUser"
          :date-range="selectedDateRange"
          v-on:outletVisitResult="outletVisitFunction($event)"
        />
        <!-- strike rate -->
        <div class="col-xl-3 col-md-6 ">
          <dashboard-stats-card icon="ni ni-sound-wave" title="" type="gradient-green">
            <h5 class="card-title text-uppercase text-muted mb-0">Visited (%)</h5>
            <span class="h2 font-weight-bold mb-0">
              {{ outletVisitValue === 0 || scheduleCallValue === 0 ? 0 : ((outletVisitValue / scheduleCallValue) * 100).toFixed(2) }}
            </span>
          </dashboard-stats-card>
        </div>
        <NewOutlet :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
      </div>
      <div class="row pl-3">
        <OrderAmount :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
        <OrderCreated
          :territory-id="selectedTerritory"
          :user-id="selectedUser"
          :date-range="selectedDateRange"
          v-on:totalNumberOfOrderResult="totalNumberOfOrderFunction($event)"
        />
        <AverageOrder :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
        <LinePerCallOrder :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange"> </LinePerCallOrder>
      </div>
      <div class="row pl-3">
        <InvoiceAmount :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
        <InvoiceCreated :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
        <AverageInvoice :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
        <LinePerCall :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange"> </LinePerCall>
      </div>
      <div class="row pl-3">
        <!-- schedule productivity -->
        <div class="col-xl-3 col-md-6 ">
          <dashboard-stats-card icon="ni ni-sound-wave" title="" type="gradient-green">
            <h5 class="card-title text-uppercase text-muted mb-0">Schedule productivity (%)</h5>
            <span class="h2 font-weight-bold mb-0">
              {{ totalNumberOfOrderValue === 0 || scheduleCallValue === 0 ? 0 : ((totalNumberOfOrderValue / scheduleCallValue) * 100).toFixed(2) }}
            </span>
          </dashboard-stats-card>
        </div>
        <!-- visit productivity -->
        <div class="col-xl-3 col-md-6 ">
          <dashboard-stats-card icon="ni ni-sound-wave" title="" type="gradient-green">
            <h5 class="card-title text-uppercase text-muted mb-0">Visit productivity (%)</h5>
            <span class="h2 font-weight-bold mb-0">
              {{ totalNumberOfOrderValue === 0 || outletVisitValue === 0 ? 0 : ((totalNumberOfOrderValue / outletVisitValue) * 100).toFixed(2) }}
            </span>
          </dashboard-stats-card>
        </div>
        <OrderCancelledAmount :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
        <DeliveryLeadTime :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
      </div>
      <!-- <div class="row pl-3">
        <InvoiceVsDelivered :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
        <TargetVsAchievementRevenue :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
        <TargetVsAchievementVisit :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
        <InvoiceVsShopVisit :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
      </div> -->
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Mixins, Watch, Prop } from 'vue-property-decorator'; // @ts-ignore
  // @ts-ignore
  import PieChart from '@/components/argon-core/Charts/PieChart';
  // @ts-ignore
  import { Charts } from '@/components/argon-core/Charts/config';
  import DashboardStatsCard from '@/components/DashboardStatsCard.vue';
  import 'flatpickr/dist/flatpickr.css';
  import TaxonomyMixin from '@/mixins/TaxonomyComponent';
  import TerritoryTypeAutocomplete from '@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue';
  import TerritoryAutocomplete from '@/components/resources-autocomplete/TerritoryAutocomplete.vue';
  import DateRange from '@/components/DateRange.vue';
  import { QueryBuilder } from '@/classes/QueryBuilder';
  import { ButtonGroup, Button } from 'element-ui';
  import moment from 'moment';
  import MemberAutocomplete from '@/components/resources-autocomplete/MemberAutocomplete.vue';
  import DailyReport from '@/intefaces/DailyReport';
  import OutletVisit from '@/views/dashboard/TodaysData/OutletVisit.vue';
  import ScheduleCall from '@/views/dashboard/TodaysData/ScheduleCall.vue';
  import NewOutlet from '@/views/dashboard/TodaysData/NewOutlet.vue';
  import DeliveryLeadTime from '@/views/dashboard/TodaysData/DeliveryLeadTime.vue';
  import OrderCancelledAmount from '@/views/dashboard/TodaysData/OrderCancelledAmount.vue';
  import InvoiceAmount from '@/views/dashboard/TodaysData/InvoiceAmount.vue';
  import InvoiceCreated from '@/views/dashboard/TodaysData/InvoiceCreated.vue';
  import AverageInvoice from '@/views/dashboard/TodaysData/AverageInvoice.vue';
  import LinePerCall from '@/views/dashboard/TodaysData/LinePerCall.vue';
  import TargetVsAchievement from '@/views/dashboard/TodaysData/Charts/TargetVsAchievementRevenue.vue';
  import InvoiceVsDelivered from '@/views/dashboard/TodaysData/Charts/InvoiceVsDelivered.vue';
  import TargetVsAchievementVisit from '@/views/dashboard/TodaysData/Charts/TargetVsAchievementVisit.vue';
  import TargetVsAchievementRevenue from '@/views/dashboard/TodaysData/Charts/TargetVsAchievementRevenue.vue';
  import InvoiceVsShopVisit from '@/views/dashboard/TodaysData/Charts/InvoiceVsShopVisit.vue';
  import OrderAmount from './OrderAmount.vue';
  import OrderCreated from './OrderCreated.vue';
  import AverageOrder from './AverageOrder.vue';
  import LinePerCallOrder from './LinePerCallOrder.vue';

  const flatPicker = require('vue-flatpickr-component');

  @Component({
    components: {
      InvoiceVsShopVisit,
      TargetVsAchievementRevenue,
      TargetVsAchievementVisit,
      InvoiceVsDelivered,
      TargetVsAchievement,
      LinePerCall,
      AverageInvoice,
      InvoiceCreated,
      InvoiceAmount,
      OrderCancelledAmount,
      DeliveryLeadTime,
      NewOutlet,
      OutletVisit,
      ScheduleCall,
      MemberAutocomplete,
      TerritoryAutocomplete,
      TerritoryTypeAutocomplete,
      PieChart,
      DashboardStatsCard,
      DateRange,
      flatPicker,
      [Button.name]: Button,
      [ButtonGroup.name]: ButtonGroup,
      OrderAmount,
      OrderCreated,
      AverageOrder,
      LinePerCallOrder
    }
  })
  export default class TodaysData extends Mixins(TaxonomyMixin) {
    private dailyReports: DailyReport = {
      invoiceCreated: 0,
      invoiceDelivered: 0,
      invoiceAmount: 0,
      invoiceOrderRatio: 0,
      linePerCall: 0,
      revenueTarget: 0,
      visitTarget: 0,
      achievedRevenueTarget: 0,
      achievedVisitTarget: 0,
      deliveryLeadTime: 0,
      outletsCreated: 0,
      outletsVisited: 0,
      ordersCancelled: 0,
      avgInvoice: 0,
      orderCancelledAmount: 0
    };
    private selectedDate: any = '';
    private selectedDateRange: string = moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD');
    private selectedTerritoryType: number | null = null;
    private selectedTerritory: number | null = null;
    private selectedUser: number | null = null;
    private selectedButton: string = 'Today';
    private error: string = '';
    private isFetchData: boolean = false;
    private loading: boolean = false;
    private queryBuilder: QueryBuilder = new QueryBuilder();
    private scheduleCallValue: number = 0;
    private outletVisitValue: number = 0;
    private totalNumberOfOrderValue: number = 0;

    private InvoicePieChart: any = {
      chartData: {
        labels: ['Invoice', 'Delivery'],
        datasets: [
          {
            data: [],
            backgroundColor: [Charts.colors.theme['success'], Charts.colors.theme['info']],
            label: 'Dataset 1'
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

    private RevenuePieChart: any = {
      chartData: {
        labels: ['Revenue Target', 'Achievement'],
        datasets: [
          {
            data: [],
            backgroundColor: [Charts.colors.theme['warning'], Charts.colors.theme['primary']],
            label: 'Dataset 1'
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

    private visitTarget: any = {
      chartData: {
        labels: ['Visit Target', 'Achievement'],
        datasets: [
          {
            data: [],
            backgroundColor: [Charts.colors.theme['primary'], Charts.colors.theme['success']],
            label: 'Dataset 1'
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

    private invoiceVsShopVisit: any = {
      chartData: {
        labels: ['No. of Invoice', 'Shop Visited'],
        datasets: [
          {
            data: [],
            backgroundColor: [Charts.colors.theme['primary'], Charts.colors.theme['success']],
            label: 'Dataset 1'
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

    // get avgInvoice() {
    //   if (this.dailyReports.invoiceCreated != 0) {
    //     return this.dailyReports.invoiceAmount / this.dailyReports.invoiceCreated;
    //   } else {
    //     return 0;
    //   }
    // }

    scheduleCallFunction(value: number) {
      this.scheduleCallValue = value;
    }
    outletVisitFunction(value: number) {
      this.outletVisitValue = value;
    }
    totalNumberOfOrderFunction(value: number) {
      this.totalNumberOfOrderValue = value;
    }

    get getCurrency() {
      return this.$store.getters['Settings/getCurrency'];
    }

    @Watch('queryBuilder.watch')
    fetchTodyasData() {
      this.loading = true;
      this.invoiceVsShopVisit.chartData.datasets[0].data = [];
      this.InvoicePieChart.chartData.datasets[0].data = [];
      this.visitTarget.chartData.datasets[0].data = [];
      this.RevenuePieChart.chartData.datasets[0].data = [];
      this.isFetchData = false;
      // this.$http
      //   .get(this.$api(`/daily-reports${this.queryBuilder.getFilters(true)}`))
      //   .then((response) => {
      //     this.dailyReports = response.data.dailyReports;
      //     this.InvoicePieChart.chartData.datasets[0].data.push(this.dailyReports.invoiceAmount, this.dailyReports.invoiceDelivered);
      //     this.invoiceVsShopVisit.chartData.datasets[0].data.push(this.dailyReports.invoiceCreated, this.dailyReports.outletsVisited);
      //     this.visitTarget.chartData.datasets[0].data.push(this.dailyReports.visitTarget, this.dailyReports.achievedVisitTarget);
      //     this.RevenuePieChart.chartData.datasets[0].data.push(this.dailyReports.achievedRevenueTarget, this.dailyReports.revenueTarget);
      //     this.isFetchData = true;
      //   })
      //   .catch((error) => {
      //     this.isFetchData = true;
      //     this.error = error.response.data.errors.manager[0];
      //   });
    }

    @Watch('selectedTerritoryType')
    onChangeTerritoryType(value: number) {}

    @Watch('selectedTerritory')
    onChangeTerritory(value: number) {
      this.queryBuilder.addListener('territory_id', value);
    }

    @Watch('selectedUser')
    onChangeUser(value: number) {
      this.queryBuilder.addListener('user_id', value);
    }

    @Watch('selectedDateRange')
    onChangeDateRange(value: string) {
      this.queryBuilder.addListener('range', value);
    }

    todaysDate() {
      var currentDate = new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, '/');
      return currentDate;
    }

    updateDateRange(range: string) {
      this.selectedButton = range;
      if (range === 'Today') {
        this.selectedDateRange = moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD');
      } else if (range === 'WTD') {
        this.selectedDateRange =
          moment()
            .day(-1)
            .format('YYYY-MM-DD') +
          ',' +
          moment().format('YYYY-MM-DD');
      } else if (range === 'MTD') {
        this.selectedDateRange =
          moment()
            .startOf('month')
            .format('YYYY-MM-DD') +
          ',' +
          moment().format('YYYY-MM-DD');
      } else if (range === 'QTD') {
        this.selectedDateRange =
          moment()
            .startOf('quarter')
            .format('YYYY-MM-DD') +
          ',' +
          moment().format('YYYY-MM-DD');
      } else if (range === 'YTD') {
        this.selectedDateRange =
          moment()
            .startOf('year')
            .format('YYYY-MM-DD') +
          ',' +
          moment().format('YYYY-MM-DD');
      }
    }

    created() {
      this.fetchTodyasData();
    }
  }
</script>
<style>
  .error-notice {
    margin: 5px;
  }

  .oaerror {
    width: 90%;
    background-color: #ffffff;
    padding: 10px;
    border: 1px solid #eee;
    border-left-width: 5px;
    border-radius: 5px;
    margin: 5px auto;
    font-family: 'Open Sans', sans-serif;
    font-size: 13px;
  }

  .danger {
    border-left-color: #d9534f; /* Left side border color */
    background-color: rgba(217, 83, 79, 0.1); /*Same color as the left border with reduced alpha to 0.1*/
  }

  .danger strong {
    color: #d9534f;
  }
</style>
