<template>
  <div class="row pl-3">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-2">
              <department-lazydropdown
                v-model="filters.name" label="Filter By Name"
                @selected-item="onChangeDeptName($event)" :add-button="false">
              </department-lazydropdown>
            </div>
            <div class="col-2">
              <department-lazydropdown v-model="filters.code"
                                 label="Filter By Code"
                                 item-text="code" searchable-key="code"
                                 @selected-item="onChangeDeptCode($event)"></department-lazydropdown>
            </div>
            <div class="col-3">
              <DateRange v-model="range" :disabled="!filters.name" label-prop="Date Range"></DateRange>
            </div>
            <div class="offset-2 col-3 text-right">
              <base-button :disabled="!filters.name && productPerformanceReport.length==0" :loading="printing"
                           type="secondary"
                           @click.prevent="onClickPrint">
                <i class="fa fa-print"></i>
              </base-button>
              <base-button :disabled="!filters.name && productPerformanceReport.length==0" :loading="downloading"
                           type="primary"
                           @click.prevent="onClickDownload">
                <i class="fa fa-download"></i>
              </base-button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <el-table v-loading="loading" class="table-responsive  table-flush table-striped"
                    header-row-class-name="thead-light"
                    :data="productPerformanceReport">
            <el-table-column label="SL" min-width="100px" prop="name" sortable type="index"></el-table-column>
            <el-table-column label="SKU" sortable>
              <template v-slot="{ row }">
                <b>{{ row.sku ? row.sku : '-' }}</b>
              </template>
            </el-table-column>
            <el-table-column min-width="150px" label="Name" sortable>
              <template v-slot="{ row }">
                <b>{{ row.product_name ? row.product_name : '-' }}</b>
              </template>
            </el-table-column>
            <el-table-column min-width="140px" label="Order Qty" sortable>
              <template v-slot="{ row }">
                <b>{{ row.total_order_qty ? row.total_order_qty : '-' }}</b>
              </template>
            </el-table-column>
            <el-table-column min-width="140px" label="Bonus Qty" sortable>
              <template v-slot="{ row }">
                <b>{{ row.total_order_bonus_qty ? row.total_order_bonus_qty : '-' }}</b>
              </template>
            </el-table-column>
            <el-table-column min-width="140px" label="Value" sortable>
              <template v-slot="{ row }">
                <b>{{ row.total_order_amount ? row.total_order_amount : '-' }}</b>
              </template>
            </el-table-column>
            <el-table-column min-width="140px" label="Delivered Qty" sortable>
              <template v-slot="{ row }">
                <b>{{ row.total_delivered_qty ? row.total_delivered_qty : '-' }}</b>
              </template>
            </el-table-column>
            <el-table-column min-width="190px" label="Bonus Delivered Qty" sortable>
              <template v-slot="{ row }">
                <b>{{ row.total_bonus_delivery_qty ? row.total_bonus_delivery_qty : '-' }}</b>
              </template>
            </el-table-column>
            <el-table-column min-width="150px" label="Delivery Value" sortable>
              <template v-slot="{ row }">
                <b>{{ row.total_delivered_amount ? row.total_delivered_amount : '-' }}</b>
              </template>
            </el-table-column>
            <el-table-column min-width="170px" label="Bounce Rate (%)" sortable>
              <template v-slot="{ row }">
                <b>{{ row.bounce_rate ? row.bounce_rate + '%' : '-' }}</b>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { QueryBuilder } from "@/classes/QueryBuilder";
import moment from "moment";
import DepartmentLazydropdown from '@/components/lazyDropdown/DepartmentLazydropdown.vue';
import printJS from "print-js";
import DateRange from "@/components/DateRange.vue";
import { Permission as PermissionEnum } from "@/enums/Permission";
import { Tag } from 'element-ui';

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    DepartmentLazydropdown,
    flatPicker,
    DateRange,
    [Tag.name]: Tag,
  }
})
export default class DeptWisePerformanceReport extends Vue {
  public downloading: boolean = false;
  public loading: boolean = false;
  public printing: boolean = false;
  private showModal: boolean = false;
  public created_by: number | null = null;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public productPerformanceReport = [];
  public range: string = '';
  private deptNameOnPrint = '';
  public rangeSelectConfig = {
    allowInput: true,
    disable: [
      function (range: Date) {
        return moment().diff(range) < 0;
      }
    ]
  }

  private filters: any = {
    name: '',
    code: ''
  }

  todaysDate() {
    var currentDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return currentDate;
  }

  @Watch('queryBuilder.watch')
  async getUserProductPerformanceReport() {
    if (!this.filters.name) {
      this.productPerformanceReport = [];
      this.range = '';
      return
    }
    this.loading = true;
    try {
      let {data} = await this.$http.get(this.$api('/department-product-performance-report' +
        this.queryBuilder.getFilters(true)))
      this.productPerformanceReport = data.productPerformanceReport;
    } catch (e) {
      this.$notify({message: "Please contact your service provider.", title: "Something went wrong!", type: 'warning'})
    } finally {
      this.loading = false;
    }
  }


  async onClickDownload() {
    this.downloading = true;
    try {
      let {
        data,
        headers
      } = await this.$http.get(this.$api('/department-product-performance-report?download&' + this.queryBuilder.getFilters()),
        {
          responseType:
            'arraybuffer'
        });
      const blob = await new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const link = document.createElement("a");
      link.href = await URL.createObjectURL(blob);
      link.download = this.$getFileNameFromContentDisposition(headers);
      link.click();
    } catch (e) {
      this.$notify({title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.',})
    } finally {
      this.downloading = false;
    }
  }

  async reportObjectUrl() {
    let {data} = await this.$http.get(
      this.$api('/department-product-performance-report?download&' + this.queryBuilder.getFilters()),
      {
        responseType: 'blob'
      }
    );
    const blob = await new Blob([data], {type: 'application/pdf'});
    let fileURL = await URL.createObjectURL(blob);
    return fileURL;
  }

  async onClickPrint() {
    this.printing = true;
    try {
      let {data} = await this.$http.get(this.$api('/department-product-performance-report?' +
        this.queryBuilder.getFilters()));
      let productPerformanceReport = data.productPerformanceReport.map((KPI: any, index: number) => {
        KPI.sl = index + 1;
        KPI.bounceRate = KPI.bounce_rate + '%'
        return KPI;
      });
      await printJS({
        printable: productPerformanceReport,
        properties: [
          {field: 'sl', displayName: 'SL'},
          {field: 'sku', displayName: 'SKU'},
          {field: 'product_name', displayName: 'Product Name'},
          {field: 'total_order_qty', displayName: 'Order Qty'},
          {field: 'total_order_bonus_qty', displayName: 'Bonus Qty'},
          {field: 'total_order_amount', displayName: 'Value'},
          {field: 'total_delivered_qty', displayName: 'Delivery Qty'},
          {field: 'total_bonus_delivery_qty', displayName: 'Bonus Delivery Qty'},
          {field: 'total_delivered_amount', displayName: 'Delivery Value'},
          {field: 'bounceRate', displayName: 'Bounce Rate (%)'},
        ],
        type: 'json',
        header:
          `Dept-Wise Product Performance Report  ${this.deptNameOnPrint ? ' - ' + this.deptNameOnPrint : ''} ${this.range
            ? ' - ' +
            this.range : ''}`
      })
    } catch (e) {
      this.$notify({title: 'Something Wrong!', message: 'Please Try again.', type: 'warning'});
    } finally {
      this.printing = false;
    }
  }

  @Watch('range')
  onChangeRange(value: number) {
    this.queryBuilder.addListener('range', value);
  }

  onChangeDeptCode(kpi: any) {
    if (kpi) {
      this.deptNameOnPrint = kpi.name;
      this.filters.name = kpi.name;
      this.queryBuilder.addListener('department_id', kpi.id);
    } else {
      this.filters.name = null;
      this.deptNameOnPrint = '';
      this.range = '';
      this.productPerformanceReport = [];
    }
  }


  onChangeDeptName(kpi: any) {
    if (kpi) {
      this.deptNameOnPrint = kpi.name;
      this.filters.code = kpi.code;
      this.queryBuilder.addListener('department_id', kpi.id);
    } else {
      this.filters.code = null;
      this.deptNameOnPrint = '';
      this.range = '';
      this.productPerformanceReport = [];
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
