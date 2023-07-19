<template>
<div class="card">
    <div class="card-header border-0">
            <div class="row">
                <div class="col-8">
                    <div class="form-inline">
                        <h3 class="mb-0">Target Achievement Report</h3>
                    </div>
                </div>
            </div>
        </div>
    <div class="card-body">
        <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
            <div class="row">
                <div class="col-xs-12 col-sm-3 col-lg-2">
                    <base-input :rules="{ required: true }" label="Select Target Month" name="month">
                        <el-date-picker v-model="formData.month" type="month" placeholder="Pick a month" clearable format="MMMM, yyyy" value-format="yyyy-MM-dd"></el-date-picker>
                    </base-input>
                </div>
                <div class="p-1"></div>
                <TerritoryCascaderDropdown label="Select Territory" v-model="formData.territory_id" name="territory_id"></TerritoryCascaderDropdown>
                <div class="p-1"></div>
                <div class="col-xs-12 col-sm-4 col-lg-2">
                    <UserLazydropdown :collapseTags="true" label="Select User" :addButton="false" :multiple="true" v-model="formData.user_id" :disabled="!formData.territory_id" :end-point="`users${ formData.territory_id ? '?t=' + formData.territory_id : '' }`"></UserLazydropdown>
                </div>
                <div class="p-1"></div>

                <div class="col-xs-12 col-sm-4 col-lg-2">
                    <ProductCategoryLazydropdown label="Select Category" :addButton="false" v-model="formData.category_id">
                    </ProductCategoryLazydropdown>
                </div>

                <div class="col-xs-12 col-sm-4 col-lg-2">
                    <product-brand-lazydropdown @selected-item="onSelectBrand($event)" label="Select Brand" placeholder="Select Brand" :addButton="false" name="product brand" v-model="formData.brand_id" rules="" clearable></product-brand-lazydropdown>
                </div>

                <div class="col-xs-12 col-sm-4 col-lg-2">
                    <base-input label="View Based On" name="viewBasedOn">
                        <el-select v-model="formData.viewBasedOn" placeholder="Select" clearable>
                            <el-option v-for="item in viewBasedOnOptions" :key="item.value" :label="item.label" :value="item.value" > </el-option>
                        </el-select>
                    </base-input>
                </div>

                <div class="col-xs-12 col-sm-4 col-lg-2">
                    <base-input :rules="{ required: true }" label="Achievement Based On" name="achbasedOn">
                        <el-select v-model="formData.achbasedOn" placeholder="Select">
                            <el-option v-for="item in achievementBasedOnOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </base-input>
                </div>

                <div class="col-xs-12 col-sm-4 col-lg-2">
                    <!-- :disabled="disableSearch" -->
                    <base-button class="btn-block" @click="handleSubmit(onClickGenerate)" :loading="loading" type="success" style="margin-top: 20px">
                        <i class="fa fa-search"> Generate Report</i>
                    </base-button>
                </div>
            </div>
        </validation-observer>
        <br />
        <div class="w-100 overflow-auto" v-if="targets.length > 0">
            <div class="text-center">
                <h2>Target Achievement Report</h2>
                <p>Report Month: {{ filter_data.report_month }}</p>
            </div>
            <div class="col-12 text-right">
                <base-button :loading="downloading" type="primary" @click="onClickDownload"> <i class="fa fa-download"></i> Download </base-button>
            </div>
            <div class="col-12 pl-0">
                <div class="col-2 pl-0 float-left">
                    <h3>#Filtered Applied: <span>{{ filter_data.territory }}</span></h3>
                </div>
                <div class="col-2 pl-0 float-left">
                    <h3>Total Employees: <span>{{ filter_data.total_users}}</span></h3>
                </div>
                <div class="col-2 pl-0 float-left">
                    <h3>
                        Total Targets: <span>{{ filter_data.total_target_value }}</span>
                    </h3>
                </div>
                <div class="col-2 pl-0 float-left">
                    <h3>
                        Total Achievement: <span>{{ filter_data.total_achievement_value }}</span>
                    </h3>
                </div>
                <div class="col-1 pl-0 float-left">
                    <h3>
                        Avg: <span>{{ filter_data.avg_percentage }}%</span>
                    </h3>
                </div>
                <div class="col-1 pl-0 float-left">
                    <h3>
                        Total ADS: <span>{{ filter_data.total_ads }}</span>
                    </h3>
                </div>
                <div class="col-2 pl-0 float-left">
                    <h3>
                        Total RADS: <span>{{ filter_data.total_rads }}</span>
                    </h3>
                </div>
            </div>
            <el-table v-loading="loading" class="table-responsive  table-flush table-striped" header-row-class-name="thead-light" :data="targets">
                <el-table-column label="SL" min-width="100px" sortable type="index"></el-table-column>
                <el-table-column v-for="(column, key) in table_fields" :key="key" :label="column.value" :prop="column.name">
                    <template v-slot="{ row }">
                        <b v-if="column.name === 'value_based_on'">{{ getValueBased(row[column.name]) }}</b>
                        <b v-else>{{ row[column.name] + (column.name === 'percentage' ? '%' : '') }}</b>
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
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import ProductBrandLazydropdown from '@/components/lazyDropdown/ProductBrandLazydropdown.vue';
import ProductCategoryLazydropdown from '@/components/lazyDropdown/ProductCategoryLazydropdown.vue';
import TerritoryCascaderDropdown from '@/components/resources-autocomplete/TerritoryCascaderDropdown.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import swal from 'sweetalert2';
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
    },
})
export default class TargetAchievement extends Mixins(PaginationComponentMixin, Vue) {
    public downloading: boolean = false;
    public formData: any = {};
    public selectedTerritoriesName = '';
    public loading: boolean = false;
    public targets = [];
    public table_fields = [];
    public filter_data = {};
    public viewBasedOnOptions: any = [{
            value: 'category',
            label: 'Category',
        },
        {
            value: 'brand',
            label: 'Brand',
        },
        {
            value: 'product',
            label: 'Product',
        },
    ];
    public achievementBasedOnOptions: any = [{
            value: 'order',
            label: 'Order',
        },
        {
            value: 'delivery',
            label: 'Delivery',
        },
    ];
    public types: any = [{
        value: 'amount',
        name: 'Amount'
    },
    {
        value: 'qty',
        name: 'Quantity'
    }
    ];
    public onClickGenerate() {
        this.fetchEcoReport();
    }

    async fetchEcoReport() {
        this.loading = true;
        this.targets = [];
        this.$http.get(this.$api3(`/target-achievement-report${this.$toQueryString(this.formData)}`)).then(response => {
                this.targets = response.data.targets;
                this.table_fields = response.data.table_fields;
                this.filter_data = response.data.filter_data;
                if (this.targets.length == 0) {
                    this.$notify({
                        type: 'warning',
                        message: 'There is no targets set in selected filters',
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
    onSelectBrand(value: []) {
        // window.console.log(value)
    }

    async onClickDownload() {
        this.downloading = true;
        try {
            let {
                data,
                headers
            } = await this.$http.get(this.$api3(`/target-achievement-report${this.$toQueryString(this.formData)}&download`), {
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
    created() {
        this.$http.get(this.$api(`/units`)).then(response => {
            const units = this.sortItems(response.data.units);
            units.forEach((element: any, key: number) => {
                this.types.push({
                    name: element.name,
                    value: 'unit' + (key + 1)
                });
            })
        });
    }

    sortItems(arr: []) {
        return arr.sort((a: any, b: any) => (a.id > b.id ? 1 : -1));
    }

    getValueBased(value_based_on: String) {
        let value = this.types.find((type: any) => type.value === value_based_on);
        if (value) {
            return value.name;
        }
    }
}
</script>

<style>
</style>
