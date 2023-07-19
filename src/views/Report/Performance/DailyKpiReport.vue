<template>
  <div class="row pl-3">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-3">
              <DateRange v-model="range" label-prop="Date Range"></DateRange>
            </div>
            <div class="col-2">
              <UserLazydropdown
                :disabled="!range" v-model="filters.name" label="Filter By Name"
                @selected-item="onChangeUserName($event)" :add-button="false">
              </UserLazydropdown>

            </div>
            <div class="col-2">
              <user-lazydropdown :disabled="!range" v-model="filters.code"
                                 label="Filter By Code"
                                 item-text="code" searchable-key="code"
                                 @selected-item="onChangeUserCode($event)"></user-lazydropdown>
            </div>
            <div class="offset-2 col-3 text-right">
              <base-button :disabled="!range && dailyKpiReport.length==0" :loading="printing" type="secondary"
                           @click.prevent="onClickPrint">
                <i class="fa fa-print"></i>
              </base-button>
              <base-button :disabled="!range && dailyKpiReport.length==0" :loading="downloading" type="primary"
                           @click.prevent="onClickDownload">
                <i class="fa fa-download"></i>
              </base-button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <el-table v-loading="loading" class="table-responsive  table-flush table-striped"
                    header-row-class-name="thead-light"
                    :data="dailyKpiReport">
            <el-table-column label="SL" min-width="100px" prop="name" sortable type="index"></el-table-column>
            <el-table-column label="Date" prop="Date" sortable>
              <template v-slot="{ row }">
                <b v-if="row.date">{{ row.date|datetime('ll') }}</b>
                <b v-else>-</b>
              </template>
            </el-table-column>
            <el-table-column label="Territories" prop="territories" sortable>
              <template v-slot="{ row }">
                <el-popover v-if="row.territories_name" placement="bottom"
                            width="200" trigger="hover">
                  <div>
                    <el-tag type="secondary" class="mr-1 mb-2" v-for="(territory, index) in
                    row.territories_name.split(',')"
                            :key="index">
                      <b>{{ territory }}</b>
                    </el-tag>
                  </div>
                  <base-button type="secondary" icon size="sm" slot="reference">
                    Territories
                  </base-button>
                </el-popover>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="Outlet Hit" prop="outlet_hit" sortable>
              <template v-slot="{ row }">
                <b>{{ row.total_checkin ? row.total_checkin : '-' }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Order Count" prop="order_count" sortable>
              <template v-slot="{ row }">
                <b>{{ row.total_orders ? row.total_orders : '-' }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Amount" prop="amount" sortable>
              <template v-slot="{ row }">
                <b>{{ row.total_amount ? row.total_amount : '-' }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Productivity" prop="productivity" sortable>
              <template v-slot="{ row }">
                <b>{{
                    row.total_orders && (row.total_checkin > 0) ? Math.trunc(Number(row.total_orders /
                      row.total_checkin) * 100) + '%'
                      :
                      '-'
                  }}</b>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { QueryBuilder } from "@/classes/QueryBuilder";
import moment from "moment";
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import printJS from "print-js";
import DateRange from "@/components/DateRange.vue";
import { Permission as PermissionEnum } from "@/enums/Permission";
import { Tag } from 'element-ui';

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    UserLazydropdown,
    flatPicker,
    DateRange,
    [Tag.name]: Tag,
  }
})
export default class DailyKPIReport extends Vue {
  public downloading: boolean = false;
  public loading: boolean = false;
  public printing: boolean = false;
  private showModal: boolean = false;
  public created_by: number | null = null;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public dailyKpiReport = [];
  public range: string = '';
  private userNameOnPrint = '';
  private userCodeOnPrint = '';
  public rangeSelectConfig = {
    allowInput: true,
    disable: [
      function (range: Date) {
        return moment().diff(range) < 0;
      }
    ]
  }

  private filters: any = {
    name: '',
    code: ''
  }

  todaysDate() {
    var currentDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return currentDate;
  }

  @Watch('queryBuilder.watch')
  async getDailyKPIReport() {
    if (!this.range) {
      this.dailyKpiReport = [];
      return
    }
    this.loading = true;
    try {
      let {data} = await this.$http.get(this.$api('/daily-kpi-report' + this.queryBuilder.getFilters(true)))
      this.dailyKpiReport = data.dailyKpiReport;
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
      } = await this.$http.get(this.$api('/daily-kpi-report?download&' + this.queryBuilder.getFilters()),
        {
          responseType:
            'arraybuffer'
        });
      const blob = await new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
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
      this.$api('/daily-kpi-report?download&' + this.queryBuilder.getFilters()),
      {
        responseType: 'blob'
      }
    );
    const blob = await new Blob([data], {type: 'application/pdf'});
    let fileURL = await URL.createObjectURL(blob);
    return fileURL;
  }

  async onClickPrint() {
    this.printing = true;
    try {
      let {data} = await this.$http.get(this.$api('/daily-kpi-report?' + this.queryBuilder.getFilters()));
      let dailyKpiReport = data.dailyKpiReport.map((KPI: any) => {
        KPI.formattedDate = KPI.date ? moment(KPI.date).format('ll') : '-';
        KPI.productivity = KPI.total_checkin === 0 ? 0 : Math.trunc(Number(KPI.total_orders /
          KPI.total_checkin) * 100) + '%';
        KPI.code = KPI.user_code ? KPI.user_code : '-';
        KPI.amount = KPI.total_amount ? KPI.total_amount : '-';
        KPI.territories = KPI.territories_name ? KPI.territories_name.split(',').map((item: string) => item +
          '\t') : '-';
        return KPI;
      });
      printJS({
        printable: dailyKpiReport,
        properties: [
          {field: 'formattedDate', displayName: 'Date'},
          {field: 'territories', displayName: 'Territories'},
          {field: 'total_checkin', displayName: 'Outlet Hit'},
          {field: 'total_orders', displayName: 'Order Count'},
          {field: 'amount', displayName: 'Amount'},
          {field: 'productivity', displayName: 'Productivity'},
        ],
        type: 'json',
        headerStyle: 'font-size: 20px;',
        header: `Daily KPI Report  ${this.userNameOnPrint ? ' - ' + this.userNameOnPrint + ' (' +
          this.userCodeOnPrint + ')' :
          ''} ${this.range ?
          ' - ' +
          this.range : ''}`
      })
    } catch (e) {
      this.$notify({title: 'Something Wrong!', message: 'Please Try again.', type: 'warning'});
    } finally {
      this.printing = false;
    }
  }

  @Watch('range')
  onChangeRange(value: number) {
    this.queryBuilder.addListener('range', value);
  }

  onChangeUserCode(kpi: any) {
    if (kpi) {
      this.userNameOnPrint = kpi.name;
      this.userCodeOnPrint = kpi.code;
      this.filters.name = kpi.name;
      this.queryBuilder.addListener('user_id', kpi.id);
    } else {
      this.filters.name = null;
      this.userNameOnPrint = '';
      this.userCodeOnPrint = '';
      this.queryBuilder.addListener('user_id', '');
    }
  }

  onChangeUserName(kpi: any) {
    if (kpi) {
      this.userNameOnPrint = kpi.name;
      this.userCodeOnPrint = kpi.code;
      this.filters.code = kpi.code;
      this.queryBuilder.addListener('user_id', kpi.id);
    } else {
      this.filters.code = null;
      this.userNameOnPrint = '';
      this.userCodeOnPrint = '';
      this.queryBuilder.addListener('user_id', '');
    }
  }

  close() {
    this.showModal = false;
  }

  get permissionEnum() {
    return PermissionEnum;
  }
}
</script>
