<template>
    <div class="row pl-3">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
                        <div class="row">
                            <div class="col-xs-12 col-sm-4 col-lg-3">
                                <DateRange v-model="formData.range" label-prop="Date Range (Required)" :max-date="maxDate">
                                </DateRange>
                            </div>
                            <TerritoryCascaderDropdown label="Select Territory" v-model="formData.territory_id"
                                name="territory_id"></TerritoryCascaderDropdown>
                            <div class="p-5"></div>
                            <UserLazydropdown :collapseTags="true" label="Select User" :addButton="false" :multiple="true"
                                v-model="formData.user_id" :disabled="!formData.territory_id"
                                :end-point="`users${formData.territory_id ? '?t=' + formData.territory_id : ''}`">
                            </UserLazydropdown>
                            <div class="p-4"></div>
                            <div class="col-xs-12 col-sm-2 col-lg-2">
                                <base-input label="Based On" name="achbasedOn">
                                    <el-radio-group v-model="formData.basedOn" size="small">
                                        <el-radio v-for="item in basedOnOptions" :key="item.value" :label="item.value"
                                            border>{{ item.label }}</el-radio>
                                    </el-radio-group>
                                </base-input>
                            </div>
                            <div class="col-xs-12 col-sm-4 col-lg-2">
                                <base-button class="btn-block" @click="handleSubmit(onClickGenerate)" :loading="loading"
                                    :disabled="loading" type="success" style="margin-top: 20px">
                                    <i class="fa fa-search"> Generate Report</i>
                                </base-button>
                            </div>
                        </div>
                    </validation-observer>
                    <br />
                    <div class="w-100 overflow-auto" v-if="reports.length > 0">
                        <div class="text-center">
                            <h2>KPI Report</h2>
                            <p>Date Selected: {{ formData.range.substring(0, 10) }} to {{ formData.range.substring(11) }}
                            </p>
                        </div>
                        <div class="col-12 text-right">
                            <base-button :loading="downloading" type="primary" @click="onClickDownload"> <i
                                    class="fa fa-download"></i> Download </base-button>
                        </div>
                        <div class="col-12 pl-0">
                            <div class="col-2 pl-0 float-left">
                                <h3>#Filtered Applied: <span>{{ filter_data.territory }}</span></h3>
                            </div>
                            <div class="col-2 pl-0 float-left">
                                <h3>Total Employees: <span>{{ filter_data.total_users }}</span></h3>
                            </div>
                            <div class="col-2 pl-0 float-left">
                                <h3>Based On: <span>{{ filter_data.basedOn }}</span></h3>
                            </div>
                        </div>
                        <el-table v-loading="loading" class="table-responsive  table-flush table-striped"
                            header-row-class-name="thead-light" :data="reports">
                            <el-table-column label="SL" min-width="100px" sortable type="index"></el-table-column>
                            <el-table-column v-for="(column, key) in table_fields" :key="key" :label="column.value"
                                :prop="column.name"
                                :width="column.name === 'user_name' ? '180px' : (column.name === 'user_code' ? '100px' : '')">
                                <template v-slot="{ row }">
                                    <b>{{ row[column.name] }}</b>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Vue
} from 'vue-property-decorator';
import DateRange from '@/components/DateRange.vue';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import TerritoryCascaderDropdown from '@/components/resources-autocomplete/TerritoryCascaderDropdown.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import moment from 'moment';
import {
    Radio,
    RadioGroup,
    Button
} from 'element-ui';

@Component({
    components: {
        TerritoryCascaderDropdown,
        UserLazydropdown,
        DateRange,
        ElRadio: Radio,
        ElRadioGroup: RadioGroup,
        [Button.name]: Button,
    },
})
export default class KPIReportByOrder extends Mixins(PaginationComponentMixin, Vue) {
    public downloading: boolean = false;
    public formData = {
        'range': '',
        'territory_id': '',
        'user_id': [],
        'basedOn': '',
    };
    public loading: boolean = false;
    public reports = [];
    public table_fields = [];
    public filter_data = [];
    public maxDate: string = moment().subtract(1, 'days').format('YYYY-MM-DD');

    public basedOnOptions: any = [{
        value: 'order',
        label: 'Order',
    },
    {
        value: 'delivery',
        label: 'Delivery',
    },
    ];

    public onClickGenerate() {
        if (this.formData.range === '') {
            this.$notify({
                type: 'warning',
                message: 'Select the Date range',
                title: 'Required!',
            });
        } else if (this.formData.territory_id === '') {
            this.$notify({
                type: 'warning',
                message: 'Select the Territory',
                title: 'Required!',
            });
        } else if (this.formData.basedOn === '') {
            this.$notify({
                type: 'warning',
                message: 'Select the Based on',
                title: 'Required!',
            });
        } else {
            this.fetchReport();
        }
    }

    async fetchReport() {
        this.loading = true;
        this.reports = [];
        this.$http.get(this.$api3(`/kpi-report${this.$toQueryString(this.formData)}`)).then((response) => {
            this.reports = response.data.reports;
            this.table_fields = response.data.table_fields;
            this.filter_data = response.data.filter_data;
            if (this.reports.length == 0) {
                this.$notify({
                    type: 'info',
                    message: 'Data not found!',
                    title: 'Not found!',
                });
            }
        }).catch((e) => {
            let err_msg = [];
            if (e.response.data.errors.range) {
                err_msg.push(e.response.data.errors.range[0]);
            }
            if (e.response.data.errors.territory_id) {
                err_msg.push(e.response.data.errors.territory_id[0]);
            }
            if (e.response.data.errors.basedOn) {
                err_msg.push(e.response.data.errors.territory_id[0]);
            }
            err_msg.forEach((error) => {
                this.$notify({
                    type: 'warning',
                    message: error,
                    title: 'Validation error',
                });
            });
        }).finally(() => {
            this.loading = false;
        })
    }

    async onClickDownload() {
        this.downloading = true;
        try {
            let {
                data,
                headers
            } = await this.$http.get(this.$api3(`/kpi-report${this.$toQueryString(this.formData)}&download`), {
                responseType: 'arraybuffer'
            });
            const blob = await new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const link = document.createElement("a");
            link.href = await URL.createObjectURL(blob);
            link.download = this.$getFileNameFromContentDisposition(headers);
            link.click();
        } catch (e) {
            this.$notify({
                title: 'Something wants wrong!',
                type: 'warning',
                message: 'Unable to download reports.',
            })
        } finally {
            this.downloading = false;
        }
    }
}
</script>

<style>.el-cascader .el-input .el-input__inner {
    height: 36px;
}</style>