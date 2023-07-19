<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <h3 class="mb-0">Packages</h3>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Add New Package" placement="top">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
      </div>
      <create-package-form
        :is-active.sync="isActive"
        :is-update.sync="isUpdate"
        :current-package="currentPackage"
        :form.sync="form"
        @created="createPackage($event)"
        @updated="updatePackage($event)"
      ></create-package-form>
    </div>
    <el-table
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      v-loading="loading"
      :data="packages"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.schemes">
            <el-table-column label="Cycle" prop="cycle"></el-table-column>
            <el-table-column label="Price" prop="price"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="Name" min-width="120px" prop="label" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>

      <el-table-column label="Trial day" min-width="120px" prop="label" sortable>
        <template v-slot="{ row }">
          <b>{{ row.trial_days }} days</b>
        </template>
      </el-table-column>
      <el-table-column min-width="120" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="View Package" placement="top">
            <a
              href="#!"
              @click.prevent="(currentPackage = row), (isActivePackageView = true)"
              class="table-action"
              data-toggle="tooltip"
              data-original-title="Edit feature"
            >
              <i class="fas fa-eye"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Edit Package" placement="top">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit feature">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Delete" placement="top">
            <a
              href="#!"
              @click.prevent="(currentPackage = row), (showDeleteModal = true)"
              class="table-action table-action-delete"
              data-toggle="tooltip"
              data-original-title="Delete feature"
            >
              <i class="fas fa-trash"></i>
            </a>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="packages.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>
    <view-package-feature :is-active.sync="isActivePackageView" :current-package="currentPackage"></view-package-feature>
    <!--    Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close </base-button>
        <base-button type="danger" @click.prevent="deleteEntity">Delete </base-button>
      </template>
    </modal>

    <!--        End Delete Modal     -->
  </div>
</template>
<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag } from 'element-ui';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import Package from '@/intefaces/Package';
import CreatePackageForm from '@/views/admin/subscription/package/CreatePackageForm.vue';
import ViewPackageFeature from '@/views/admin/subscription/package/ViewPackageFeature.vue';
@Component({
  components: {
    CreatePackageForm,
    ViewPackageFeature,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
  },
})
export default class PackageList extends Mixins(PaginationComponentMixin) {
  // Variable section +++
  private packages: Package[] = [];
  private isActive: boolean = false;
  private isUpdate: boolean = false;
  private isActivePackageView: boolean = false;
  private currentPackage: any = [];
  private showDeleteModal: boolean = false;

  private form: any = {
    name: '',
    schemes: [
      {
        cycle: 0,
        price: 0,
        newScheme: 0, //newScheme = 0, new scheme, newScheme >= 0 (scheme.id), existing scheme
      },
    ],
    trialDays: 0,
    features: [],
  };
  // Variable section ---

  //method +++
  deleteEntity(): void {
    this.$http.delete(this.$landLordApi(`/packages/${this.currentPackage.id}`)).then((response) => {
      this.showDeleteModal = false;
      this.packages.splice(
        this.packages.findIndex((value) => value.id == this.currentPackage.id),
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

  createPackage(newPackage: any) {
    this.isActive = false;
    this.packages.unshift(newPackage);
  }

  updatePackage(updatedPackage: any) {
    this.isUpdate = false;
    this.packages.splice(
      this.packages.findIndex((pack) => pack.id == updatedPackage.id),
      1,
      updatedPackage
    );
    this.isActive = false;
  }

  onEdit(row: any) {
    this.isUpdate = true;
    this.isActive = true;
    this.currentPackage = row;
    this.form.schemes = [];
    this.form.features = [];
    this.form.name = this.currentPackage.name;
    this.form.trialDays = this.currentPackage.trial_days;
    this.currentPackage.features.forEach((feature: any) => {
      this.form.features.push(feature.id);
    });
    this.currentPackage.schemes.forEach((scheme: any) => {
      this.form.schemes.push({
        cycle: scheme.cycle,
        price: scheme.price,
        newScheme: scheme.id,
      });
    });
  }
  //method ---

  //Watcher +++
  @Watch('pagination.currentPage')
  fetchPackage() {
    this.loading = true;
    this.$http.get(this.$landLordApi(`/packages?page=${this.pagination.currentPage}`)).then((response) => {
      this.packages = response.data.packages;
      this.setPagination(response.data);
      this.loading = false;
    });
  }
  //Watcher ---

  // Lifecycle hooks +++
  created() {
    this.fetchPackage();
  }
  // Lifecycle hooks ---
}
</script>
