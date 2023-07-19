<template>
  <card>
    <template slot="header">
      <!-- Subtitle -->
      <h6 class="surtitle">Revenue</h6>
      <!-- Title -->
      <h5 class="h3 mb-0">Target VS Achievement</h5>
    </template>
    <div class="cardStyle">
      <a href="" @click.prevent="expandPieState('overAllCountry')" v-if="!previousPie">
        <clickable-pie-chart :height="300" :chart-data="pieChart.chartData"></clickable-pie-chart>
      </a>
      <!--            <div class="row">-->
      <!--                <div class="col-md-12" v-if="currentPieState != 'overAllCountry'">-->
      <!--                    <div class="form-inline mb-1 mr-2" style="float: right">-->
      <!--                        <el-tooltip content="Back to Previous State" placement="top">-->
      <!--                            <base-button type="primary" icon size="sm" @click="backOnPreviousState(currentPieState, 'pieChart')">-->
      <!--                    <span class="btn-inner&#45;&#45;icon">-->
      <!--                      <i class="fas fa-arrow-left"></i>-->
      <!--                    </span>-->
      <!--                                <span class="btn-inner&#45;&#45;text">Back</span>-->
      <!--                            </base-button>-->
      <!--                        </el-tooltip>-->
      <!--                        <el-tooltip content="Top State" placement="top">-->
      <!--                            <base-button type="primary" icon size="sm" @click="TopState('pieChart')">-->
      <!--                    <span class="btn-inner&#45;&#45;icon">-->
      <!--                      <i class="fas fa-arrow-up"></i>-->
      <!--                    </span>-->
      <!--                                <span class="btn-inner&#45;&#45;text">Top</span>-->
      <!--                            </base-button>-->
      <!--                        </el-tooltip>-->
      <!--                        <dashboard-territory-lazy-dropdown class="ml-2" :placeholder="currentPieState.replace(/^\w/, c => c.toUpperCase())" v-model="form.regionId" :end-point="currentPieState == 'region' ? 'territories?parent_id=1': 'territories?parent_id=2'"></dashboard-territory-lazy-dropdown>-->
      <!--                    </div>-->
      <!--                </div>-->
      <!--                <div class="col-md-12" v-if="currentPieState != ''">-->
      <!--                    <div class="text-center mb-3" v-if="pieEntities == '' && currentPieState != 'overAllCountry'">-->
      <!--                        <b>No Data Found</b>-->
      <!--                    </div>-->
      <!--                    <div class="form-inline mb-1 ">-->
      <!--                        <div class="col-xl-6 col-md-6" v-for="(pieData,index) in pieEntities" :key="index">-->
      <!--                            <a @click.prevent="expandPieState(currentPieState)">-->
      <!--                                <clickable-pie-chart-->
      <!--                                        :height = "200"-->
      <!--                                        :chart-data="pieChart.chartData"-->
      <!--                                ></clickable-pie-chart>-->
      <!--                                <h5 class="text-center mb-2">{{ pieData.name }}</h5>-->
      <!--                            </a>-->
      <!--                        </div>-->
      <!--                    </div>-->
      <!--                    <base-pagination-->
      <!--                            class="mt-3 offset-md-4 col-md-4"-->
      <!--                            v-if="pieEntities.length > 0"-->
      <!--                            v-model="paginationPie.currentPage"-->
      <!--                            :perPage="paginationPie.entityPerPage"-->
      <!--                            :total="paginationPie.totalEntity"-->
      <!--                            align="center"-->
      <!--                    ></base-pagination>-->
      <!--                </div>-->
      <!--            </div>-->
    </div>
  </card>
</template>
<script lang="ts">
import { Component, Mixins, Vue, Watch, Prop } from 'vue-property-decorator';
import DashboardTerritoryLazyDropdown from '@/components/lazyDropdown/DashboardTerritoryLazyDropdown.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import ClickablePieChart from '@/components/ClickablePieChart.vue';

@Component({
  components: {
    DashboardTerritoryLazyDropdown,
    ClickablePieChart
  }
})
export default class TargetVsAchievement extends Mixins(PaginationComponentMixin) {
  @Prop() pieChart!: any;
  @Prop() searchTypes!: any;
  private currentPieState: string = 'overAllCountry';
  private previousPie: string = '';

  expandPieState(event: any) {
    var type: any = '';
    this.previousPie = event.name;
    if (event != 'overAllCountry') {
      type = this.searchTypes.findIndex((type: any) => type == this.currentPieState);
      this.currentPieState = this.searchTypes[type + 1];
    } else {
      this.currentPieState = 'region';
    }
    this.$emit('expandTargetVsAchieve', null);
  }
}
</script>
