<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <h3 class="mb-0">List of Coupons</h3>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Add New Coupon" placement="top">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Create</span>
            </base-button>
          </el-tooltip>
        </div>

        <!--                Start of Create & update Modal           -->
        <create-coupon-form
          :currentEntity="isUpdate ? currentEntity : null"
          :form.sync="form"
          :is-active.sync="isActive"
          :is-update.sync="isUpdate"
          @created="entityCreated($event)"
          @updated="entityUpdated($event)"
        ></create-coupon-form>
        <!--                End of Create & update Modal           -->
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="coupons"
    >
      <el-table-column label="Code" min-width="210px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.code }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Discount" min-width="210px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.discount }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Created At" min-width="210px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Expires At" min-width="210px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.expires_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Edit" placement="top">
            <a
              href="#!"
              @click.prevent="onEdit(row)"
              class="table-action"
              data-toggle="tooltip"
              data-original-title="Edit product"
            >
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Delete" placement="top">
            <a
              href="#!"
              @click.prevent="(showDeleteModal = true), (currentEntity = row)"
              class="table-action table-action-delete"
              data-toggle="tooltip"
              data-original-title="Delete Territory Type"
            >
              <i class="fas fa-trash"></i>
            </a>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="coupons.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>
    <!--    Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteEntity">Delete</base-button>
      </template>
    </modal>

    <!--        End Delete Modal     -->
  </div>
</template>
<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator';
// import CreateBadgeForm from '@/views/organization/CreateBadgeForm.vue';
import CreateCouponForm from '@/views/admin/subscription/coupon/CreateCouponForm.vue';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag } from 'element-ui';
import Coupon from '@/intefaces/Coupon';
import PaginationComponentMixin from '@/mixins/PaginationComponent';

@Component({
  components: {
    // CreateBadgeForm,
    CreateCouponForm,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
  },
})
export default class CouponList extends Mixins(PaginationComponentMixin) {
  private coupons: Coupon[] = [];
  private showDeleteModal = false;
  private isActive = false;
  private isUpdate = false;
  private currentEntity!: Coupon;
  private form: Coupon = {
    code: '',
    discount: 0,
    expires_at: '',
  };

  created() {
    this.fetchEntity();
  }

  entityCreated(entity: Coupon) {
    this.coupons.unshift(entity);
  }

  entityUpdated(entity: Coupon): void {
    this.coupons.splice(
      this.coupons.findIndex((type) => type.id == entity.id),
      1,
      entity
    );
  }

  onEdit(row: Coupon) {
    this.isUpdate = true;
    this.currentEntity = row;
    this.form = {
      code: this.currentEntity.code,
      discount: this.currentEntity.discount,
      expires_at: this.currentEntity.expires_at,
    };
    this.isActive = true;
  }

  @Watch('pagination.currentPage')
  fetchEntity(): void {
    this.loading = true;
    this.$http.get(this.$landLordApi(`/coupons?page=${this.pagination.currentPage}`)).then((response) => {
      this.coupons = response.data.coupons;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  deleteEntity(): void {
    this.$http.delete(this.$landLordApi(`/coupons/${this.currentEntity.id}`)).then((response) => {
      this.showDeleteModal = false;
      this.coupons.splice(
        this.coupons.findIndex((value) => value.id == this.currentEntity.id),
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
}
</script>
