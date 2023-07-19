<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Territories</h3>
            <el-tooltip class="ml-3" content="Manage the regions of your business." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer"
                 @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>

        <div class="col-6 text-right">
          <!--          <el-tooltip content="Enable the drag and drop" placement="top">-->
          <!--            <el-switch class="mr-2" v-model="draggable" active-color="#13ce66" inactive-color="#fb6340"-->
          <!--                       inactive-text="Draggable:"></el-switch>-->
          <!--          </el-tooltip>-->
          <div class="btn-group mr-2 ml-2" role="group" aria-label="Basic example">
            <base-button size="sm" type="primary" :class="viewType == 'table' ? 'active' : ''"
                         @click="viewType = 'table'">
              <span class="btn-inner--icon">
                <i class="fas fa-table"></i>
              </span>
            </base-button>
            <base-button size="sm" type="primary" :class="viewType == 'list' ? 'active' : ''"
                         @click="viewType = 'list'">
              <span class="btn-inner--icon">
                <i class="fas fa-project-diagram"></i>
              </span>
            </base-button>
          </div>
          <el-tooltip content="Territory bulk download" placement="top">
            <base-button :loading="bulkDownloading" type="primary" icon size="sm" @click="bulkDownload">
              <span class="btn-inner--icon">
                <i class="fas fa-download"></i>
              </span>
              <span class="btn-inner--text">Download</span>
            </base-button>
          </el-tooltip>
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
          <el-tooltip :content="`Add Territory`" placement="top" v-can="permissionEnum.CREATE_TERRITORY">
            <base-dropdown :menu-on-right="true">
              <base-button icon size="sm" slot="title-container" type="primary" class="dropdown-toggle">
                <span class="btn-inner--icon">
                  <i class="fas fa-plus"></i>
                </span>
                <span class="btn-inner--text">Add</span>
              </base-button>
              <a class="dropdown-item" @click.prevent="isActive = true">New Territory</a>
              <a class="dropdown-item" @click.prevent="showBulkTerritoriesModal = true">Bulk Territories</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" :href="$api('/bulk-territories-sample')">Download Bulk Format</a>
            </base-dropdown>
          </el-tooltip>
        </div>
        <el-drawer title="Territory Filter" :visible.sync="isFilterModelActive" direction="rtl"
                   :before-close="handleClose">
          <div class="col-md-12">
            <base-input label="Name" placeholder="e.g. Dhaka" v-model="filter.search"></base-input>
          </div>
          <div class="col-md-12">
            <base-input label="Code" placeholder="e.g. DHK" v-model="filter.code"></base-input>
          </div>
          <div class="col-md-12">
            <TerritoryTypeAutocomplete label="Type" placeholder="e.g. Level-2 | Division"
                                       v-model="filter.territory_type"></TerritoryTypeAutocomplete>
          </div>
          <div class="col-md-12">
            <UserLazydropdown label="Manager" placeholder="e.g. John Doe"
                              v-model="filter.managed_by"></UserLazydropdown>
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

        <create-bulk-territories
          :show-bulk-territories-modal.sync="showBulkTerritoriesModal"
          @created="entityCreated($event)"
        ></create-bulk-territories>
        <!--                Create and update Modal            -->
        <CreateTerritoryForm
          :territories="territories"
          :currentEntity="isUpdate ? currentEntity : null"
          :form.sync="form"
          :is-active.sync="isActive"
          :is-update.sync="isUpdate"
          @created="entityCreated($event)"
          @updated="entityUpdated($event)"
        ></CreateTerritoryForm>
        <!--               Create and update Modal           -->
      </div>
    </div>
    <el-table
      v-if="viewType == 'table'"
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="territories"
    >
      <el-table-column label="Name" min-width="250px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Code" min-width="250px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.code }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Parent" min-width="250px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.parent ? row.parent.name : '-' }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Territory Type" min-width="250px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.territory_type ? row.territory_type.name : '' }}</b>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Manager" min-width="120px" prop="manager">
        <template v-slot="{ row }">
          <ManagerList :territory="row"></ManagerList>
        </template>
      </el-table-column> -->
      <el-table-column min-width="150px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Update Territory" placement="top" v-if="row.id != 1"
                      v-can="permissionEnum.UPDATE_TERRITORY">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip"
               data-original-title="Edit product">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <div v-loading="loading" class="drag-container" v-if="viewType == 'list'">
      <el-tree :props="props" :load="loadNode" lazy accordion>
        <span class="custom-tree-node" slot-scope="{ node }">
        <span>{{ node.label }}</span>
        <span>
            <i class="fas fa-eye" @click.prevent="currentTerritoryId = node.data.id, showTerritory = true"></i>
        </span>
      </span>
      </el-tree>
    </div>
    <base-pagination
      class="mt-3"
      v-if="territories.length > 0 && viewType == 'table'"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>

    <TerritoryDetailsModal v-if="showTerritory"
                           :territory-id="currentTerritoryId"
                           :show-territory.sync="showTerritory">
    </TerritoryDetailsModal>

    <!--        Territory Delete Modal-->
    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteEntity">Delete</base-button>
      </template>
    </modal>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"
              :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator';
import Territory from '@/intefaces/Territory';
import CreateTerritoryForm from './CreateTerritoryForm.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import { Dropdown, DropdownItem, Switch, DropdownMenu, Table, TableColumn, Tooltip, Drawer, Tree, Button, Popover } from
    'element-ui';
// import {Tree, Draggable} from 'he-tree-vue';
// import 'he-tree-vue/dist/he-tree-vue.css';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import { AxiosResponse } from 'axios';
import CreateBulkTerritories from '@/views/territory/CreateBulkTerritories.vue';
import { Permission as PermissionEnum } from '@/enums/Permission';
import TerritoryTypeAutocomplete from '@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import { QueryBuilder } from '@/classes/QueryBuilder';
// import ManagerList from "@/views/department/ManagerList.vue";
import TerritoryDetailsModal from "@/views/territory/TerritoryDetailsModal.vue";

@Component({
  components: {
    TerritoryDetailsModal,
    // ManagerList,
    UserLazydropdown,
    TerritoryTypeAutocomplete,
    CreateTerritoryForm,
    CreateBulkTerritories,
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Switch.name]: Switch,
    [Drawer.name]: Drawer,
    [Tree.name]: Tree,
    [Button.name]: Button,
    [Popover.name]: Popover,
    //@ts-ignore
    // Tree: Tree.mixPlugins([Draggable])
  },
})
export default class TerritoryList extends Mixins(PaginationComponentMixin) {
  private territories: Territory[] = [];
  private showBulkTerritoriesModal: boolean = false;
  private showDeleteModal: boolean = false;
  private isActive: boolean = false;
  private isUpdate: boolean = false;
  private currentEntity!: Territory;
  // private draggable: boolean = false;
  private isFilterModelActive: boolean = false;
  private query: any = [];
  private viewType: any = 'table';
  private demoTourEntity: string = 'territory';
  private showGIF: boolean = false;
  private user: any = {};
  private queryBuilder: QueryBuilder = new QueryBuilder();
  private showTerritory: boolean = false;
  private bulkDownloading: boolean = false;
  private currentTerritoryId!: number;
  private props: object = {
    label: 'name',
    isLeaf: 'leaf',
  };
  private GIFs: Array<any> = [
    {
      label: 'Create a territory',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    },
    {
      label: 'Update a territory',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ',
    },
    {
      label: 'Delete a territory',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM',
    },
  ];
  private demoTourTitle: string = 'A quick demo of territory';
  private filter: any = {
    search: '',
    code: '',
    territory_type: null,
    managed_by: null,
  };
  private form: Territory = {
    name: '',
    code: '',
    territory_type_id: null,
    managed_by: null,
    parent_id: null,
    managers: [],
    parent: null,
  };

  private paginate = {
    currentPage: 1,
    total: 0,
    perPage: 0,
  };

  get checkParentId() {
    if (this.user && this.user.managed_territory && this.user.managed_territory.id) {
      {
        if (this.user.managed_territory.id != 1) {
          return this.user.managed_territory.parent_id;
        } else {
          return '';
        }
      }
    } else {
      if (this.user.territory && this.user.territory.parent_id) {
        return this.user.territory.parent_id;
      } else {
        return '';
      }
    }
  }

  loadNode(node: any, resolve: any) {
    var territories: any[] = [];
    this.$http.get(this.$api(`/territories?parent_id=${node.level === 0 ? this.checkParentId : node.data.id}`)).then((response) => {
      territories = response.data.territories;
      let treeData = territories.map((territory) => {
        const container: any = {};
        container['name'] = territory.name;
        container['leaf'] = !territory.children_count;
        container['id'] = territory.id;
        return container;
      });
      resolve(treeData);
    });
  }

  get permissionEnum() {
    return PermissionEnum;
  }

  get formattedTerritoryTree(): any {
    return this.$options.filters ? this.$options.filters.parentTreeBuilder(this.territories) : [];
  }

  set formattedTerritoryTree(value: any) {
    // Deep copy of territories array
    let oldTerritory = JSON.parse(JSON.stringify(this.territories));

    function arrayFlattener(elements: Array<any>, parentId: null | number = null): void {
      elements.forEach((value1, index) => {
        if (value1.children.length) {
          arrayFlattener(value1.children, value1.id);
        }
        value1.parent_id = parentId;
      });
    }

    arrayFlattener(value);
    this.updateParentId(oldTerritory);
  }

  updateParentId(oldTerritoryValue: Array<any>) {
    this.territories
      .filter((element: any, index: number) => {
        return element.parent_id !== oldTerritoryValue[index].parent_id;
      })
      .forEach((value) => {
        this.$http.patch(this.$api(`/territories/${value.id}`), value);
      });
  }

  entityCreated(territory: Territory) {
    this.territories.unshift(territory);
  }

  onEdit(row: Territory) {
    this.isUpdate = true;
    this.currentEntity = row;
    this.form = {
      name: this.currentEntity.name,
      code: this.currentEntity.code,
      territory_type_id: this.currentEntity.territory_type_id,
      managed_by: this.currentEntity.managed_by,
      managers: this.currentEntity.managers,
      parent_id: this.currentEntity.parent_id,
      parent: this.currentEntity.parent,
    };
    this.isActive = true;
  }

  @Watch('queryBuilder.watch')
  async fetchEntity() {
    this.loading = true;
    let {data} = await this.$http.get(this.$api(`/territories${this.queryBuilder.getFilters(true)}`));
    this.territories = data.territories;
    this.setPagination(data);
    this.loading = false;
  }

  async fetchUser() {
    this.loading = true;
    let {data} = await this.$http.get(this.$api('/me'));
    this.user = data.me;
  }

  @Watch('filter.search')
  onChangeSearch(value: string) {
    this.queryBuilder.addListener('q', value);
  }

  @Watch('filter.code')
  onChangeCode(value: string) {
    this.queryBuilder.addListener('code', value);
  }

  @Watch('filter.territory_type')
  onChangeTerritoryType(value: string) {
    this.queryBuilder.addListener('territory_type', value);
  }

  @Watch('filter.managed_by')
  onChangeManagedBy(value: string) {
    this.queryBuilder.addListener('managed_by', value);
  }

  @Watch('pagination.currentPage')
  onChangePagination(value: string) {
    this.queryBuilder.addListener('page', value);
  }

  entityUpdated(territory: Territory) {
    this.territories.splice(
      this.territories.findIndex((value) => value.id == territory.id),
      1,
      territory
    );
    this.territories.forEach(function (value, index) {
      if (value.parent && value.parent_id == territory.id) {
        value.parent.name = territory.name;
      }
    });
  }

  deleteEntity(): void {
    this.$http.delete(this.$api(`/territories/${this.currentEntity.id}`)).then((response) => {
      this.showDeleteModal = false;
      this.territories.splice(
        this.territories.findIndex((value) => value.id == this.currentEntity.id),
        1
      );
      this.$notify({
        title: 'Success',
        message: 'Successfully Deleted',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success',
      });
    });
  }

  async created() {
    await this.fetchUser();
    await this.fetchEntity();
  }

  closeBtn() {
    this.isFilterModelActive = false;
    this.viewType = 'table';
  }

  handleClose() {
    this.isFilterModelActive = false;
    this.viewType = 'table';
  }

  resetBtn() {
    this.filter.search = '';
    this.filter.code = '';
    this.filter.territory_type = null;
    this.filter.managed_by = null;
  }

  async bulkDownload() {
    this.bulkDownloading = true;
    try {
      let {data, headers} = await this.$http.get(
        this.$api(`/territories-bulk-download?download&${this.queryBuilder.getFilters(false)}`),
        {responseType: 'arraybuffer'}
      )
      const blob = await new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const link = document.createElement("a");
      link.href = await URL.createObjectURL(blob);
      link.download = this.$getFileNameFromContentDisposition(headers);
      link.click();
    } catch (e) {
      this.$notify({type: 'warning', message: 'Unable to download.', title: 'Something went wrong!'});
    } finally {
      this.bulkDownloading = false;
    }

  }
}
</script>

<style scoped>
.drag-container {
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 3px 0 rgba(16, 17, 23, 0.1), 0 0 1px 0 rgba(16, 17, 23, 0.1);
  background-color: white;
  color: #49494d;
  padding: 1em;
  flex: 1;
  margin: 1em;
  overflow: hidden;
  min-height: 150px;
}

.el-tree-node__content {
  font-weight: bolder;
  color: #525f7f;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
