<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-2">
          <TerritoryTypeAutocomplete v-model="selectedTerritoryType" label="Territory Type" :remove-root="true">
          </TerritoryTypeAutocomplete>
        </div>
        <div class="col-2">
          <TerritoryAutocomplete :disabled="!selectedTerritoryType" v-model="selectedTerritory"
            :fetch-on-change-disable="false"
            :end-point="`territories${selectedTerritoryType ? '?territory_type=' + selectedTerritoryType : ''}`"
            label="Territory"></TerritoryAutocomplete>
        </div>
        <!-- <div class="col-4" @click="selectedButton = ''">
          <DateRange label-prop="Date Range" :key="selectedDateRange" v-model="selectedDateRange"></DateRange>
        </div> -->
        <div class="col-3 justify-content-center" style="margin-top:1.3%;">
          <el-button-group :key="selectedButton">
            <el-button :type="selectedButton == 'Today' ? 'info' : ''"
              @click="updateDateRange('Today')">Today</el-button>
            <el-button :type="selectedButton == 'last30' ? 'info' : ''" @click="updateDateRange('last30')">Last 30
              Days</el-button>
            <!-- <el-button :type="selectedButton == 'WTD' ? 'info' : ''" @click="updateDateRange('WTD')">WTD</el-button>
            <el-button :type="selectedButton == 'MTD' ? 'info' : ''" @click="updateDateRange('MTD')">MTD</el-button>
            <el-button :type="selectedButton == 'QTD' ? 'info' : ''" @click="updateDateRange('QTD')">QTD</el-button>
            <el-button :type="selectedButton == 'YTD' ? 'info' : ''" @click="updateDateRange('YTD')">YTD</el-button> -->
          </el-button-group>
          <div v-show="selectedRows.length > 0 || allItemSelected">
            <p v-if="allItemSelected" class="text-center">
              All items are selected.
              <!-- <a href="#" @click.prevent="deselectAllItems">Deselect All items.</a> -->
            </p>
            <p v-else class="text-center">
              {{ selectedRows.length == 1 ? '1 item' : `${selectedRows.length} items are` }} selected.
              <!-- <a href="#" @click.prevent="selectAllItems">Select all items.</a> -->
            </p>
          </div>
        </div>
        <div class="col-1" style="margin-top:1.5%;">
          <base-button type="info" @click="getOutletResults()">
            GET
          </base-button>
        </div>
        <div class="col-1 text-right" style="margin-top:1.5%;">
          <base-button type="info" v-if="showBackButton" @click="backPreviousPage()">
            <i class="fa fa-arrow-left"></i>
          </base-button>
        </div>
      </div>

    </div>
    <div class="card-body">

      <el-table v-loading="loading" class="table-responsive  table-flush table-striped"
        header-row-class-name="thead-light" :data="terrritoryList" @selection-change="handleSelectionChange"
        :row-key="getRowKeys">
        <el-table-column type="selection" width="60" :reserve-selection="true"></el-table-column>
        <el-table-column label="Territory Type" align="center" min-width="130px" prop="territory_type" sortable>

          <template v-slot="{ row }">
            <!-- <input type="checkbox" @click="checkedValue(row.id,$event)"> -->
            {{ row.territory_type }}

          </template>
        </el-table-column>

        <el-table-column label="Code" align="center" min-width="130px" prop="code" sortable>
          <template v-slot="{ row }">
            {{ row.code }}
          </template>
        </el-table-column>

        <el-table-column label="Territory Name" align="center" min-width="130px" prop="territory_name" sortable>
          <template v-slot="{ row }">
            <a href="#!" @click.prevent="territoryType(row.id)">
              {{ row.territory_name }}
            </a>

          </template>
        </el-table-column>
        <el-table-column label="Total Outlet Count" align="center" min-width="130px" prop="total_outlet" sortable>
          <template v-slot="{ row }">
            {{ row.total_outlet }}
          </template>
        </el-table-column>
        <el-table-column label="Order Outlet" align="center" min-width="130px" prop="total_order_outlet" sortable>
          <template v-slot="{ row }">
            {{ row.total_order_outlet }}
            <a v-if="row.total_order_outlet > 0" href="#" @click="downloadOrderSingle(row.id)"><i
                class="fa fa-download"></i></a>
          </template>
        </el-table-column>
        <el-table-column label="Not Order Outlet" align="center" min-width="130px" prop="total_notorder_outlet"
          sortable>
          <template v-slot="{ row }">
            {{ row.total_notorder_outlet }}
            <a v-if="row.total_notorder_outlet > 0" href="#" @click="downloadNotOrderSingle(row.id)"><i
                class="fa fa-download"></i></a>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination class="mt-3" v-if="terrritoryList.length > 0" v-model="pagination.currentPage"
        :perPage="pagination.entityPerPage" :total="pagination.totalEntity" align="center"
        :disabled="loading"></base-pagination>
      <div class="col-12 text-right">
        <base-dropdown v-if="selectedRows.length > 0 || allItemSelected" menuOnRight>
          <base-button slot="title-container" size="sm" type="primary" class="dropdown-toggle">
            Export
          </base-button>
          <a class="dropdown-item " href="#" @click.prevent="showDownloadModal = !showDownloadModal">Order Outlet</a>
          <a class="dropdown-item" href="#" @click.prevent="showDownloadNotOrderModal = !showDownloadNotOrderModal">Not
            Order Outlet</a>
        </base-dropdown>

      </div>
    </div>
    <modal :show="showDownloadModal" @close="showDownloadModal = false">
      <template slot="header">
        <h5 class="modal-title">Download Order Outlet Report</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <base-input label="Recipient (Optional)" v-model="recipient"
            :placeholder="$user ? $user.email : ''"></base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="showDownloadModal = false" type="secondary">Close</base-button>
        <base-button :loading="loading" type="primary" @click.prevent="downloadOrder">
          <i class="fa fa-envelope"></i>
        </base-button>
      </template>
    </modal>
    <modal :show="showDownloadNotOrderModal" @close="showDownloadNotOrderModal = false">
      <template slot="header">
        <h5 class="modal-title">Download Not Order Outlet Report</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <base-input label="Recipient (Optional)" v-model="recipient"
            :placeholder="$user ? $user.email : ''"></base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="showDownloadNotOrderModal = false" type="secondary">Close</base-button>
        <base-button :loading="loading" type="primary" @click.prevent="downloadNotOrder">
          <i class="fa fa-envelope"></i>
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
import 'flatpickr/dist/flatpickr.css';
import DateRange from '@/components/DateRange.vue';
import { QueryBuilder } from '@/classes/QueryBuilder';
import { ButtonGroup, Dropdown, DropdownItem, DropdownMenu, Button, Table, TableColumn, Tooltip, Row, Col, Tag } from 'element-ui';
import moment from 'moment';
import swal from 'sweetalert2';
import { AxiosResponse } from "axios";
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import MultiSelectRow from '@/mixins/MultiSelectRow';
import BaseOrderSectionDetails from '@/views/order/BaseOrderSectionDetails.vue';
import TerritoryTypeAutocomplete from '@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue';
import TerritoryAutocomplete from '@/components/resources-autocomplete/TerritoryAutocomplete.vue';
// @ts-ignore
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

const flatPicker = require('vue-flatpickr-component');


@Component({
  components: {
    DateRange,
    flatPicker,
    [Button.name]: Button,
    [ButtonGroup.name]: ButtonGroup,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Row.name]: Row,
    [Col.name]: Col,
    [TableColumn.name]: TableColumn,
    DatePicker,
    QueryBuilder,
    BaseOrderSectionDetails,
    TerritoryAutocomplete,
    TerritoryTypeAutocomplete,
  }
})

export default class OutletOrder extends Mixins(MultiSelectRow, PaginationComponentMixin, TaxonomyMixin) {
  private terrritoryList: [] = [];
  private checkboxList: [] = [];
  //private selectedRows:[] = [];
  //private allItemSelected:boolean = false;
  private selectedTerritoryType: number | null = null;
  private selectedTerritory: number | null = null;
  private showDownloadModal: boolean = false;
  private showDownloadNotOrderModal: boolean = false;
  private selectedButton: string = 'Today';
  private selectedDateRange: string = moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD');
  private queryBuilder: QueryBuilder = new QueryBuilder();
  private territory_type: number | null = null;
  private previous_territory_type: number | null = null;
  private range: string = moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD');
  private recipient: string = '';
  loading = false;
  isSelected = false;
  showBackButton = false;
  fetchOutlet() {
    this.loading = true
    this.$http.get(this.$api3(`/outlet-order-report?page=${this.pagination.currentPage}&territory_type=${this.territory_type}&range=${this.range}`))
      .then((response: AxiosResponse) => {
        this.terrritoryList = response.data.terrritoryList;
        if (response.data.terrritoryList[0]) {
          this.previous_territory_type = response.data.terrritoryList[0]['parent_parent_id'];
        }
        this.setPagination(response.data);
      })
      .finally(() => this.loading = false);
  }

  @Watch('selectedDateRange')
  onChangeDateRange(value: string) {
    this.pagination.currentPage = this.pagination.currentPage ?? 1;
    this.range = value;
    this.queryBuilder.setParam('range', value);
  }
  @Watch('selectedTerritoryType')
  onChangeTerritoryType(value: number) { }

  @Watch('selectedTerritory')
  onChangeTerritory(value: number) {
    this.pagination.currentPage = 1;
    this.territory_type = value;
    this.queryBuilder.setParam('territory_type', value);
  }

  @Watch('pagination.currentPage')
  getOutletResults() {
    this.queryBuilder.setParam('territory_type', this.territory_type);
    this.queryBuilder.setParam('range', this.range);
    this.fetchOutlet();
  }

  territoryType(value: number) {
    this.pagination.currentPage = 1;
    this.territory_type = value;
    this.showBackButton = true;
    this.getOutletResults();
  }

  backPreviousPage() {
    if (this.previous_territory_type == null || this.previous_territory_type == 1) {
      this.showBackButton = false;
    }
    this.territory_type = this.previous_territory_type;
    this.queryBuilder.setParam('territory_type', this.previous_territory_type);
    this.fetchOutlet();
  }
  // checkedValue(id,event){
  //   if (event.target.checked) {
  //     this.checkboxList.push(id);
  //   }else{
  //     var index = this.checkboxList.indexOf(id);
  //     this.checkboxList.splice(index,1);
  //   }
  // }
  todaysDate() {
    var currentDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return currentDate;
  }

  updateDateRange(range: string) {
    this.selectedButton = range;
    if (range === 'Today') {
      this.selectedDateRange = moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD');
    } else if (range === 'last30') {
      this.selectedDateRange =
        moment()
          .day(-26)
          .format('YYYY-MM-DD') +
        ',' +
        moment().format('YYYY-MM-DD');
    } else if (range === 'WTD') {
      this.selectedDateRange =
        moment()
          .day(-1)
          .format('YYYY-MM-DD') +
        ',' +
        moment().format('YYYY-MM-DD');
    } else if (range === 'MTD') {
      this.selectedDateRange =
        moment()
          .startOf('month')
          .format('YYYY-MM-DD') +
        ',' +
        moment().format('YYYY-MM-DD');
    } else if (range === 'QTD') {
      this.selectedDateRange =
        moment()
          .startOf('quarter')
          .format('YYYY-MM-DD') +
        ',' +
        moment().format('YYYY-MM-DD');
    } else if (range === 'YTD') {
      this.selectedDateRange =
        moment()
          .startOf('year')
          .format('YYYY-MM-DD') +
        ',' +
        moment().format('YYYY-MM-DD');
    }
  }
  downloadOrderSingle(value: number) {
    this.showDownloadModal = true;
    this.queryBuilder.setParam(
      'id',
      value
    );
  }
  downloadNotOrderSingle(value: number) {
    this.showDownloadNotOrderModal = true;
    this.queryBuilder.setParam(
      'id',
      value
    );
  }
  async downloadOrder(status: string) {
    this.loading = true;
    await this.queryBuilder.setParam('recipient', this.recipient);
    await this.queryBuilder.setParam('type', 'csv');
    if (this.selectedRows.length > 0) {
      await this.queryBuilder.setParam(
        'id',
        this.selectedRows.map(order => order['id'])
      );
    }
    try {
      let { data, headers } = await this.$http.get(this.$api(`/download/order-outlet${this.queryBuilder.getFilters(true)}`));
      await swal.fire('Report Sent', 'You will receive the report within a few minutes.', 'success');
    } catch (e) {
      //console.log(e);
      this.$notify({ title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.' });
    } finally {
      this.loading = false;
      this.showDownloadModal = false;
      await this.queryBuilder.setParam('recipient', null);
      await this.queryBuilder.setParam('type', null);
      await this.queryBuilder.setParam('id', null);
    }
  }
  async downloadNotOrder(status: string) {
    this.loading = true;
    await this.queryBuilder.setParam('recipient', this.recipient);
    await this.queryBuilder.setParam('type', 'csv');
    if (this.selectedRows.length > 0) {
      await this.queryBuilder.setParam(
        'id',
        this.selectedRows.map(order => order['id'])
      );
    }
    try {
      let { data, headers } = await this.$http.get(this.$api(`/download/not-order-outlet${this.queryBuilder.getFilters(true)}`));
      await swal.fire('Report Sent', 'You will receive the report within a few minutes.', 'success');
    } catch (e) {
      this.$notify({ title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.' });
    } finally {
      this.loading = false;
      this.showDownloadModal = false;
      await this.queryBuilder.setParam('recipient', null);
      await this.queryBuilder.setParam('type', null);
      await this.queryBuilder.setParam('id', null);
    }
  }
  created() {
    this.queryBuilder.setParam('range', this.range);
    this.queryBuilder.setParam('territory_id', null);
    this.queryBuilder.setParam('territory_type', null);
    this.fetchOutlet();
  }
}

</script>
<style module>
.cell {
  display: flex;
  justify-content: center;
}

.cell a {
  margin-left: 4%;
}
</style>