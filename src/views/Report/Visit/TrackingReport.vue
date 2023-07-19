<template>
  <div class="col-6">
    <a href="#" @click.prevent="showDownloadModal = true">
      <stats-card title="Visit Report" type="gradient-green" sub-title="Tracking Report" icon="ni ni-bullet-list-67"
                  v-can="permissionEnum.TRACKING_REPORT">
        <template slot="footer">
          <div class="row">
            <div class="col-md-6">
              <!--              <span class="text-nowrap"> <i class="ni ni-email-83"></i> {{ todaysDate() | datetime('ll') }} </span>-->
            </div>
            <div class="col-md-6">
              <el-tooltip class="ml-3" content="Download Tracking Report" placement="right">
                <i class="fas fa-info-circle"
                   style="color: #5e72e4; font-size: 28px; margin-right: 0.60rem; float: right"></i>
              </el-tooltip>
            </div>
          </div>
        </template>
      </stats-card>
    </a>
    <validation-observer v-if="showDownloadModal" v-slot="{ handleSubmit }" ref="formValidator">
      <modal :show="showDownloadModal" @close="close">
        <template slot="header">
          <h5 class="modal-title"> Download Tracking Report</h5>
        </template>
        <div class="card">
          <div class="card-body">
            <base-input name="date" :rules="{required:true}" clearable label="Select Date">
              <flat-picker clearable :config="{ allowInput: true }" class="form-control datepicker" placeholder="Date"
                           v-model="date"></flat-picker>
            </base-input>
            <territory-lazydropdown
              label="Territory (Optional)"
              placeholder="Territory"
              v-model="territory_id"
              :add-button="false"
            ></territory-lazydropdown>
            <base-input label="Recipient (Optional)"
                        v-model="recipient"
                        :placeholder="$user?$user.email:''"
            ></base-input>
          </div>
        </div>
        <template slot="footer">
          <base-button @click="close" type="secondary">Close</base-button>
          <base-button :loading="downloading" type="primary" @click.prevent="handleSubmit(onClickDownload)">
            <i class="fa fa-envelope"></i>
          </base-button>
        </template>
      </modal>
    </validation-observer>
  </div>

</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown.vue";
import { QueryBuilder } from "@/classes/QueryBuilder";
import { Permission as PermissionEnum } from '@/enums/Permission'
import swal from "sweetalert2";

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    TerritoryLazydropdown,
    flatPicker
  }
})
export default class TrackingReport extends Vue {
  public downloading: boolean = false;
  private showDownloadModal: boolean = false;
  public territory_id: number | null = null;
  public recipient: string | null = null;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public date: string = '';

  todaysDate() {
    var currentDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return currentDate;
  }

  get permissionEnum() {
    return PermissionEnum;
  }

  async onClickDownload() {
    this.downloading = true;
    try {
      await this.$http.get(this.$api('/tracking-report' + this.queryBuilder.getFilters(true)));
      swal.fire(
        "Report Sent",
        "You will receive the report within a few minutes.",
        "success"
      );
    } catch (e) {
      this.$notify({title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.',})
    } finally {
      this.downloading = false;
      this.showDownloadModal = false;
    }
  }

  @Watch('territory_id')
  onChangeTerritoryId(value: number) {
    this.queryBuilder.addListener('territory_id', value);
  }

  @Watch('date')
  onChangeRange(value: number) {
    this.queryBuilder.addListener('date', value);
  }

  @Watch('recipient')
  onRecipient(value: string) {
    this.queryBuilder.addListener('recipient', value);
  }

  close() {
    this.showDownloadModal = false;
  }
}
</script>
