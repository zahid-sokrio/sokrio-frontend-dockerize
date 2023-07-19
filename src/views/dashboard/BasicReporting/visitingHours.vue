<template>
<div class="col-xl-12 col-md-6 pt-5">
    <div v-if="loading" class="loading" align="center">
        <span class="h2 font-weight-bold mb-0">
            <i class="el-icon-loading"></i>
        </span>
    </div>
    <div class="chart" v-if="visitingHours.chartData.datasets.length > 0">
        <line-chart :height="350"  :chart-data="visitingHours.chartData" :extra-options="visitingHours.extraOptions">
        </line-chart>
    </div> 
    <h2 align="center">Visiting Hours</h2>
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
@Component({
    components: {
        LineChart
    },
})
export default class visitingHours extends Mixins(TaxonomyMixin) {
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
    private visitingHours: any = {
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
            }
        }
    };
    mounted() {
        this.fetch();
    }
    async fetch() {
        this.loading = true;
        this.visitingHours.chartData.datasets = []
        this.visitingHours.chartData.labels = []
        const params = {
            type: 'visitingHours',
            date: this.dateRange,
            territory_id: this.territoryId,
            user_id: this.userId
        };

        try {
            let { data } = await this.$http.get(this.$api3(`/basic-report${this.$toQueryString(params)}`)) 
            this.visitingHours.chartData.datasets = data.basicReport.datasets;
            this.visitingHours.chartData.labels = data.basicReport.labels;
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
