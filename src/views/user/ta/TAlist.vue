<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Travel Allowance</h3>
            <el-tooltip class="ml-3" content="Manage travel allowance of employees" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                 @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <base-button type="primary" icon size="sm" v-if="selectedRows.length > 0 || allItemSelected"
                       :menuOnRight="true" @click.prevent="dialogVisible=true">
            Bulk Action <i class="fas fa-tasks"></i>
          </base-button>
          <el-tooltip content="Filters" placement="top">
            <base-button
              icon
              size="sm"
              type="primary"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)"
            >
              <span class="btn-inner--text">Filters</span>
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
            </base-button>
          </el-tooltip>
          <el-tooltip content="Add New Travel Allowance" placement="top" v-can="permissionEnum.CREATE_TRAVEL_ALLOWANCE">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
        <filter-drawer-component v-if="isFilterModelActive" :visible.sync="isFilterModelActive" direction="rtl"
                                 title="Travel Allowance"
                                 @closeBtn="closeBtn" @resetBtn="resetBtn">
          <DateRange v-model="filters.submissionDateRange" label-prop="Submission Dates"></DateRange>
          <DateRange v-model="filters.taDateRange" label-prop="Travel Dates"></DateRange>
          <user-lazydropdown label="Name" v-model="filters.name" placeholder="e.g. John Doe"
                             searchable-key="q"></user-lazydropdown>
          <user-lazydropdown label="Code" v-model="filters.code" placeholder="e.g. CAD101"
                             item-text="code" searchable-key="code"></user-lazydropdown>
          <base-input label="Status">
            <el-select v-model="filters.status" clearable filterable placeholder="e.g. Accepted">
              <el-option v-for="(unit, index) in ['pending', 'rejected', 'accepted']" :key="index"
                         :label="unit.toUpperCase()"
                         :value="unit"></el-option>
            </el-select>
          </base-input>
          <territory-lazydropdown label="Territory" v-model="filters.territoryId" :add-button="false"
                                  searchable-key="q" class="ml-1"
                                  placeholder="e.g. Dhaka"></territory-lazydropdown>
          <div class="row">
            <div class="col-12 mb-3">
              <span class="text-sm" style="color: #536080; font-size: 0.77875rem; font-weight: 600;">Amount Range</span>
            </div>

            <div class="col-6">
              <base-input type="number" min="0.1" name="Minimum Amount" v-model="filters.minimumAmount"
                          placeholder="Minimum"></base-input>
            </div>
            <div class="col-6">
              <validation-observer ref="formValidator">
                <base-input :rules="{min_value: filters.minimumAmount}" :min="0.01"
                            :disabled="!filters.minimumAmount"
                            v-model="filters.maximumAmount" name="Maximum Amount"
                            placeholder="Maximum"></base-input>
              </validation-observer>

            </div>
            <div class="col-12 mt-2 mb-4">
                <span v-if="(filters.minimumAmount &&  !filters.maximumAmount) ||
                (!filters.minimumAmount &&  filters.maximumAmount)" class="text-muted text-sm">
                  Both Minimum and Maximum Amount is Required
                </span>
            </div>
          </div>

        </filter-drawer-component>
        <!--                Start of Create Modal           -->
        <CreateTAForm
          :is-active.sync="isActive"
          @created="entityCreated()"
        >
        </CreateTAForm>
        <!--                End of Create Modal           -->
      </div>
    </div>
    <div v-show="selectedRows.length > 0 || allItemSelected">
      <p v-if="allItemSelected" class="text-center">
        All {{ pagination.totalEntity }} items are selected.
        <a href="#" @click.prevent="deselectAllItems">Deselect All {{ pagination.totalEntity }} items.</a>
      </p>
      <p v-else class="text-center">
        {{ selectedRows.length == 1 ? '1 item' : `${selectedRows.length} items are` }} selected.
        <a href="#" @click.prevent="selectAllItems">Select all {{ pagination.totalEntity }} items.</a>
      </p>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="travelAllowances"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      :row-key="getRowKeys"
    >
      <el-table-column type="selection" width="65" :reserve-selection="true"></el-table-column>
      <el-table-column label="Name" min-width="210px" prop="name" sortable>
        <template v-slot="{ row }">
          <async-image v-slot="slotProps" v-if="row.creator.propic_url"
                       :url="row.creator.propic_url">
            <img :src="slotProps.imageSrc" class="rounded-circle avatar avatar-lg"
                 alt="Profile Picture"/> <b :class="[textStyle(row.status)]"> {{
              ' ' +
              row.creator ? row.creator.name : ''
            }}</b>
          </async-image>
          <div v-else>
            <img :src="`${$cdn}/img/avatar.png`" class="rounded-circle avatar avatar-lg"
                 alt="Profile Picture"/>
            <b :class="[textStyle(row.status)]">
              {{
                ' ' + row.creator ? row.creator.name : ''
              }}
            </b>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Employee Id" min-width="130px" sortable>
        <template v-slot="{ row }">
          <b :class="[textStyle(row.status)]">
            {{ row.creator && row.creator.code ? row.creator.code : '-' }}
          </b>
        </template>
      </el-table-column>
      <el-table-column label="Territory" min-width="150px" sortable>
        <template v-slot="{ row }">
          <b :class="[textStyle(row.status)]">{{
              row.creator && row.creator.territory && row.creator.territory.name ? row.creator.territory.name : '-'
            }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Reason" min-width="150px" sortable>
        <template v-slot="{ row }">
          <b :class="[textStyle(row.status)]">{{
              row.reason ? row.reason : '-'
            }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Date" min-width="180px" sortable>
        <template v-slot="{ row }">
          <b :class="[textStyle(row.status)]">{{
              row.travel_date | datetime('ll')
            }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Mode of Transport" min-width="180px" sortable>
        <template v-slot="{ row }">
          <b :class="[textStyle(row.status)]">{{
              row.transport && row.transport.name ? row.transport.name : '-'
            }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Start Location" min-width="180px" sortable>
        <template v-slot="{ row }">
          <b :class="[textStyle(row.status)]">{{
              row.start_location ? row.start_location : '-'
            }}</b>
        </template>
      </el-table-column>
      <el-table-column label="End Location" min-width="180px" sortable>
        <template v-slot="{ row }">
          <b :class="[textStyle(row.status)]">{{
              row.end_location ? row.end_location : '-'
            }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Start Time" min-width="180px" sortable>
        <template v-slot="{ row }">
          <b
            :class="[textStyle(row.status)]">{{
              row.start_time ? row.start_time : '-'
            }}</b>
        </template>
      </el-table-column>
      <el-table-column label="End Time" min-width="180px" sortable>
        <template v-slot="{ row }">
          <b :class="[textStyle(row.status)]">{{
              row.end_time ? row.end_time : '-'
            }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Total Expense" min-width="180px" sortable>
        <template v-slot="{ row }">
          <b :class="[textStyle(row.status)]"
             v-if="row.expense">{{ row.expense + ' ' + Currency }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Image" min-width="120px" sortable>
        <template v-slot="{ row }">
          <base-button size="small" type="primary" v-if="row.photos.length>0"
                       @click="showImage = true, currentImages= row.photos">Images
          </base-button>
          <span class="text-center" v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-popover
            trigger="hover"
            placement="left"
            width="200"
          >
            <h4>{{ row.comment ? 'Comments' : 'No Comments Yet' }}</h4>
            <p>{{ row.comment ? row.comment : '' }}</p>

            <div class="row mt-4 justify-content-around " style="text-align: right; margin: 0">

            </div>
            <a slot="reference" class="table-action" data-original-title="Comment">
              <i class="fa fa-eye"></i>
            </a>
          </el-popover>

          <el-popover
            trigger="hover"
            placement="left"
            width="200"
            v-model="row.showRejectPopOver"
            :disabled="row.status != 'pending'"
            v-can="permissionEnum.APPROVE_TRAVEL_ALLOWANCE"
          >
            <el-input
              v-model="form.remarks"
              :rows="2"
              class="mt-4"
              placeholder="Remarks..."
              type="textarea">
            </el-input>

            <div class="row mt-4 justify-content-around " style="text-align: right; margin: 0">
              <base-button size="sm" type="secondary" style="color: #bb2773" @click="((form.status = 'rejected'),
                      (UpdateStatusForTA(row)))">
                Reject
              </base-button>

            </div>
            <a slot="reference" class="table-action"
               data-original-title="Reject Travel Allowance">
              <i class="fas fa-ban"
                 :style="row.status != 'pending'?'color:#cfd4e5; cursor:not-allowed;':'color:#70768e;'"></i>
            </a>
          </el-popover>

          <el-popover
            trigger="hover"
            placement="left"
            width="200"
            :disabled="row.status != 'pending'"
            v-can="permissionEnum.APPROVE_TRAVEL_ALLOWANCE"
          >
            <el-input
              v-model="form.remarks"
              :rows="2"
              class="mt-4"
              placeholder="Remarks..."
              type="textarea">
            </el-input>

            <div class="row mt-4 justify-content-around " style="text-align: right; margin: 0">
              <base-button size="sm" type="secondary" style="color: #3aaf85"
                           @click="((form.status =
                      'accepted'),
                      (UpdateStatusForTA(row)))">
                Approve
              </base-button>
            </div>
            <a slot="reference" class="table-action" data-original-title="Approve Travel Allowance">
              <i class="fa fa-check"
                 :style="row.status != 'pending'?'color:#cfd4e5; cursor:not-allowed;':'color:#70768e;'"></i>
            </a>
          </el-popover>
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="travelAllowances.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>
    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"
              :showGIF.sync="showGIF"></GIFModal>
    <ImagesModal :showImage.sync="showImage" v-if="showImage" :images="currentImages"></ImagesModal>

    <modal size="sm" :show.sync="dialogVisible">
      <h6 slot="header" class="modal-title" id="modal-title-default">Bulk Action</h6>
      <base-input alternative
                  class="mb-3"
                  type="textarea">
          <textarea class="form-control" rows="4" v-model="bulkForm.remarks" placeholder="Remarks"
          ></textarea>
      </base-input>

      <span class="text-sm text-muted">Note: Already 'Approved' or 'Rejected' Travel Allowances' status will not be
        changed!</span>

      <template slot="footer">
        <div class="form-inline">
          <base-button type="secondary"
                       @click="submitBulkAction('rejected')"><span class="text-danger">Reject</span></base-button>
          <base-button type="secondary"
                       @click="submitBulkAction('accepted')"><span class="text-success">Approve</span></base-button>
        </div>

      </template>
    </modal>
  </div>

</template>
<script lang="ts">
import {Vue, Component, Mixins, Watch} from 'vue-property-decorator';
import CreateTAForm from '@/views/user/ta/CreateTAForm.vue';
import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag} from 'element-ui';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import GIFModal from '@/components/tour/GIFModal.vue';
import ImagesModal from "@/views/user/ta/ImagesModal.vue";
import AsyncImage from "@/components/AsyncImage.vue";
import { Permission as PermissionEnum } from '@/enums/Permission'
import FilterDrawerComponent from "@/components/FilterDrawerComponent.vue";
import {QueryBuilder} from "@/classes/QueryBuilder";
import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown.vue";
import DateRange from "@/components/DateRange.vue";
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import MultiSelectRow from "@/mixins/MultiSelectRow";
import _ from 'lodash'


const flatPicker = require("vue-flatpickr-component");

@Component({
  components: {
    UserLazydropdown,
    TerritoryLazydropdown,
    AsyncImage,
    ImagesModal,
    CreateTAForm,
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    FilterDrawerComponent,
    flatPicker,
    DateRange
  }
})
export default class TAlist extends Mixins(PaginationComponentMixin, MultiSelectRow) {
  private travelAllowances: any = [];
  private isActive = false;
  private showGIF: boolean = false;
  private showImage: boolean = false;
  private demoTourEntity: string = 'TA';
  private currentImages!: Array<any>;
  private queryBuilder: QueryBuilder = new QueryBuilder();
  private isFilterModelActive: boolean = false;
  private dialogVisible: boolean = false;
  private filters: any = {
    submissionDateRange: '',
    taDateRange: '',
    name: '',
    code: '',
    status: '',
    territoryId: '',
    minimumAmount: '',
    maximumAmount: ''
  }

  private bulkForm = {
    remarks: '',
  }

  private form = {
    remarks: '',
    status: ''
  };
  private GIFs: Array<any> = [
    {
      label: 'Create a Travel Allowance',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a Travel Allowance',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a Travel Allowance',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of Travel Allowance';

  get permissionEnum () {
    return PermissionEnum;
  }

  UpdateStatusForTA(row: any) {
    this.$http.post(this.$api(`/travel-allowances/${row.id}/status`), {
      status_remark: this.form.remarks,
      status: this.form.status
    }).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Successfully Changed',
          duration: 5000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.fetchTAs();
      }
    ).catch(error => {
      this.$notify({
        title: 'Error',
        message: 'Already modified',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'warning'
      });
    })
  }


  get Currency() {
    return this.$store.getters['Settings/getCurrency']
  }

  get amountRange() {
    if (this.filters.minimumAmount && this.filters.maximumAmount &&
      (this.filters.minimumAmount <= this.filters.maximumAmount)) {
      return `${this.filters.minimumAmount},${this.filters.maximumAmount}`
    }
    return '';
  }

  created() {
    this.fetchTAs();
  }

  entityCreated() {
    this.fetchTAs();
  }

  @Watch('filters.submissionDateRange', {deep: true})
  onChangeSubmissionDateRange(value: string) {
    this.queryBuilder.addListener('range', value);
  }

  @Watch('filters.taDateRange', {deep: true})
  onChangeTaDateRange(value: string) {
    this.queryBuilder.addListener('travel_date_range', value);

  }

  @Watch('filters.name', {deep: true})
  onChangeNameFilter(value: string) {
    this.queryBuilder.addListener('created_by', value);
  }

  @Watch('filters.code', {deep: true})
  onChangeCodeFilter(value: string) {
    this.queryBuilder.addListener('created_by', value);
  }

  @Watch('filters.status', {deep: true})
  onChangeStatusFilter(value: string) {
    this.queryBuilder.addListener('status', value);
  }


  @Watch('filters.territoryId', {deep: true})
  onChangeTerritoryFilter(value: number) {
    this.queryBuilder.addListener('t', value);
  }

  @Watch('amountRange')
  OnChangeMinimumAmountFilter(newValue: any) {
      this.queryBuilder.addListener('expense_between', this.amountRange);
  }


 //  @Watch('filters.maximumAmount', {deep: true})
 // OnChangeMaximumAmountFilter(newValue: any) {
 //      this.queryBuilder.addListener('expense_between', this.amountRange);
 //  }

  @Watch('queryBuilder.watch')
  @Watch('pagination.currentPage')
  fetchTAs(): void {
    this.loading = true;
    this.$http.get(this.$api(`/travel-allowances?web&page=${this.pagination.currentPage}&${this.queryBuilder.getFilters()}`)).then(response => {
      this.travelAllowances = response.data.travelAllowances;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  closeBtn() {
    this.isFilterModelActive = false;
  }

  handleClose(done: any) {
    done();
  }

  bulkActionDispatchNotification() {
    this.$notify({
      title: 'Success',
      message: "Bulk Actions Applied",
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
      .post(this.$api(`/bulk-travel-allowances-status?${this.queryBuilder.getFilters()}`), this.allItemSelected ? {
        id: '',
        status_action: status,
        status_bulk_remark: this.bulkForm.remarks
      } : {
        id: this.selectedRows.map(ta => ta.id),
        status_action: status,
        status_bulk_remark: this.bulkForm.remarks
      }).then(response => {
      this.bulkActionDispatchNotification();
      this.selectedRows = [];
      this.bulkForm.remarks = '';
      this.loading = false;
      this.fetchTAs()
    })
      .catch(error => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
        this.loading = false;
      });
  }

  textStyle(status: string) {
    if (status === 'rejected') {
      return 'text-danger'
    } else if (status === 'accepted') {
      return 'text-accepted'
    } else {
      return 'text-pending'
    }
  }


  resetBtn() {
    this.filters.submissionDateRange = '';
    this.filters.taDateRange = '';
    this.filters.name = '';
    this.filters.code = '';
    this.filters.status = '';
    this.filters.territoryId = '';
    this.filters.minimumAmount = '';
    this.filters.maximumAmount = ''

    if(this.$refs.formValidator){
      (this.$refs.formValidator as Vue & {
        reset: Function
      }).reset();
    }

  }

}
</script>
<style scoped>
.text-pending {
  color: #e5b02a;
}

.text-accepted {
  color: #489341;
}
</style>
