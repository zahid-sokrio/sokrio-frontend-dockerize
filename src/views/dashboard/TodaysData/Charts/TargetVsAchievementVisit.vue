<template>
  <div class="col-xl-3">
    <card>
      <template slot="header">
        <!-- Subtitle -->
        <h6 class="surtitle">Visit</h6>
        <!-- Title -->
        <h5 class="h3 mb-0">Target vs Achievement</h5>
      </template>
      <div class="chart">
        <div class="text-center">
          <b v-if="visitTarget == 0 && achievedVisitTarget == 0"> No Data
            Found </b>
        </div>
        <pie-chart v-if="!loading" :chart-data="visitTargetPieChart.chartData"
                   :extra-options="visitTargetPieChart.extraOptions" :height="300"></pie-chart>
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
export default class TargetVsAchievementVisit extends Mixins(TaxonomyMixin) {

  @Prop({default: ''})
  public dateRange!: string;
  private achievedVisitTarget: number = 0;
  private visitTarget: number = 0;
  private loading: boolean = true;
  @Prop({default: null})
  public territoryId!: number | null;
  @Prop({default: null})
  public userId!: number | null;

  private visitTargetPieChart: any = {
    chartData: {
      labels: ['Visit Target', 'Achievement'],
      datasets: [
        {
          data: [this.visitTarget, this.achievedVisitTarget],
          backgroundColor: [Charts.colors.theme['primary'], Charts.colors.theme['success']],
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
      labels: ['Visit Target', 'Achievement'],
    };
    this.visitTargetPieChart.chartData = chartData;
  }

  mounted() {
    this.fetch();
  }

  @Watch('dateRange')
  @Watch('userId')
  @Watch('territoryId')
  async fetch() {
    this.loading = true;

    const achievedVisitTargetParams = {
      only: 'achievedVisitTarget',
      range: this.dateRange,
      territory_id: this.territoryId,
      user_id: this.userId
    };

    const visitTargetParams = {
      only: 'visitTarget',
      range: this.dateRange,
      territory_id: this.territoryId,
      user_id: this.userId
    };

    axios.all([
      this.$http.get(this.$api(`/daily-reports${this.$toQueryString(achievedVisitTargetParams)}`)),
      this.$http.get(this.$api(`/daily-reports${this.$toQueryString(visitTargetParams)}`))
    ]).then(axios.spread((data1, data2) => {
      this.achievedVisitTarget = data1.data.dailyReports.achievedVisitTarget;
      this.visitTarget = data2.data.dailyReports.visitTarget;
      this.initPieChart([this.achievedVisitTarget, this.visitTarget])
    })).finally(() => {
      this.loading = false
    })
  }
}
</script>

<style scoped>

</style>
