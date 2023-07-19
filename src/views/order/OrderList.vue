<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">{{ getTaxonomy('order') }}s</h3>
            <el-tooltip class="ml-3" :content="'Keep Track on your ' + getTaxonomy('order')" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <base-dropdown v-if="selectedRows.length > 0 || allItemSelected" menuOnRight>
            <base-button slot="title-container" size="sm" type="primary" class="dropdown-toggle">
              Bulk Action
            </base-button>
            <a class="dropdown-item" href="#" @click.prevent="dialogVisible = true">Status</a>
            <!-- <a class="dropdown-item" href="#" @click.prevent="showDownloadModal = !showDownloadModal">Download</a> -->
          </base-dropdown>
          <base-button v-if="selectedRows.length > 0 || allItemSelected" :loading="loading" size="sm" type="primary"
            @click.prevent="downloadOrder">
            Download
          </base-button>
          <!--          <base-button-->
          <!--            type="primary"-->
          <!--            icon size="sm"-->
          <!--            v-if="selectedRows.length > 0 || allItemSelected"-->
          <!--            :menuOnRight="true" @click.prevent="dialogVisible=true">-->
          <!--            Bulk Action <i class="fas fa-tasks"></i>-->
          <!--          </base-button>-->
          <el-tooltip content="Filters" placement="top">
            <base-button type="primary" icon size="sm"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)">
              <span class="btn-inner--text">Filters</span>
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
            </base-button>
          </el-tooltip>
        </div>
        <filter-drawer-component v-if="isFilterModelActive" :visible.sync="isFilterModelActive" direction="rtl"
          :title="getTaxonomy('order') + ' Filter'" @closeBtn="closeBtn" @resetBtn="resetBtn">
          <div @click="selectedButton = ''">
            <DateRange v-model="filters.orderDateRange" label-prop="Order Dates"></DateRange>
          </div>
          <base-input label="Order ID" v-model="filters.orderId" name="Order ID"
            placeholder="e.g. 202209070001"></base-input>
          <user-lazydropdown label="Order By" v-model="filters.orderBy" placeholder="e.g. John Doe"
            searchable-key="q"></user-lazydropdown>
          <department-lazydropdown v-model="filters.departmentId" :label="'Buyer ' + getTaxonomy('department')"
            placeholder="e.g. ABC Store" endPoint="departments?except_id=1"></department-lazydropdown>
          <territory-lazydropdown label="Buyer's Territory" v-model="filters.territoryId" :add-button="false"
            searchable-key="q" class="ml-1" placeholder="e.g. Dhaka"></territory-lazydropdown>
          <base-input label="Status">
            <el-select filterable v-model="filters.status" clearable>
              <el-option v-for="(type, index) in statuses" :key="index"
                :label="type.title.replace(/^\w/, c => c.toUpperCase())" :value="type.value">
              </el-option>
            </el-select>
          </base-input>
          <div class="row">
            <div class="col-12 mb-3">
              <span class="text-sm" style="color: #536080; font-size: 0.77875rem; font-weight: 600;">Amount Range</span>
            </div>

            <div class="col-6">
              <base-input type="number" min="0.01" name="Minimum Amount" v-model="filters.minimumAmount"
                placeholder="Minimum"></base-input>
            </div>
            <div class="col-6">
              <validation-observer>
                <base-input :rules="{ required: true, min_value: filters.minimumAmount }" :min="0"
                  :disabled="!filters.minimumAmount" v-model="filters.maximumAmount" name="Maximum Amount"
                  placeholder="Maximum"></base-input>
              </validation-observer>
            </div>
            <div class="col-12 mt-2 mb-4">
              <span
                v-if="(filters.minimumAmount && !filters.maximumAmount) || (!filters.minimumAmount && filters.maximumAmount)"
                class="text-muted text-sm">
                Both Minimum and Maximum Amount is Required
              </span>
            </div>
          </div>
        </filter-drawer-component>
      </div>
    </div>
    <div class="pb-4 pt-2 row justify-content-center">
      <el-button-group :key="selectedButton">
        <el-button :type="selectedButton == 'Today' ? 'info' : ''" @click="updateDateRange('Today')">Today</el-button>
        <el-button :type="selectedButton == 'WTD' ? 'info' : ''" @click="updateDateRange('WTD')">WTD</el-button>
        <el-button :type="selectedButton == 'MTD' ? 'info' : ''" @click="updateDateRange('MTD')">MTD</el-button>
        <el-button :type="selectedButton == 'QTD' ? 'info' : ''" @click="updateDateRange('QTD')">QTD</el-button>
        <el-button :type="selectedButton == 'YTD' ? 'info' : ''" @click="updateDateRange('YTD')">YTD</el-button>
      </el-button-group>
    </div>
    <div v-if="filters.status" class="text-center text-uppercase mb-4" style="color:#99979c">{{ filters.status }} Orders
    </div>
    <div v-show="selectedRows.length > 0 || allItemSelected">
      <p v-if="allItemSelected" class="text-center">
        All items are selected.
        <a href="#" @click.prevent="deselectAllItems">Deselect All items.</a>
      </p>
      <p v-else class="text-center">
        {{ selectedRows.length == 1 ? '1 item' : `${selectedRows.length} items are` }} selected.
        <a href="#" @click.prevent="selectAllItems">Select all items.</a>
      </p>
    </div>
    <el-table v-loading="loading" class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light" :data="orders" ref="multipleTable" @selection-change="handleSelectionChange"
      :row-key="getRowKeys">
      <template v-slot:empty>
        <p
          v-text="loading ? 'Loading data . . .' : filterApplied ? 'No Data Found' : 'Please apply filters to get your desired data.'">
        </p>
      </template>
      <el-table-column type="selection" width="60" :reserve-selection="true"></el-table-column>
      <el-table-column align="center" :label="getTaxonomy('order') + ' Date'" min-width="130px" prop="id">
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="getTaxonomy('order') + ' No.'" min-width="150px" prop="id">
        <template v-slot="{ row }">
          <b>#{{ row.code }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Created By" min-width="150px" prop="creator" sortable>
        <template v-slot="{ row }">
          <b>{{ row.creator }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="getTaxonomy('department')" min-width="150px" prop="buyer" sortable>
        <template v-slot="{ row }">
          <b> {{ row.buyer_name }} </b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Territory" min-width="150px" prop="buyer" sortable>
        <template v-slot="{ row }">
          <b> {{ row.buyer_territory_name }} </b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Amount" min-width="100px" prop="amount">
        <template v-slot="{ row }">
          <b>{{ row.payable }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" min-width="100px" prop="statuses">
        <template v-slot="{ row }">
          <b>{{ _.startCase(row.status) }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Details" min-width="100px" prop="id">
        <template v-slot="{ row }">
          <base-button outline size="sm" @click="(isActive = true), (currentEntity = row)" type="info">Details
          </base-button>
        </template>
      </el-table-column>
    </el-table>
    <CursorPagination v-model="currentCursor" :next-page-cursor="nextPageCursor" :prev-page-cursor="prevPageCursor"
      :disabled="loading" />
    <BaseOrderSectionDetails v-if="isActive" :is-active.sync="isActive" :title="getTaxonomy('order')"
      @editedEntity="updateOrder($event)" :current-entity-id.sync="currentEntity.id"
      @updatedStatus="entityUpdated($event)" :edit-permission="orderEditPermission"
      :status-permission="orderApprovePermission"></BaseOrderSectionDetails>
    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF">
    </GIFModal>

    <!-- <modal :show="showDownloadModal" @close="showDownloadModal = false">
      <template slot="header">
        <h5 class="modal-title">Download Order Report</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <base-input label="Recipient (Optional)" v-model="recipient" :placeholder="$user ? $user.email : ''"></base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="showDownloadModal = false" type="secondary">Close</base-button>
        <base-button :loading="loading" type="primary" @click.prevent="downloadOrder">
          <i class="fa fa-envelope"></i>
        </base-button>
      </template>
    </modal> -->
    <modal size="sm" :show.sync="dialogVisible">
      <h6 slot="header" class="modal-title" id="modal-title-default">Bulk Action</h6>
      <base-input alternative class="mb-3" type="textarea">
        <textarea class="form-control" rows="4" v-model="bulkForm.remarks" placeholder="Remarks"></textarea>
      </base-input>

      <span class="text-sm text-muted">Note: Already 'Accepted' or 'Rejected' {{ getTaxonomy('order') }}s' status will not
        be changed!</span>

      <template slot="footer">
        <div class="form-inline">
          <base-button type="secondary" @click="submitBulkAction('rejected')"><span
              class="text-danger">Reject</span></base-button>
          <base-button type="secondary" @click="submitBulkAction('accepted')"><span
              class="text-success">Accept</span></base-button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Mixins } from 'vue-property-decorator';
import Order from '@/intefaces/Order';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag, Drawer, ButtonGroup, Button } from 'element-ui';
import OrderDetailsForm from '@/views/order/OrderDetailsForm.vue';
import OrderStatusAutocomplete from '@/components/resources-autocomplete/OrderStatusAutocomplete.vue';
import statuses from '@/data/OrderStatus';
import GIFModal from '@/components/tour/GIFModal.vue';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import { Permission as PermissionEnum } from '@/enums/Permission';
import { QueryBuilder } from '@/classes/QueryBuilder';
import DateRange from '@/components/DateRange.vue';
import FilterDrawerComponent from '@/components/FilterDrawerComponent.vue';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import TerritoryLazydropdown from '@/components/lazyDropdown/TerritoryLazydropdown.vue';
import DepartmentLazydropdown from '@/components/lazyDropdown/DepartmentLazydropdown.vue';
import MultiSelectRow from '@/mixins/MultiSelectRow';
import BaseOrderSectionDetails from '@/views/order/BaseOrderSectionDetails.vue';
import HasCursorPaginationMixin from '@/mixins/HasCursorPagination';
import CursorPagination from '@/components/CursorPagination.vue';
import moment from 'moment';
import swal from 'sweetalert2';

@Component({
  components: {
    CursorPagination,
    DepartmentLazydropdown,
    UserLazydropdown,
    TerritoryLazydropdown,
    GIFModal,
    OrderStatusAutocomplete,
    OrderDetailsForm,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Drawer.name]: Drawer,
    [Tag.name]: Tag,
    [ButtonGroup.name]: ButtonGroup,
    [Button.name]: Button,
    FilterDrawerComponent,
    DateRange,
    BaseOrderSectionDetails
  },
  filters: {
    currentStatus: function (value: Order) {
      if (!value) return '';
      return value.statuses[value.statuses.length - 1].status.toString().toUpperCase();
    }
  }
})
export default class OrderList extends Mixins(HasCursorPaginationMixin, MultiSelectRow, TaxonomyMixin) {
  private orders: Order[] = [];
  private isActive: boolean = false;
  private isFilterModelActive: boolean = false;
  private queryBuilder: QueryBuilder = new QueryBuilder();
  private showGIF: boolean = false;
  private demoTourEntity: string = 'orders';
  private dialogVisible: boolean = false;
  private filterApplied: boolean = false;
  private orderEditPermission: string = '';
  private orderApprovePermission: string = '';
  private selectedButton: string = 'Today';
  private showDownloadModal: boolean = false;
  private recipient: string = '';

  private bulkForm = {
    remarks: ''
  };

  async updateDateRange(range: string) {
    this.selectedButton = range;
    if (range === 'Today') {
      await this.queryBuilder.setParam('created_between', moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD'));
    }
    if (range === 'WTD') {
      await this.queryBuilder.setParam(
        'created_between',
        moment()
          .day(-1)
          .format('YYYY-MM-DD') +
        ',' +
        moment().format('YYYY-MM-DD')
      );
    }
    if (range === 'MTD') {
      await this.queryBuilder.setParam(
        'created_between',
        moment()
          .startOf('month')
          .format('YYYY-MM-DD') +
        ',' +
        moment().format('YYYY-MM-DD')
      );
    }
    if (range === 'QTD') {
      await this.queryBuilder.setParam(
        'created_between',
        moment()
          .startOf('quarter')
          .format('YYYY-MM-DD') +
        ',' +
        moment().format('YYYY-MM-DD')
      );
    }
    if (range === 'YTD') {
      await this.queryBuilder.setParam(
        'created_between',
        moment()
          .startOf('year')
          .format('YYYY-MM-DD') +
        ',' +
        moment().format('YYYY-MM-DD')
      );
    }
    this.$nextTick(function () {
      this.applyFilter();
    });
  }

  private currentEntity = {
    ordered_products: []
  };

  get statuses() {
    let data = [...statuses];
    data.unshift({ title: 'All ' + this.getTaxonomy('order') + 's', value: '' });
    return data;
  }

  private filters: any = {
    orderDateRange: '',
    orderId: '',
    orderBy: '',
    departmentId: '',
    territoryId: '',
    status: 'pending',
    minimumAmount: '',
    maximumAmount: ''
  };

  private GIFs: Array<any> = [
    {
      label: 'Create an order',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update an order',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete an order',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of order';

  get permissionEnum() {
    return PermissionEnum;
  }

  get amountRange() {
    if (this.filters.minimumAmount && this.filters.maximumAmount) {
      return `${this.filters.minimumAmount},${this.filters.maximumAmount}`;
    }
    return '';
  }

  @Watch('isActive')
  getPermission(newVal: boolean) {
    this.orderApprovePermission = this.permissionEnum.APPROVE_ORDER;
    this.orderEditPermission = this.permissionEnum.CREATE_ORDER_MOBILE;
  }

  async mounted() {
    await this.queryBuilder.setParam('created_between', moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD'));
    await this.queryBuilder.setParam('status', 'pending');
    this.$nextTick(function () {
      this.applyFilter();
    });
  }

  updateOrder(event: any) {
    this.$http.get(this.$api(`/orders/${event.order_id}`)).then(response => {
      this.orders.splice(
        this.orders.findIndex((order: any) => order.id == response.data.order.id),
        1,
        response.data.order
      );
    });
  }

  entityCreated(entity: Order) {
    this.orders.unshift(entity);
  }

  entityUpdated(entity: Order): void {
    this.orders.splice(
      this.orders.findIndex(type => type.id == entity.id),
      1,
      entity
    );
    this.isActive = false;
  }

  @Watch('currentCursor')
  async fetchOrder(cursor: string | null) {
    this.loading = true;
    let { data } = await this.$http.get(
      this.$api2(`/orders${cursor ? '?cursor=' + cursor + '&' : ''}${this.queryBuilder.getFilters(cursor == null)}`)
    );
    this.orders = data.data;
    this.setPagination(data);
    this.loading = false;
  }

  @Watch('filters.orderDateRange', { deep: true })
  onChangeSubmissionDateRange(value: string) {
    this.queryBuilder.addListener('created_between', value);
  }

  @Watch('filters.orderId', { deep: true })
  onChangeCodeFilter(value: string) {
    this.queryBuilder.addListener('code', value);
  }

  @Watch('filters.orderBy', { deep: true })
  onChangeNameFilter(value: string) {
    this.queryBuilder.addListener('created_by', value);
  }

  @Watch('filters.departmentId', { deep: true })
  onChangeDepartmentFilter(value: number) {
    this.queryBuilder.addListener('buyer_id', value);
  }

  @Watch('filters.territoryId', { deep: true })
  onChangeTerritoryFilter(value: number) {
    this.queryBuilder.addListener('buyer_territory_id', value);
  }

  @Watch('filters.status', { deep: true })
  onChangeStatusFilter(value: string) {
    this.queryBuilder.addListener('status', value);
  }

  @Watch('filters.minimumAmount', { deep: true })
  onChangeMinimumAmountFilter() {
    if (this.filters.maximumAmount && this.filters.minimumAmount <= this.filters.maximumAmount) {
      this.queryBuilder.addListener('amount_between', this.amountRange);
    }
  }

  @Watch('filters.maximumAmount', { deep: true })
  onChangeMaximumAmountFilter() {
    if (this.filters.minimumAmount && this.filters.maximumAmount >= this.filters.minimumAmount) {
      this.queryBuilder.addListener('amount_between', this.amountRange);
    }
  }

  bulkActionDispatchNotification() {
    this.$notify({
      title: 'Success',
      message: 'Bulk Actions Applied',
      duration: 5000,
      iconClass: 'ni ni-bell-55',
      // @ts-ignore
      verticalAlign: 'bottom',
      horizontalAlign: 'right',
      type: 'success'
    });
  }

  submitBulkAction(status: string) {
    this.loading = true;
    this.dialogVisible = false;
    this.$http
      .post(
        this.$api(`/bulk-order-status?${this.queryBuilder.getFilters()}`),
        this.allItemSelected
          ? {
            id: '',
            status_action: status,
            remarks: this.bulkForm.remarks
          }
          : {
            id: this.selectedRows.map(order => order.id),
            status_action: status,
            remarks: this.bulkForm.remarks
          }
      )
      .then(response => {
        this.bulkActionDispatchNotification();
        this.selectedRows = [];
        this.bulkForm.remarks = '';
        this.fetchOrder(null);
      })
      .catch(error => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      })
      .finally(() => (this.loading = false));
  }

  async downloadOrder() {
    this.loading = true;
    if (!this.allItemSelected) {
      await this.queryBuilder.setParam(
        'id',
        this.selectedRows.map(order => order.id)
      );
    }
    try {
      let {
        data,
        headers
      } = await this.$http.get(this.$api(`/download/bulk-order${this.queryBuilder.getFilters(true)}`), {
        responseType: 'arraybuffer'
      });
      const blob = await new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const link = document.createElement("a");
      link.href = await URL.createObjectURL(blob);
      link.download = this.$getFileNameFromContentDisposition(headers);
      link.click();
    } catch (e) {
      let err_msg = [];
      const decoder = new TextDecoder();
      const errorMessage = JSON.parse(decoder.decode(new Uint8Array(e.response.data)));
      if (errorMessage['errors'].created_between) {
        err_msg.push(errorMessage['errors'].created_between[0]);
      }
      if (errorMessage['errors'].recipient) {
        err_msg.push(errorMessage['errors'].recipient[0]);
      }
      if (err_msg.length > 0) {
        err_msg.forEach(error => {
          this.$notify({
            type: 'warning',
            message: error,
            title: 'Unprocessable Content'
          });
        })
      } else {
        this.$notify({ title: 'Something went wrong!', type: 'warning', message: 'Unable to download reports.' });
      }
    } finally {
      this.loading = false;
      await this.queryBuilder.setParam('id', null);
    }
  }

  // async downloadOrder(status: string) {
  //   this.loading = true;
  //   await this.queryBuilder.setParam('recipient', this.recipient);
  //   await this.queryBuilder.setParam('type', 'csv');
  //   if (!this.allItemSelected) {
  //     await this.queryBuilder.setParam(
  //       'id',
  //       this.selectedRows.map(order => order.id)
  //     );
  //   }
  //   try {
  //     let { data, headers } = await this.$http.get(this.$api(`/download/bulk-order${this.queryBuilder.getFilters(true)}`));
  //     await swal.fire('Report Sent', 'You will receive the report within a few minutes.', 'success');
  //   } catch (e) {
  //     let err_msg = [];
  //     if (e.response.data.errors.created_between) {
  //       err_msg.push(e.response.data.errors.created_between[0]);
  //     }
  //     if (e.response.data.errors.recipient) {
  //       err_msg.push(e.response.data.errors.recipient[0]);
  //     }
  //     if (err_msg.length > 0) {
  //       err_msg.forEach(error => {
  //         this.$notify({
  //           type: 'warning',
  //           message: error,
  //           title: 'Unprocessable Content'
  //         });
  //       })
  //     } else {
  //       this.$notify({ title: 'Something went wrong!', type: 'warning', message: 'Unable to download reports.' });
  //     }
  //   } finally {
  //     this.loading = false;
  //     this.showDownloadModal = false;
  //     await this.queryBuilder.setParam('recipient', null);
  //     await this.queryBuilder.setParam('type', null);
  //     await this.queryBuilder.setParam('id', null);
  //   }
  // }

  closeBtn() {
    this.isFilterModelActive = false;
    this.applyFilter();
  }

  handleClose(done: any) {
    done();
  }

  applyFilter() {
    this.filterApplied = true;
    this.fetchOrder(null);
  }

  resetBtn() {
    this.filters.orderDateRange = '';
    this.filters.orderBy = '';
    this.filters.orderId = '';
    this.filters.status = 'pending';
    this.filters.territoryId = '';
    this.filters.minimumAmount = '';
    this.filters.maximumAmount = '';
    this.filters.selectedOrders = '';
    this.fetchOrder(null);
  }
}
</script>
<style>
#order-filter-dropdown .dropdown-menu {
  min-width: 155px;
  text-align: center;
}
</style>