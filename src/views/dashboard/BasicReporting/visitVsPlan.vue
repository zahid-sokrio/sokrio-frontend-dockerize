<template>
<div class="col-xl-4 col-md-6 ">
    <div v-if="loading" class="loading" align="center">
        <span class="h2 font-weight-bold mb-0">
            <i class="el-icon-loading"></i>
        </span>
    </div>
    <div class="chart" v-if="visitPlan.chartData.datasets.length > 0">
        <line-chart :height="350" :chart-data="visitPlan.chartData" :extra-options="visitPlan.extraOptions"> </line-chart>
    </div> 
    <h2 align="center">Planned and Visit</h2>
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
import LineChart from '@/components/argon-core/Charts/LineChart';
import moment from 'moment';
@Component({
    components: {
        LineChart
    },
})
export default class visitVsPlan extends Mixins(TaxonomyMixin) {
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
    private visitPlan: any = {
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
            }, scales: {
                xAxes: [{
                    ticks: {
                        callback: function (value: number) {
                            return moment(String(value)).format('DD');
                        }
                    }
                }]
            }
        } 
    };
    mounted() {
        this.fetch();
    }
    async fetch() {
        this.loading = true;
        this.visitPlan.chartData.datasets = []
        this.visitPlan.chartData.labels = []
        const params = {
            type: 'visitPlan',
            date: this.dateRange,
            territory_id: this.territoryId,
            user_id: this.userId
        };

        try {
            let { data } = await this.$http.get(this.$api3(`/basic-report${this.$toQueryString(params)}`)) 
            this.visitPlan.chartData.datasets = data.basicReport.datasets;
            this.visitPlan.chartData.labels = data.basicReport.labels;
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
