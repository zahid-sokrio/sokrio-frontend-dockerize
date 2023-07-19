<template>
  <div class="row pl-3">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-3">
              <DateRangeForReport v-model="filters.range" label-prop="Date Range"></DateRangeForReport>
            </div>
            <div class="col-3">
              <UserLazydropdown v-model="filters.user_id" label="Select User(Optional)" :add-button="false"> </UserLazydropdown>
            </div>
            <div class="col-6 text-right pt-4">
              <base-button :disabled="!filters.range" :loading="downloading" type="primary" @click.prevent="showDownloadModal = !showDownloadModal">
                <i class="fa fa-download"></i> Download
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal :show="showDownloadModal" @close="showDownloadModal = false">
      <template slot="header">
        <h5 class="modal-title">Download Attendance Report</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <base-input label="Recipient (Optional)" v-model="recipient" :placeholder="$user ? $user.email : ''"></base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="showDownloadModal = false" type="secondary">Close</base-button>
        <base-button :loading="loading" type="primary" @click.prevent="downloadAttendanceReport">
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
import TerritoryTypeAutocomplete from '@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import swal from 'sweetalert2';

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    UserLazydropdown,
    TerritoryTypeAutocomplete,
    DepartmentLazydropdown,
    flatPicker,
    DateRangeForReport,
    [Tag.name]: Tag
  }
})
export default class AttendanceReport extends Vue {
  public downloading: boolean = false;
  public loading: boolean = false;
  public printing: boolean = false;
  private showModal: boolean = false;
  public created_by: number | null = null;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public showDownloadModal: boolean = false;
  public recipient: string = '';
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
    user_id: null
  };

  todaysDate() {
    var currentDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return currentDate;
  }
  async downloadAttendanceReport(status: string) {
    this.loading = true;
    try {
      let { data, headers } = await this.$http.get(
        this.$api('/attendance-report?' + this.queryBuilder.getFilters() + '&' + 'recipient=' + this.recipient)
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

  @Watch('filters.range')
  onChangeRange(value: number) {
    this.queryBuilder.addListener('range', value);
  }

  @Watch('filters.user_id')
  onChangeUser(value: number) {
    this.queryBuilder.addListener('user_id', value);
  }

  close() {
    this.showModal = false;
  }

  get permissionEnum() {
    return PermissionEnum;
  }
}
</script>
