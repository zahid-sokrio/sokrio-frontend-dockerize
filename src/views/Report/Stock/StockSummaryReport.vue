<template>
    <div class="card">
        <div class="card-header border-0">
            <div class="row">
                <div class="col-8">
                    <div class="form-inline">
                        <h3 class="mb-0">Stock Summary Report</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
                <div class="row">
                    <div class="col-xs-12 col-sm-4 col-lg-2 mt-1">
                        <base-input clearable label="Opening Date">
                            <el-date-picker v-model="formData.opening_date" type="date" placeholder="Opening date"
                                :picker-options="openingPickerOptions" value-format="yyyy-MM-dd"> </el-date-picker>
                        </base-input>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-lg-2 mt-1">
                        <base-input clearable label="Closing Date">
                            <el-date-picker v-model="formData.closing_date" type="date" :disabled="!formData.opening_date"
                                placeholder="Closing date" :picker-options="closingPickerOptions" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </base-input>
                    </div>
                    <div class="p-1"></div>
                    <TerritoryCascaderDropdown label="Select Territory" v-model="formData.territory_id" name="territory_id">
                    </TerritoryCascaderDropdown>
                    <div class="col-xs-12 col-sm-4 col-lg-2">
                        <department-lazydropdown v-model="formData.department_id" label="Department"
                            placeholder="e.g. ABC Store" :disabled="!formData.territory_id" :endPoint="`departments?has_outlet=0&ut=${formData.territory_id}`"></department-lazydropdown>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-lg-2">
                        <ProductCategoryLazydropdown label="Select Category" :addButton="false"
                            v-model="formData.category_id"></ProductCategoryLazydropdown>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-lg-2">
                        <product-brand-lazydropdown label="Select Brand" placeholder="Select Brand" :addButton="false"
                            name="product brand" v-model="formData.brand_id" clearable></product-brand-lazydropdown>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-lg-2">
                        <base-product-lazydropdown :collapseTags="true" label="Select Products"
                            placeholder="Select Products" :multiple="true" :addButton="false" name="product brand"
                            v-model="formData.product_id" clearable></base-product-lazydropdown>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-lg-2">
                        <!-- :disabled="disableSearch" -->
                        <base-button class="btn-block" @click="handleSubmit(onClickGenerate)" :loading="loading"
                            type="success" style="margin-top: 20px">
                            <i class="fa fa-search"> Generate Report</i>
                        </base-button>
                    </div>
                </div>
            </validation-observer>
            <br />
            <div class="w-100 overflow-auto" v-if="reports.length > 0">
                <div class="text-center">
                    <h2>Stock Summary Report</h2>
                    <p>Report Date: {{ filter_data.opening_date }} to {{ filter_data.closing_date }}</p>
                </div>
                <div class="col-12 text-right">
                    <base-button :loading="downloading" type="primary" @click="onClickDownload('summary')"> <i class="fa fa-download"></i>
                        Summary </base-button>
                    <base-button :loading="downloadingDetails" type="primary" @click="onClickDownload('details')"> <i class="fa fa-download"></i>
                        Details </base-button>
                </div>
                <div class="col-12 pl-0">
                    <div class="col-3 pl-0 float-left">
                        <h3>#Filtered Applied:</h3>
                    </div>
                    <div class="col-1 pl-0 float-left" style="margin-right: 60px;">
                        <h3>Total: </h3>
                    </div>
                    <div class="col-2 pl-0 float-left">
                        <h3><span>{{ filter_data.opening_stock_total }}</span></h3>
                    </div>
                    <div class="col-2 pl-0 float-left">
                        <h3>
                            <span>{{ filter_data.primary_lifting_total }}</span>
                        </h3>
                    </div>
                    <div class="col-2 pl-0 float-left">
                        <h3>
                            <span>{{ filter_data.secondary_sales_total }}</span>
                        </h3>
                    </div>
                    <div class="col-1 pl-0 float-left">
                        <h3>
                            <span>{{ filter_data.current_stock_total }}</span>
                        </h3>
                    </div>
                </div>
                <el-table v-loading="loading" class="table-responsive  table-flush table-striped"
                    header-row-class-name="thead-light" :data="reports">
                    <el-table-column label="SL" min-width="100px" sortable type="index"></el-table-column>
                    <el-table-column v-for="(column, key) in table_fields" :key="key" :label="column.value"
                        :prop="column.name">
                        <template v-slot="{ row }">
                            <b>{{ row[column.name] }}</b>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <base-pagination v-if="targets.length > 0" v-model="pagination.currentPage" :perPage="pagination.entityPerPage" :total="pagination.totalEntity" align="center" class="mt-3" :disabled="loading"></base-pagination> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Vue,
    Watch
} from 'vue-property-decorator';
import DateRange from "@/components/DateRange.vue";
import ProductBrandLazydropdown from '@/components/lazyDropdown/ProductBrandLazydropdown.vue';
import ProductCategoryLazydropdown from '@/components/lazyDropdown/ProductCategoryLazydropdown.vue';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import TerritoryCascaderDropdown from '@/components/resources-autocomplete/TerritoryCascaderDropdown.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import DepartmentLazydropdown from '@/components/lazyDropdown/DepartmentLazydropdown.vue';
import BaseProductLazydropdown from "@/components/lazyDropdown/BaseProductLazyDropdown.vue";
import swal from 'sweetalert2';
import moment, { now } from "moment";
import {
    DatePicker,
    Select
} from 'element-ui';

@Component({
    components: {
        TerritoryCascaderDropdown,
        ProductBrandLazydropdown,
        ProductCategoryLazydropdown,
        UserLazydropdown,
        ElDatePicker: DatePicker,
        ElSelect: Select,
        DateRange,
        DepartmentLazydropdown,
        BaseProductLazydropdown
    },
})
export default class StockReportDetails extends Mixins(PaginationComponentMixin, Vue) {
    public downloading: boolean = false;
    public downloadingDetails: boolean = false;
    public formData: any = {};
    public selectedTerritoriesName = '';
    public loading: boolean = false;
    public reports = [];
    public table_fields = [];
    public maxDateRange = 30;
    public filter_data = {};
    public openingPickerOptions = {
        disabledDate(time: any) {
            return time.getTime() > Date.now();
        },
    };
    public closingPickerOptions = {
        disabledDate: (time: any) => {
            const startDate = moment(this.formData.opening_date);
            const nowDate = moment(now());
            const daysDiff = nowDate.diff(startDate, 'days');

            if (daysDiff <= this.maxDateRange) {
                return time.getTime() > Date.now();
            } else {
                const endDate = moment(this.formData.opening_date).add(this.maxDateRange, 'days');
                return time.getTime() > endDate;
            }
        },
    };

    public onClickGenerate() {
        this.fetchReport();
    }

    async fetchReport() {
        this.loading = true;
        this.reports = [];
        this.$http.get(this.$api3(`/stock-report${this.$toQueryString(this.formData)}&type=summary`)).then(response => {
            this.reports = response.data.reports;
            this.table_fields = response.data.table_fields;
            this.filter_data = response.data.filter_data;
            if (this.reports.length === 0) {
                this.$notify({
                    type: 'warning',
                    message: 'There is no data in selected filters',
                    title: 'No data found!',
                });
            }
        })
            .catch((error) => {
                (
                    this.$refs.formValidator as Vue & {
                        setErrors: (errors: []) => any;
                    }
                ).setErrors(error.response.data.errors);
            })
            .finally(() => {
                this.loading = false;
            })
    }

    async onClickDownload(type: string) {
        if (type === 'summary') {
            this.downloading = true;
        } else {
            this.downloadingDetails = true;
        }
        try {
            let {
                data,
                headers
            } = await this.$http.get(this.$api3(`/stock-report${this.$toQueryString(this.formData)}&type=${type}&download`), {
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
            if (type === 'summary') {
                this.downloading = false;
            } else {
                this.downloadingDetails = false;
            }
        }
    }
    created() { }
}
</script>

<style>
.el-date-editor .el-input__inner {
    height: 36px;
}
</style>