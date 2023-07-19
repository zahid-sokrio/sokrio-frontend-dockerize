<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row ">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Proposed Visit Plans</h3>
            <el-tooltip class="ml-3"
                        content="Approve visit plan to visit workplace (ex. outlet etc) for your employee's."
                        placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                 @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class=" col-6 text-right">


          <base-button type="primary" icon size="sm" v-if="selectedRows.length > 0 || allItemSelected"
                       :menuOnRight="true" @click.prevent="dialogVisible=true">
            <span class="btn-inner--text">Submit All</span>
            <span class="btn-inner--icon">
              <i class="fas fa-check"></i>
            </span>
          </base-button>

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


      <filter-drawer-component v-if="isFilterModelActive" title="Visit Plan" :visible.sync="isFilterModelActive"
                               direction="rtl" @resetBtn="resetBtn" @closeBtn="onFilterSubmit">
        <UserLazydropdown
          :addButton="false"
          label="Name"
          placeholder="e.g. Baker Street"
          v-model="filter.search"
        >
        </UserLazydropdown>

        <!--        <route-plan-proposal-lazy-dropdown-->
        <!--          label="Search by Name..."-->
        <!--          placeholder="Select Name"-->
        <!--          v-model="filter.search"-->
        <!--          :multiple="true"-->
        <!--          @remove-tag="onRemoveFilter">-->
        <!--        </route-plan-proposal-lazy-dropdown>-->

        <base-input label="Status">
          <el-select filterable placeholder="e.g. Accepted" v-model="filter.status" clearable>
            <el-option
              v-for="(status, index) in statuses"
              :key="index"
              :label="status.replace(/^\w/, c => c.toUpperCase())"
              :value="status"
            >
            </el-option>
          </el-select>
        </base-input>
      </filter-drawer-component>

      <el-table
        v-loading="loading"
        class="table-responsive align-items-center table-flush table-striped mt-4 mb-4"
        header-row-class-name="thead-light"
        :data="routes"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>

        <el-table-column label="id" min-width="200px" align="center" prop="id" sortable>
          <template v-slot="{ row }">
            <b>#{{ row.code }}</b>
          </template>
        </el-table-column>


        <el-table-column label="Proposed by" min-width="200px" align="center" prop="name" sortable>
          <template v-slot="{ row }">
            <b>{{ row.proposed_by }}</b>
          </template>
        </el-table-column>
        <el-table-column label="Timespan" min-width="200px" align="center" prop="timespan" sortable>
          <template v-slot="{ row }">
            <b>{{ row.timespan }}</b>
          </template>
        </el-table-column>
        <el-table-column :label="routeColumnTitle" min-width="200px" align="center" prop="timespan" sortable>
          <template v-slot="{ row }">
            <el-popover placement="bottom" trigger="hover" title="Routes" width="200">

              <el-tag class="mr-1" v-for="(routePlan, index) in row.routePlans" :key="index">
                <b>{{ routePlan.name }}</b>
              </el-tag>

              <el-button type="info" size="small" round plain slot="reference"> {{
                  row.routePlans ? row.routePlans.map((e) => (e.name)).join(" , ").length > 10 ? row.routePlans.map((e) => (e.name)).join(" , ").slice(0, 10) + '...' : row.routePlans.map((e) => (e.name)).join(" , ") : ""
                }}
              </el-button>

            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="Proposed Date" min-width="200px" align="center" prop="expires_at" sortable>
          <template v-slot="{ row }">
            <b>{{ row.created_at | datetime('ll') }}</b>
          </template>
        </el-table-column>

        <el-table-column label="Reporting Time" min-width="200px" align="center" prop="outlets" sortable>
          <template v-slot="{ row }">
            <b>{{ row.reporting_time }}</b>
          </template>
        </el-table-column>

        <el-table-column label="Starting Point" min-width="200px" align="center" prop="outlets" sortable>
          <template v-slot="{ row }">
            <b>{{ row.startingPoint }}</b>
          </template>
        </el-table-column>
        <el-table-column label="Day to Visit" min-width="200px" align="center" prop="days" sortable>
          <template v-slot="{ row }">
            <el-popover placement="bottom" trigger="hover"
                        :title="row.timespan != 'tour' ? 'Days to visit' : 'Dates to visit'" width="200">
              <div v-if="row.timespan == 'tour'">
                <el-tag type="success" class="mr-1" v-for="(date, index) in row.tour_dates" :key="index">
                  <b>{{ date }}</b>
                </el-tag>
              </div>
              <div v-else>
                <el-tag type="success" class="mr-1" v-for="(day, index) in row.days" :key="index">
                  <b>{{ day }}</b>
                </el-tag>
              </div>

              <el-button type="info" size="small" round plain slot="reference">
                {{ row.timespan != 'tour' ? 'View Days' : 'View Dates' }}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column min-width="120px" align="center" label="Status" sortable>
          <template v-slot="{ row }">

            <badge class="badge-dot mr-4" type="">
              <i :class=" `bg-${row.status== 0 ? 'info': row.status== 1? 'success': 'warning'}`"></i>
              <span
                class="status"> <b> {{
                  row.status == 1 ? "Accepted" : row.status == 2 ? 'Rejected' : "Pending"
                }} </b></span>
            </badge>
          </template>
        </el-table-column>


        <el-table-column min-width="120px" align="center" prop="acceptModel">
          <div class="table-actions" slot-scope="{row}">

            <el-popover
              placement="left"
              width="200"
              v-model='row.showPopOver'
              :disabled="row.status ==1"
              v-can="permissionEnum.APPROVE_PROPOSED_ROUTE_PLAN"
            >
              <b class="text-sm">Are you sure to accept this?</b>

              <el-input
                type="textarea"
                :rows="2"
                placeholder="Remarks..."
                class="mt-4"

                v-model="row.remark">
              </el-input>

              <div style="text-align: right; margin: 0" class="row mt-4 justify-content-around ">

                <el-button size="mini" type="text"
                           @click="((row.showPopOver = false), (onSelectAction(row, 'rejected')))">Reject
                </el-button>
                <el-button type="primary" size="mini"
                           @click.prevent="((row.showPopOver =false),  (onSelectAction(row, 'accepted')))">Accept
                </el-button>
              </div>
              <a class="table-action" slot="reference" data-original-title="Edit Status">
                <i class="fas fa-edit "
                   :style="row.status==1?'color:#cfd4e5; cursor:not-allowed;':'color:#70768e;'"></i>
              </a>
            </el-popover>

          </div>
        </el-table-column>

      </el-table>

      <base-pagination
        class="mt-3"
        v-if="routes.length > 0"
        v-model="pagination.currentPage"
        :perPage="pagination.entityPerPage"
        :total="pagination.totalEntity"
        align="center"
        :disabled="loading"
      ></base-pagination>
    </div>

    <el-dialog
      title="Actions"
      :visible.sync="dialogVisible"
      width="30%">
      <span>Please Select your action</span>

      <el-input
        type="textarea"
        :rows="4"
        placeholder="Remarks..."
        class="mt-4 mb-4"

        v-model="remarks">
      </el-input>

      <span slot="footer" class="dialog-footer">
         <el-button @click="((dialogVisible = false),(onSelectAction(null, 'rejected')) )">Reject All</el-button>
         <el-button type="primary"
                    @click="((dialogVisible = false),(onSelectAction(null, 'accepted')))">Accept All</el-button>
        </span>
    </el-dialog>
  </div>

</template>
<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { PROPOSAL_STATUS, ProposedRoutePlanEntity } from "@/intefaces/ProposedRoutePlanModel";
import { Button, Dialog, Tag } from "element-ui";
import PaginationComponentMixin from "@/mixins/PaginationComponent";
import MultiSelectRow from "@/mixins/MultiSelectRow";
import RoutePlanProposalLazyDropdown from "@/components/lazyDropdown/RoutePlanProposalLazyDropdown.vue";
import { Permission as PermissionEnum } from '@/enums/Permission'
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import FilterDrawerComponent from '@/components/FilterDrawerComponent.vue';

@Component({
  components: {
    UserLazydropdown,
    RoutePlanProposalLazyDropdown,
    [Tag.name]: Tag,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    FilterDrawerComponent
  }
})

export default class ProposedRoutePlan extends Mixins(PaginationComponentMixin, MultiSelectRow) {

  private routes: ProposedRoutePlanEntity[] = [];
  private isFilterModelActive: boolean = false;
  private filter: any = {
    search: null,
    status: null
  };
  private dialogVisible: boolean = false
  private remarks: string = '';
  private routeColumnTitle: string = 'route';
  private statuses: Array<string> = ['pending', 'accepted', 'rejected'];


  get permissionEnum() {
    return PermissionEnum;
  }

  /*   private dummyRoute: ProposedRoutePlanEntity= {
       routePlans: [
         {
           id: 1,
           name: 'Uttara'
         },
         {
           id: 2,
           name: 'Mirpur'
         },

         {
           id: 3,
           name: 'Lala'
         },

       ],
       assigned_to: 1,
       created_at: "2020-02-25",
       created_by: 1,
       creator: [{
         id: 1,
         name: "Mubir m C"
       }],
       days: ['sun', 'mon'],
       proposed_date:  "2020-03-25",
       startingPoint: "tareq store",
       proposed_by: "tareq",
       reporting_time: "09.00",
       status: false, //means pending
       timespan: "weekly",
       tour_dates: undefined,
       updated_at:  "09.00",
       id: 1,
       showPopOver: false

     };
     private dummyRoute2: ProposedRoutePlanEntity= {
       routePlans: [
         {
           id: 1,
           name: 'Uttara'
         },
         {
           id: 2,
           name: 'Mirpur'
         },

         {
           id: 3,
           name: 'Lala'
         },

       ],
       assigned_to: 1,
       created_at: "2020-02-25",
       created_by: 1,
       creator: [{
         id: 1,
         name: "Mubir m C"
       }],
       days: ['sun', 'mon'],
       proposed_date:  "2020-03-25",
       startingPoint: "tareq store",
       proposed_by: "tareq",
       reporting_time: "09.00",
       status: false, //means pending
       timespan: "weekly",
       tour_dates: undefined,
       updated_at:  "09.00",
       id: 2,
       showPopOver: false

     };
 */

  created() {
    //todo: delete dummy data
    this.routes.push(
      //  this.dummyRoute,
      // this.dummyRoute2,

    );

    this.getTerritoryType();
    this.fetchProposedVisitPlan();
  }


  onSelectAction(row: ProposedRoutePlanEntity, status: string) {
    if (row != null) {
      this.submitProposal([row.id], status, row.remark).then(
        value => {
          this.$notify({
            title: 'Success!',
            message: 'Your operation has been succeed',
          });
          this.updateRoute(new ProposedRoutePlanEntity(
            row.created_by,
            row.created_at,
            row.created_by,
            row.creator,
            row.days,
            row.id,
            row.code,
            row.creator?.name,
            row.created_at,
            row.reporting_time,
            row.routePlans,
            false,
            row.startingPoint,
            value[0].status == "accepted" ? PROPOSAL_STATUS.accepted : PROPOSAL_STATUS.rejected,
            row.timespan,
            row.tour_dates,
            row.updated_at,
            ''
          ));

        }
      ).catch(
        reason => {
          this.$notify({
            title: 'Failed!',
            message: 'Your operation has been failed',
            type: "warning"
          });
        }
      )

    } else {

      this.submitProposal(this.allItemSelected ? [] : this.selectedRows.map((e) => e.id), status, this.remarks).then(
        value => {
          this.$notify({
            title: 'Success!',
            message: 'Your operation has been succeed',
          });
          this.fetchProposedVisitPlan();
        }
      ).catch(
        reason => {
          this.$notify({
            title: 'Failed!',
            message: 'Your operation has been failed',
            type: "warning"

          });
        }
      )
    }


  }


  async getTerritoryType() {
    this.routeColumnTitle = 'territory';
    let {data} = await this.$http.get(
      this.$api(`/territory-types?   has_outlet=1 `)
    );
    this.routeColumnTitle = data?.territoryTypes[0]?.name ?? 'Territories'
  }


  @Watch('pagination.currentPage')
  async fetchProposedVisitPlan() {
    //todo: change url right in here

    this.loading = true;
    let {data} = await this.$http.get(
      this.$api(`/propose-route-plans?page=${this.pagination.currentPage}&status=${this.filter.status ?? ''}&created_by=${this.filter.search ?? ''}`)
    );
    this.setPagination(data);
    this.routes = data.proposeRoutePlans.map((e: any) => new ProposedRoutePlanEntity(
      e.created_by,
      e.created_at,
      e.created_by,
      {id: e.creator.id, name: e.creator.name},
      e.days,
      e.id,
      e.code,
      e.creator?.name,
      e.created_at,
      e.reporting_time,
      e.territories.map((e: any) =>
        Object.create({'id': e.territory_id, 'name': e.territory_name})
      ),
      false,
      e.outlets.name,
      this.checkStatus(e.status),
      e.timespan,
      e.route_plan_dates,
      e.updated_at,
      ''
    ));
    this.loading = false;
  }


  async submitProposal(routes: Array<number>, status: string, remarks: string) {
    let response = await this.$http.post(
      this.$api(`/approved-proposed-route-plans`), {
        "proposed_route_plan_id": routes,
        "remarks": remarks,
        "status": status,
        "user_id": this.filter.search
      }
    );
    return response.data.approvedProposeRoutePlan;


  }

  resetBtn() {
    this.filter.search = null;
    this.filter.status = null;
    this.pagination.currentPage = 1;
    this.fetchProposedVisitPlan();

  }

  onFilterSubmit() {
  }

  updateRoute(updatedRoute: any) {
    this.routes.splice(
      this.routes.findIndex(route => route.id == updatedRoute.id),
      1,
      updatedRoute
    );
  }

  @Watch('filter', {immediate: true, deep: true})
  onChangeFilter() {
    this.pagination.currentPage = 1;
    this.fetchProposedVisitPlan();
  }

  checkStatus(status: string) {
    if (status === 'pending') {
      return PROPOSAL_STATUS.pending;
    } else {
      if (status === 'accepted') {
        return PROPOSAL_STATUS.accepted;
      } else {
        return PROPOSAL_STATUS.rejected;
      }
    }
  }


}
</script>

<style scoped>

</style>
