<template>
    <div class="card">
        <div class="card-header border-0">
            <div class="row">
                <div class="col-8">
                    <div class="form-inline">
                        <h3 class="mb-0">Delivery Summary</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-3">
                    <DateRange v-model="range" label-prop="Date Range (Required)" :max-date="maxDate"></DateRange>
                </div>
                <TerritoryTypeAutocomplete label="Select Territory" placeholder="Select" :multiple="false"
                    :add-button="false" v-model="selectedTerritoryType"></TerritoryTypeAutocomplete>
                <div class="p-3"></div>
                <TerritoryAutocomplete :disabled="!selectedTerritoryType" label="Territory (Required)" :collapseTags="true"
                    v-model="selectedTerritories" :fetch-on-change-disable="false"
                    :end-point="`territories${selectedTerritoryType ? '?territory_type=' + selectedTerritoryType : ''}`">
                </TerritoryAutocomplete>
                <div class="col col-2">
                    <UserLazydropdown :collapseTags="true" label="Select User" :addButton="false" :multiple="true"
                        v-model="selectedUsers">
                    </UserLazydropdown>
                </div>
                <div class="col col-2">
                    <DepartmentCategoryLazyDropdown :collapseTags="true" label="Select Outlet Category" :addButton="false"
                        :multiple="true" v-model="selectedOutletCategories">
                    </DepartmentCategoryLazyDropdown>
                </div>

                <div class="col col-2">
                    <DepartmentLocationTypeLazyDropdown :collapseTags="true" label="Select Outlet Location Type"
                        :addButton="false" :multiple="true" v-model="selectedOutletLocationTypes">
                    </DepartmentLocationTypeLazyDropdown>
                </div>

                <div class="col col-2">
                    <BadgeLazydropdown :collapseTags="true" label="Select Outlet Badge" :addButton="false" :multiple="true"
                        v-model="selectedOutletBadges">
                    </BadgeLazydropdown>
                </div>
                <div class="col col-2">
                    <ProductCategoryLazydropdown :collapseTags="true" label="Select Category" :addButton="false"
                        v-model="selectedCategories">
                    </ProductCategoryLazydropdown>
                </div>

                <div class="col col-2">
                    <product-brand-lazydropdown :collapseTags="true" @selected-item="onSelectBrand($event)"
                        label="Select Brand" placeholder="Select Brand" :addButton="false" name="product brand"
                        v-model="brand_id" rules="" clearable></product-brand-lazydropdown>
                </div>

                <div class="col col-2">
                    <base-product-lazydropdown :collapseTags="true" @selected-item="onSelectBrand($event)"
                        label="Select Products" placeholder="Select Products" :multiple="true" :addButton="false"
                        name="product brand" v-model="selectedProducts" rules="" clearable></base-product-lazydropdown>
                </div>

                <div class="col col-2">
                    <!-- :disabled="disableSearch" -->
                    <base-button class="btn-block" @click="onClickGenerate" :loading="loading" type="primary"
                        style="margin-top: 20px;">
                        <i class="fa fa-search"> Search</i>
                    </base-button>
                </div>
            </div>
            <br>
            <div v-if="searchMsg && !downloadbtn" class="w-100 overflow-auto text-center">
                <base-button type="warning" :disabled="true" style="margin-top: 20px;">
                    Total Data Found {{ totalRecords }} <br> Data is larger than 5 laks. Add some filter to Download
                </base-button>
            </div>
            <div v-if="downloadbtn" class="w-100">
                <p style="color: peru;font-size: 14px;">If Records is 150000 or less, you can download excel format xlsx.
                    Excel format will be xls and csv if more than 150000.</p>
                <div class="text-center col-12">
                    <p>Records founds: {{ totalRecords }}</p>
                    <div class="col-8 offset-4" v-if="totalRecords > 0">
                        <base-button v-if="totalRecords <= 150000" :loading="downloadingXlsx" type="primary"
                            @click="exportSummaryXlsx(); excelType = 'xlsx'" :disabled="downloadingXlx || downloadingCsv"
                            style="float: left;">
                            <i class="fa fa-download"></i> Download Xlsx
                        </base-button>
                        <download-excel :fetch="exportSummary" :before-generate="() => { excelType = 'xls' }"
                            :name="fileName" :meta="json_meta" type="xls" :fields="json_fields"
                            style="float: left;margin-right: 10px;">
                            <base-button :disabled="downloadingXlsx || downloadingCsv" :loading="downloadingXlx"
                                type="primary">
                                <i class="fa fa-download"></i> Download Xls
                            </base-button>
                        </download-excel>
                        <download-excel :fetch="exportSummary" :before-generate="() => { excelType = 'csv' }"
                            :name="fileName" :meta="json_meta" type="csv" :fields="json_fields" style="float: left;">
                            <base-button :disabled="downloadingXlsx || downloadingXlx" :loading="downloadingCsv"
                                type="primary">
                                <i class="fa fa-download"></i> Download CSV
                            </base-button>
                        </download-excel>
                    </div>
                </div>
                <div style="clear: both;"></div>
                <div v-if="downloadingCount" class="p-5 col-12 text-center" style="margin-top: 15px;">
                    <base-button type="success">{{ fileSize }}</base-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
declare global {
    interface Window {
        excelFIleSize: any;
        excelFIleProgressStart: any;
    }
}
import {
    Component,
    Mixins,
    Vue,
    Watch
} from 'vue-property-decorator';
import DateRange from "@/components/DateRange.vue";
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import ProductBrandLazydropdown from "@/components/lazyDropdown/ProductBrandLazydropdown.vue";
import TerritoryTypeAutocomplete from "@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue";
import TerritoryAutocomplete from "@/components/resources-autocomplete/TerritoryAutocomplete.vue";
import PaginationComponentMixin from "@/mixins/PaginationComponent";
import swal from 'sweetalert2';
import moment from "moment";
import ProductCategoryLazydropdown from "@/components/lazyDropdown/ProductCategoryLazydropdown.vue";
import BaseProductLazydropdown from "@/components/lazyDropdown/BaseProductLazyDropdown.vue";
import DepartmentCategoryLazyDropdown from "@/components/lazyDropdown/DepartmentCategoryLazyDropdown.vue";
import DepartmentLocationTypeLazyDropdown from "@/components/lazyDropdown/DepartmentLocationTypeLazyDropdown.vue";
import BadgeLazydropdown from "@/components/lazyDropdown/BadgeLazydropdown.vue";
//@ts-ignore
import downloadExcel from "vue-json-excel";
import {
    isSet
} from 'lodash';
import {
    QueryBuilder
} from '@/classes/QueryBuilder';

@Component({
    components: {
        TerritoryAutocomplete,
        TerritoryTypeAutocomplete,
        ProductBrandLazydropdown,
        UserLazydropdown,
        DateRange,
        ProductCategoryLazydropdown,
        BaseProductLazydropdown,
        DepartmentCategoryLazyDropdown,
        DepartmentLocationTypeLazyDropdown,
        BadgeLazydropdown,
        downloadExcel
    }
})
export default class DeliverySummaryDownload extends Mixins(PaginationComponentMixin, Vue) {
    public downloadingXlsx: boolean = false;
    public downloadingXlx: boolean = false;
    public downloadingCsv: boolean = false;
    public range = '';
    public selectedTerritoriesName = '';
    public selectedTerritoriesUsers = '';
    public totalOutletsCount: any = 0;
    public totalBilledOutlet: any = 0;
    public totalNotBilledOutlet: any = 0;
    public selectedUsers: any = [];
    public selectedTerritoryType: any = null;
    public selectedTerritories: any = [];
    public brand_id: any = '';
    public loading: boolean = false;
    public outletReport = [];
    public selectedBrands: any = '';
    public showOutletModal: boolean = false;
    public usersNotBuilledOutlets: any = [];
    public maxDate: string = moment().subtract(1, "days").format('YYYY-MM-DD');
    public totalRecords: any = 0;
    public downloadbtn: any = false;
    public rows = [];
    public query: any = '';
    public selectedCategories: any = '';
    public selectedOutletCategories: any = '';
    public selectedOutletLocationTypes: any = '';
    public selectedOutletBadges: any = '';
    public selectedProducts: any = [];
    public searchMsg = false;
    public fileSize: any = 'Waiting for Server...';
    public clearTimer: any = 0;
    public downloadingCount = false;
    public excelType = 'xls';
    public fileName = 'delivery-summary-report-' + moment().format('YYYY-MM-DD') + '.' + this.excelType;
    public json_fields: any = {
        'Delivery Date': 'delivery_date',
        'Employee Code': 'created_code',
        'Employee Name': 'created_name',
        'Seller Department Code': 'seller_department_code',
        'Seller Department Name': 'seller_department_name',
        'Buyer Department Code': 'buyer_department_code',
        'Buyer Department Name': 'buyer_department_name',
        'Buyer Badge Name': 'buyer_badge_name',
        'Product Category': 'product_category_name',
        'Product Brand': 'product_brand_name',
        'SKU': 'product_sku',
        'Product Name': 'product_name',
        'Delivery Quantity': 'delivery_qty',
        'Unit Price': 'unit_price',
        'Amount': 'amount',
        'Subtotal': 'subtotal'
    };
    public json_meta = [
        [{
            key: "charset",
            value: "utf-8",
        },],
    ];

    created(): void {
        this.$http.get(this.$api(`/units?page=${this.pagination.currentPage}`)).then(response => {
            const units = this.sortItems(response.data.units);
            units.forEach((element: any, key: number) => {
                this.json_fields[element.name] = 'unit' + (key + 1);
            })
        });
        window.excelFIleProgressStart = false;
    }

    public sortItems(arr: []) {
        return arr.sort((a: any, b: any) => (a.id > b.id ? 1 : -1));
    }

    @Watch('range')
    onChangeRange(type: any) {
        this.downloadbtn = false;
        this.searchMsg = false;
    }

    @Watch('selectedTerritories')
    onChangeTerritories() {
        this.downloadbtn = false;
        this.searchMsg = false;
    }

    public onClickGenerate() {
        this.search();
    }

    async search() {
        try {
            this.loading = true;
            this.downloadbtn = false;
            this.downloadingCount = false;
            this.outletReport = [];
            this.query = {
                range: this.range,
                territory_id: this.selectedTerritories,
                created_id: this.selectedUsers,
                buyer_dept_cat_id: this.selectedOutletCategories,
                buyer_dept_loc_type_id: this.selectedOutletLocationTypes,
                buyer_badge_id: this.selectedOutletBadges,
                category: this.selectedCategories,
                brand: this.brand_id,
                product_id: this.selectedProducts
            };
            let {
                data
            } = await this.$http.get(this.$api3(`/delivery-summary${this.$toQueryString(this.query)}`))
            this.totalRecords = data.total_records;
            if (this.totalRecords > 500000) {
                this.downloadbtn = false;
                this.searchMsg = true;
            } else {
                this.downloadbtn = true;
            }
        } catch (e) {
            let err_msg = [];
            if (e.response.data.errors.range) {
                err_msg.push(e.response.data.errors.range[0]);
            }
            if (e.response.data.errors.territory_id) {
                err_msg.push(e.response.data.errors.territory_id[0]);
            }
            err_msg.forEach(error => {
                this.$notify({
                    type: 'warning',
                    message: error,
                    title: 'Validation error'
                });
            })
        } finally {
            this.loading = false
        }
    }

    async exportSummaryXlsx() {
        this.downloadingXlsx = true;
        try {
            let {
                data,
                headers
            } = await this.$http.get(this.$api3(`/delivery-summary${this.$toQueryString(this.query)}&download&type=xlsx`), {
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
            this.downloadingXlsx = false;
        }
    }

    async exportSummary() {
        if (this.excelType === 'csv') {
            this.downloadingCsv = true;
        } else {
            this.downloadingXlx = true;
        }
        this.fileSize = 'Waiting for Server...';
        this.downloadingCount = true;
        window.excelFIleSize = 0;
        this.clearTimer = setInterval(() => {
            if (window.excelFIleProgressStart) {
                if (window.excelFIleSize != 0) {
                    this.fileSize = 'Downloading : ' + window.excelFIleSize;
                } else {
                    clearInterval(this.clearTimer);
                }
            }
        }, 100)
        try {
            let {
                data
            } = await this.$http.get(this.$api3(`/delivery-summary${this.$toQueryString(this.query)}&download`), {
                onDownloadProgress: function (progressEvent) {
                    // Do whatever you want with the native progress event
                    window.excelFIleProgressStart = true;
                    const bytes = parseInt(progressEvent.loaded);
                    const decimals = 2;
                    const k = 1024;
                    const dm = decimals < 0 ? 0 : decimals;
                    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    const current_size = parseFloat(((bytes / Math.pow(k, i)) / 2).toFixed(dm)) + ' ' + sizes[i];
                    window.excelFIleSize = current_size;
                    //window.console.log('Response size:', progressEvent);
                }
            });
            clearInterval(this.clearTimer);
            this.fileSize = 'Downloaded (appr) : ' + window.excelFIleSize;
            let dataSet = JSON.parse(data.data);
            return dataSet;
        } catch (e) {
            this.$notify({
                title: 'Something went wrong!',
                type: 'warning',
                message: 'Unable to download reports.'
            });
        } finally {
            if (this.excelType === 'csv') {
                this.downloadingCsv = false;
            } else {
                this.downloadingXlx = false;
            }
        }
    }

    onSelectBrand(value: []) {
        // this.selectedBrands = value.sort((a: any, b: any) => a.id - b.id);
        this.selectedBrands = value;
    }
}
</script>

<style>
#customers {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

#customers td,
#customers th {
    border: 1px solid #ddd;
    padding: 8px;
    min-width: 100px;
}

#customers tr:nth-child(even) {
    background-color: #f2f2f2;
}

#customers tr:hover {
    background-color: #ddd;
}

#customers th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    background-color: #04AA6D;
    color: white;
}</style>