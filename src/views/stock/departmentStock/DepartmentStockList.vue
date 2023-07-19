<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-md-6">
          <div class="form-inline">
            <h3 class="mb-0">{{ getTaxonomy('department') }} Stock</h3>
            <el-tooltip class="ml-3" content="Monitor department wise product stock for your business" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <!-- <el-tooltip content="DOwnload All Stock" placement="top" v-can="permissionEnum.STOCK_DOWNLOAD">
            <base-button icon size="sm" type="primary" :loading="downloading" @click.prevent="showDownloadModal = !showDownloadModal">
              <span class="btn-inner--icon">
                <i class="fas fa-download"></i>
              </span>
              <span class="btn-inner--text">Stock Download</span>
            </base-button>
          </el-tooltip> -->
          <el-tooltip content="New Stock Requisition" placement="top" v-if="$user.id == 1">
            <base-button icon size="sm" type="primary" @click.prevent="RequisitionModal = !RequisitionModal">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Bulk Requisition</span>
            </base-button>
          </el-tooltip>
          <el-tooltip content="Add Stock" placement="top" v-can="permissionEnum.BULK_STOCK">
            <base-button icon size="sm" type="primary" @click.prevent="AddModal = !AddModal; duplicateChallan=''">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Bulk Add</span>
            </base-button>
          </el-tooltip>
          <el-tooltip content="Adjustment Stock" placement="top" v-if="$user.id == 1">
            <base-button icon size="sm" type="primary" @click.prevent="UpdateModal = !UpdateModal">
              <span class="btn-inner--icon">
                <i class="fas fa-edit"></i>
              </span>
              <span class="btn-inner--text">Bulk Adjustment</span>
            </base-button>
          </el-tooltip>
          <el-tooltip content="Update Stock" placement="top" v-can="permissionEnum.BULK_STOCK">
              <base-button icon size="sm" type="primary" @click.prevent="ChallanUpdateModal = !ChallanUpdateModal">
                <span class="btn-inner--icon">
                  <i class="fas fa-edit"></i>
                </span>
                <span class="btn-inner--text">Update</span>
              </base-button>
            </el-tooltip>
          <el-tooltip content="Filters" placement="top">
            <base-button icon size="sm" type="primary" @click="isFilterModelActive ? (isFilterModelActive = false) : (isFilterModelActive = true)">
              <span class="btn-inner--text">Filters</span>
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
            </base-button>
          </el-tooltip>
        </div>
      </div>
      <department-stock-filter-drawer
        :entity-current-page.sync="pagination.currentPage"
        :entity-per-page.sync="pagination.entityPerPage"
        :is-filter-model-active.sync="isFilterModelActive"
        :total-entity.sync="pagination.totalEntity"
        @update="stocks = $event"
      ></department-stock-filter-drawer>
    </div>
    <modal :show="RequisitionModal" @close="RequisitionModal = false">
      <template slot="header">
        <h5 class="modal-title">Bulk Stock Requisition</h5>
      </template>
      <div class="card">
        <base-button :loading="downloading" type="primary" @click.prevent="onClickDownload">
          <i class="fa fa-download"></i> Download Bulk Format
        </base-button>
        <!-- <br /><br />
            <label class="form-label" for="customFile">Bulk Stock Upload</label>
            <input type="file" accept=".xlsx" class="form-control" id="customFile" /> -->
        <div class="card-header">
          <h3 class="mb-0">Select a CSV file:</h3>
        </div>
        <form>
          <file-input @change="filesChange" accept=".csv"></file-input>
        </form>
      </div>
      <ul>
        <li class="text-danger" v-for="(errorBag, index) in errors" :key="index">
          <h5 class="text-danger" v-for="(error, index) in errorBag" :key="index">{{ error }}</h5>
        </li>
      </ul>
      <template slot="footer">
        <base-button @click.prevent="closeModal" type="secondary">Close</base-button>
        <base-button :loading="btnDisabled" :disabled="btnDisabled" type="success" @click.prevent="importNewEntry">Import
        </base-button>
      </template>
    </modal>
    <modal :show="AddModal" @close="AddModal = false">
      <template slot="header">
        <h5 class="modal-title">Bulk Stock Add</h5>
      </template>
      <div class="card">
        <base-button :loading="downloading" type="primary" @click.prevent="onClickDownload">
          <i class="fa fa-download"></i> Download Bulk Format
        </base-button>
        <!-- <br /><br />
        <label class="form-label" for="customFile">Bulk Stock Upload</label>
        <input type="file" accept=".xlsx" class="form-control" id="customFile" /> -->
        <div class="card-header">
          <h3 class="mb-0">Select a CSV file:</h3>
        </div>
        <form>
          <file-input @change="filesChange" accept=".csv"></file-input>
        </form>
      </div>
      <div v-if="duplicateChallan">
        <code style="color:#df1c09">These Challan no are already exists in stocks <br><br> <strong style="color:blue">{{ duplicateChallan }}</strong><br> <br> N.B. Correction the file, upload again</code>
      </div>
      <ul>
        <li class="text-danger" v-for="(errorBag, index) in errors" :key="index">
          <h5 class="text-danger" v-for="(error, index) in errorBag" :key="index">{{ error }}</h5>
        </li>
      </ul>
      <template slot="footer">
        <base-button @click.prevent="closeModal" type="secondary">Close</base-button>
        <base-button :loading="btnDisabled" :disabled="btnDisabled" type="success" @click.prevent="_import">Import</base-button>
      </template>
    </modal>
    <modal :show="UpdateModal" @close="UpdateModal = false">
      <template slot="header">
        <h5 class="modal-title">Bulk Stock Update</h5>
      </template>
      <div class="card">
        <base-button :loading="downloading" type="primary" @click.prevent="onClickDownload">
          <i class="fa fa-download"></i> Download Bulk Format
        </base-button>
        <div class="card-header">
          <h3 class="mb-0">Select a CSV file:</h3>
        </div>
        <form>
          <file-input @change="filesChange" accept=".csv"></file-input>
        </form>
      </div>
      <ul>
        <li class="text-danger" v-for="(errorBag, index) in errors" :key="index">
          <h5 class="text-danger" v-for="(error, index) in errorBag" :key="index">{{ error }}</h5>
        </li>
      </ul>
      <template slot="footer">
        <base-button @click.prevent="closeModal" type="secondary">Close</base-button>
        <base-button :loading="btnDisabled" :disabled="btnDisabled" type="success" @click.prevent="importFileUpdate">Import</base-button>
      </template>
    </modal>
    <el-table
      v-loading="loading"
      :data="stocks"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
    >
      <el-table-column label="Product" min-width="200px" prop="code" sortable>
        <template v-slot="{ row }">
          <a data-toggle="tooltip" href="#!" @click.prevent="(isActiveProductDetails = true), (currentDepartmentProduct = row)">
            <b v-if="row.product">
              {{ row.product ? row.product.full_name : '' }}
              <badge rounded type="info" size="md">
                {{ row.product.base_product ? 'SKU - ' + row.product.base_product.sku : '-' }}
              </badge>
            </b>
          </a>
        </template>
      </el-table-column>
      <el-table-column :label="getTaxonomy('department')" min-width="200px" prop="code" sortable>
        <template v-slot="{ row }">
          <a data-toggle="tooltip" href="#!" @click.prevent="buyerDepartment(row)">
            <b v-if="row.department">
              {{ row.department.name }}
              <badge rounded type="info" size="md">{{ row.department.code }}</badge>
            </b>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="Free Product" min-width="110px" prop="is_free" sortable>
        <template v-slot="{ row }">
          <b>{{ row.is_free ? 'Yes' : 'No' }}</b>
        </template>
      </el-table-column>
      <el-table-column label="MRP" min-width="100px" prop="code" sortable>
        <template v-slot="{ row }">
          <b>{{ row.product ? row.product.mrp : 0 }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Delivered" min-width="100px" prop="code" sortable>
        <template v-slot="{ row }">
          <b>{{ row.delivered_qty }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Pending" min-width="100px" prop="code" sortable>
        <template v-slot="{ row }">
          <b>{{ row.pending_qty }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Available" min-width="100px" prop="code" sortable>
        <template v-slot="{ row }">
          <b v-if="row.qty > 0"> {{ row.qty }} <br /> </b>
          <b v-else>
            <el-tag class="ml-2" type="danger"><span v-text="'Out of stock'"></span></el-tag>
          </b>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      v-if="stocks && stocks.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      class="mt-3"
      :disabled="loading"
    ></base-pagination>
    <productDetailsForm :current-department-product="currentDepartmentProduct" :is-active.sync="isActiveProductDetails"></productDetailsForm>
    <departmentDetailsForm
      :current-department-product="currentDepartmentProduct"
      :is-active.sync="isActiveDepartment"
      :is-buyer.sync="isBuyer"
    ></departmentDetailsForm>

    <modal :show="showDownloadModal" @close="showDownloadModal = false">
      <template slot="header">
        <h5 class="modal-title">Stock Download</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <base-input label="Recipient (Optional)" v-model="recipient" :placeholder="$user ? $user.email : ''"></base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="showDownloadModal = false" type="secondary">Close</base-button>
        <base-button :loading="loading" type="primary" @click.prevent="stockDownload">
          <i class="fa fa-envelope"></i>
        </base-button>
      </template>
    </modal>
   <modal size="lg" :show="ChallanUpdateModal" @close="ChallanUpdateModal = false">
        <template slot="header">
          <h5 class="modal-title">Stock Update</h5>
        </template>
        <div class="card">
          <div class="card-body">
            <stock-history-lazydropdown
                          v-model="challan_no"
                          :end-point="`/stocks-history`"
                          item-text="challan_no"
                          item-value="challan_no"
                          placeholder="Enter Challan No"
                          :api-version="3"
                          :close-history-modal="closeHistoryModal"
                          :rules="{ required: true }"
                          @selected-item="stocksHistory = $event"                        >
            </stock-history-lazydropdown>
             <el-table v-if="challan_no && stocksHistory.stocks" :data="stocksHistory.stocks" style="width: 100%">
                <el-table-column prop="department" label="Department" width="180">
                  <template v-slot="{ row }">
                    {{ row.department_name }}
                  </template>
                </el-table-column>
                  <el-table-column prop="product" label="Product" width="180">
                    <template v-slot="{ row }">
                      {{ row.product_name }}
                    </template>
                  </el-table-column>
                <el-table-column prop="current_qty" label="Current Qty">
                  <template v-slot="{ row }">
                        {{ row.quantity }}
                      </template>
                </el-table-column>
                <el-table-column prop="update_qty" label="Update Qty">
                    <template v-slot="{ row }">
                    <el-input-number v-model="row.update_qty" :controls="false" :min="0" style="width: 100%;"></el-input-number>
                    </template>
                </el-table-column>
            </el-table>
          </div>
        </div>
        <ul>
          <li class="text-danger" v-for="(errorBag, index) in errors" :key="index">
            <h5 class="text-danger" v-for="(error, index) in errorBag" :key="index">{{ error }}</h5>
          </li>
        </ul>
        <template slot="footer">
          <base-button @click.prevent="closeHistoryModal = true; challan_no = ''; stocksHistory = []; ChallanUpdateModal = false;" type="secondary">Close</base-button>
          <base-button :loading="btnDisabled" :disabled="!challan_no" type="success" @click.prevent="challanUpdate">Update</base-button>
        </template>
      </modal>
    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip, InputNumber } from 'element-ui';
import { mixins } from 'vue-class-component';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import DepartmentProduct from '@/intefaces/DepartmentProduct';
import Department from '@/intefaces/Department';
import ProductDetailsForm from '@/views/stock/departmentStock/ProductDetailsForm.vue';
import DepartmentDetailsForm from '@/views/stock/departmentStock/DepartmentDetailsForm.vue';
import DepartmentStockFilterDrawer from '@/views/stock/departmentStock/DepartmentSrockFilterDrawer.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import FileInput from '@/components/argon-core/Inputs/FileInput.vue';
import { AxiosError, AxiosResponse } from 'axios';
import { Permission as PermissionEnum } from '@/enums/Permission';
import swal from 'sweetalert2';
import StockHistoryLazydropdown from "@/components/lazyDropdown/StockHistoryLazyDropdown.vue";

@Component({
  components: {
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    [InputNumber.name]: InputNumber,
    ProductDetailsForm,
    DepartmentDetailsForm,
    DepartmentStockFilterDrawer,
    FileInput,
    StockHistoryLazydropdown,
  }
})
export default class DepartmentStockList extends mixins(PaginationComponentMixin, TaxonomyMixin) {
  //variable section +++
  private departments: Department[] = [];
  private stocks: any = [];
  public stocksHistory: any = [];
  public formData: any = {};
  public closeHistoryModal: boolean = false;
  private isFilterModelActive: boolean = false;
  private isActiveProductDetails = false;
  private currentDepartmentProduct: DepartmentProduct[] = [];
  private isActiveDepartment = false;
  private isBuyer = false;
  private showGIF: boolean = false;
  private demoTourEntity: string = 'departmentStock';
  public RequisitionModal: boolean = false;
  public AddModal: boolean = false;
  public UpdateModal: boolean = false;
  public ChallanUpdateModal: boolean = false;
  public downloading: boolean = false;
  public loading: boolean = false;
  public btnDisabled: boolean = false;
  private csvFile: Blob | string = '';
  private errors: Array<string> = [];
  private is_owner: boolean = false;
  public showDownloadModal: boolean = false;
  public recipient: string = '';
  public challan_no: string = '';
  public duplicateChallan: string = '';
  private GIFs: Array<any> = [
    {
      label: 'Create a department stock',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a department stock',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a department stock',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of department stock';
  // Variable section ---

  //method +++
  buyerDepartment(row: any) {
    this.isActiveDepartment = true;
    this.isBuyer = true;
    this.currentDepartmentProduct = row;
  }
  closeModal() {
    this.errors = [];
    if (this.AddModal)
      this.AddModal = false;
    else if (this.UpdateModal)
      this.UpdateModal = false;
    else
      this.RequisitionModal = false; 
  }
  get permissionEnum() {
    return PermissionEnum;
  }

  //method ---

  //Watcher +++
  @Watch('departmentFilter')
  filterDepartmentWiseProduct(newVal: any) {
    if (newVal == 'all') {
      this.fetchDepartmentProduct();
    } else {
      this.loading = true;
      this.$http.get(this.$api(`/stocks?department_id=${newVal}`)).then(response => {
        this.stocks = response.data.products;
        this.setPagination(response.data);
        this.loading = false;
      });
    }
  }
  filesChange(files: FileList) {
    this.csvFile = files[0];
  }
  importNewEntry() {
    this.btnDisabled = true;
    let form = new FormData();
    form.append('bulkStock', this.csvFile);
    this.$http
      .post(this.$api3('/stock/bulk-import/requisition'), form)
      .then((response: AxiosResponse) => { 
        swal.fire('Total ' + response.data.total +' Stock Uploading...', 'You will receive the stocks data within a few minutes.', 'success');
        this.btnDisabled = false;
        this.AddModal = false;
        this.fetchDepartmentProduct();
        this.errors = [];
      })
      .catch((err: any) => {
        if (this.csvFile) {
          if (err.response.status == 422) {
            this.errors = err.response?.data.errors;
          } else {
            this.$notify({
              title: 'Warning',
              message: 'Please import the correct file',
              duration: 3000,
              iconClass: 'ni ni-bell-55',
              type: 'warning'
            });
          }
        } else {
          this.errors = err.response?.data.errors;
        }
        this.btnDisabled = false;
      });
  } 
  _import() {
    this.btnDisabled = true;
    let form = new FormData();
    form.append('bulkStock', this.csvFile);
    this.$http
      .post(this.$api('/stock/bulk-import/add'), form)
      .then((response: AxiosResponse) => {
        swal.fire('Stock Uploading...', 'You will receive the stocks data within a few minutes.', 'success');
        this.btnDisabled = false;
        this.AddModal = false;
        this.fetchDepartmentProduct();
        this.errors = [];
      })
      .catch((err: any) => {
        if (this.csvFile) {
          if (err.response.status == 422) {
            this.errors = err.response?.data.errors;
          } else if (err.response.status == 409) {
            this.$notify({
              title: 'Conflict',
              message: 'Duplicate entities.',
              duration: 3000,
              iconClass: 'ni ni-bell-55',
              type: 'warning'
            });
            this.duplicateChallan = err.response.data.challan_no;
          } else {
            this.$notify({
              title: 'Warning',
              message: 'Please import the correct file',
              duration: 3000,
              iconClass: 'ni ni-bell-55',
              type: 'warning'
            });
          }
        } else {
          this.errors = err.response?.data.errors;
        }
        this.btnDisabled = false;
      });
  }
  importFileUpdate() {
    this.btnDisabled = true;
    let form = new FormData();
    form.append('bulkStock', this.csvFile);
    this.$http
      .post(this.$api('/stock/bulk-import/update'), form)
      .then((response: AxiosResponse) => {
        swal.fire('Stock Updating...', 'You will receive the stocks data within a few minutes.', 'success');
        this.btnDisabled = false;
        this.UpdateModal = false;
        this.fetchDepartmentProduct();
        this.errors = [];
      })
      .catch((err: any) => {
        if (this.csvFile) {
          if (err.response.status == 422) {
            this.errors = err.response?.data.errors;
          } else {
            this.$notify({
              title: 'Warning',
              message: 'Please import the correct file',
              duration: 3000,
              iconClass: 'ni ni-bell-55',
              type: 'warning'
            });
          }
        } else {
          this.errors = err.response?.data.errors;
        }
        this.btnDisabled = false;
      });
  }
  async onClickDownload() {
    this.downloading = true;
    try {
      let { data, headers } = await this.$http.get(this.$api('/stock/bulk-export?download'), {
        responseType: 'arraybuffer'
      });
      const blob = await new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = await URL.createObjectURL(blob);
      link.download = this.$getFileNameFromContentDisposition(headers);
      link.click();
    } catch (e) {
      this.$notify({ title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.' });
    } finally {
      this.downloading = false;
    }
  }

  async stockDownload(status: string) {
    this.loading = true;
    try {
      let { data, headers } = await this.$http.get(this.$api('/all-stock-download?' + 'recipient=' + this.recipient));
      await swal.fire('Stock List Sending...', 'You will receive the report within a few minutes.', 'success');
    } catch (e) {
      this.$notify({ title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.' });
    } finally {
      this.loading = false;
      this.showDownloadModal = false;
      this.recipient = '';
    }
  }

  // Lifecycle hooks +++
  fetchDepartmentProduct() {
    this.loading = true;
    this.$http.get(this.$api(`/stocks?page=${this.pagination.currentPage}`)).then(response => {
      this.stocks = response.data.stocks;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  fetchDepartment() {
    this.$http.get(this.$api(`/departments`)).then(response => {
      this.departments = response.data.departments;
    });
  }
  currentUser() {
    this.$http.get(this.$api(`/owner-status`)).then(response => {
      this.is_owner = response.data.is_owner == 1 ? true : false;
    });
  }

  created() {
    this.currentUser();
    this.fetchDepartmentProduct();
    this.fetchDepartment();
  }

  challanUpdate() {
    this.formData = [];
    this.stocksHistory.stocks.forEach((stock: any) => {
      if (stock.update_qty > 0) {
        this.formData.push({
          id: stock.id,
          quantity: stock.quantity,
          update_qty: stock.update_qty
        })
      }
    });
    if (this.formData.length > 0) {
      this.$http.put(this.$api3(`/stocks-history-update`), this.formData).then(response => {
        if (response.status === 200) {
          this.challan_no = '';
          this.stocksHistory = [];
          this.closeHistoryModal = true;
          this.ChallanUpdateModal = false;
          this.$notify({
            title: 'Confirmation!',
            type: 'success',
            message: 'Stock update successfully'
          });
        }
      });
    }
  }
  // Lifecycle hooks ---
}
</script>
<style lang="css">
.card.flex-design {
  display: flex;
  flex-direction: inherit;
  justify-content: center;
  align-items: center;
}
</style>
