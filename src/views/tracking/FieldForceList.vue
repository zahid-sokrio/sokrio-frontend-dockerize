<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <h3 class="mb-0">
            Field Forces
            <el-tooltip class="ml-3" content="List and details of fieldforces" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                 @click="showGIF = true"></i>
            </el-tooltip>
          </h3>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Filters" placement="top">
            <base-button
              icon
              size="sm"
              type="primary"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)"
            >
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
              <span class="btn-inner--text">Filters</span>
            </base-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="fieldforce"
    >
      <el-table-column label="Name" min-width="210px" prop="name" sortable>
        <template v-slot="{ row }">
          <async-image v-slot="slotProps" v-if="row.propicUrl"
                       :url="row.propicUrl">
            <img :src="slotProps.imageSrc" class="rounded-circle avatar avatar-lg"
                 alt="Profile Picture"/> <b> {{ ' ' + row.name }}</b>
          </async-image>
          <div v-else>
            <img :src="`${$cdn}/img/avatar.png`" class="rounded-circle avatar avatar-lg"
                 alt="Profile Picture"/>
            <b> {{ ' ' + row.name }}</b>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Mobile Number" align="center" min-width="170px" prop="mobile-number">
        <template v-slot="{ row }">
          <b>{{ row.phone ? row.phone : ' - ' }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Roles" align="center" min-width="170px" prop="roles" sortable>
        <template v-slot="{ row }">
          <b>{{ row.roles ? row.roles : ' - ' }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Today's Plans" align="center" min-width="160px" prop="name" sortable>
        <template v-slot="{ row }">
          <el-popover placement="bottom" title="Today's Plans" width="200" trigger="click" v-if="row.todaysRoutes[0]">
            <el-tag type="success" class="mr-1" v-for="(route, index) in row.todaysRoutes" :key="index">
              <b>{{ route }}</b>
            </el-tag>
            <base-button type="primary" icon size="sm" slot="reference"> {{ 'View Plans' }}</base-button>
          </el-popover>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" min-width="100px" prop="status">
        <template v-slot="{ row }">
          <el-tooltip content="Click to see the last position of this field force" placement="top">
            <b>
              <i
                v-if="row.trackings[0]"
                @click.prevent="changeCurrentTracking(row.trackings), showStatus = true"
                v-bind:class="[statusLabel(row.updatedAt)]"
                style="cursor: pointer"
              ></i>
              <b v-else>-</b>
            </b>
          </el-tooltip>

        </template>
      </el-table-column>
      <el-table-column label="Trackings" align="center" min-width="160px" prop="last-10-track">
        <template v-slot="{ row }">
          <base-button
            v-if="row.trackings[0]"
            size="sm"
            type="primary"
            @click="showTracking = true, currentUserId = row.id"
          >Show Tracks
          </base-button
          >
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="Assigned Outlets" align="center" min-width="160px" prop="checked-outlet">
        <template v-slot="{ row }">
          <el-tooltip content="Check-Ins Inside Plan / Assigned Outlets + Check-Ins Outside Plan" placement="top">
            <base-button
              size="sm"
              :type="`${row.plannedVisit ==  row.totalAssigned? 'success' : 'danger'}`"
              @click="showOutlets = true, currentUserId = row.id"
            ><b> {{
                row.plannedVisit +
                ' / ' +
                row.totalAssigned +
                ' + ' +
                row.unplannedVisit
              }}
            </b></base-button
            >
          </el-tooltip>

        </template>
      </el-table-column>

    </el-table>
    <base-pagination
      class="mt-3"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>

    <TrackingModal v-if="showTracking"
                   :current-user-id="currentUserId"
                   :showTracking.sync="showTracking">
    </TrackingModal>

    <AssignedOutletsModal
      v-if="showOutlets"
      :current-user-id="currentUserId"
      :showOutlets.sync="showOutlets"
    ></AssignedOutletsModal>

    <LastStatusMapView
      :lastTracking="lastTracking"
      :showStatus.sync="showStatus"
      v-if="showStatus">
    </LastStatusMapView>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"
              :showGIF.sync="showGIF"></GIFModal>

    <filter-drawer-component v-if="isFilterModelActive" :visible.sync="isFilterModelActive" direction="rtl"
                             title="Field Force Filter" @closeBtn="onFilterSubmit"
                             @resetBtn="resetBtn">
      <base-input label="Name" v-model="filters.name" name="name" placeholder="e.g. John Doe"></base-input>
      <base-input label="Code" v-model="filters.code" name="code" placeholder="e.g. CAD101"></base-input>
      <base-input label="Phone" v-model="filters.phone" name="phone" placeholder="e.g. 01710800000"></base-input>
      <territory-lazydropdown label="Territory" v-model="filters.territory_id" :add-button="false" searchable-key="q"
                              class="ml-1"
                              placeholder="e.g. Dhaka"></territory-lazydropdown>
      <role-lazydropdown label="Role" v-model="filters.role" :add-button="false" class="ml-1"
                         placeholder="e.g. Field Officer"></role-lazydropdown>
      <base-input label="Status">
        <el-select v-model="filters.status" clearable filterable placeholder="e.g. Active">
          <el-option v-for="(type, index) in statuses"
                     :key="index" :label="type.label"
                     :value="type.value"></el-option>
        </el-select>
      </base-input>
    </filter-drawer-component>

  </div>
</template>
<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag } from 'element-ui';
import BaseTable from '@/components/argon-core/BaseTable.vue';
import FieldForce from '@/intefaces/FieldForce';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import GIFModal from '@/components/tour/GIFModal.vue';
import TrackingModal from '@/views/tracking/TrackingModal.vue';
import AssignedOutletsModal from '@/views/tracking/AssignedOutletsModal.vue';
import LastStatusMapView from '@/views/tracking/LastStatusMapView.vue';
import _ from 'lodash';
import AsyncImage from "@/components/AsyncImage.vue";
import FilterDrawerComponent from "@/components/FilterDrawerComponent.vue";
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown.vue";
import { QueryBuilder } from "@/classes/QueryBuilder";
import RoleLazydropdown from "@/components/lazyDropdown/RoleLazydropdown.vue";

const moment = require('moment');

@Component({
  components: {
    AsyncImage,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    BaseTable,
    GIFModal,
    TrackingModal,
    AssignedOutletsModal,
    LastStatusMapView,
    FilterDrawerComponent,
    UserLazydropdown,
    TerritoryLazydropdown,
    RoleLazydropdown,
  }
})
export default class FieldForceList extends Mixins(PaginationComponentMixin) {
  private fieldforce: any[] = [];
  private fieldForceData!: FieldForce;
  private lastTracking: Array<any> = [];
  private showTracking = false;
  private showStatus = false;
  private showOutlets = false;
  private isActive = false;
  private isNeutral = false;
  private isInactive = false;
  public GoogleMapsLoader: any = null;
  private dateTimestamp: any;
  private currentUserId!: number;
  private demoTourEntity: string = 'fieldForceList';
  private showGIF: boolean = false;
  private isFilterModelActive = false;
  private statuses = [{label: 'Active', value: '1'}, {label: 'Inactive', value: '0'}];
  private queryBuilder = new QueryBuilder();
  private filters: any = {
    name: '',
    code: '',
    phone: '',
    territory_id: '',
    role: '',
    status: '',
  }
  private GIFs: Array<any> = [
    {
      label: 'Create a field force',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a field force',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a field force',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of field force';

  created() {
    this.fetchEntity();
  }

  changeCurrentTracking(lastTracking: any) {
    this.lastTracking = lastTracking;
  }

  @Watch('queryBuilder.watch')
  @Watch('pagination.currentPage')
  fetchEntity(): void {
    this.loading = true;
    //Users API Call
    this.$http.get(this.$api(`/users?can=checkinMobile&with_last_tracking&with_assigned_route_plans&page=${this.pagination.currentPage + '&' + this.queryBuilder.getFilters(false)}`)).then(async response => {
      let users = response.data.users;
      this.fieldforce = [];
      let userVisitInfo: any = [];
      await this.$http.post(this.$api(`/user-visit-info`), {'userIds': _.map(users, 'id')}).then(response => {
        userVisitInfo = response.data.userVisitInfo;
      })
      users.forEach((user: any) => {
        // assigning value in Field force starts
        this.fieldForceData = {
          id: user.id,
          name: user.name,
          todaysRoutes: user.assigned_route_plans[0] ? _.map(user.assigned_route_plans, 'name') : '',
          roles: user.roles[0]?.name ?? '',
          phone: user.phone,
          trackings: user.trackings,
          batteryPercent: user.trackings[0]?.battery_percent ?? '',
          createdAt: user.trackings[0]?.created_at ?? '',
          updatedAt: user.trackings[0]?.updated_at ?? '',
          plannedVisit: userVisitInfo.find((visitInfo: any) => visitInfo.id == user.id).planned_visit,
          unplannedVisit: userVisitInfo.find((visitInfo: any) => visitInfo.id == user.id).unplanned_visit,
          totalAssigned: userVisitInfo.find((visitInfo: any) => visitInfo.id == user.id).total_assigned,
          propicUrl: user.propic_url
        };

        this.fieldforce.push(this.fieldForceData);
        // assigning value in fieldforce ends
      });
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  statusLabel(lastCheckinTime: string): string {
    let status = 'inactiveStatus fa fa-bed';
    var last = moment().diff(moment(lastCheckinTime).format('lll'), 'minute');

    if (last <= 15) {
      status = 'activeStatus fas fa-walking';
      return status;
    }

    if (last > 15 && last <= 30) {
      status = 'neutralStatus fas fa-walking';
      return status;
    }

    if (last > 30) {
      status = 'inactiveStatus fas fa-walking';
      return status;
    }
    return status;
  }

  @Watch('filters.name', {deep: true})
  onChangeNameFiler(newVal: string) {
    this.queryBuilder.addListener('q', newVal);
  }

  @Watch('filters.code', {deep: true})
  onChangeCodeFiler(newVal: string) {
    this.queryBuilder.addListener('code', newVal);
  }

  @Watch('filters.phone', {deep: true})
  onChangePhoneFiler(newVal: string) {
    this.queryBuilder.addListener('phone', newVal);
  }

  @Watch('filters.territory_id', {deep: true})
  onChangeTerritoryFiler(newVal: string) {
    this.queryBuilder.addListener('t', newVal);
  }

  @Watch('filters.role', {deep: true})
  onChangeRoleFiler(newVal: string) {
    this.queryBuilder.addListener('role', newVal);
  }

  @Watch('filters.status', {deep: true})
  onChangeStatusPhoneFiler(newVal: string) {
    this.queryBuilder.addListener('active', newVal);
  }

  resetBtn() {
    this.filters.name = '';
    this.filters.code = '';
    this.filters.phone = '';
    this.filters.territory_id = '';
    this.filters.role = '';
    this.filters.status = ''
  }

  onFilterSubmit() {
    this.isFilterModelActive = false;
  }
}
</script>
<style lang="scss" scoped>
.inactiveStatus {
  color: #f54a5c;
  text-shadow: 1px 1px 1px #ccc;
  font-size: 1.5em;
}

.activeStatus {
  color: #4dce89;
  text-shadow: 1px 1px 1px #ccc;
  font-size: 1.5em;
}

.neutralStatus {
  color: #ffe352;
  text-shadow: 1px 1px 1px #ccc;
  font-size: 1.5em;
}
</style>
