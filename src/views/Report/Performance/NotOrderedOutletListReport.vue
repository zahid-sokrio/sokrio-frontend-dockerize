<template>
  <div class="row pl-3" v-can="permissionEnum.NOT_ORDERED_REPORT">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <div class="row ml-2">
            <div class="col-6">
              <div class="row alignment">
                <label for="Channel"><strong>Select Channels</strong></label>
                <el-select class="ml-4" v-model="channel" filterable placeholder="Select Channels">
                  <el-option v-for="item in department_types" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <br />
          <div class="row layout-alignment" v-if="channel">
            <div class="col-4">
              <DateRange label-prop="Date Range" :key="selectedDateRange" v-model="filters.range"></DateRange>
            </div>
            <div class="col-2">
              <TerritoryTypeAutocomplete
                :disabled="!filters.range"
                v-model="selectedTerritoryType"
                label="Territory Type"
              ></TerritoryTypeAutocomplete>
            </div>
            <div class="col-2">
              <TerritoryAutocomplete
                :disabled="!selectedTerritoryType"
                label="Territory"
                v-model="filters.territorry"
                :fetch-on-change-disable="false"
                :end-point="`territories${selectedTerritoryType ? '?territory_type=' + selectedTerritoryType : ''}`"
              >
              </TerritoryAutocomplete>
            </div>
            <div class="col-2">
              <MemberAutocomplete
                :disabled="!filters.territorry"
                label="Under Territory Manager"
                :fetch-on-change-disable="false"
                :end-point="`manager-lists${selectedTerritoryType ? '?t=' + filters.territorry : ''}`"
                v-model="filters.user_id"
              >
              </MemberAutocomplete>
            </div>
            <div class="col-2 text-right">
              <base-button :disabled="!filters.territorry" :loading="loading" type="primary" @click.prevent="getOrderedStatus">
                Check Status</base-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 status" v-loading="loading">
      <div class="card" v-if="checkStatus">
        <div class="card-header row layout-alignment">
          <div class="col-8">
            <table class="table">
              <tr>
                <td><strong>Total Outlet</strong></td>
                <td>
                  <strong>{{ outlets[0] }}</strong>
                </td>
              </tr>
              <tr>
                <td><strong>Not Ordered Outlet</strong></td>
                <td>
                  <strong style="color:#DC143C;">{{ outlets[1] }}</strong>
                </td>
              </tr>
            </table>
          </div>
          <div class="col-4 text-right">
            <base-button :loading="downloading" :disabled="!download" type="primary" @click.prevent="showDownloadModal = !showDownloadModal">
              <i class="fa fa-download"></i> Download
            </base-button>
          </div>
        </div>
      </div>
    </div>
    <modal :show="showDownloadModal" @close="showDownloadModal = false">
      <template slot="header">
        <h5 class="modal-title">Download Not-Ordered Outlet List Report</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <base-input label="Recipient (Optional)" v-model="recipient" :placeholder="$user ? $user.email : ''"></base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="showDownloadModal = false" type="secondary">Close</base-button>
        <base-button :loading="loading" type="primary" @click.prevent="downloadDailyCallReport">
          <i class="fa fa-envelope"></i>
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { QueryBuilder } from '@/classes/QueryBuilder';
import moment from 'moment';
import DepartmentLazydropdown from '@/components/lazyDropdown/DepartmentLazydropdown.vue';
import printJS from 'print-js';
import DateRangeForReport from '@/components/DateRangeForReports.vue';
import { Permission as PermissionEnum } from '@/enums/Permission';
import { Tag } from 'element-ui';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import swal from 'sweetalert2';
import TerritoryTypeAutocomplete from '@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue';
import TerritoryAutocomplete from '@/components/resources-autocomplete/TerritoryAutocomplete.vue';
import DateRange from '@/components/DateRange.vue';
import MemberAutocomplete from '@/components/resources-autocomplete/MemberAutocomplete.vue';

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    UserLazydropdown,
    TerritoryTypeAutocomplete,
    TerritoryAutocomplete,
    DateRange,
    MemberAutocomplete,
    DepartmentLazydropdown,
    flatPicker,
    DateRangeForReport,
    [Tag.name]: Tag
  }
})
export default class DailyCallPerformanceReport extends Vue {
  public downloading: boolean = false;
  public loading: boolean = false;
  public reChecker: boolean = false;
  public printing: boolean = false;
  private showModal: boolean = false;
  public created_by: number | null = null;
  public channel: number | null = null;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public showDownloadModal: boolean = false;
  public download: boolean = false;
  public checkStatus: boolean = false;
  public recipient: string = '';
  public selectedTerritoryType: number | null = null;
  public selectedTerritory: number | null = null;
  public selectedUser: number | null = null;
  private selectedDateRange: string = moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD');
  public department_types: any = [];
  public outlets: any = '';
  public rangeSelectConfig = {
    allowInput: true,
    disable: [
      function(range: Date) {
        return moment().diff(range) < 0;
      }
    ]
  };
  public filters: any = {
    range: '',
    territorry: null,
    user_id: null
  };

  async getOrderedStatus() {
    this.loading = true;
    try {
      await this.delay(1000);
      let { data } = await this.$http.get(this.$api('/not-ordered-status' + this.queryBuilder.getFilters(true) + '&' + 'channel=' + this.channel));
      this.outlets = data.notOrderedStatus;
    } catch (e) {
      this.$notify({ message: 'Please contact your service provider.', title: 'Something went wrong!', type: 'warning' });
    } finally {
      this.loading = false;
      this.reChecker = true;
      this.checkStatus = true;
      this.download = parseInt(this.outlets[1]) > 0 ? true : false;
    }
  }

  async downloadDailyCallReport(status: string) {
    this.loading = true;
    try {
      let { data, headers } = await this.$http.get(
        this.$api(
          '/not-ordered-outlet-list-report?' + this.queryBuilder.getFilters() + '&' + 'recipient=' + this.recipient + '&' + 'channel=' + this.channel
        )
      );
      await swal.fire('Thanks for entering your mail', 'You will receive the report within a few minutes.', 'success');
    } catch (e) {
      this.$notify({ title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.' });
    } finally {
      this.loading = false;
      this.showDownloadModal = false;
      this.recipient = '';
    }
  }
  async mounted() {
    await this.$http.get(this.$api(`/department-types-list`)).then(response => {
      this.department_types = response.data.departmentTypes;
    });
  }

  delay(milliseconds: any) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }

  @Watch('filters.range')
  onChangeRange(value: number) {
    this.queryBuilder.addListener('range', value);
  }

  @Watch('selectedTerritoryType')
  onChangeTerritoryType(value: number) {}

  @Watch('filters.territorry')
  onChangeTerritory(value: number) {
    this.filters.user_id = '';
    this.queryBuilder.addListener('territory_id', value);
    if (this.reChecker) {
      this.getOrderedStatus();
    }
  }

  @Watch('filters.user_id')
  onChangeUser(value: number) {
    this.queryBuilder.addListener('user_id', value);
    if (this.reChecker) {
      this.getOrderedStatus();
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
<style lang="css">
.layout-alignment {
  display: flex;
  align-items: center;
}
.alignment {
  align-items: baseline;
}
</style>
