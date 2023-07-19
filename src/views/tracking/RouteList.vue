<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Visit Plans</h3>
            <el-tooltip class="ml-3"
                        content="Manage visit plan to visit workplace (ex. outlet etc) for your employee's."
                        placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                 @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Filters" placement="top">
            <base-button
              type="primary"
              icon
              size="sm"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)"
            >
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
              <span class="btn-inner--text">Filters</span>
            </base-button>
          </el-tooltip>
          <el-tooltip content="Add New View Plan" placement="top" v-can="permissionEnum.CREATE_VISIT_PLAN">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
      </div>
      <route-plan-form
        :is-active.sync="isActive"
        :is-update.sync="isUpdate"
        :form.sync="form"
        :current-route-plan="isUpdate ? currentRoutePlan : null"
        @created="createRoute($event)"
        @updated="updateRoute($event)"
      ></route-plan-form>
      <filter-drawer-component v-if="isFilterModelActive" title="Visit Plan" :visible.sync="isFilterModelActive"
                               direction="rtl" @resetBtn="resetBtn">
        <DateRange v-model="filters.expiresDateRange" label-prop="Expires At"></DateRange>
        <DateRange v-model="filters.createdDateRange" label-prop="Created At"></DateRange>
        <base-input label="Visit Plan Name" v-model="filters.name" name="name"
                    placeholder="e.g. Tajmahal Road"></base-input>
        <user-lazydropdown label="User Name" v-model="filters.userName" placeholder="e.g. John Doe"
                           :add-button="false"
                           searchable-key="q"></user-lazydropdown>
        <territory-lazydropdown label="Territory" v-model="filters.territoryId" :add-button="false" searchable-key="q"
                                placeholder="e.g. Mohammadpur"></territory-lazydropdown>
        <department-lazydropdown label="Department" v-model="filters.departmentId" :add-button="false"
                                 searchable-key="q"
                                 placeholder="e.g. ABC Store"></department-lazydropdown>
        <base-input label="Days">
          <el-select filterable placeholder="e.g. Sunday" v-model="filters.day" clearable>
            <el-option
              v-for="(day, index) in days"
              :key="index"
              :label="day.name"
              :value="day.id"
            >
            </el-option>
          </el-select>
        </base-input>
        <base-input label="Timespan">
          <el-select filterable placeholder="e.g. Weekly" v-model="filters.timespan" clearable>
            <el-option
              v-for="(timespan, index) in timespans"
              :key="index"
              :label="timespan.replace(/^\w/, c => c.toUpperCase())"
              :value="timespan"
            >
            </el-option>
          </el-select>
        </base-input>
        <base-input label="Status">
          <el-select filterable placeholder="e.g. Active" v-model="filters.status" clearable>
            <el-option
              v-for="(status, index) in activeStatuses"
              :key="index"
              :label="status.replace(/^\w/, c => c.toUpperCase())"
              :value="status == 'active' ? 1 : 0"
            >
            </el-option>
          </el-select>
        </base-input>
      </filter-drawer-component>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="routes"
    >
      <el-table-column label="Name" min-width="180px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Assigned To" min-width="180px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.assignee.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Timespan" min-width="180px" prop="timespan" sortable>
        <template v-slot="{ row }">
          <b>{{ row.timespan }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Territory" min-width="180px" prop="timespan" sortable>
        <template v-slot="{ row }">
          <b>{{ row.territory ? row.territory.name : "" }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Expires At" min-width="180px" prop="expires_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.expires_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Total Outlets" min-width="150px" prop="total_outlets" sortable>
        <template v-slot="{ row }">
          <b>{{ row.total_outlets }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Outlets" min-width="130px" prop="outlets" sortable>
        <template v-slot="{ row }">
          <!--          <CustomTooltip :entities="outletLists" title="Outlets" button-text="View Outlet"-->
          <!--                         @onClick="onClick(row.id)"></CustomTooltip>-->
          <base-button type="primary" @click.prevent="showOutletModal = true, currentRoutePlan = row"
                       size="sm">View Outlets
          </base-button>
        </template>
      </el-table-column>
      <el-table-column label="Day to Visit" min-width="140px" prop="days" sortable>
        <template v-slot="{ row }">
          <el-popover placement="bottom" :title="row.timespan != 'tour' ? 'Days to visit' : 'Dates to visit'"
                      width="200" trigger="click">
            <div v-if="row.timespan == 'tour'">
              <el-tag type="success" class="mr-1" v-for="(date, index) in row.route_plan_dates" :key="index">
                <b>{{ date.tour_date }}</b>
              </el-tag>
            </div>
            <div v-else>
              <el-tag type="success" class="mr-1" v-for="(day, index) in row.days" :key="index">
                <b>{{ day }}</b>
              </el-tag>
            </div>

            <base-button type="primary" icon size="sm" slot="reference">
              {{ row.timespan != 'tour' ? 'View Days' : 'View Dates' }}
            </base-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="Status" min-width="100px" prop="name" sortable>
        <template v-slot="{ row }">
          <badge rounded :type="row.active ? 'success' : 'danger'" size="md">
            {{ row.active ? 'Active' : 'Inactive' }}
          </badge>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Update Visit Plan" placement="top" v-can="permissionEnum.UPDATE_VISIT_PLAN">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip"
               data-original-title="Edit product">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
          <!--          <el-tooltip content="Delete" placement="top">-->
          <!--            <a-->
          <!--              href="#!"-->
          <!--              @click.prevent="(showDeleteModal = true), (currentRoutePlan = row)"-->
          <!--              class="table-action table-action-delete"-->
          <!--              data-toggle="tooltip"-->
          <!--              data-original-title="Delete product"-->
          <!--            >-->
          <!--              <i class="fas fa-trash"></i>-->
          <!--            </a>-->
          <!--          </el-tooltip>-->
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      v-if="routes.length > 0"
      class="mt-3"
      align="center"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      v-model="pagination.currentPage"
      :disabled="loading"
    ></base-pagination>
    <!--        Route Plan Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteRoutePlan">Delete</base-button>
      </template>
    </modal>

    <!--        End Route Plan Delete Modal     -->

    <view-outlet-for-route-plan v-if="showOutletModal" :is-active.sync="showOutletModal" :current-entity="currentRoutePlan"
    ></view-outlet-for-route-plan>

    <!--    <OutletsModal :showOutletModal="showOutletModal" :outlets="outlets"-->
    <!--                  v-on:update:showOutletModal="showOutletModal = $event"/>-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"
              :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import _ from 'lodash';
import {Vue, Component, Watch, Mixins} from 'vue-property-decorator';
import RoutePlanForm from '@/components/tracking/RoutePlanForm.vue';
import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip, Tag, Popover} from 'element-ui';
import RoutePlan from '@/intefaces/RoutePlan';
import OutletsModal from '@/views/tracking/OutletsModal.vue';
import GIFModal from "@/components/tour/GIFModal.vue";
import ActiveStatus from '@/data/ActiveStatus.ts';
import CustomTooltip from "@/components/CustomTooltip.vue";
import {Permission as PermissionEnum} from '@/enums/Permission'
import {QueryBuilder} from "@/classes/QueryBuilder";
import PaginationComponentMixin from "@/mixins/PaginationComponent";
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import Days from "@/data/Days.ts";
import {RoutePlanTimespan} from '@/enums/RoutePlanTimespan.ts';
import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown.vue";
import DepartmentLazydropdown from "@/components/lazyDropdown/DepartmentLazydropdown.vue";
import DateRange from "@/components/DateRange.vue";
import ViewOutletForRoutePlan from "@/views/tracking/ViewOutletForRoutePlan.vue";
import FilterDrawerComponent from '@/components/FilterDrawerComponent.vue';

@Component({
  components: {
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    [Popover.name]: Popover,
    RoutePlanForm,
    OutletsModal,
    // ActiveStatus,
    CustomTooltip,
    UserLazydropdown,
    TerritoryLazydropdown,
    DepartmentLazydropdown,
    DateRange,
    ViewOutletForRoutePlan,
    FilterDrawerComponent
  }
})
export default class RouteList extends Mixins(PaginationComponentMixin) {
  private isActive = false;
  private isUpdate = false;
  private showDeleteModal = false;
  private showOutletModal = false;
  private currentRoutePlan: any = [];
  private users: any[] = [];
  private routes: RoutePlan[] = [];
  private showGIF: boolean = false;
  private outlets: any = [];
  private isFilterModelActive: boolean = false;
  private status: any = '';
  private filters: any = {
    status: '',
    name: '',
    userName: '',
    territoryId: '',
    day: '',
    timespan: '',
    departmentId: '',
    createdDateRange: '',
    expiresDateRange: '',
  }
  private queryBuilder: QueryBuilder = new QueryBuilder();
  private form: any = {
    routeName: '',
    timespans: '',
    user: '',
    days: [],
    outletList: [],
    expiresAt: '',
    territory: '',
    active: true
  };
  private demoTourEntity: string = 'routes';
  private outletLists: any = [];
  private GIFs: Array<any> = [
    {
      label: 'Create a route',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a route',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a route',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of routes';

  get permissionEnum() {
    return PermissionEnum;
  }

  get days() {
    return Days;
  }

  get timespans() {
    return RoutePlanTimespan;
  }

  fetchUser() {
    this.$http(this.$api('/users')).then(response => {
      this.users = response.data.users;
    });
  }

  get activeStatuses() {
    return ActiveStatus;
  }

  addZero(v: any) {
    if (v < 10) return '0' + v;
    return v;
  }

  stripDate(date: any) {
    var d = new Date(date),
      y = d.getFullYear(),
      m = this.addZero(d.getMonth() + 1),
      da = this.addZero(d.getDate());
    return y + '-' + m + '-' + da;
  }

  onClick(row: any) {
    this.outletLists = [];
    this.$http(this.$api(`/route-plans/${row}/outlets`)).then(response => {
      response.data.outlets.forEach((outlet: any) => {
        this.outletLists.push(outlet.name);
      })
    });
  }

  onEdit(row: any) {
    this.isUpdate = true;
    this.currentRoutePlan = row;
    var currentDays: any = [];
    var outletLists: any = [];
    // this.currentRoutePlan.outlets.forEach((outletList: any) => {
    //   outletLists.push(outletList.id);
    // });
    this.form = {
      routeName: this.currentRoutePlan.name,
      timespans: this.currentRoutePlan.timespan,
      user: this.currentRoutePlan.assigned_to,
      days: this.currentRoutePlan.days,
      tour_dates: _.map(this.currentRoutePlan.route_plan_dates, 'tour_date'),
      reporting_time: this.currentRoutePlan.reporting_time,
      outletList: outletLists,
      expiresAt: this.stripDate(this.currentRoutePlan.expires_at),
      territory: this.currentRoutePlan.territory_id,
      active: Boolean(this.currentRoutePlan.active),
    };
    this.isActive = true;
  }

  deleteRoutePlan() {
    this.$http.delete(this.$api(`/route-plans/${this.currentRoutePlan.id}`)).then(response => {
      this.showDeleteModal = false;
      this.routes.splice(
        this.routes.findIndex(route => route.id == this.currentRoutePlan.id),
        1
      );
      this.$notify({
        title: 'Success',
        message: 'Successfully Deleted',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
    });
  }

  createRoute(route: any) {
    this.isActive = false;
    this.routes.unshift(route);
  }

  updateRoute(updatedRoute: any) {
    this.isUpdate = false;
    this.routes.splice(
      this.routes.findIndex(route => route.id == updatedRoute.id),
      1,
      updatedRoute
    );
    this.isActive = false;
  }

  showOutletsModal(outlets: any) {
    this.outlets = outlets;
  }

  created() {
    // this.fetchUser();
    this.fetchRoute();
  }

  resetBtn() {
    this.filters.status = '';
    this.filters.name = '';
    this.filters.userName = '';
    this.filters.territoryId = '';
    this.filters.day = '';
    this.filters.timespan = '';
    this.filters.departmentId = '';
    this.filters.createdDateRange = '';
    this.filters.expiresDateRange = '';

    if (this.$refs.formValidator) {
      (this.$refs.formValidator as Vue & {
        reset: Function
      }).reset();
    }
  }

  @Watch('filters.name', {deep: true})
  onChangeNameFilter(value: string) {
    this.queryBuilder.addListener('name', value);
  }

  @Watch('filters.userName', {deep: true})
  onChangeUserNameFilter(value: string) {
    this.queryBuilder.addListener('assigned_to', value);
  }

  @Watch('filters.status', {deep: true})
  onChangeStatusFilter(value: string) {
    this.queryBuilder.addListener('status', value);
  }

  @Watch('filters.territoryId', {deep: true})
  onChangeTerritoryFilter(value: string) {
    this.queryBuilder.addListener('t', value);
  }

  @Watch('filters.day', {deep: true})
  onChangeDayFilter(value: string) {
    this.queryBuilder.addListener('day', value);
  }

  @Watch('filters.timespan', {deep: true})
  onChangeTimeSpanFilter(value: string) {
    this.queryBuilder.addListener('timespan', value);
  }

  @Watch('filters.departmentId', {deep: true})
  onChangeDepartmentFilter(value: string) {
    this.queryBuilder.addListener('dept', value);
  }

  @Watch('filters.expiresDateRange', {deep: true})
  onChangeExpiresDateRangeFilter(value: string) {
    this.queryBuilder.addListener('expires_at_date_range', value);
  }

  @Watch('filters.createdDateRange', {deep: true})
  onChangeCreatedAtDateRangeFilter(value: string) {
    this.queryBuilder.addListener('created_at_date_range', value);
  }

  @Watch('queryBuilder.watch')
  @Watch('pagination.currentPage')
  fetchRoute(): void {
    this.loading = true;
    this.$http.get(this.$api(`/route-plans?with=assignee&page=${this.pagination.currentPage}&${this.queryBuilder.getFilters()}`)).then(response => {
      this.routes = response.data.routePlans;
      this.setPagination(response.data);
      this.loading = false;
    });
  }
}
</script>
