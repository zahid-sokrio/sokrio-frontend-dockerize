<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-8">
          <div class="form-inline">
            <h3 class="mb-0">Visit Report</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row pl-3">
      <div v-for="(targetReport, index) in visitReports" :key="index" class="col-xl-6 col-md-6 ">
        <a href="#" @click.prevent="(showDownloadModal = true),(currentReport = targetReport)">
          <stats-card title="Visit Report" type="gradient-green" :sub-title="targetReport.name" icon="ni ni-bullet-list-67">
            <template slot="footer">
              <div class="row">
                <div class="col-md-6">
<!--                  <span class="text-nowrap"> <i class="ni ni-email-83"></i> {{ todaysDate() | datetime('ll') }} </span>-->
                </div>
                <div class="col-md-6">
                  <el-tooltip class="ml-3" :content="targetReport.tooltip" placement="right">
                    <i class="fas fa-info-circle" style="color: #5e72e4; font-size: 28px; margin-right: 0.60rem; float: right"></i>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </stats-card>
        </a>
      </div>
    </div>
    <modal :show="showDownloadModal" @close="close">
      <template slot="header">
        <h5 class="modal-title"> Download {{currentReport.name}}</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <territory-lazydropdown
            label="Territory (Optional)"
            placeholder="Territory"
            v-model="territory_id"
            :add-button="false"
          ></territory-lazydropdown>
          <user-lazydropdown
            label="User (Optional)"
            placeholder="User"
            v-model="user_id"
            :end-point="'users'"
            :add-button="false"
            :multiple="true"
          ></user-lazydropdown>
          <DateRange v-model="range" label-prop="Date Range"></DateRange>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="close" type="secondary">Close</base-button>
        <base-button :loading="downloading" type="primary" @click.prevent="onClickDownload">
          <i class="fa fa-download"></i>
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import DateRange from "@/components/DateRange.vue";
  import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown.vue";
  import {QueryBuilder} from "@/classes/QueryBuilder";
  import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";

  @Component({
    components: {
      UserLazydropdown,
      TerritoryLazydropdown,
      DateRange
    }
  })
  export default class VisitPlanReport extends Vue {
    private visitReports: any[] = [
      {name: 'Visit Target Report', tooltip: 'Download Visit Target Report.'}
    ];
    public downloading: boolean = false;
    private showDownloadModal: boolean = false;
    public currentReport: { name: string } = {name: ''};
    public range: string = ''
    public territory_id: number | null = null;
    public user_id: string = '';
    public queryBuilder: QueryBuilder = new QueryBuilder();

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
        let {data} = await this.$http.get(this.$api('/visit-target-report' + this.queryBuilder.getFilters(true)), {responseType: 'arraybuffer'});
        const blob = await new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const link = document.createElement("a");
        link.href = await URL.createObjectURL(blob);
        link.download = 'visit-plan-report-' + this.todaysDate()
        link.click();
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

    @Watch('range')
    onChangeRange(value: number) {
      this.queryBuilder.addListener('range', value);
    }

    @Watch('user_id')
    onChangeUsers(value: number) {
      this.queryBuilder.addListener('user_id', value);
    }

    close() {
      this.showDownloadModal = false;
    }
  }
</script>
