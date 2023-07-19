<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Batch</h3>
            <el-tooltip class="ml-3" content="Manage Batch for your organization." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Add New Batch" placement="top" v-can="permissionEnum.CREATE_BATCH">
            <base-button type="primary" icon size="sm" @click.prevent="isActive = true">
                  <span class="btn-inner--icon">
                    <i class="fas fa-plus"></i>
                  </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>

      </div>
    </div>
    <el-table
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="batches"
    >
      <el-table-column label="Name" min-width="310px" prop="label" sortable>
        <template v-slot="{row}">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Created At" min-width="310px" prop="created_at" sortable>
        <template v-slot="{row}">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      v-if="batches.length > 0"
      class="mt-3"
      align="center"
      :total="pagination.totalEntity"
      :perPage="pagination.entityPerPage"
      v-model="pagination.currentPage"
      :disabled="loading"
    >
    </base-pagination>
    <create-batch
      :is-active.sync="isActive"
      :form.sync="form"
      @created="creatProduct($event)"
    ></create-batch>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>

  </div>
</template>
<script lang="ts">
import {Component, Mixins, Vue, Watch} from "vue-property-decorator";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Table,
  TableColumn,
  Tooltip
} from "element-ui";
import PaginationComponentMixin from "../../mixins/PaginationComponent";
import Batch from "@/intefaces/Batch";
import CreateBatch from "@/views/product/CreateBatch.vue";
import GIFModal from "@/components/tour/GIFModal.vue";
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
    CreateBatch
  }
})
export default class batchlist extends Mixins(PaginationComponentMixin) {
  private batches: Batch[] = [];
  private showDeleteModal: boolean = false;
  private currentVariantCategory: any = [];
  private isActive: boolean = false;
  private demoTourEntity: string = 'batch';
  private showGIF: boolean = false;
  private GIFs: Array<any> = [
    {
      label: 'Create a batch',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a batch',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a batch',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of batch';
  private form: { name: string } = {
    name: ''
  }

  get permissionEnum () {
    return PermissionEnum;
  }

  @Watch('pagination.currentPage')
  fetchBatch() {
    this.loading = true;
    this.$http.get(this.$api(`/batches?page=${this.pagination.currentPage}`))
      .then(response => {
        this.batches = response.data.batches;
        this.setPagination(response.data);
        this.loading = false;
      })
  }

  creatProduct(batch: any) {
    this.isActive = false;
    this.batches.unshift(batch);
  }

  created() {
    this.fetchBatch();
  }
}
</script>
