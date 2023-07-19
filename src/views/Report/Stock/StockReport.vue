<template>
  <div class="row pl-3">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-3">
              <label for="department_name">DB Name</label>
              <el-select
                v-model="filters.department_id"
                filterable
                multiple
                allow-create
                default-first-option
                placeholder="Choose DB Name"
              >
                <el-option v-for="item in department_name" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </div>
            <div class="col-9 text-right pt-4">
              <base-button
                :loading="downloading"
                type="primary"
                @click.prevent="showDownloadModal = !showDownloadModal"
              >
                <i class="fa fa-download"></i> Download
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal :show="showDownloadModal" @close="showDownloadModal = false">
      <template slot="header">
        <h5 class="modal-title">Download Stock Report</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <base-input label="Recipient (Optional)" v-model="recipient" :placeholder="$user ? $user.email : ''"></base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="showDownloadModal = false" type="secondary">Close</base-button>
        <base-button :loading="loading" type="primary" @click.prevent="downloadStockReport">
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
import TerritoryAutocomplete from '@/components/resources-autocomplete/TerritoryAutocomplete.vue';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import swal from 'sweetalert2';

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    UserLazydropdown,
    TerritoryAutocomplete,
    DepartmentLazydropdown,
    flatPicker,
    DateRangeForReport,
    [Tag.name]: Tag
  }
})
export default class StockReport extends Vue {
  public downloading: boolean = false;
  public loading: boolean = false;
  public printing: boolean = false;
  private showModal: boolean = false;
  public created_by: number | null = null;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public showDownloadModal: boolean = false;
  public recipient: string = '';
  public department_name: any = [];
  public rangeSelectConfig = {
    allowInput: true,
    disable: [
      function(range: Date) {
        return moment().diff(range) < 0;
      }
    ]
  };
  public filters: any = {
    department_id: null
  };

  todaysDate() {
    var currentDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return currentDate;
  }
  async downloadStockReport(status: string) {
    this.loading = true;
    try {
      let { data, headers } = await this.$http.get(
        this.$api('/stock-report?' + this.queryBuilder.getFilters() + '&' + 'recipient=' + this.recipient)
      );
      await swal.fire('Thanks For Entering Your Mail', 'You will receive the report within a few minutes.', 'success');
    } catch (e) {
      this.$notify({ title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.' });
    } finally {
      this.loading = false;
      this.showDownloadModal = false;
      this.recipient = '';
      this.filters.department_id = null;
    }
  }

  async mounted() {
    this.$http.get(await this.$api(`/department-type-wise-department-name`)).then(response => {
      this.department_name = response.data.thDepartmantName;
    });
  }

  @Watch('filters.department_id')
  onChangeRange(value: number) {
    this.queryBuilder.addListener('department_id', value);
  }

  @Watch('filters.territory_type')
  onChangeTerritory(value: number) {
    this.queryBuilder.addListener('territory_type', value);
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
<style>
.el-select {
  display: block !important;
}
</style>
