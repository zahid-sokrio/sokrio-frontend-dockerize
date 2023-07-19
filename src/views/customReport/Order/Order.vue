<template>
<div class="card">
    <div class="card-header border-0">
        <div class="row">
            <div class="col-8">
                <ul class="list-group list-group-flush list my--3">
                    <li class="list-group-item px-0">
                        <div class="row align-items-center">
                            <div v-if="this.$route.matched.length > 3" class="col-auto">
                                <el-button @click="$router.back()" icon="fa fa-arrow-left" circle></el-button>
                            </div>
                            <div class="col ml--2">
                                <h4 class="mb-0">{{ $route.meta.label }}</h4>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="card-body" v-loading="loading">
        <div v-if="$route.name == 'custom-report-order' && loading == false" class="row pl-3">
            <div v-for="(report, index) in reports" :key="index" class="col-xl-6 col-md-6 ">
                <a href="#" @click.prevent="$router.push({ name: report.path, params: { reportId: report.id } })">
                    <stats-card type="gradient-green" :sub-title="report.name" icon="ni ni-bullet-list-67">
                        <template slot="footer">
                            <div class="row">
                                <div class="col-md-6 text-black">
                                    <span>Territory : {{ report.territories }}</span><br>
                                    <span v-if="report.parameter">Selected Values : {{ report.parameter }}</span><br>
                                    <span v-if="report.sums">Sums Of : {{ report.sums }}</span><br>
                                </div>
                                <div class="col-md-6">
                                    <el-tooltip class="ml-3" :content="report.tooltip" placement="right">
                                        <i class="fas fa-info-circle" style="color: #5e72e4; font-size: 28px; margin-right: 0.60rem; float: right"></i>
                                    </el-tooltip>
                                </div>
                            </div>
                        </template>
                    </stats-card>
                </a>
            </div>
            <div v-if="reports.length === 0" align="center" style="width: 100%;">
                <span>There is no custom generated order report</span>
            </div>
        </div>
        <router-view name="report"></router-view>
    </div>
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator';
import {
    Button
} from 'element-ui';

@Component({
    components: {
        [Button.name]: Button
    }
})
export default class Orders extends Vue {
    public reports: any[] = [];
    public loading: boolean = false;

    fetchResults() {
        this.loading = true;
        this.$http.get(this.$api3('/custom-report?type=order')).then((response) => {
            this.reports = response.data;
            this.reports.forEach((value: any) => {
                value['tooltip'] = 'Report will be generated only for custom orders report.';
                value['path'] = 'download-report-order';
            });
        }).finally(() => {
            this.loading = false;
        });
    }

    created() {
        this.fetchResults();
    }
}
</script>

<style scoped>
.text-black {
    color: #000;
    font-weight: 600;
}
</style>
