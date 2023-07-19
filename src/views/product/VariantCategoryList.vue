<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Variant</h3>
            <el-tooltip class="ml-3" content="Manage different options for products, such as size or color." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Add New Variants" placement="top" v-can="permissionEnum.CREATE_VARIANT_CATEGORY">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
        <!--                Variant Category Create and update Modal            -->
        <variant-category-form
          :current-entity="currentVariantCategory"
          :is-active.sync="isActive"
          :is-update.sync="isUpdate"
          :form.sync="form"
          @created="variantCateogryCreated($event)"
          @updated="variantCategoryUpdated($event)"
        >
        </variant-category-form>
        <!--                End Variant Category Create and update Modal            -->
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="variantCategories"
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
          <el-tooltip content="Update Variant Category" placement="top" v-can="permissionEnum.UPDATE_VARIANT_CATEGORY">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit product">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
<!--          <el-tooltip content="Delete" placement="top">-->
<!--            <a-->
<!--              href="#!"-->
<!--              @click.prevent="(showDeleteModal = true), (currentVariantCategory = row)"-->
<!--              class="table-action table-action-delete"-->
<!--              data-toggle="tooltip"-->
<!--              data-original-title="Delete product"-->
<!--            >-->
<!--              <i class="fas fa-trash"></i>-->
<!--            </a>-->
<!--          </el-tooltip>-->
        </div>
      </el-table-column>
    </el-table>
    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel">Are you sure you want to delete this?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteVariantCategory">Delete</base-button>
      </template>
    </modal>
    <base-pagination
      v-if="variantCategories.length > 0"
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
import Variant from '@/intefaces/VariantCategory';
import VariantCategoryForm from '@/components/products/VariantCategoryForm.vue';
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
    VariantCategoryForm,
    GIFModal
  }
})
export default class variantCategoryList extends Mixins(PaginationComponentMixin) {
  private variantCategories: Variant[] = [];
  private showDeleteModal = false;
  private isActive = false;
  private isUpdate = false;
  private currentVariantCategory: any = [];
  private showGIF: boolean = false;
  private form: { name: String } = {
    name: ''
  };
  private demoTourEntity: string = 'variantCategory';
  private GIFs: Array<any> = [
    {
      label: 'Create a variantCategory',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a variantCategory',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a variantCategory',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of variant';

  get permissionEnum () {
    return PermissionEnum;
  }

  onEdit(row: Variant) {
    this.isUpdate = true;
    this.currentVariantCategory = row;
    this.form = {
      name: this.currentVariantCategory.name
    };
    this.isActive = true;
  }

  deleteVariantCategory() {
    this.$http.delete(this.$api(`/variant-categories/${this.currentVariantCategory.id}`)).then(response => {
      this.showDeleteModal = false;
      this.variantCategories.splice(
        this.variantCategories.findIndex(variantCategory => variantCategory.id == this.currentVariantCategory.id),
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

  variantCateogryCreated(variantCategory: Variant) {
    this.isActive = false;
    this.variantCategories.unshift(variantCategory);
  }

  variantCategoryUpdated(variant: Variant) {
    this.isUpdate = false;
    this.isActive = false;
    this.variantCategories.splice(
      this.variantCategories.findIndex(variantCategory => variantCategory.id == variant.id),
      1,
      variant
    );
  }

  @Watch('pagination.currentPage')
  fetchVariantCategories() {
    this.loading = true;
    this.$http.get(this.$api(`/variant-categories?page=${this.pagination.currentPage}`)).then(response => {
      this.variantCategories = response.data.variantCategories;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  created() {
    this.fetchVariantCategories();
  }
}
</script>
