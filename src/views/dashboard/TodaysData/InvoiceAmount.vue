<template>
  <div class="col-xl-3 col-md-6 ">
    <dashboard-stats-card
      :sub-title="result + ' ' +getCurrency"
      :title="getTaxonomy('invoice') + ' Amount'"
      icon="ni ni-money-coins"
      type="gradient-red"
      :not-loading="!loading"
    >
    </dashboard-stats-card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import DashboardStatsCard from '@/components/DashboardStatsCard.vue';

@Component({
  components: {
    DashboardStatsCard
  },
})
export default class InvoiceAmount extends Mixins(TaxonomyMixin) {
  @Prop({default: ''})
  public dateRange!: string;
  private result: number = 0;
  private loading: boolean = true;
  @Prop({default: null})
  public territoryId!: number | null;
  @Prop({default: null})
  public userId!: number | null;

  mounted() {
    this.fetch();
  }

  async fetch() {
    this.loading = true;

    const params = {
      only: 'invoiceAmount',
      range: this.dateRange,
      territory_id: this.territoryId,
      user_id: this.userId
    };

    try {
      let {data} = await this.$http.get(this.$api(`/daily-reports${this.$toQueryString(params)}`))
      this.result = data.dailyReports.invoiceAmount.toLocaleString('en-US');
    }
      // catch (e) {
      //
      // }
    finally {
      this.loading = false
    }
  }

  get getCurrency() {
    return this.$store.getters['Settings/getCurrency'];
  }

  @Watch('dateRange')
  onChangeDateRange() {
    this.fetch()
  }

  @Watch('territoryId')
  onTerritoryId() {
    this.fetch()
  }

  @Watch('userId')
  onUserId() {
    this.fetch()
  }
}
</script>

<style scoped>

</style>
