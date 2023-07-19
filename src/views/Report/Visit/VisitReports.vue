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
    <div class="card-body">
      <div class="row pl-3">
        <VisitTargetReport></VisitTargetReport>
        <TrackingReport></TrackingReport>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import VisitTargetReport from "@/views/Report/Visit/VisitTargetReport.vue";
  import TrackingReport from "@/views/Report/Visit/TrackingReport.vue";

  @Component({
    components: {TrackingReport, VisitTargetReport}
  })
  export default class VisitReports extends Vue {

  }
</script>
