<template>
  <div class="col-xl-6 col-md-6 ">
    <a href="#" @click.prevent="showModal = true">
      <stats-card title="" type="gradient-green" sub-title="Product Summary Report" icon="ni ni-bullet-list-67"
                  v-can="permissionEnum.PRODUCT_BASED_REPORT">
        <template slot="footer">
          <div class="row">
            <div class="col-md-6">
<!--              <span class="text-nowrap"> <i class="ni ni-email-83"></i> {{ todaysDate() | datetime('ll') }} </span>-->
            </div>
            <div class="col-md-6">
              <el-tooltip class="ml-3" content="Download Product Summary Report" placement="right">
                <i class="fas fa-info-circle" style="color: #5e72e4; font-size: 28px; margin-right: 0.60rem; float: right"></i>
              </el-tooltip>
            </div>
          </div>
        </template>
      </stats-card>
    </a>
    <validation-observer v-if="showModal" v-slot="{ handleSubmit }" ref="formValidator">
      <modal :show="showModal" @close="close" class="modal-dialog-scrollable" size="lg">
        <template slot="header">
          <h5 class="modal-title"> Product Summary Report</h5>
        </template>
        <div class="row">
          <div class="col-3">
            <base-input addon-left-icon="ni ni-calendar-grid-58" label="Select Date">
              <flat-picker slot-scope="{focus, blur}"
                           @on-open="focus"
                           @on-close="blur"
                           :config="dateSelectConfig"
                           class="form-control datepicker"
                           v-model="date">
              </flat-picker>
            </base-input>
          </div>
          <div class="col-3">
            <UserLazydropdown :disabled="!date" v-model="user_id" label="Select User(Optional)" :add-button="false"></UserLazydropdown>
          </div>
        </div>
        <div class="card">
          <el-table v-loading="loading" class="table-responsive  table-flush table-striped" header-row-class-name="thead-light" :data="productSummaryReport">
            <el-table-column label="SL" min-width="100px" prop="name" sortable type="index"></el-table-column>
            <el-table-column label="SKU" prop="name" sortable>
              <template v-slot="{ row }">
                <b>{{ row.sku }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Product Name" prop="Product Name" sortable>
              <template v-slot="{ row }">
                <b>{{ row.product_name }}</b>
              </template>
            </el-table-column>
            <el-table-column label="Variant" prop="name" sortable>
              <template v-slot="{ row }">
                <b> - </b>
              </template>
            </el-table-column>
            <el-table-column label="Batch Name" prop="name" sortable>
              <template v-slot="{ row }">
                <b>{{ row.batch_name }}</b>
              </template>
            </el-table-column>
            <el-table-column label="QTY" prop="name" sortable>
              <template v-slot="{ row }">
                <b>{{ row.qty }}</b>
              </template>
            </el-table-column>
          </el-table>
          <div class="card-footer">
            Total QTY : {{ productSummaryReport.reduce((n, {qty}) => n + qty, 0) }}
          </div>
        </div>
        <template slot="footer">
          <base-button @click="close" type="secondary">Close</base-button>
          <base-button :disabled="!date" :loading="downloading" type="primary" @click.prevent="handleSubmit(onClickDownload)">
            <i class="fa fa-download"></i>
          </base-button>
          <base-button :disabled="!date" :loading="printing" type="secondary" @click.prevent="handleSubmit(onClickPrint)">
            <i class="fa fa-print"></i>
          </base-button>
        </template>
      </modal>
    </validation-observer>
  </div>

</template>
<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {QueryBuilder} from "@/classes/QueryBuilder";
import moment from "moment";
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import printJS from "print-js";
import { Permission as PermissionEnum } from '@/enums/Permission'

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    UserLazydropdown,
    flatPicker,
  }
})
export default class ProductSummaryReport extends Vue {
  public downloading: boolean = false;
  public loading: boolean = false;
  public printing: boolean = false;
  private showModal: boolean = false;
  public user_id: number | null = null;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public productSummaryReport = [];
  public date: string = '';
  public dateSelectConfig = {
    allowInput: true,
    disable: [
      function (date: Date) {
        return moment().diff(date) < 0;
      }
    ]
  }

  get permissionEnum () {
    return PermissionEnum;
  }

  todaysDate() {
    var currentDate = new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, '/');
    return currentDate;
  }

  @Watch('queryBuilder.watch')
  async getProductSummaryReport() {
    this.loading = true;
    try {
      let {data} = await this.$http.get(this.$api('/product-summary-report' + this.queryBuilder.getFilters(true)))
      this.productSummaryReport = data.productSummaryReport;
    } catch (e) {
      this.$notify({message: "Please contact your service provider.", title: "Something went wrong!", type: 'warning'})
    } finally {
      this.loading = false;
    }
  }

  async onClickDownload() {
    this.downloading = true;
    try {
      let {data, headers} = await this.$http.get(this.$api('/product-summary-report?download&' + this.queryBuilder.getFilters()), {responseType: 'arraybuffer'});
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
        this.$api('/product-summary-report?download&' + this.queryBuilder.getFilters()),
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
      await printJS({printable: await this.reportObjectUrl()});
    } catch (e) {
      this.$notify({title: 'Something Wrong!', message: 'Please Try again.', type: 'warning'});
    } finally {
      this.printing = false;
    }
  }

  @Watch('user_id')
  onChangeUserId(value: number) {
    this.queryBuilder.addListener('user_id', value);
  }

  @Watch('date')
  onChangeRange(value: number) {
    this.queryBuilder.addListener('date', value);
  }

  close() {
    this.showModal = false;
  }
}
</script>
