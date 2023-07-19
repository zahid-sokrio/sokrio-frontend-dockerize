<template>
<div class="row pl-3">
    <div class="col-12">
        <div class="card">
            <div class="card-header border-0">
                <div class="row">
                    <div class="col-8">
                        <div class="form-inline">
                            <h3 class="mb-0">Checkin Summary Details Report</h3>
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
                        <UserLazydropdown :collapseTags="true" label="Select Users(Optional)" :addButton="false" :multiple="true" v-model="selectedUsers">
                        </UserLazydropdown>
                    </div>

                    <div class="col-xs-12 col-sm-4 col-lg-2">
                        <!-- :disabled="disableSearch" -->
                        <base-button class="btn-block" @click="onClickGenerate" :loading="loading" type="success" style="margin-top: 20px">
                            <i class="fa fa-search"> Generate Report</i>
                        </base-button>
                    </div>
                </div>
                <br />
                <div class="w-100 overflow-auto" v-if="checkInReport.length > 0">
                    <div class="text-center">
                        <h2>Checkin Summary Report</h2>
                        <p>Date Selected: {{ range.substring(0, 10) }} to {{ range.substring(11) }}</p>
                    </div>
                    <div class="col-12 text-right">
                        <base-button :loading="downloading" type="primary" @click="onClickDownload"> <i class="fa fa-download"></i> Download </base-button>
                    </div>
                    <div class="col-12 pl-0 mt-2">
                        <div class="col-2 pl-0 float-left">
                            <h3>
                                #Filter Applied: <span>{{ selectedTerritoriesName }}</span>
                            </h3>
                        </div>
                        <div class="col-2 pl-0 float-left">
                            <h3>
                                Total Employees: <span>{{ selectedTerritoriesUsers }}</span>
                            </h3>
                        </div>
                        <div class="col-2 pl-0 float-left">
                            <h3>
                                Avg. Working Hour: <span>{{ avgWorking }}</span>
                            </h3>
                        </div>
                        <div class="col-1 pl-0 float-left">
                            <h3>
                                Planned: <span>{{ totalPlanned }}</span>
                            </h3>
                        </div>
                        <div class="col-1 pl-0 float-left">
                            <h3>
                                Visited: <span>{{ totalVisited }}</span>
                            </h3>
                        </div>
                        <div class="col-1 pl-0 float-left">
                            <h3>
                                Visited %: <span>{{ visitedPercentage }}</span>
                            </h3>
                        </div>
                        <div class="col-2 pl-0 float-left">
                            <h3>
                                Avg. Outlet Time: <span>{{ avgOutletTime }}</span>
                            </h3>
                        </div>

                    </div>
                    <el-table v-loading="loading" class="table-responsive  table-flush table-striped" header-row-class-name="thead-light" :data="checkInReport">
                        <el-table-column label="SL" min-width="100px" sortable type="index"></el-table-column>
                        <el-table-column label="Date" min-width="120px" prop="date" sortable align="center">
                            <template v-slot="{ row }">
                                {{ row.date }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Employee Code" min-width="120px" prop="user_code" sortable>
                            <template v-slot="{ row }">
                                {{ row.user_code }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Employee Name" min-width="140px" prop="user_name" sortable>
                            <template v-slot="{ row }">
                                {{ row.user_name }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Working Hour" min-width="120px" prop="working_hour" align="center">
                            <template v-slot="{ row }">
                                {{ row.working_hour.toString().replace(".", ":") }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Planned" min-width="120px" prop="planned" align="center">
                            <template v-slot="{ row }">
                                {{ row.planned }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Visited" min-width="120px" prop="visited" align="center">
                            <template v-slot="{ row }">
                                {{ row.visited }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Visited %" min-width="120px" prop="visited_percentage" align="center">
                            <template v-slot="{ row }">
                                {{ row.visited_percentage }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Avg. Outlet Spent Time" min-width="150px" prop="avg_outlet_time" align="center">
                            <template v-slot="{ row }">
                                {{ row.avg_outlet_time }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Route Name" min-width="140px" prop="route_name">
                            <template v-slot="{ row }">
                                {{ row.route_name }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <base-pagination v-if="checkInReport.length > 0" v-model="pagination.currentPage" :perPage="pagination.entityPerPage" :total="pagination.totalEntity" align="center" class="mt-3" :disabled="loading"></base-pagination>
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
    Vue,
    Watch
} from 'vue-property-decorator';
import DateRange from '@/components/DateRange.vue';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import ProductBrandLazydropdown from '@/components/lazyDropdown/ProductBrandLazydropdown.vue';
import TerritoryTypeAutocomplete from '@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue';
import TerritoryAutocomplete from '@/components/resources-autocomplete/TerritoryAutocomplete.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import swal from 'sweetalert2';
import moment from 'moment';

@Component({
    components: {
        TerritoryAutocomplete,
        TerritoryTypeAutocomplete,
        ProductBrandLazydropdown,
        UserLazydropdown,
        DateRange,
    },
})
export default class ECO extends Mixins(PaginationComponentMixin, Vue) {
    public downloading: boolean = false;
    public range = '';
    public selectedTerritoriesName = '';
    public selectedTerritoriesUsers = '';
    public avgWorking: any = 0;
    public totalPlanned: any = 0;
    public totalVisited: any = 0;
    public visitedPercentage: any = 0;
    public avgOutletTime: any = 0;
    public selectedUsers: any = [];
    public selectedTerritoryType: any = null;
    public selectedTerritories: any = [];
    public loading: boolean = false;
    public checkInReport = [];
    public maxDate: string = moment().subtract(1, 'days').format('YYYY-MM-DD');
    public query: any = '';

    public onClickGenerate() {
        if (this.range === '' || this.selectedTerritories === '') {
            this.$notify({
                type: 'warning',
                message: 'Select the required field',
                title: 'Required!',
            });
        } else {
            this.fetchReport();
        }
    }

    @Watch('pagination.currentPage')
    onChangePage(newVal: any) {
        this.fetchReport();
    }

    @Watch('range', { immediate: true })
    @Watch('selectedTerritories', { immediate: true })
    @Watch('selectedUsers', { immediate: true })
    updateCurrentpage() {
        this.pagination.currentPage = 1;
  }

    async fetchReport() {
        try {
            this.loading = true;
            this.checkInReport = [];
            this.query = {
                range: this.range,
                territory_id: this.selectedTerritories,
                user_id: this.selectedUsers.join(','),
                page: `${ this.pagination.currentPage }`,
            };
            let {
                data
            } = await this.$http.get(this.$api3(`/checkin-summary${this.$toQueryString(this.query)}`));
            this.checkInReport = data.reports.data;
            this.setPagination(data.reports);
            if (this.checkInReport.length > 0) {
                this.selectedTerritoriesName = data.territory.name;
                this.selectedTerritoriesUsers = data.territory.total_users;
                this.avgWorking = data.territory.avg_working;
                this.totalPlanned = data.territory.total_planned;
                this.totalVisited = data.territory.total_visited;
                this.visitedPercentage = data.territory.visited_percentage;
                this.avgOutletTime = data.territory.avg_outlet_time;
            } else {
                this.$notify({
                    type: 'info',
                    message: 'The filter you applied has no data',
                    title: 'Checkin summary report is empty!',
                    duration: 5000,
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
            err_msg.forEach((error) => {
                this.$notify({
                    type: 'warning',
                    message: error,
                    title: 'Validation error',
                });
            });
        } finally {
            this.loading = false;
        }
    }
    async onClickDownload() {
        try {
            this.downloading = true;
            const link = document.createElement('a');
            link.href = this.$api3(`/checkin-summary${this.$toQueryString(this.query)}&download`);
            link.click();
        } catch (e) {
            this.$notify({
                type: 'warning',
                message: 'Unable to download.',
                title: 'Something went wrong!',
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
    background-color: #04aa6d;
    color: white;
}
</style>
