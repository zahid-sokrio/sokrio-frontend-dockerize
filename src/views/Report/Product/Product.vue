<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-8">
          <div class="form-inline">
            <h3 class="mb-0">Product Report</h3>
          </div>
        </div>
      </div>
    </div>
   <div class="card-body">
     <div class="row pl-3">
       <div v-for="(productReport, index) in productReports" :key="index" class="col-xl-6 col-md-6 ">
         <a href="#" @click.prevent="(isShowEmailReport = true), (currentReport = productReport)"
            v-can="productReport.permission">
           <stats-card title="Product Report" type="gradient-green" :sub-title="productReport.name" icon="ni ni-bullet-list-67">
             <template slot="footer">
               <div class="row">
                 <div class="col-md-6">
<!--                   <span class="text-nowrap"> <i class="ni ni-email-83"></i> {{ todaysDate() | datetime('ll') }} </span>-->
                 </div>
                 <div class="col-md-6">
                   <el-tooltip class="ml-3" :content="productReport.tooltip" placement="right">
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
export default class Product extends Vue {
  private productReports: any[] = [];
  private isShowEmailReport: boolean = false;
  private currentReport = '';
  private demoTourEntity: string = 'productReport';
  private GIFs: Array<any> = [
    {
      label: 'Create a product report',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a product report',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a product report',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of product report';

  fetchSalesReportTab() {
    this.productReports = [
      { name: 'Product Wise Sales Report', tooltip: 'Reports will be generated for product stock.', type: 'product',
        permission: PermissionEnum.PRODUCT_WISE_SALES_REPORT }
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
