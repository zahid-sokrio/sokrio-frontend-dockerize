<template>
  <div class="row pl-3" v-can="permissionEnum.ACTIVE_USER_REPORT">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-3">
              <DateRangeForReport v-model="filters.range" label-prop="Date Range (Optional)"></DateRangeForReport>
            </div>
            <div class="col-3"></div>
            <div class="col-3"></div>
            <div class="col-3 text-right pt-4">
              <base-button :loading="downloading" type="primary" @click.prevent="showDownloadModal = !showDownloadModal">
                <i class="fa fa-download"></i> Download
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal :show="showDownloadModal" @close="showDownloadModal = false">
      <template slot="header">
        <h5 class="modal-title">Download Active User Report</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <base-input label="Recipient (Optional)" v-model="recipient" :placeholder="$user ? $user.email : ''"></base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="showDownloadModal = false" type="secondary">Close</base-button>
        <base-button :loading="loading" type="primary" @click.prevent="downloadActiveUserReport">
          <i class="fa fa-envelope"></i>
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { QueryBuilder } from '@/classes/QueryBuilder';
import DateRangeForReport from '@/components/DateRangeForReports.vue';
import { Permission as PermissionEnum } from '@/enums/Permission';
import { Tag } from 'element-ui';
import swal from 'sweetalert2';

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    flatPicker,
    DateRangeForReport,
    [Tag.name]: Tag
  }
})
export default class StockReport extends Vue {
  public downloading: boolean = false;
  public loading: boolean = false;
  private showModal: boolean = false;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public showDownloadModal: boolean = false;
  public recipient: string = '';
  public filters: any = {
    range: ''
  };
  async downloadActiveUserReport(status: string) {
    this.loading = true;
    try {
      let { data, headers } = await this.$http.get(
        this.$api('/active-user-report?' + this.queryBuilder.getFilters() + '&' + 'recipient=' + this.recipient)
      );
      await swal.fire('Thanks for entering your mail', 'You will receive the report within a few minutes.', 'success');
    } catch (e) {
      this.$notify({ title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.' });
    } finally {
      this.loading = false;
      this.showDownloadModal = false;
      this.recipient = '';
      this.filters.range = '';
    }
  }

  @Watch('filters.range')
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
