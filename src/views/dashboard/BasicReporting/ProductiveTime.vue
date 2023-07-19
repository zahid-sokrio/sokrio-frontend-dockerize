<template>
<div class="col-xl-12 col-md-6">
    <div v-if="loading" class="loading" align="center">
        <span class="h2 font-weight-bold mb-0">
            <i class="el-icon-loading"></i>
        </span>
    </div>
    <base-button type="primary" icon size="sm" @click="isActive = true">
        <span class="btn-inner--text">Filters</span>
        <span class="btn-inner--icon">
            <i class="fas fa-filter"></i>
        </span>
    </base-button>
    <div class="chart" v-if="productiveTime.chartData.datasets.length > 0 && isFilter">
        <line-chart :height="350" :chart-data="productiveTime.chartData" :extra-options="productiveTime.extraOptions"> </line-chart>
    </div>
    <h2 align="center">AVG. Productive Time Per outlet</h2>
    <productive-time-filter :is-active.sync="isActive" :filters.sync="filters" @updateFilter="filters = $event"> </productive-time-filter>
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
import ProductiveTimeFilter from '@/views/dashboard/BasicReporting/ProductiveTimeFilter.vue';
import moment from 'moment';
// @ts-ignore
import LineChart from '@/components/argon-core/Charts/LineChart';
@Component({
    components: {
        LineChart,
        ProductiveTimeFilter
    },
})
export default class productiveTime extends Mixins(TaxonomyMixin) {
    private month: string = moment().format('MM');
    private loading: boolean = true;
    private query: any = [];
    private isActive: boolean = false;
    private isFilter = false;
    private productiveTime: any = {
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
    private filters: any = {
        month: '',
        territory_id: '',
        user_id: ''
    };
    mounted() {
        this.fetch();
    }
    async fetch() {
        this.loading = true;
        this.isFilter = false;
        this.productiveTime.chartData.datasets = []
        this.productiveTime.chartData.labels = []

        try {
            let { data } = await this.$http.get(this.$api3(`/basic-report${this.query.length > 0 ? '?' + this.query.join('&') : ''}`))
            this.productiveTime.chartData.datasets = data.basicReport.datasets;
            this.productiveTime.chartData.labels = data.basicReport.labels;
        }
        // catch (e) {
        //
        // }
        finally {
            this.loading = false;
            this.isFilter = true;
        }
    }
    @Watch('filters', {
        immediate: true,
        deep: true
    })
    onChangeFilter(newVal: any) {
        this.query = [];
        this.query.push(`type=productiveTime`);
        newVal.month ? this.query.push(`month=${newVal.month}`) : '';
        newVal.territory_id ? this.query.push(`territory_id=${newVal.territory_id}`) : '';
        newVal.user_id ? this.query.push(`user_id=${newVal.user_id}`) : '';
        this.fetch();
    }

}
</script>

<style scoped> 
</style>
