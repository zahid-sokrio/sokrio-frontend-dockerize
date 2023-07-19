<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Merchandise</h3>
            <el-tooltip class="ml-3" content="Manage your campaign products such as banner, stickers etc." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Add New Merchandise" placement="top" v-can="permissionEnum.CREATE_CAMPAIGN">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <campaign-form
      :is-active.sync="isActive"
      :is-update.sync="isUpdate"
      :form.sync="form"
      :current-entity="currentCampaign"
      @created="createCampaign($event)"
      @updated="updateCampaign($event)"
    ></campaign-form>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="campaigns"
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
        <div class="table-actions" slot-scope="{ row }">
          <el-tooltip content="Update Merchandise" placement="top" v-can="permissionEnum.UPDATE_CAMPAIGN">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit Asset">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
<!--          <el-tooltip content="Delete" placement="top">-->
<!--            <a-->
<!--              href="#!"-->
<!--              @click.prevent="(showDeleteModal = true), (currentCampaign = row)"-->
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
      v-if="campaigns.length > 0"
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
        <base-button type="danger" @click.prevent="deleteCampaign" :disabled="disableBtn">Delete</base-button>
      </template>
    </modal>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Component, Mixins, Vue, Watch} from 'vue-property-decorator';
import CampaignForm from '@/views/inspection/campaign/CampaignForm.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip} from 'element-ui';
import Campaign from '@/intefaces/Campaign';
import Asset from '@/intefaces/Asset';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
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
    CampaignForm
  }
})
export default class CampaignList extends Mixins(PaginationComponentMixin) {
  private isActive = false;
  private isUpdate = false;
  private currentCampaign: any = [];
  private campaigns: Campaign[] = [];
  private showDeleteModal = false;
  private disableBtn = false;
  private form = {
    name: '',
    qty: 0
  };
  private showGIF: boolean = false;
  private demoTourEntity: string = 'inspectionMerchandise';
  private GIFs: Array<any> = [
    {
      label: 'Create a merchandise',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a merchandise',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a merchandise',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of merchandise';

  get permissionEnum () {
    return PermissionEnum;
  }

  createCampaign(campaign: Campaign) {
    this.isActive = false;
    this.campaigns.unshift(campaign);
  }

  updateCampaign(campaign: Campaign) {
    this.isUpdate = false;
    this.campaigns.splice(
      this.campaigns.findIndex(campaignItem => campaignItem.id == campaign.id),
      1,
      campaign
    );
    this.isActive = false;
  }

  onEdit(row: Campaign) {
    this.isUpdate = true;
    this.currentCampaign = row;
    this.form = {
      name: this.currentCampaign.name,
      qty: this.currentCampaign.qty
    };
    this.isActive = true;
  }

  deleteCampaign() {
    this.disableBtn = true;
    this.$http
      .delete(this.$api(`/campaign-items/${this.currentCampaign.id}`))
      .then(response => {
        this.disableBtn = false;
        this.showDeleteModal = false;
        this.campaigns.splice(
          this.campaigns.findIndex(campaign => campaign.id == this.currentCampaign.id),
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
  fetchCampaign() {
    this.loading = true;
    this.$http.get(this.$api(`/campaign-items?page=${this.pagination.currentPage}`)).then(response => {
      this.campaigns = response.data.campaignItems;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  created() {
    this.fetchCampaign();
  }
}
</script>
