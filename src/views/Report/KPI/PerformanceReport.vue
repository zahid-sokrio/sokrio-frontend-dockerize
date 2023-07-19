<template>
<div class="col-md-12">
    <div v-if="$route.name == 'kpi'">
        <div class="col-md-6" style="float: left">
            <a href="#" @click.prevent="showDownloadModal = true">
                <stats-card title="Visit Report" type="gradient-green" sub-title="KPI Report" icon="ni ni-bullet-list-67" v-can="permissionEnum.KPI_REPORT">
                    <template slot="footer">
                        <div class="row">
                            <div class="col-md-6">
                                <!--              <span class="text-nowrap"> <i class="ni ni-email-83"></i> {{ todaysDate() | datetime('ll') }} </span>-->
                            </div>
                            <div class="col-md-6">
                                <el-tooltip class="ml-3" content="Download KPI Report" placement="right">
                                    <i class="fas fa-info-circle" style="color: #5e72e4; font-size: 28px; margin-right: 0.6rem; float: right"></i>
                                </el-tooltip>
                            </div>
                        </div>
                    </template>
                </stats-card>
            </a>

            <validation-observer v-if="showDownloadModal" v-slot="{ handleSubmit }" ref="formValidator">
                <modal :show="showDownloadModal" @close="close">
                    <template slot="header">
                        <h5 class="modal-title">Download KPI Report</h5>
                    </template>
                    <div class="card">
                        <div class="card-body">
                            <DateRange v-model="date" label-prop="Date Range"></DateRange>
                            <!--            <territory-lazydropdown-->
                            <!--                label="Territory (Optional)"-->
                            <!--                placeholder="Territory"-->
                            <!--                v-model="territory_id"-->
                            <!--                :add-button="false"-->
                            <!--            ></territory-lazydropdown>-->
                        </div>
                    </div>
                    <template slot="footer">
                        <base-button @click="close" type="secondary">Close</base-button>
                        <base-button :loading="downloading" type="primary" @click.prevent="handleSubmit(onClickDownload)">
                            <i class="fa fa-download"></i>
                        </base-button>
                    </template>
                </modal>
            </validation-observer>
        </div>

        <a href="#" @click.prevent="$router.push({ name: 'kpi-report-based-on-order' })">
            <div class="col-md-6" style="float: right">
                <stats-card title="Visit Report" type="gradient-green" sub-title="KPI Report (Based on Order)" icon="ni ni-bullet-list-67" v-can="permissionEnum.KPI_REPORT">
                    <template slot="footer">
                        <div class="row">
                            <div class="col-md-6">
                                <!--              <span class="text-nowrap"> <i class="ni ni-email-83"></i> {{ todaysDate() | datetime('ll') }} </span>-->
                            </div>
                            <div class="col-md-6">
                                <el-tooltip class="ml-3" content="Download KPI Report" placement="right">
                                    <i class="fas fa-info-circle" style="color: #5e72e4; font-size: 28px; margin-right: 0.6rem; float: right"></i>
                                </el-tooltip>
                            </div>
                        </div>
                    </template>
                </stats-card>
            </div>
        </a>
    </div>
    <!-- <router-view name="KPIReports"></router-view> -->
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue,
    Watch
} from 'vue-property-decorator';
import TerritoryLazydropdown from '@/components/lazyDropdown/TerritoryLazydropdown.vue';
import DateRange from '@/components/DateRange.vue';
import {
    QueryBuilder
} from '@/classes/QueryBuilder';
import {
    Permission as PermissionEnum
} from '@/enums/Permission';

const flatPicker = require('vue-flatpickr-component');
@Component({
    components: {
        TerritoryLazydropdown,
        flatPicker,
        DateRange,
    },
})
export default class PerformanceReport extends Vue {
    public downloading: boolean = false;
    private showDownloadModal: boolean = false;
    public territory_id: number | null = null;
    public queryBuilder: QueryBuilder = new QueryBuilder();
    public date: string = '';

    todaysDate() {
        var currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
        return currentDate;
    }

    get permissionEnum() {
        return PermissionEnum;
    }

    async onClickDownload() {
        this.downloading = true;
        try {
            let {
                data,
                headers
            } = await this.$http.get(this.$api('/performance-monitoring-report' + this.queryBuilder.getFilters(true)), {
                responseType: 'arraybuffer',
            });
            const blob = await new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const link = document.createElement('a');
            link.href = await URL.createObjectURL(blob);
            link.download = this.$getFileNameFromContentDisposition(headers);
            link.click();
        } catch (e) {
            this.$notify({
                title: 'Something wants wrong!',
                type: 'warning',
                message: 'Unable to download reports.'
            });
        } finally {
            this.downloading = false;
            this.showDownloadModal = false;
        }
    }

    @Watch('territory_id')
    onChangeTerritoryId(value: number) {
        this.queryBuilder.addListener('territory_id', value);
    }

    @Watch('date')
    onChangeRange(value: number) {
        this.queryBuilder.addListener('range', value);
    }

    close() {
        this.showDownloadModal = false;
    }
}
</script>
