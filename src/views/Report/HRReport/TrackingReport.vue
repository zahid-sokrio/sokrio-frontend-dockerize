<template>
  <div class="row pl-3" v-can="permissionEnum.HR_TRACKING_REPORT">
    <div class="col-xl-12 col-md-12 col-lg-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-xl-3 col-md-3 col-lg-3">
              <DateRange v-model="range" label-prop="Date Range"></DateRange>
            </div>
            <div class="col-xl-3 col-md-3 col-lg-3">
              <UserLazydropdown
                :disabled="!range"
                v-model="created_by"
                label="Select User(Optional)"
                :add-button="false">
              </UserLazydropdown>
            </div>
            <div class="offset-3 col-xl-3 col-md-3 col-lg-3 text-right">
              <base-button :disabled="!range && reports.length==0" :loading="printing" type="secondary"
                           @click.prevent="onClickPrint">
                <i class="fa fa-print"></i>
              </base-button>
              <base-button :disabled="!range && reports.length==0" :loading="downloading" type="primary"
                           @click.prevent="onClickDownload">
                <i class="fa fa-download"></i>
              </base-button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <el-table v-loading="loading" class="table-responsive  table-flush table-striped" header-row-class-name="thead-light"
                    :data="reports">
            <el-table-column label="SL" min-width="100px" prop="name" sortable type="index"></el-table-column>
            <el-table-column label="Employee Code" prop="Employee Code">
              <template v-slot="{ row }">
                <b>{{ row.user.code }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Name">
              <template v-slot="{ row }">
                {{ row.user.name }}
              </template>
            </el-table-column>
            <el-table-column label="Latitude" prop="name">
              <template v-slot="{ row }">
                <b>{{ row.lat }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Longitude" prop="name">
              <template v-slot="{ row }">
                <b>{{ row.long }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Date/Time">
              <template v-slot="{ row }">
                <b>{{ row.created_at | datetime }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Address">
              <template v-slot="{ row }">
                <b>{{ row.address }}</b>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {QueryBuilder} from "@/classes/QueryBuilder";
import moment from "moment";
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import printJS from "print-js";
import DateRange from "@/components/DateRange.vue";
import {Permission as PermissionEnum} from "@/enums/Permission";

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    UserLazydropdown,
    flatPicker,
    DateRange
  }
})
export default class TrackingReport extends Vue {
  public downloading: boolean = false;
  public loading: boolean = false;
  public printing: boolean = false;
  private showModal: boolean = false;
  public created_by: number | null = null;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public reports = [];
  public range: string = '';
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

  @Watch('queryBuilder.watch')
  async getReport() {
    if (!this.range) {
      this.reports = [];
      return
    }
    this.loading = true;
    try {
      let {data} = await this.$http.get(
        this.$api('/location-tracking-report' + this.queryBuilder.getFilters(true))
      );
      this.reports = data.locationTrackingReport;
    } catch (e) {
      this.$notify({message: "Please contact your service provider.", title: "Something went wrong!", type: 'warning'})
    } finally {
      this.loading = false;
    }
  }

  async onClickDownload() {
    this.downloading = true;
    try {
      let {
        data,
        headers
      } = await this.$http.get(
        this.$api('/location-tracking-report?download&' + this.queryBuilder.getFilters()
        ), {
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

  async onClickPrint() {
    this.printing = true;
    try {
      let {data} = await this.$http.get(this.$api('/location-tracking-report?' + this.queryBuilder.getFilters()));
      await printJS({
        printable: data.locationTrackingReport,
        properties: [
          {field: 'user.code', displayName: 'Employee code'},
          {field: 'user.name', displayName: 'Name'},
          {field: 'lat', displayName: 'Latitude'},
          {field: 'long', displayName: 'Longitude'},
          {field: 'created_at', displayName: 'Date/Time(24hr format)'},
          {field: 'address', displayName: 'Address'}
        ],
        type: 'json',
        header: 'Tracking Report'
      })
    } catch (e) {
      this.$notify({title: 'Something Wrong!', message: 'Please Try again.', type: 'warning'});
    } finally {
      this.printing = false;
    }
  }

  @Watch('created_by')
  onChangeUser(value: number) {
    this.queryBuilder.addListener('user_id', value);
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
