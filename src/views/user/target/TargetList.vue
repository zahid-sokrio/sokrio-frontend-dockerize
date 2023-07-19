<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Targets</h3>
            <el-tooltip class="ml-3" content="Manage target for sales representative, to increase their work efficiency" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
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
          <el-tooltip content="New Target Name" placement="top" v-can="permissionEnum.CREATE_TARGET">
            <base-button icon size="sm" style="float:right;" type="primary" @click="isTargetName = true">
              <span class="btn-inner--text">Add</span>
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
            </base-button>
          </el-tooltip>
        </div>
        <filter-drawer-component
          v-if="isFilterModelActive"
          :visible.sync="isFilterModelActive"
          direction="rtl"
          title="Target Filter"
          @closeBtn="closeBtn"
          @resetBtn="resetBtn"
        >
          <DateRange v-model="filters.startFromDateRange" label-prop="Start From"></DateRange>
          <DateRange v-model="filters.expiresAtDateRange" label-prop="Expires At"></DateRange>
          <base-input label="Type">
            <el-select v-model="filters.type" clearable filterable placeholder="e.g. Created">
              <el-option v-for="(type, index) in filter" :key="index" :label="type.replace(/^\w/, c => c.toUpperCase())" :value="type"></el-option>
            </el-select>
          </base-input>
          <base-input label="Target Type">
            <el-select v-model="filters.targetType" clearable filterable placeholder="e.g. Delivery">
              <el-option
                v-for="(type, index) in ['delivery', 'invoice', 'product', 'visit']"
                :key="index"
                :label="type.replace(/^\w/, c => c.toUpperCase())"
                :value="type"
              ></el-option>
            </el-select>
          </base-input>
          <base-input label="Name" v-model="filters.assigneeName" clearable placeholder="e.g. John Doe"></base-input>
          <base-input label="Assignee" v-model="filters.role" clearable placeholder="e.g. Sales Representative"></base-input>
          <base-input label="Unit">
            <el-select v-model="filters.unit" clearable filterable placeholder="e.g. QTY">
              <el-option v-for="(unit, index) in ['amount', 'qty', 'visit']" :key="index" :label="unit.toUpperCase()" :value="unit"></el-option>
            </el-select>
          </base-input>
          <base-input label="Status">
            <el-select v-model="filters.status" clearable filterable placeholder="e.g. Active">
              <el-option
                v-for="(status, index) in [
                  { label: 'Active', value: '1' },
                  { label: 'Inactive', value: '0' }
                ]"
                :key="index"
                :label="status.label"
                :value="status.value"
              ></el-option>
            </el-select>
          </base-input>
        </filter-drawer-component>
      </div>
      <target-form
        :current-lable-for-invoice="getTaxonomy('invoice')"
        :current-traget="isUpdate ? currentTarget : null"
        :form.sync="form"
        :is-active.sync="isActive"
        :is-update.sync="isUpdate"
        @created="targetCreated($event)"
        @updated="targetUpdate($event)"
        :route-column-title="routeColumnTitle"
        :passTargetAssignId="targetAssign"
        v-on:targetAssignId="assignIdFromTargetAssignReset($event)"
      >
      </target-form>

      <target-form-bulk-assign
        :current-traget="isUpdate ? currentTarget : null"
        :form.sync="form"
        :is-bulk-active.sync="isBulkActive"
        :is-update.sync="isUpdate"
        @created="bulkTargetCreated($event)"
        @updated="targetUpdate($event)"
        :route-column-title="routeColumnTitle"
        :passTargetAssignId="targetAssign"
        v-on:targetAssignId="assignIdFromTargetAssignReset($event)"
      >
      </target-form-bulk-assign>

      <target-assign-form
        :form.sync="form"
        @created="targetNameCreated($event)"
        @updated="targetUpdate($event)"
        :is-update.sync="isUpdate"
        v-on:targetAssignId="assignIdFromTargetAssign($event)"
        v-on:TargetNameUpdate="TargetNameUpdate($event)"
        v-on:TargetNameUpdateForBulkAssign="TargetNameUpdateForBulkAssign($event)"
        :isTargetName="isTargetName"
        :isBulk="false"
      >
      </target-assign-form>
    </div>
    <el-table
      v-loading="loading"
      :data="targets"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
    >
      <el-table-column label="Name" min-width="300px" prop="name" sortable>
        <template v-slot="{ row }">
          <async-image v-slot="slotProps" v-if="row.assignee && row.assignee.propic_url" :url="row.assignee.propic_url">
            <img :src="slotProps.imageSrc" class="rounded-circle avatar avatar-lg" alt="Profile Picture" />
            <b> {{ ' ' + row.assignee ? row.assignee.name : '' }}</b>
          </async-image>
          <div v-else>
            <img :src="`${$cdn}/img/avatar.png`" class="rounded-circle avatar avatar-lg" alt="Profile Picture" />
            <b> {{ row.assignee ? row.assignee.name : '-' }}</b>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Type" min-width="120px" prop="type" sortable>
        <template v-slot="{ row }">
          <b>{{ row.type == 'invoice' ? getTaxonomy('invoice') : row.type }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Scheme" min-width="120px" prop="scheme" sortable>
        <template v-slot="{ row }">
          <b>{{ row.scheme }}</b>
        </template>
      </el-table-column>
      <el-table-column :label="routeColumnTitle" min-width="150px" prop="scheme" sortable>
        <template v-slot="{ row }">
          <b v-if="row.territory">{{ row.territory.name }}</b>
          <b v-else> - </b>
        </template>
      </el-table-column>
      <el-table-column label="Amount" min-width="150px" prop="amount" sortable>
        <template v-slot="{ row }">
          <b>{{ row.unit_value }} {{ row.unit_name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Achieved" min-width="150px" prop="achieved" align="center" sortable>
        <template v-slot="{ row }">
          <el-tooltip content="Achieved Breakdown" placement="top">
            <a data-toggle="tooltip" href="#!" @click.prevent="(isShowAchievedHistory = true), (currentTarget = row)">
              <b
                :style="
                  row.target_products != ''
                    ? acheivedResult(row.target_products) != false && row.achieved >= row.unit_value
                      ? 'color: green'
                      : ''
                    : row.target_products == '' && row.achieved >= row.unit_value
                    ? 'color: green'
                    : ''
                "
                >{{ row.achieved }}</b
              >
            </a>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Target Name" min-width="200px" prop="amount" sortable>
        <template v-slot="{ row }">
          <b>{{ row.get_target_name ? row.get_target_name.target_name : '' }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Start From" min-width="150px" prop="start_from" sortable>
        <template v-slot="{ row }">
          <b v-if="row.start_from">{{ row.start_from | datetime('ll') }}</b>
          <b v-else> - </b>
        </template>
      </el-table-column>
      <el-table-column label="Expires At" min-width="150px" prop="expires_at" sortable>
        <template v-slot="{ row }">
          <b v-if="row.expires_at">{{ row.expires_at | datetime('ll') }}</b>
          <b v-else> - </b>
        </template>
      </el-table-column>
      <el-table-column label="Status" min-width="100px" prop="active" sortable>
        <template v-slot="{ row }">
          <el-tag :type="`${row.active == 1 ? 'success' : 'danger'}`">
            <span v-text="`${row.active == 1 ? 'Active' : 'Inactive'}`"></span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150px">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Target Breakdown" placement="top">
            <a
              class="table-action"
              data-original-title="Edit product"
              data-toggle="tooltip"
              href="#!"
              @click.prevent="(isActiveView = true), viewProduct(row)"
            >
              <i class="fas fa-eye"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Update Target" placement="top" v-can="permissionEnum.UPDATE_TARGET">
            <a class="table-action" data-original-title="Edit product" data-toggle="tooltip" href="#!" @click.prevent="onEdit(row)">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
          <!--          <el-tooltip content="Delete" placement="top">-->
          <!--            <a-->
          <!--              @click.prevent="(showDeleteModal = true), (currentTraget = row)"-->
          <!--              class="table-action table-action-delete"-->
          <!--              data-original-title="Delete"-->
          <!--              data-toggle="tooltip"-->
          <!--              href="#!"-->
          <!--            >-->
          <!--              <i class="fas fa-trash"></i>-->
          <!--            </a>-->
          <!--          </el-tooltip>-->
        </div>
      </el-table-column>
    </el-table>
    <target-view-form :is-active-view.sync="isActiveView" :target-product="targetProducts"></target-view-form>
    <!--        Target Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 id="exampleModalLabel1" class="modal-title">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteTarget">Delete</base-button>
      </template>
    </modal>

    <target-achieved-history
      v-if="isShowAchievedHistory"
      :is-active.sync="isShowAchievedHistory"
      :current-target="currentTarget"
    ></target-achieved-history>

    <!--        Target Brand Delete Modal     -->
    <base-pagination
      v-if="targets.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.perPage"
      :total="pagination.total"
      align="center"
      class="mt-3"
      :disabled="loading"
    ></base-pagination>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator';
import TargetForm from '@/views/user/target/TargetForm.vue';
import TargetFormBulkAssign from '@/views/user/target/TargetFormBulkAssign.vue';
import TargetAssignForm from '@/views/user/target/TargetAssignForm.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import TargetViewForm from '@/views/user/target/TargetViewForm.vue';
import { Badge, Drawer, Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip } from 'element-ui';
import Target from '@/intefaces/Target';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import { QueryBuilder } from '@/classes/QueryBuilder';
import FilterDrawerComponent from '@/components/FilterDrawerComponent.vue';
import TargetAchievedHistory from '@/views/user/target/TargetAchievedHistory.vue';
import AsyncImage from '@/components/AsyncImage.vue';
import { Permission as PermissionEnum } from '@/enums/Permission';
import DateRange from '@/components/DateRange.vue';

const flatPicker = require('vue-flatpickr-component');

@Component({
  components: {
    AsyncImage,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Badge.name]: Badge,
    [Drawer.name]: Drawer,
    [Tag.name]: Tag,
    TargetForm,
    TargetFormBulkAssign,
    TargetAssignForm,
    TargetViewForm,
    GIFModal,
    FilterDrawerComponent,
    flatPicker,
    TargetAchievedHistory,
    DateRange
  }
})
export default class TargetList extends Mixins(TaxonomyMixin) {
  public targetAssign: number = 0;
  private isActive = false;
  private isBulkActive = false;
  private isTargetName = false;
  private isBulk = false;
  private isActiveView = false;
  private targetType = '';
  private targetProducts: any = [];
  private productList: any = [];
  private targets: Target[] = [];
  private filter: any = ['created', 'assigned'];
  private filters: any = {
    type: '',
    targetType: '',
    assigneeName: '',
    role: '',
    expiresAtDateRange: '',
    startFromDateRange: '',
    unit: '',
    status: ''
  };
  private showDeleteModal = false;
  private currentTarget: any = [];
  private isUpdate = false;
  private userList: any = [];
  private loading: boolean = false;
  private isShowAchievedHistory = false;
  private isFilterModelActive: boolean = false;
  private showGIF: boolean = false;
  private queryBuilder: QueryBuilder = new QueryBuilder();
  private routeColumnTitle: string = 'Route';
  private form: any = {
    type: '',
    expiresDate: '',
    amount: '',
    unit: '',
    assignTo: '',
    scheme: '',
    start_from: '',
    status: true,
    territory_id: ''
  };
  private pagination = {
    currentPage: 1,
    total: 0,
    perPage: 0
  };

  private demoTourEntity: string = 'target';
  private GIFs: Array<any> = [
    {
      label: 'Create a target',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a target',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a target',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of target';

  get permissionEnum() {
    return PermissionEnum;
  }
  assignIdFromTargetAssign(data: any) {
    this.targetAssign = data;
  }
  assignIdFromTargetAssignReset(data: any) {
    this.targetAssign = data;
  }

  TargetNameUpdate(data: any) {
    this.isTargetName = data;
    if (this.targetAssign > 0) {
      this.isActive = true;
    }
  }
  TargetNameUpdateForBulkAssign(data: any) {
    this.isTargetName = data;
    if (this.targetAssign > 0) {
      this.isBulkActive = true;
    }
  }

  @Watch('filters.type', { deep: true })
  filterTarget(value: string) {
    this.queryBuilder.addListener('filter', value);
  }

  @Watch('filters.targetType', { deep: true })
  onChangeTargetTypeFilter(value: string) {
    this.queryBuilder.addListener('target_type', value);
  }

  @Watch('filters.assigneeName', { deep: true })
  onChangeNameFilter(value: string) {
    this.queryBuilder.addListener('assignee_name', value);
  }

  @Watch('filters.role', { deep: true })
  onChangeRoleFilter(value: string) {
    this.queryBuilder.addListener('assignee_role', value);
  }

  @Watch('filters.startFromDateRange', { deep: true })
  onChangeStartDateFilter(value: string) {
    this.queryBuilder.addListener('start_from_date_range', value);
  }

  @Watch('filters.expiresAtDateRange', { deep: true })
  onChangeExpiresAtFilter(value: string) {
    this.queryBuilder.addListener('expires_at_date_range', value);
  }

  @Watch('filters.unit', { deep: true })
  onChangeUnitFilter(value: string) {
    this.queryBuilder.addListener('unit_name', value);
  }

  @Watch('filters.status', { deep: true })
  onChangeStatusFilter(value: string) {
    this.queryBuilder.addListener('active', value);
  }

  viewProduct(row: any) {
    this.$http.get(this.$api(`/targets/${row.id}/target-products`)).then(response => {
      this.targetProducts = response.data.targetProducts;
    });
  }

  acheivedResult(row: any) {
    var achieved = false;
    if (row) {
      row.forEach((product: any) => {
        if (product.achieved >= product.amount) {
          achieved = true;
        } else {
          achieved = false;
        }
      });
    }
    if (achieved == false) {
      return false;
    }
  }

  onEdit(row: any) {
    this.currentTarget = row;
    this.isActive = true;
    this.form = {
      type: this.currentTarget.type,
      expiresDate: this.currentTarget.expires_at,
      amount: this.currentTarget.unit_value,
      unit: this.currentTarget.unit_name,
      assignTo: this.currentTarget.assigned_to,
      scheme: this.currentTarget.scheme,
      start_from: this.currentTarget.start_from,
      status: Boolean(this.currentTarget.active),
      territory_id: this.currentTarget.territory_id
    };
    this.isUpdate = true;
  }

  deleteTarget() {
    this.$http.delete(this.$api(`/targets/${this.currentTarget.id}`)).then(response => {
      this.showDeleteModal = false;
      this.targets.splice(
        this.targets.findIndex((target: any) => target.id == this.currentTarget.id),
        1
      );
    });
  }

  targetCreated(target: any) {
    this.isActive = false;
    this.targets.unshift(target);
  }

  bulkTargetCreated(target: any) {
    location.reload();
  }

  targetUpdate(targetUpdate: any) {
    this.isUpdate = false;
    this.targets.splice(
      this.targets.findIndex((target: any) => target.id == targetUpdate.id),
      1,
      targetUpdate
    );
    this.isActive = false;
  }

  @Watch('queryBuilder.watch')
  @Watch('pagination.currentPage')
  async fetchTarget() {
    this.loading = true;
    let isFirstPage = this.pagination.currentPage < 2;
    let url = isFirstPage
      ? `/targets?${this.queryBuilder.getFilters()}`
      : `/targets?${this.queryBuilder.getFilters()}&page=${this.pagination.currentPage}`;

    await this.$http.get(this.$api(url)).then(response => {
      this.targets = response.data.targets;
      this.pagination.total = response.data.total;
      this.pagination.perPage = response.data.per_page;
      this.loading = false;
    });
  }

  bulkLoadingPage() {
    this.fetchTarget();
  }

  created() {
    this.fetchTarget();
    this.getTerritoryType();
  }

  closeBtn() {
    this.isFilterModelActive = false;
  }

  handleClose(done: any) {
    done();
  }

  async getTerritoryType() {
    let { data } = await this.$http.get(this.$api(`/territory-types?   has_outlet=1 `));
    this.routeColumnTitle = data?.territoryTypes[0]?.name ?? 'Route';
  }

  resetBtn() {
    this.filters.type = '';
    this.filters.targetType = '';
    this.filters.unit = '';
    this.filters.status = '';
    this.filters.role = '';
    this.filters.assigneeName = '';
    this.filters.expiresAtDateRange = '';
    this.filters.startFromDateRange = '';
    this.isFilterModelActive = false;
    this.fetchTarget();
  }
}
</script>
