<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Assets</h3>
            <el-tooltip class="ml-3" content="Manage rental items for your company." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Add New Asset" placement="top" v-can="permissionEnum.CREATE_ASSET">
            <base-button type="primary" icon size="sm" @click="isActiveAsset = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
        <asset-form
          :is-active.sync="isActiveAsset"
          :is-update.sync="isUpdate"
          :form.sync="form"
          :current-entity="currentAsset"
          @created="createAsset($event)"
          @updated="updateAsset($event)"
        ></asset-form>
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="assets"
    >
      <el-table-column label="Name" name="name" min-width="250px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Qty" name="qty" min-width="250px" prop="qty" sortable>
        <template v-slot="{ row }">
          <b>{{ row.qty }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Created At" name="created_at" min-width="250px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Update Asset" placement="top" v-can="permissionEnum.UPDATE_ASSET">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit Asset">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
<!--          <el-tooltip content="Delete" placement="top">-->
<!--            <a-->
<!--              href="#!"-->
<!--              @click.prevent="(showDeleteModal = true), (currentAsset = row)"-->
<!--              class="table-action"-->
<!--              data-toggle="tooltip"-->
<!--              data-original-title="Delete Asset"-->
<!--            >-->
<!--              <i class="fas fa-trash"></i>-->
<!--            </a>-->
<!--          </el-tooltip>-->
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      v-if="assets.length > 0"
      class="mt-3"
      align="center"
      :total="pagination.totalEntity"
      :perPage="pagination.entityPerPage"
      v-model="pagination.currentPage"
      :disabled="loading"
    ></base-pagination>

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteAsset" :disabled="disableBtn">Delete</base-button>
      </template>
    </modal>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Component, Mixins, Vue, Watch} from 'vue-property-decorator';
import AssetForm from '@/views/inspection/auditable/AssetForm.vue';
import Asset from '@/intefaces/Asset';
import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip} from 'element-ui';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import GIFModal from '@/components/tour/GIFModal.vue';
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
    AssetForm
  }
})
export default class AssetList extends Mixins(PaginationComponentMixin) {
  private isActiveAsset = false;
  private isUpdate = false;
  private showDeleteModal = false;
  private disableBtn = false;
  private form = {
    name: '',
    qty: 0
  };
  private assets: Asset[] = [];
  private currentAsset: any = [];
  private showGIF: boolean = false;
  private demoTourEntity: string = 'inspectionAsset';
  private GIFs: Array<any> = [
    {
      label: 'Create a asset',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a asset',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a asset',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of asset';

  get permissionEnum () {
    return PermissionEnum;
  }

  onEdit(row: Asset) {
    this.isUpdate = true;
    this.currentAsset = row;
    this.form = {
      name: this.currentAsset.name,
      qty: this.currentAsset.qty
    };
    this.isActiveAsset = true;
  }

  createAsset(asset: Asset) {
    this.isActiveAsset = false;
    this.assets.unshift(asset);
  }

  updateAsset(updatedAsset: Asset) {
    this.isUpdate = false;
    this.assets.splice(
      this.assets.findIndex(asset => asset.id == updatedAsset.id),
      1,
      updatedAsset
    );
    this.isActiveAsset = false;
  }

  deleteAsset() {
    this.disableBtn = true;
    this.$http
      .delete(this.$api(`/assets/${this.currentAsset.id}`))
      .then(response => {
        this.disableBtn = false;
        this.showDeleteModal = false;
        this.assets.splice(
          this.assets.findIndex(asset => asset.id == this.currentAsset.id),
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

  @Watch('pagination.currentPage')
  fetchAssets() {
    this.loading = true;
    this.$http.get(this.$api(`/assets?page=${this.pagination.currentPage}`)).then(response => {
      this.assets = response.data.assets;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  created() {
    this.fetchAssets();
  }
}
</script>
