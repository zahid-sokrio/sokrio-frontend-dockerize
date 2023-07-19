<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-4">
          <div class="form-inline">
            <h3 class="mb-0">Outlet Items</h3>
            <el-tooltip class="ml-3" content="Assign asset, merchandise or products to your department." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-8 text-right">
          <el-tooltip content="Filters" placement="top">
            <base-button
              type="primary"
              icon
              size="sm"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)"
            >
              <span class="btn-inner--text">Filters</span>
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
            </base-button>
          </el-tooltip>
          <!--                    <base-dropdown  :menuOnRight="true">-->
          <!--                        <base-button :loading="loading" size="sm" slot="title-container" type="primary" class="dropdown-toggle">-->
          <!--                            {{ selectedFilter == 'campaign' ? 'Merchandise' : selectedFilter.replace(/^\w/, c => c.toUpperCase()) }}-->
          <!--                        </base-button>-->
          <!--                        <a v-for="filter in filters" :key="filter.value" @click="selectedFilter = filter.value" class="dropdown-item" href="#">-->
          <!--                            {{ filter.title }}-->
          <!--                        </a>-->
          <!--                    </base-dropdown>-->
          <el-tooltip content="Assign Outlet Item" placement="top" v-can="permissionEnum.CREATE_OUTLET_ITEM">
            <base-button type="primary" icon size="sm" @click="isActiveAssignAsset = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Assign Item</span>
            </base-button>
          </el-tooltip>
          <!--                    </div>-->
        </div>
        <el-drawer title="Outlet Item Filter" :visible.sync="isFilterModelActive" direction="rtl" :before-close="handleClose">
          <div class="col-md-12 m-2">
            <base-input label="Type">
              <el-select filterable placeholder="Type" v-model="selectedFilter" clearable>
                <el-option
                  v-for="(type, index) in filters"
                  :key="index"
                  :label="type.value == 'campaign' ? 'Merchandise' : type.value.replace(/^\w/, c => c.toUpperCase())"
                  :value="type.value"
                >
                </el-option>
              </el-select>
            </base-input>
          </div>
          <div class="col-md-12 text-left">
            <base-button type="primary" icon @click="closeBtn">
              <span class="btn-inner--text">Done</span>
            </base-button>
            <base-button type="primary" icon @click="resetBtn">
              <span class="btn-inner--text">Reset</span>
            </base-button>
          </div>
        </el-drawer>
        <auditable-outlet-form
          :is-active-assign-asset.sync="isActiveAssignAsset"
          :is-update.sync="isUpdate"
          :outlets="outlets"
          :assets="assets"
          :form.sync="form"
          @created="AssignAsset"
          v-if="isActiveAssignAsset"
        ></auditable-outlet-form>
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="outletAssets"
    >
      <el-table-column label="Outlet" name="outlet_id" min-width="200px" prop="outlet" sortable>
        <template v-slot="{ row }">
          <b>{{ row.outlet.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Type" name="asset_id" min-width="200px" prop="asset" sortable>
        <template v-slot="{ row }">
          <b>{{ row.auditable_type }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Name" name="asset_id" min-width="200px" prop="asset" sortable>
        <template v-slot="{ row }">
          <b>{{ row.auditable.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Qty" name="qty" min-width="200px" prop="qty" sortable>
        <template v-slot="{ row }">
          <b>{{ row.qty }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Provided On" name="provided_at" min-width="200px" prop="provided_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.provided_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Expires On" name="expires_at" min-width="200px" prop="expires_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.expires_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center">
        <div class="table-actions" slot-scope="{ row }">
          <el-tooltip content="Update Outlet Item" placement="top" v-can="permissionEnum.UPDATE_OUTLET_ITEM">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit Outlet Asset">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
          <!--                    <el-tooltip content="Delete" placement="top">-->
          <!--                        <a-->
          <!--                                href="#!"-->
          <!--                                @click="showDeleteModal = true, currentAssignedOutlet = row"-->
          <!--                                class="table-action"-->
          <!--                                data-toggle="tooltip"-->
          <!--                                data-original-title="Delete Outlet Asset"-->
          <!--                        >-->
          <!--                            <i class="fas fa-trash"></i>-->
          <!--                        </a>-->
          <!--                    </el-tooltip>-->
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      v-if="pagination.total > pagination.perPage"
      class="mt-2"
      align="center"
      :total="pagination.total"
      :perPage="pagination.perPage"
      @input="fetchOutletAuditables"
      v-model="pagination.currentPage"
      :disabled="loading"
    ></base-pagination>

    <assign-asset-update-form
      :is-update.sync="isUpdate"
      :current-auditable-outlet="currentAuditableOutlet"
      :form-update="formUpdate"
      :outlets="outlets"
      @updated="updateAssignAsset($event)"
    ></assign-asset-update-form>

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteAssignAsset" :disabled="disableBtn">Delete</base-button>
      </template>
    </modal>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import AuditableOutletForm from '@/views/inspection/auditable/AuditableOutletForm.vue';
import AssignAssetUpdateForm from '@/views/inspection/auditable/AuditableOutletUpdateForm.vue';
import AssignAsset from '@/intefaces/AssignAsset';
import filters from '@/data/InspectionFilter';
import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip, Drawer} from 'element-ui';
import GIFModal from '@/components/tour/GIFModal.vue';
import Asset from '@/intefaces/Asset';
import { Permission as PermissionEnum } from '@/enums/Permission'

@Component({
  components: {
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Drawer.name]: Drawer,
    AssignAssetUpdateForm,
    AuditableOutletForm
  }
})
export default class AuditableOutletList extends Vue {
  private isActiveAssignAsset = false;
  private isUpdate = false;
  private outlets: any = [];
  private assets: Asset[] = [];
  private outletAssets: AssignAsset[] = [];
  private currentAuditableOutlet: any = [];
  private showDeleteModal = false;
  private disableBtn = false;
  private loading: boolean = false;
  private filter = '';
  private selectedFilter = 'all';
  private isFilterModelActive: boolean = false;
  private form = {
    type: 'asset',
    outlets: [],
    auditable: '',
    providedAt: [],
    expiresAt: [],
    qty: []
  };
  private formUpdate = {
    auditable: '',
    prodivedAt: '',
    expiresAt: '',
    qty: ''
  };
  private pagination = {
    currentPage: 1,
    total: 0,
    perPage: 0
  };
  private showGIF: boolean = false;
  private demoTourEntity: string = 'inspectionOutlet';
  private GIFs: Array<any> = [
    {
      label: 'Create an outlet',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update an outlet',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete an outlet',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of outlet';

  get permissionEnum () {
    return PermissionEnum;
  }

  get filters() {
    let data = [...filters];
    return data;
  }

  @Watch('selectedFilter')
  filterAuditableOutlet(newVal: any) {
    this.fetchOutletAuditables();
  }

  onEdit(row: any) {
    this.isUpdate = true;
    this.currentAuditableOutlet = row;
    this.formUpdate = {
      auditable: this.currentAuditableOutlet.auditable_id,
      prodivedAt: this.currentAuditableOutlet.provided_at,
      expiresAt: this.currentAuditableOutlet.expires_at,
      qty: this.currentAuditableOutlet.qty
    };
  }

  deleteAssignAsset() {
    this.disableBtn = true;
    this.$http
      .delete(this.$api(`/outlet-assets/${this.currentAuditableOutlet.id}`))
      .then(response => {
        this.showDeleteModal = false;
        this.disableBtn = false;
        this.outletAssets.splice(
          this.outletAssets.findIndex(outletAsset => outletAsset.id == this.currentAuditableOutlet.id),
          1
        );
        this.$notify({
          title: 'Success',
          message: 'Successfully Deleted',
          duration: 5000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
      })
      .catch(error => {
        this.disableBtn = false;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  AssignAsset(outletAsset: any) {
    this.isActiveAssignAsset = false;
    this.outletAssets.unshift(outletAsset);
  }

  updateAssignAsset(assignAsset: any) {
    this.isUpdate = false;
    this.outletAssets.splice(
      this.outletAssets.findIndex(outletAsset => outletAsset.id == assignAsset.id),
      1,
      assignAsset
    );
  }

  fetchOutlet() {
    this.$http.get(this.$api(`/departments?has_outlet=1`)).then(response => {
      this.outlets = response.data.departments;
    });
  }

  fetchAsset() {
    this.$http.get(this.$api('/assets')).then(response => {
      this.assets = response.data.assets;
    });
  }

  fetchOutletAuditables() {
    this.loading = true;
    let isFirstPage = this.pagination.currentPage < 2;
    let url = isFirstPage
      ? `/outlet-auditables?auditable_type=${this.selectedFilter != 'all' ? this.selectedFilter : ''}`
      : `/outlet-auditables?auditable_type=${this.selectedFilter}?page=${this.pagination.currentPage}`;

    this.$http.get(this.$api(url)).then(response => {
      this.outletAssets = response.data.outletAuditables;
      this.pagination.total = response.data.total;
      this.pagination.perPage = response.data.per_page;
      this.loading = false;
    });
  }

  created() {
    this.fetchAsset();
    this.fetchOutlet();
    this.fetchOutletAuditables();
  }

  closeBtn() {
    this.isFilterModelActive = false;
  }

  handleClose(done: any) {
    done();
  }

  resetBtn() {
    this.selectedFilter = 'all';
  }
}
</script>
