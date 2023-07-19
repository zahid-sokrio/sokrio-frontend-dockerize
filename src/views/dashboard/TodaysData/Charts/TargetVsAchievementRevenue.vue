<template>
  <div class="col-xl-3">
    <card>
      <template slot="header">
        <!-- Subtitle -->
        <h6 class="surtitle">Revenue</h6>
        <!-- Title -->
        <h5 class="h3 mb-0">Target vs Achievement</h5>
      </template>
      <div class="chart">
        <div class="text-center">
          <b v-if="achievedRevenueTarget == 0 && revenueTarget == 0"> No Data
            Found </b>
        </div>
        <pie-chart v-if="!loading" :chart-data="revenuePieChart.chartData"
                   :extra-options="revenuePieChart.extraOptions"
                   :height="300"></pie-chart>
      </div>
    </card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
// @ts-ignore
import PieChart from '@/components/argon-core/Charts/PieChart';
// @ts-ignore
import { Charts } from '@/components/argon-core/Charts/config';
import axios from 'axios';

@Component({
  components: {
    PieChart
  },
})
export default class TargetVsAchievementRevenue extends Mixins(TaxonomyMixin) {

  @Prop({default: ''})
  public dateRange!: string;
  private achievedRevenueTarget: number = 0;
  private revenueTarget: number = 0;
  private loading: boolean = true;
  @Prop({default: null})
  public territoryId!: number | null;
  @Prop({default: null})
  public userId!: number | null;

  private revenuePieChart: any = {
    chartData: {
      labels: ['Revenue Target', 'Achievement'],
      datasets: [
        {
          data: [this.revenueTarget, this.achievedRevenueTarget],
          backgroundColor: [Charts.colors.theme['warning'], Charts.colors.theme['primary']],
          label: 'Dataset 1',
        },
      ],
    },
    extraOptions: {
      responsive: true,
      legend: {
        position: 'top',
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    },
  };

  initPieChart( data: Array<Number>) {
    let chartData = {
      datasets: [
        {
          label: 'Dataset',
          data: data,
          backgroundColor: [Charts.colors.theme['warning'], Charts.colors.theme['primary']]
        }
      ],
      labels: ['Revenue Target', 'Achievement'],
    };
    this.revenuePieChart.chartData = chartData;
  }

  mounted() {
    this.fetch();
  }

  @Watch('dateRange')
  @Watch('userId')
  @Watch('territoryId')
  async fetch() {
    this.loading = true;

    const achievedRevenueTargetParams = {
      only: 'achievedRevenueTarget',
      range: this.dateRange,
      territory_id: this.territoryId,
      user_id: this.userId
    };

    const revenueTargetParams = {
      only: 'revenueTarget',
      range: this.dateRange,
      territory_id: this.territoryId,
      user_id: this.userId
    };

    axios.all([
      this.$http.get(this.$api(`/daily-reports${this.$toQueryString(achievedRevenueTargetParams)}`)),
      this.$http.get(this.$api(`/daily-reports${this.$toQueryString(revenueTargetParams)}`))
    ]).then(axios.spread((data1, data2) => {
      this.achievedRevenueTarget = data1.data.dailyReports.achievedRevenueTarget;
      this.revenueTarget = data2.data.dailyReports.revenueTarget;
      this.initPieChart([this.achievedRevenueTarget, this.revenueTarget])
    })).finally(() => {
      this.loading = false
    })
  }
}
</script>

<style scoped>

</style>
