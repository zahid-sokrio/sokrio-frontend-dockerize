<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Territory Types</h3>
            <el-tooltip class="ml-3" content="Manage hierarchy of your region type" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
         <!-- <el-tooltip content="Enable the drag and drop" placement="top">
            <el-switch class="mr-2" v-model="draggable" active-color="#13ce66" inactive-color="#fb6340" inactive-text="Draggable:"></el-switch>
          </el-tooltip>-->

          <el-tooltip content="Add New Territory Type" placement="top" v-can="permissionEnum.CREATE_TERRITORY_TYPE">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>

        <!--                Territory Type Create and update Modal            -->
        <CreateTerritoryTypeForm
          :availableTerritoryTypes="territoryTypes"
          :currentEntity="isUpdate ? currentEntity : null"
          :form.sync="form"
          :is-active.sync="isActive"
          :is-update.sync="isUpdate"
          :has-outlet.sync="hasOutlet"
          @created="territoryTypeCreated($event)"
          @updated="territoryTypeUpdated($event)"
        ></CreateTerritoryTypeForm>
        <!--                End Territory Type and update Modal           -->
      </div>
    </div>
    <el-table-draggable :disabled="draggable" @drop="onDrop($event)">
      <el-table
        class="table-responsive align-items-center table-flush table-striped"
        header-row-class-name="thead-light"
        :data="territorySortByLevel"
      >
        <el-table-column class-name="level" align="center" min-width="145px" class="p-2" prop="level">
          <template v-slot="{ row }">
            <el-tooltip :disabled="draggable" placement="none">
             <!-- <div slot="content">
                Enable this option
                <el-switch class="mr-2" v-model="draggable" active-color="#13ce66" inactive-color="#fb6340" inactive-text="Draggable:"></el-switch>
                to use drag & drop.
              </div>-->
              <span>LEVEL - {{ row.level }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Name" align="center" min-width="220px" prop="name">
          <template v-slot="{ row }">
            <b>{{ row.name }}</b>
          </template>
        </el-table-column>
        <el-table-column label="Description" align="center" min-width="280px" prop="description">
          <template v-slot="{ row }">
            <b>{{ row.description }}</b>
          </template>
        </el-table-column>
        <el-table-column label="Has Outlet" align="center" prop="has_outlet" min-width="180px">
          <template v-slot="{ row }">
            <el-tag :type="`${row.has_outlet ? 'success' : 'warning'}`">
              <span v-text="`${row.has_outlet ? 'Yes' : 'No'}`"></span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Created At" align="center" min-width="170px" prop="created_at">
          <template v-slot="{ row }">
            <b>{{ row.created_at | datetime('ll') }}</b>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center">
          <div slot-scope="{ row }" class="table-actions">
            <el-tooltip content="Update Territory Type" placement="top" v-can="permissionEnum.UPDATE_TERRITORY_TYPE">
              <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit product">
                <i class="fas fa-edit"></i>
              </a>
            </el-tooltip>
<!--            <el-tooltip content="Delete" placement="top">-->
<!--              <a-->
<!--                href="#!"-->
<!--                @click.prevent="(showDeleteModal = true), (currentEntity = row)"-->
<!--                class="table-action table-action-delete"-->
<!--                data-toggle="tooltip"-->
<!--                data-original-title="Delete Territory Type"-->
<!--              >-->
<!--                <i class="fas fa-trash"></i>-->
<!--              </a>-->
<!--            </el-tooltip>-->
          </div>
        </el-table-column>
      </el-table>
    </el-table-draggable>
    <!--      Delete Modal-->
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
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import TerritoryType from '@/intefaces/TerritoryType';
import CreateTerritoryTypeForm from '@/views/territory/CreateTerritoryTypeFrom.vue';
import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Switch, Tooltip, Tag} from 'element-ui';
import ElTableDraggable from '@/components/tables/ElementUiElTableDraggable.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import {clone} from 'lodash';
import { Permission as PermissionEnum } from '@/enums/Permission'

@Component({
  components: {
    CreateTerritoryTypeForm,
    GIFModal,
    [Switch.name]: Switch,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    ElTableDraggable
  }
})
export default class TerritoryTypeList extends Vue {
  private territoryTypes: Array<TerritoryType> = [];
  private showDeleteModal = false;
  private isActive = false;
  private isUpdate = false;
  private draggable: boolean = false; // disable
  private currentEntity!: TerritoryType;
  private showGIF: boolean = false;
  private demoTourEntity: string = 'territoryTypes';
  private hasOutlet: boolean = false;
  private GIFs: Array<any> = [
    {
      label: 'Create a territory-type',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a territory-type',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a territory-type',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of territory-type';
  protected form: TerritoryType = {
    name: '',
    description: '',
    has_outlet: false,
    level: 1
  };
  private paginate = {
    currentPage: 1,
    total: 0,
    perPage: 0
  };

  get permissionEnum () {
    return PermissionEnum;
  }

  created() {
    this.fetchEntity();
  }

  checkTerritoryTypesHasOutlet() {
    this.territoryTypes.forEach((territoryType: any) => {
      if(territoryType.has_outlet == 1) {
        this.hasOutlet = true;
      }
    })
  }

  territoryTypeCreated(territoryType: TerritoryType) {
    this.territoryTypes.forEach(value => {
      if (value.level >= territoryType.level) {
        value.level++;
      }
    });
    this.territoryTypes.unshift(territoryType);
    this.checkTerritoryTypesHasOutlet();
  }

  territoryTypeUpdated(territoryType: TerritoryType): void {
    let indexOfSwapTerritoryType = this.territoryTypes.findIndex(type => type.level == territoryType.level);
    let indexOfTargetTerritoryType = this.territoryTypes.findIndex(type => type.id == territoryType.id);
    this.swapOfLevel(clone(this.territoryTypes[indexOfTargetTerritoryType]), this.territoryTypes[indexOfSwapTerritoryType]);
    this.territoryTypes.splice(indexOfTargetTerritoryType,  1, territoryType);
    this.checkTerritoryTypesHasOutlet();
  }

  onEdit(row: TerritoryType) {
    this.isUpdate = true;
    this.currentEntity = row;
    this.form = {
      name: this.currentEntity.name,
      description: this.currentEntity.description,
      has_outlet: this.currentEntity.has_outlet ? true : false,
      level: this.currentEntity.level
    };
    this.isActive = true;
  }

  fetchEntity(): void {
    this.$http.get(this.$api('/territory-types')).then(response => {
      this.territoryTypes = response.data.territoryTypes;
      this.checkTerritoryTypesHasOutlet();
    });
  }

  deleteEntity(): void {
    this.$http.delete(this.$api(`/territory-types/${this.currentEntity.id}`)).then(response => {
      this.showDeleteModal = false;
      this.territoryTypes.splice(
        this.territoryTypes.findIndex(value => value.id == this.currentEntity.id),
        1
      );
      if(this.currentEntity.has_outlet){
        this.hasOutlet = false;
      }
      this.$notify({
        title: 'Success',
        message: 'Successfully Deleted',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
    });
  }

  onDrop({targetObject, list, newIndex, oldIndex}: { targetObject: any; list: any; newIndex: any; oldIndex: any }) {
    let targetTerritoryType = clone(targetObject);
    let newlySortedTargetTerritoryTypeList = list;
    let swapTerritoryType: any = null;
    if (Math.sign(newIndex - oldIndex) < 0) {
      // If drag down to up ⬆
      swapTerritoryType = newlySortedTargetTerritoryTypeList[newIndex + 1];
    } else if (Math.sign(newIndex - oldIndex) > 0) {
      // If drag up to down ⬇
      swapTerritoryType = newlySortedTargetTerritoryTypeList[newIndex - 1];
    }
    this.swapOfLevel(targetTerritoryType, swapTerritoryType);

    //TODO : implement the error response handler
    targetTerritoryType.level = swapTerritoryType.level;
    this.$http.patch(this.$api(`/territory-types/${targetTerritoryType.id}`), targetTerritoryType).then(res => {
    });
  }

  swapOfLevel(targetTerritoryType: TerritoryType, swapTerritoryType: TerritoryType) {
    // Swap the Level of two territory at front-end.
    this.territoryTypes.forEach(value1 => {
      if (value1.id === targetTerritoryType.id) {
        value1.level = swapTerritoryType.level;
      }
      if (value1.id === swapTerritoryType.id) {
        value1.level = targetTerritoryType.level;
      }
    });
  }

  get territorySortByLevel() {
    return JSON.parse(JSON.stringify(this.territoryTypes)).sort((a: any, b: any) => a.level - b.level);
  }
}
</script>
<style>
.level .cell {
  position: relative;
  background: #35bb16;
  border-radius: 3px;
  text-align: center;
  color: white;
  font-weight: 800;
  font-size: 15px;
  padding: 3px;
  margin: 0 12px;
}

.level .cell:first-child {
  position: relative;
  background: #35bb16;
  border-radius: 3px;
  text-align: center;
  color: white;
  font-weight: 800;
  font-size: 15px;
  padding: 0px !important;
}

.level .cell:hover {
  cursor: pointer;
}
</style>
