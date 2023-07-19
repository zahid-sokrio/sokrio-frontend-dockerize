<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-8">
          <div class="form-inline">
            <h3 class="mb-0">Sales Report</h3>
          </div>
        </div>
      </div>
    </div>
   <div class="card-body">
     <div class="row pl-3">
       <div v-for="(salesReport, index) in salesReports" :key="index" class="col-xl-6 col-md-6 ">
         <a href="#" @click.prevent="(isShowEmailReport = true), (currentReport = salesReport)" v-can="salesReport.permission">
           <stats-card title="Sales Report" type="gradient-green" :sub-title="salesReport.name" icon="ni ni-bullet-list-67">
             <template slot="footer">
               <div class="row">
                 <div class="col-md-6">
<!--                   <span class="text-nowrap"> <i class="ni ni-email-83"></i> {{ todaysDate() | datetime('ll') }} </span>-->
                 </div>
                 <div class="col-md-6">
                   <el-tooltip class="ml-3" :content="salesReport.tooltip" placement="right">
                     <i class="fas fa-info-circle" style="color: #5e72e4; font-size: 28px; margin-right: 0.60rem; float: right"></i>
                   </el-tooltip>
                 </div>
               </div>
             </template>
           </stats-card>
         </a>
       </div>
     </div>
   </div>
    <email-modal :is-email-report.sync="isShowEmailReport" :currentReport="currentReport"></email-modal>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"></GIFModal>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
// @ts-ignore
import emailModal from '@/views/Report/emailModal.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import { Permission as PermissionEnum } from '@/enums/Permission'

@Component({
  components: {
    emailModal,
    GIFModal
  }
})
export default class Sales extends Vue {
  private salesReports: any[] = [];
  private isShowEmailReport: boolean = false;
  private currentReport = '';
  private demoTourEntity: string = 'salesReport';
  private GIFs: Array<any> = [
    {
      label: 'Create a sales report',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a sales report',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a sales report',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of sales report';

  fetchSalesReportTab() {
    this.salesReports = [
      { name: 'Sales Order Report', tooltip: 'Report will be generated only for delivered orders.', type: 'order',
        permission: PermissionEnum.SALES_ORDER_REPORT },
      { name: 'SR Wise Sales Report', tooltip: 'Report will be generated for field force performance.', type:
          'field_force', permission: PermissionEnum.SR_WISE_SALES_REPORT}
    ];
  }
  todaysDate() {
    var currentDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return currentDate;
  }

  created() {
    this.fetchSalesReportTab();
  }
}
</script>
