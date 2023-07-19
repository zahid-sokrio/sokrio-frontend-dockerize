<template>
    <div class="col-xl-8 col-md-6 "> 
        <div v-if="loading" class="loading" align="center">
            <span class="h2 font-weight-bold mb-0">
                <i class="el-icon-loading"></i>
            </span>
        </div>
        <div class="chart" v-if="coveredOutlet.chartData.datasets.length > 0">
            <bar-chart :height="350" :chart-data="coveredOutlet.chartData" :extra-options="coveredOutlet.extraOptions"></bar-chart>
        </div>
        <h2 align="center">NOT Covered Outlet %</h2>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
    Watch
} from "vue-property-decorator";
import TaxonomyMixin from "@/mixins/TaxonomyComponent"; 
// @ts-ignore
import BarChart from '@/components/argon-core/Charts/BarChart';
@Component({
    components: {
        BarChart
    },
})
export default class CoveredOutlet extends Mixins(TaxonomyMixin) {
    @Prop({
        default: ''
    })
    public dateRange!: string;
    private loading: boolean = true;
    @Prop({
        default: null
    })
    public territoryId!: number | null;
    @Prop({
        default: null
    })
    public userId!: number | null;
    private coveredOutlet: any = {
        chartData: { 
             datasets: [],
             labels: [] 
        },
        extraOptions: {
            responsive: true,
            legend: { 
                display: true,
                position: 'top'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            },

            maintainAspectRatio: false,
            cutoutPercentage: 80,
            tooltips: {
                callbacks: {
                    label: function (tooltipItem: any, data: any) {
                        return data['datasets'][0]['label'] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%'; 
                    } 
                }
            } 
        }
    };
    mounted() {
        this.fetch();
    }
    async fetch() {
        this.loading = true;
        this.coveredOutlet.chartData.datasets = [];
        this.coveredOutlet.chartData.labels = [];
        const params = {
            type: 'coveredOutlet',
            date: this.dateRange,
            territory_id: this.territoryId,
            user_id: this.userId
        };

        try {
            let { data } = await this.$http.get(this.$api3(`/basic-report${this.$toQueryString(params)}`))  
            this.coveredOutlet.chartData.datasets = data.basicReport.datasets;
            this.coveredOutlet.chartData.labels = data.basicReport.labels;
        }
        // catch (e) {
        //
        // }
        finally {
            this.loading = false
        }
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
