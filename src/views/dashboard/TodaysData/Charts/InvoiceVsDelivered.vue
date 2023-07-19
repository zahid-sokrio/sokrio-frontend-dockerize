<template>
  <div class="col-xl-3">
    <card>
      <template slot="header">
        <!-- Subtitle -->
        <h6 class="surtitle">DAILY</h6>
        <!-- Title -->
        <h5 class="h3 mb-0">{{ getTaxonomy('invoice') }} vs Delivered</h5></template>
      <div class="chart">
        <div class="text-center">
          <b v-if="invoiceCreated == 0 && invoiceDelivered == 0"> No Data
            Found </b>
        </div>
        <pie-chart v-if="!loading" :chart-data="invoiceDeliveryPieChart.chartData"
                   :extra-options="invoiceDeliveryPieChart.extraOptions"
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
export default class InvoiceVsDelivered extends Mixins(TaxonomyMixin) {

  @Prop({default: ''})
  public dateRange!: string;
  private invoiceCreated: number = 0;
  private invoiceDelivered: number = 0;
  private loading: boolean = true;
  @Prop({default: null})
  public territoryId!: number | null;
  @Prop({default: null})
  public userId!: number | null;

  private invoiceDeliveryPieChart: any = {
    chartData: {
      labels: ['Invoice', 'Delivery'],
      datasets: [
        {
          data: [this.invoiceCreated, this.invoiceDelivered],
          backgroundColor: [Charts.colors.theme['success'], Charts.colors.theme['info']],
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
          backgroundColor: [Charts.colors.theme['success'], Charts.colors.theme['info']]
        }
      ],
      labels: ['Invoice', 'Delivery'],
    };
    this.invoiceDeliveryPieChart.chartData = chartData;
  }


  mounted() {
    this.fetch();
  }

  @Watch('dateRange')
  @Watch('userId')
  @Watch('territoryId')
  async fetch() {
    this.loading = true;

    const invoiceCreatedParams = {
      only: 'invoiceCreated',
      range: this.dateRange,
      territory_id: this.territoryId,
      user_id: this.userId
    };

    const invoiceDeliveredParams = {
      only: 'invoiceDelivered',
      range: this.dateRange,
      territory_id: this.territoryId,
      user_id: this.userId
    };

    axios.all([
      this.$http.get(this.$api(`/daily-reports${this.$toQueryString(invoiceCreatedParams)}`)),
      this.$http.get(this.$api(`/daily-reports${this.$toQueryString(invoiceDeliveredParams)}`))
    ]).then(axios.spread((data1, data2) => {
      this.invoiceCreated = data1.data.dailyReports.invoiceCreated;
      this.invoiceDelivered = data2.data.dailyReports.invoiceDelivered;
      this.initPieChart([this.invoiceCreated, this.invoiceDelivered])
    })).finally(() => {
      this.loading = false
    })
  }
}
</script>

<style scoped>

</style>
