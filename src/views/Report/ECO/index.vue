<template>
<div class="card">
    <div class="card-header border-0">
        <div class="row">
            <div class="col-8">
                <div class="form-inline">
                    <h3 class="mb-0">ECO Report</h3>
                </div>
            </div>
        </div>
    </div>
    <div class="card-body">
        <div class="row">
            <div class="col-xs-12 col-sm-4 col-lg-3">
                <DateRange v-model="range" label-prop="Date Range (Required)" :max-date="maxDate"></DateRange>
            </div>

            <div class="p-1"></div>

            <TerritoryTypeAutocomplete label="Select Territory" placeholder="Select" :multiple="false" :add-button="false" v-model="selectedTerritoryType"></TerritoryTypeAutocomplete>

            <div class="p-1"></div>

            <TerritoryAutocomplete :disabled="!selectedTerritoryType" label="Territory (Required)" :collapseTags="true" v-model="selectedTerritories" :fetch-on-change-disable="false" :end-point="`territories${selectedTerritoryType ? '?territory_type=' + selectedTerritoryType : ''}`">
            </TerritoryAutocomplete>

            <div class="p-1"></div>
            <div class="col-xs-12 col-sm-4 col-lg-2">
                <UserLazydropdown :collapseTags="true" label="Select User" :addButton="false" :multiple="true" v-model="selectedUsers">
                </UserLazydropdown>
            </div>
            <div class="p-1"></div>

            <div class="col-xs-12 col-sm-4 col-lg-2">
                <product-brand-lazydropdown :collapseTags="true" @selected-item="onSelectBrand($event)" label="Select Brand" placeholder="Select Brand" :addButton="false" name="product brand" v-model="brand_id" rules="" clearable></product-brand-lazydropdown>
            </div>
            <div class="col-xs-12 col-sm-4 col-lg-2">
                <!-- :disabled="disableSearch" -->
                <base-button class="btn-block" @click="onClickGenerate" :loading="loading" type="success" style="margin-top: 20px;">
                    <i class="fa fa-search"> Generate Report</i>
                </base-button>
            </div>
        </div>
        <br>
        <div class="w-100 overflow-auto" v-if="outletReport.length > 0">
            <div class="text-center">
                <h2>Eco Report</h2>
                <p>Date Selected: {{range.substring(0,10)}} to {{range.substring(11)}}</p>
            </div>
            <div class="col-12 text-right">
                <base-button :loading="downloading" type="primary" @click="onClickDownload">
                    <i class="fa fa-download"></i> Download
                </base-button>
            </div>
            <div class="col-12 pl-0">
                <div class="col-4 pl-0 float-left">
                    <h3>#Filtered Applied: <span>{{ selectedTerritoriesName }}</span></h3>
                </div>
                <div class="col-2 pl-0 float-left">
                    <h3>Total Employees: <span>{{ selectedTerritoriesUsers }}</span></h3>
                </div>
                <div class="col-2 pl-0 float-left">
                    <h3>Total Outlets: <span>{{ totalOutletsCount }}</span></h3>
                </div>
                <div class="col-2 pl-0 float-left">
                    <h3>Billed Outlets: <span>{{ totalBilledOutlet }}</span></h3>
                </div>
                <div class="col-2 pl-0 float-left">
                    <h3>Not Billed Outlets: <span>{{ totalNotBilledOutlet }}</span></h3>
                </div>
            </div>
            <table id="customers">
                <tr>
                    <th>#SL</th>
                    <th>Employee Code</th>
                    <th>Employee Name</th>
                    <th>Total Outlet</th>
                    <th>Billed Outlet</th>
                    <th>Not Billed Outlet</th>
                </tr>
                <tbody v-for="(report,index) in outletReport" :key="report.id">
                    <tr>
                        <td class="text-center">{{ index + 1 }}</td>
                        <td class="text-center">{{ report.created_code }}</td>
                        <td>{{ report.created_name }}</td>
                        <td class="text-center">{{ report.total_outlets }}</td>
                        <td class="text-center">{{ report.billed_outlet }}</td>
                        <td class="text-center">{{ report.not_billed_outlet }}
                            <base-button @click="downloadNotBilledOutlet(report.created_id, report.not_billed_outlet_ids)" size="sm"><i class="fa fa-download"></i></base-button>
                        </td>
                    </tr>
                </tbody>
            </table>
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
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import ProductBrandLazydropdown from "@/components/lazyDropdown/ProductBrandLazydropdown.vue";
import TerritoryTypeAutocomplete from "@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue";
import TerritoryAutocomplete from "@/components/resources-autocomplete/TerritoryAutocomplete.vue";
import PaginationComponentMixin from "@/mixins/PaginationComponent";
import swal from 'sweetalert2';
import moment from "moment";

@Component({
    components: {
        TerritoryAutocomplete,
        TerritoryTypeAutocomplete,
        ProductBrandLazydropdown,
        UserLazydropdown,
        DateRange,
    }
})
export default class ECO extends Mixins(PaginationComponentMixin, Vue) {
    public downloading: boolean = false;
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

    public onClickGenerate() { 
        if (this.range === '' || this.selectedTerritories === '') {
            this.$notify({
                type: 'warning',
                message: 'Select the required field',
                title: 'Required!'
            });
        } else {
            this.fetchEcoReport();
        }
    }

    async fetchEcoReport() {
        try {
            this.loading = true
            this.outletReport = [];
            let usersIds = this.selectedUsers.join(',');
            let brandIds = this.brand_id;
            let query = '?territory_id=' + this.selectedTerritories + '&range=' + this.range + '&user_id=' + usersIds + '&brands=' + brandIds;
            let {
                data
            } = await this.$http.get(this.$api3(`/eco-report${query}`))
            window.console.log(data);
            this.outletReport = data.reports;
            if (this.outletReport.length > 0) {
                this.selectedTerritoriesName = data.territory.name + ',' + this.selectedBrands.name
                this.selectedTerritoriesUsers = data.territory.total_users
                this.totalOutletsCount = data.territory.total_outlets
                this.totalBilledOutlet = data.territory.billed_outlets
                this.totalNotBilledOutlet = data.territory.not_billed_outlets
            } else {
                this.$notify({
                    type: 'info',
                    message: 'Minimum 1 ordered required to generate report',
                    title: 'No ordered found!'
                });
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
    onSelectBrand(value: []) {
        // this.selectedBrands = value.sort((a: any, b: any) => a.id - b.id);
        this.selectedBrands = value;
    }
    downloadNotBilledOutlet(user_id: any, outlets: any) {
        // window.console.log(outlets, user_id);
        const link = document.createElement("a");
        link.href = this.$api(`/department-bulk-download?download&ids=${outlets}`);
        link.target = '_blank';
        link.click();
    }
    async onClickDownload() {
        try {
            this.downloading = true;
            let usersIds = this.selectedUsers.join(',');
            let brandIds = this.brand_id;
            let query = '?territory_id=' + this.selectedTerritories + '&range=' + this.range + '&user_id=' + usersIds + '&brands=' + brandIds + '&download';
            const link = document.createElement("a");
            link.href = this.$api3(`/eco-report${query}`);
            link.click();
        } catch (e) {
            this.$notify({
                type: 'warning',
                message: 'Unable to download.',
                title: 'Something went wrong!'
            });
        } finally {
            this.downloading = false;
        }
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
}
</style>
