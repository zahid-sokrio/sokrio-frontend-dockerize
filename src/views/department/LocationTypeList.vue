<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Location Type</h3>
            <el-tooltip class="ml-3"
                        content="Classify departments by their location type'. Ex: Urban, Rural, City etc"
                        placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Add New Location Type" placement="top" v-can="permissionEnum.CREATE_DEPARTMENT">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>

        <!--                Start of Create & update Modal           -->
        <CreateLocationTypeForm
          :currentEntity="isUpdate ? currentEntity : null"
          :form.sync="form"
          :is-active.sync="isActive"
          :is-update.sync="isUpdate"
          @created="entityCreated($event)"
          @updated="entityUpdated($event)"
        >
        </CreateLocationTypeForm>
        <!--                End of Create & update Modal           -->
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="departmentLocationTypes"
    >
      <el-table-column label="Name" min-width="250px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Created At" min-width="210px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Update Location Type" placement="top" v-can="permissionEnum.UPDATE_DEPARTMENT">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit product">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Delete" placement="top">
            <a
              href="#!"
              @click.prevent="(showDeleteModal = true), (currentEntity = row)"
              class="table-action table-action-delete"
              data-toggle="tooltip"
              data-original-title="Delete Location Type"
            >
              <i class="fas fa-trash"></i>
            </a>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="departmentLocationTypes.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>
    <!--    Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">
          Are you sure you want to delete this ?
        </h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteEntity">Delete</base-button>
      </template>
    </modal>

    <!--        End Delete Modal     -->

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Mixins, Watch} from 'vue-property-decorator';
import CreateLocationTypeForm from '@/views/department/CreateLocationTypeForm.vue';
import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag} from 'element-ui';
import LocationType from '@/intefaces/LocationType';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import GIFModal from '@/components/tour/GIFModal.vue';
import { Permission as PermissionEnum } from '@/enums/Permission'

@Component({
  components: {
    CreateLocationTypeForm,
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag
  }
})
export default class LocationTypeList extends Mixins(PaginationComponentMixin) {
  private departmentLocationTypes: LocationType[] = [];
  private showDeleteModal = false;
  private isActive = false;
  private isUpdate = false;
  private showGIF: boolean = false;
  private currentEntity!: LocationType;
  protected form = {
    name: ''
  };
  private demoTourEntity: string = 'locationType';
  private GIFs: Array<any> = [
    {
      label: 'Create a location type',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a location type',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a location type',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of location type';

  get permissionEnum() {
    return PermissionEnum;
  }

  created() {
    this.fetchEntity();
  }

  entityCreated(entity: LocationType) {
    this.departmentLocationTypes.unshift(entity);
  }

  entityUpdated(entity: LocationType): void {
    this.departmentLocationTypes.splice(
      this.departmentLocationTypes.findIndex(type => type.id == entity.id),
      1,
      entity
    );
  }

  onEdit(row: LocationType) {
    this.isUpdate = true;
    this.currentEntity = row;
    this.form = {
      name: this.currentEntity.name,
    };
    this.isActive = true;
  }

  @Watch('pagination.currentPage')
  fetchEntity(): void {
    this.loading = true;
    this.$http.get(this.$api(`/department-location-types?page=${this.pagination.currentPage}`)).then(response => {
      this.departmentLocationTypes = response.data.departmentLocationTypes;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  deleteEntity(): void {
    this.$http.delete(this.$api(`/department-location-types/${this.currentEntity.id}`)).then(response => {
      this.showDeleteModal = false;
      this.departmentLocationTypes.splice(
        this.departmentLocationTypes.findIndex(value => value.id == this.currentEntity.id),
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
}
</script>
