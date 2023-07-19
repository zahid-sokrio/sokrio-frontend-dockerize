<template>
  <div class="row pl-3" v-can="permissionEnum.HR_CHECKIN_REPORT">
    <div class="col-xl-12 col-md-12 col-lg-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-2">
                <DateRange v-model="range" label-prop="Date Range (Required)"></DateRange>
            </div>
            <div class="col-2">
              <UserLazydropdown
                :disabled="!range"
                v-model="user_id"
                label="Select User"
                :add-button="false">
              </UserLazydropdown>
            </div>
            <div class="col-2">
              <TerritoryTypeAutocomplete
                placeholder="Territory type"
                :add-button="false"
                v-model="territory_type_id"
                :disabled="!range"
                label="Select Territory Type"
              ></TerritoryTypeAutocomplete>
            </div>
            <div class="col-2">
              <base-input v-if="!range || !territory_type_id">
                <territory-lazydropdown v-model="territory_id"
                                        :end-point="'territories?territory_type='+territory_type_id"
                                        :add-button="false"
                                        searchable-key="q" class="ml-1"
                                        :disabled="!territory_type_id || !range"
                                        placeholder="Territory" label="Select Territory"></territory-lazydropdown>
              </base-input>
              <territory-lazydropdown v-model="territory_id"
                                      :end-point="'territories?territory_type='+territory_type_id"
                                      :add-button="false"
                                      searchable-key="q" class="ml-1"
                                      v-if="range && territory_type_id"
                                      placeholder="Territory" label="Select Territory"></territory-lazydropdown>
            </div>
            <div class="col-2">
              <department-lazydropdown
                placeholder="Department"
                v-model="department_id"
                label="Select Department"
                :disabled="!range"
              ></department-lazydropdown>
            </div>
            <div class="col-2 text-right mt-4">
              <base-button :disabled="!range && checkInReport.length==0" :loading="printing" type="secondary"
                           @click.prevent="onClickPrint">
                <i class="fa fa-print"></i>
              </base-button>
              <base-button :disabled="!range && checkInReport.length==0" :loading="downloading" type="primary" @click.prevent="showDownloadModal = !showDownloadModal">
                <i class="fa fa-download"></i> Download
              </base-button>
              <!-- <base-button :disabled="!range && checkInReport.length==0" :loading="downloading" type="primary"
                           @click.prevent="onClickDownload">
                <i class="fa fa-download"></i>
              </base-button> -->
            </div>
          </div>
        </div>

        <div class="card-body">
          <!--          <p class="text-primary text-bold" v-if="checkInReport.length>0">-->
          <!--            Total Expense: {{ this.checkInReport.reduce((n, {expense}) => n + expense, 0) + ' ' + $currency() }}-->
          <!--          </p>-->
          <el-table v-loading="loading" class="table-responsive  table-flush table-striped"
                    header-row-class-name="thead-light"
                    :data="checkInReport">
            <el-table-column label="SL" min-width="100px" prop="name" sortable type="index"></el-table-column>
            <el-table-column label="Name" min-width="140px" prop="name" sortable>
              <template v-slot="{ row }">
                {{ row.user.name }}
              </template>
            </el-table-column>
            <el-table-column label="Route" prop="name" min-width="120">
              <template v-slot="{ row }">
                <b>{{ row.route && row.route.name ? row.route.name : '-' }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Territory" prop="name" min-width="120">
              <template v-slot="{ row }">
                <b>{{ row.department && row.department.territory && row.department.territory.name ?
                  row.department.territory.name : '-' }}</b>
              </template>
            </el-table-column>

            <el-table-column label="Planned Visit" prop="name" min-width="120">
              <template v-slot="{ row }">
                <b :class="{ 'text-success': row.route_id }">{{ row.route_id ? "Yes" : "No" }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Department Name" prop="name" min-width="140" >
              <template v-slot="{ row }">
                <b>{{ row.department && row.department.name }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Address" prop="name" min-width="150" >
              <template v-slot="{ row }">
                <b>{{ row.department && row.department.address ? row.department.address : "-" }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Check In Time" prop="name" min-width="140" >
              <template v-slot="{ row }">
                <b>{{ row.created_at | datetime('lll') }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Check Out Time" prop="name" min-width="120" >
              <template v-slot="{ row }">
              <b v-if="row.checked_out_at">{{ row.checked_out_at | datetime('lll') }}</b>
              <b v-else>-</b>
              </template>
            </el-table-column>
            <el-table-column label="Time Spent" prop="name" min-width="120" >
              <template v-slot="{ row }">
              <b v-if="row.checked_out_at">{{ timeSpent(row.checked_out_at, row.created_at) }} minutes</b>
              <b v-else>-</b>
              </template>
            </el-table-column>
            <el-table-column label="Remarks" prop="name">
              <b>-</b>
            </el-table-column>
          </el-table>
        </div>
        <base-pagination
          v-if="checkInReport.length > 0"
          v-model="pagination.currentPage"
          :perPage="pagination.entityPerPage"
          :total="pagination.totalEntity"
          align="center"
          class="mt-3"
          :disabled="loading"
        ></base-pagination>
        <modal :show="showDownloadModal" @close="showDownloadModal = false">
          <template slot="header">
            <h5 class="modal-title">Download Check-In Report</h5>
          </template>
          <div class="card">
            <div class="card-body">
              <base-input label="Recipient (Optional)" v-model="recipient" :placeholder="$user ? $user.email : ''"></base-input>
            </div>
          </div>
          <template slot="footer">
            <base-button @click="showDownloadModal = false" type="secondary">Close</base-button>
            <base-button :loading="loading" type="primary" @click.prevent="downloadCheckInReport">
              <i class="fa fa-envelope"></i>
            </base-button>
          </template>
        </modal>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Watch} from 'vue-property-decorator';
import { QueryBuilder } from "@/classes/QueryBuilder";
import { mixins } from 'vue-class-component';
import moment from "moment";
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import printJS from "print-js";
import DateRange from "@/components/DateRange.vue";
import {Permission as PermissionEnum} from "@/enums/Permission";
import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown.vue";
import DepartmentLazydropdown from "@/components/lazyDropdown/DepartmentLazydropdown.vue";
import TerritoryTypeAutocomplete from "@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue";
import swal from 'sweetalert2';
import PaginationComponentMixin from '@/mixins/PaginationComponent';

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    TerritoryTypeAutocomplete,
    DepartmentLazydropdown,
    TerritoryLazydropdown,
    UserLazydropdown,
    flatPicker,
    DateRange
  }
})
export default class CheckInReport extends  mixins(PaginationComponentMixin) {
  public downloading: boolean = false;
  public loading: boolean = false;
  public printing: boolean = false;
  private showModal: boolean = false;
  public user_id: number | null = null;
  public department_id: number | null = null;
  public territory_id: number | null = null;
  public territory_type_id: number | null = null;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public checkInReport = [];
  public range: string = '';
  public showDownloadModal: boolean = false;
  public recipient: string = '';
  public rangeSelectConfig = {
    allowInput: true,
    disable: [
      function (range: Date) {
        return moment().diff(range) < 0;
      }
    ]
  }

  todaysDate() {
    var currentDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return currentDate;
  }
  async downloadCheckInReport(status: string) {
    this.loading = true;
    try {
      let { data, headers } = await this.$http.get(
        this.$api('/checkin-queue-report' + this.queryBuilder.getFilters(true) + '&all' + '&' + 'recipient=' + this.recipient)
      );
      await swal.fire('Thanks For Entering Your Mail', 'You will receive the report within a few minutes.', 'success');
    } catch (e) {
      this.$notify({ title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.' });
    } finally {
      this.loading = false;
      this.showDownloadModal = false;
      this.recipient = '';
    }
  }

  timeSpent(checkOutTime: string, checkInTime: string) {
    // return moment(moment(checkOutTime, 'hh:mm:ss a').diff(moment(checkInTime, 'hh:mm:ss a')), 'hh:mm:ss a');
    return moment(checkOutTime).diff(moment(checkInTime), 'minutes')
  }
  @Watch('pagination.currentPage')
  onChangePage(newVal: any) {
    this.queryBuilder.addListener('page', newVal);
  }

  @Watch('queryBuilder.watch')
  async getCheckInReport() {
    if (!this.range) {
      this.checkInReport = [];
      return
    }
    this.loading = true;
    try {
      let {data} = await this.$http.get(this.$api(`/checkin-report${this.queryBuilder.getFilters(true)}&page=${this.pagination.currentPage}`+ '&all'))
      '&all'
      this.checkInReport = data.checkinReport;
      this.setPagination(data);
    } catch (e) {
      this.$notify({message: "Please contact your service provider.", title: "Something went wrong!", type: 'warning'})
    } finally {
      this.loading = false;
    }
  }

  @Watch('territory_type_id')
  updateTerritory(){
    this.territory_id = null;
  }


  async onClickDownload() {
    this.downloading = true;
    try {
      let {
        data,
        headers
      } = await this.$http.get(this.$api('/checkin-report?download&' + this.queryBuilder.getFilters() + '&all'),
        {
          responseType:
            'arraybuffer'
        });
      const blob = await new Blob([data], {type: 'application/csv'});
      const link = document.createElement("a");
      link.href = await URL.createObjectURL(blob);
      link.download = this.$getFileNameFromContentDisposition(headers);
      link.click();
    } catch (e) {
      this.$notify({title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.',})
    } finally {
      this.downloading = false;
    }
  }

  async reportObjectUrl() {
    let {data} = await this.$http.get(
      this.$api('/checkin-report?download&' + this.queryBuilder.getFilters() + '&all'),
      {
        responseType: 'blob'
      }
    );
    const blob = await new Blob([data], {type: 'application/csv'});
    let fileURL = await URL.createObjectURL(blob);
    return fileURL;
  }

  async onClickPrint() {
    this.printing = true;
    try {
      let {data} = await this.$http.get(this.$api('/checkin-report?' + this.queryBuilder.getFilters() + '&all'));
      let checkInReport = data.checkinReport.map((checkIn: any) => {
        checkIn.isPlanned = checkIn.route_id ? "Yes" : "No";
        checkIn.departmentAddress = checkIn.department.address ? checkIn.department.address : "-";
        checkIn.checkOutTime = "-";
        checkIn.checkInTime = moment(checkIn.created_at).format('lll')
        checkIn.remarks = "-";
        return checkIn;
      });
      await printJS({
        printable: checkInReport,
        properties: [
          {field: 'user.code', displayName: 'Employee code'},
          {field: 'user.name', displayName: 'Employee Name'},
          {field: 'route.name', displayName: 'Route'},
          {field: 'isPlanned', displayName: 'Planned Visit'},
          {field: 'department.name', displayName: 'Department Name'},
          {field: 'departmentAddress', displayName: 'Address'},
          {field: 'checkInTime', displayName: 'Check-In Time'},
          {field: 'checkOutTime', displayName: 'Check-Out Time'},
          {field: 'remarks', displayName: 'Remarks'},
        ],
        type: 'json',
        header: 'Check-In Report'
      })
    } catch (e) {
      this.$notify({title: 'Something Wrong!', message: 'Please Try again.', type: 'warning'});
    } finally {
      this.printing = false;
    }
  }

  @Watch('user_id')
  onChangeUser(value: number) {
    this.queryBuilder.addListener('user_id', value);
  }

  @Watch('department_id')
  onChangeDepartment(value: number) {
    this.queryBuilder.addListener('department_id', value);
  }

  @Watch('territory_id')
  onChangeTerritory(value: number) {
    this.queryBuilder.addListener('territory_id', value);
  }

  @Watch('range')
  onChangeRange(value: number) {
    this.queryBuilder.addListener('range', value);
  }

  close() {
    this.showModal = false;
  }

  get permissionEnum() {
    return PermissionEnum;
  }
}
</script>
