<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Unit</h3>
            <el-tooltip class="ml-3" content="Manage different options for products, such as size or color." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Add New Unit" placement="top" v-can="permissionEnum.CREATE_UNIT_CATEGORY">
            <base-button type="primary" icon size="sm" @click="unitCategories.length >= 3 ? unitMsg() : (isActive = true)">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
        <!--                Unit Category Create and update Modal            -->
        <unit-form
          :current-entity="currentUnitCategory"
          :is-active.sync="isActive"
          :is-update.sync="isUpdate"
          :form.sync="form"
          @created="unitCateogryCreated($event)"
          @updated="unitCategoryUpdated($event)"
        >
        </unit-form>
        <!--                End Unit Category Create and update Modal            -->
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="unitCategories"
    >
      <el-table-column label="Name" min-width="310px" prop="label" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Created At" min-width="310px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Update Unit Category" placement="top" v-can="permissionEnum.UPDATE_UNIT_CATEGORY">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit unit">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
         <el-tooltip content="Delete" placement="top" v-can="permissionEnum.DELETE_UNIT_CATEGORY">
           <a
             href="#!"
             @click.prevent="(showDeleteModal = true), (currentUnitCategory = row)"
             class="table-action table-action-delete"
             data-toggle="tooltip"
             data-original-title="Delete Unit"
           >
             <i class="fas fa-trash"></i>
           </a>
         </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel">Are you sure you want to delete this?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteUnitCategory">Delete</base-button>
      </template>
    </modal> 
    <base-pagination
      v-if="unitCategories.length > 0"
      class="mt-3"
      align="center"
      :total="pagination.totalEntity"
      :perPage="pagination.entityPerPage"
      v-model="pagination.currentPage"
      :disabled="loading"
    >
    </base-pagination>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Component, Mixins, Vue, Watch} from 'vue-property-decorator';
import Unit from '@/intefaces/Unit';
import UnitForm from "@/components/products/UnitForm.vue";
import GIFModal from '@/components/tour/GIFModal.vue';
import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip} from 'element-ui';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import { Permission as PermissionEnum } from '@/enums/Permission'

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    UnitForm,
    GIFModal
  }
})
export default class unitCategoryList extends Mixins(PaginationComponentMixin) {
  private unitCategories: Unit[] = [];
  private showDeleteModal = false;
  private isActive = false;
  private isUpdate = false;
  private currentUnitCategory: any = [];
  private showGIF: boolean = false;
  private form: { name: String } = {
    name: ''
  };
  private demoTourEntity: string = 'unitCategory';
  private GIFs: Array<any> = [
    {
      label: 'Create a UnitCategory',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a UnitCategory',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a UnitCategory',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of unit';

  get permissionEnum () {
    return PermissionEnum;
  }

  onEdit(row: Unit) {
    this.isUpdate = true;
    this.currentUnitCategory = row;
    this.form = {
      name: this.currentUnitCategory.name
    };
    this.isActive = true;
  }

  deleteUnitCategory() {
    this.$http.delete(this.$api(`/units/${this.currentUnitCategory.id}`)).then(response => {
      this.showDeleteModal = false;
      this.unitCategories.splice(
        this.unitCategories.findIndex(unitCategories => unitCategories.id == this.currentUnitCategory.id),
        1
      );
      this.$notify({
        title: 'Success',
        message: 'Successfully Deleted',
        duration: 3000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
    });
  }

  unitCateogryCreated(unitCategory: Unit) {
    this.isActive = false;
    this.unitCategories.unshift(unitCategory);
  }

  unitCategoryUpdated(unit: Unit) {
    this.isUpdate = false;
    this.isActive = false;
    this.unitCategories.splice(
      this.unitCategories.findIndex(unitCategories => unitCategories.id == unit.id),
      1,
      unit
    );
  }

  @Watch('pagination.currentPage')
  fetchUnitCategories() {
    this.loading = true;
    this.$http.get(this.$api(`/units?page=${this.pagination.currentPage}`)).then(response => {
      this.unitCategories = response.data.units;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  created() {
    this.fetchUnitCategories();
  }

  unitMsg() {
    this.$notify({
      title: 'Warning',
      message: 'You cannot add more than 3 units',
      duration: 3000,
      type: 'warning'
    });
  }
}
</script>
