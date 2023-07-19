<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Audits</h3>
            <el-tooltip class="ml-3" content="Monitor your items from outlet to outlet" placement="right">
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
        </div>
      </div>
      <el-drawer title="Audit Filter" :visible.sync="isFilterModelActive" direction="rtl" :before-close="handleClose">
        <div class="col-md-12 m-2">
          <base-input label="Type">
            <el-select filterable placeholder="Type" v-model="selectedFilter" clearable>
              <el-option v-for="(type, index) in types" :key="index" :label="type.label" :value="type.name"></el-option>
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
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="assetAudits"
    >
      <el-table-column label="Outlet Name" name="name" min-width="110px" prop="outlet" sortable>
        <template v-slot="{ row }">
          <b>{{ row.outlet_auditable.outlet.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Type" name="name" min-width="100px" prop="outlet_auditable" sortable>
        <template v-slot="{ row }">
          <b>{{ row.outlet_auditable.auditable_type }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Name" name="name" min-width="110px" prop="asset" sortable>
        <template v-slot="{ row }">
          <b>{{ row.outlet_auditable.auditable.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Qty" name="name" min-width="100px" prop="qty" sortable>
        <template v-slot="{ row }">
          <b>{{ row.qty }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Created By" name="name" min-width="100px" prop="created_by" sortable>
        <template v-slot="{ row }">
          <b>{{ row.outlet_auditable.creator.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Condition" name="name" min-width="100px" prop="condition" sortable>
        <template v-slot="{ row }">
          <b>{{ row.condition }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Comment" name="comment" min-width="100px" prop="comment" sortable>
        <template v-slot="{ row }">
          <b>{{ row.comment }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Image" name="photo_url" min-width="100px" prop="photo_url" sortable>
        <template v-slot="{ row }">
          <single-image-show :image="row.photo_url"></single-image-show>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      v-if="pagination.total > pagination.perPage"
      class="mt-2"
      align="center"
      :total="pagination.total"
      :perPage="pagination.perPage"
      @input="fetchAssetAudit"
      v-model="pagination.currentPage"
      :disabled="loading"
    ></base-pagination>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SingleImageShow from '@/components/ui/SingleImageShow.vue';
import filters from '@/data/InspectionFilter';
import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip, Drawer} from 'element-ui';
import GIFModal from '@/components/tour/GIFModal.vue';

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
    SingleImageShow
  }
})
export default class Audit extends Vue {
  private assetAudits: any = [];
  private loading: boolean = false;
  private isFilterModelActive: boolean = false;
  private pagination = {
    currentPage: 1,
    total: 0,
    perPage: 0
  };
  private types = [
    {name: 'asset', label: 'Assets'},
    {name: 'campaign', label: 'Merchandise'},
    {name: 'product', label: 'Product'}
  ];
  private filter = '';
  private selectedFilter = 'All';

  get filters() {
    let data = [...filters];
    return data;
  }

  private showGIF: boolean = false;
  private demoTourEntity: string = 'inspectionAudit';
  private GIFs: Array<any> = [
    {
      label: 'Create a audit',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a audit',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a audit',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of audit';

  @Watch('selectedFilter')
  filterAudit(newVal: any) {
    this.fetchAssetAudit();
  }

  fetchAssetAudit() {
    this.loading = true;
    let isFirstPage = this.pagination.currentPage < 2;
    let url = isFirstPage
      ? `/audits?auditable_type=${this.selectedFilter != 'All' ? this.selectedFilter : ''}`
      : `/audits?auditable_type=${this.selectedFilter != 'All' ? this.selectedFilter : ''}?page=${this.pagination.currentPage}`;

    this.$http.get(this.$api(url)).then(response => {
      this.assetAudits = response.data.audits;
      this.pagination.total = response.data.total;
      this.pagination.perPage = response.data.per_page;
      this.loading = false;
    });
  }

  created() {
    this.fetchAssetAudit();
  }

  closeBtn() {
    this.isFilterModelActive = false;
  }

  handleClose(done: any) {
    done();
  }

  resetBtn() {
    this.selectedFilter = 'All';
  }
}
</script>
