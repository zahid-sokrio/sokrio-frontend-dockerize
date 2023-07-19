<template>
  <div class="col-6">
    <a href="#" @click.prevent="showDownloadModal = true">
      <stats-card title="Visit Report" type="gradient-green" sub-title="Visit Target Report"
                  icon="ni ni-bullet-list-67" v-can="permissionEnum.VISIT_TARGET_REPORT">
        <template slot="footer">
          <div class="row">
            <div class="col-md-6">
              <!--              <span class="text-nowrap"> <i class="ni ni-email-83"></i> {{ todaysDate() | datetime('ll') }} </span>-->
            </div>
            <div class="col-md-6">
              <el-tooltip class="ml-3" content="Download Visit Target Report" placement="right">
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
          <h5 class="modal-title"> Download Visit Target Report</h5>
        </template>
        <div class="card">
          <div class="card-body">
            <territory-lazydropdown
              label="Territory (Optional)"
              placeholder="Territory"
              v-model="territory_id"
              :add-button="false"
            ></territory-lazydropdown>
            <DateRange :rules="{required:true}" v-model="range" label-prop="Submission"></DateRange>
            <base-input label="Recipient (Optional)"
                        v-model="recipient"
                        :placeholder="$user?$user.email:''"
            >
            </base-input>
          </div>
        </div>
        <template slot="footer">
          <base-button @click="close" type="secondary">Close</base-button>
          <base-button :loading="downloading" type="primary" @click.prevent="handleSubmit(onClickDownload)">
            <i class="fa fa-download"></i>
          </base-button>
        </template>
      </modal>
    </validation-observer>
  </div>

</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import DateRange from "@/components/DateRange.vue";
import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown.vue";
import { QueryBuilder } from "@/classes/QueryBuilder";
import { Permission as PermissionEnum } from '@/enums/Permission'
import swal from "sweetalert2";

@Component({
  components: {
    TerritoryLazydropdown,
    DateRange
  }
})
export default class VisitReport extends Vue {
  private visitReports: any[] = [
    {name: 'Visit Target Report', tooltip: 'Download Visit Target Report.'},
    {name: 'Tracking Report', tooltip: 'Download Tracking Report.'}
  ];
  public downloading: boolean = false;
  private showDownloadModal: boolean = false;
  public currentReport: { name: string } = {name: ''};
  public range: string = ''
  public territory_id: number | null = null;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public recipient: string | null = null;

  get permissionEnum() {
    return PermissionEnum;
  }

  todaysDate() {
    var currentDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return currentDate;
  }

  async onClickDownload() {
    this.downloading = true;
    try {
      await this.$http.get(this.$api('/visit-target-report' + this.queryBuilder.getFilters(true)));
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

  @Watch('recipient')
  onChangeRecipient(value: number) {
    this.queryBuilder.addListener('recipient', value);
  }

  @Watch('territory_id')
  onChangeTerritoryId(value: number) {
    this.queryBuilder.addListener('territory_id', value);
  }

  @Watch('range')
  onChangeRange(value: number) {
    this.queryBuilder.addListener('range', value);
  }

  close() {
    this.showDownloadModal = false;
  }
}
</script>
