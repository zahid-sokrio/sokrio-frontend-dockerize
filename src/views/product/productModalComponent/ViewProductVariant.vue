<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <modal :show="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title"
            id="exampleModalLabel">View Variant</h5>
      </template>
      <div>
        <div class="col-md-12 text-right" style="margin-bottom: 8px">
          <el-tooltip content="Add Product Varaint" placement="top" class="ml-3">
            <base-button size="sm" type="primary" icon @click="isActiveCreateVariant = true">
              <span class="btn-inner--icon"><i class="fas fa-plus"></i></span>
              <span class="btn-inner--text"> Add </span>
            </base-button>
          </el-tooltip>
        </div>
        <el-table
          v-loading="loading"
          :data="productVariant"
          class="table-responsive align-items-center"
        >
          <el-table-column label="Variant Category" min-width="100px" sortable>
            <template v-slot="{ row }">
              <span v-if="row.variant_category">{{ row.variant_category.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Value" min-width="100px" prop="value" sortable></el-table-column>
          <el-table-column align="center" min-width="70px">
            <div slot-scope="{ row }" class="table-actions">
              <el-tooltip content="Update Product Varaint" placement="top" v-if="row.variant_category.name != 'default'">
                <a class="table-action" data-original-title="Update product variant" data-toggle="tooltip"
                   @click.prevent="onEdit(row)" href="#!">
                  <i class="fas fa-edit"></i>
                </a>
              </el-tooltip>
              <el-tooltip content="Delete Product Varaint" placement="top" v-if="row.variant_category.name != 'default'">
                <a class="table-action" @click.prevent="showDeleteModal = true, currentProductVariant = row"
                   data-original-title="Delete product price"
                   data-toggle="tooltip"
                   href="#!">
                  <i class="fas fa-trash"></i>
                </a>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
        <modal :show.sync="showDeleteModal">
          <template>
            <h5 id="exampleModalLabel1" class="modal-title">Are you sure you want to delete this ?</h5>
          </template>
          <template slot="footer">
            <base-button type="secondary" @click.prevent="showDeleteModal = false">Close
            </base-button>
            <base-button type="danger" @click.prevent="onDelete">Delete</base-button>
          </template>
        </modal>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
      </template>
      <create-variant
        v-if="isActiveCreateVariant"
        :is-active.sync="isActiveCreateVariant"
        :single-variant.sync="singleVariant"
        :is-update.sync="isUpdateProductVariant"
        :product.sync="product"
        :current-product-variant="currentProductVariant"
        @addVariant="addVariant"
        @updateVariant="updateVariant"
      ></create-variant>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {Dropdown, DropdownItem, DropdownMenu, Upload} from 'element-ui';
import VariantCategory from "../../../intefaces/VariantCategory";
import CreateVariant from "@/views/product/productModalComponent/CreateVariant.vue";

@Component({
  components: {
    CreateVariant
  }
})
export default class ViewProductVariant extends Vue {
  @Prop() isActive!: boolean;
  @Prop() product!: any;
  private isUpdateProductVariant: boolean = false;
  private isActiveCreateVariant: boolean = false;
  private productVariant: VariantCategory[] = [];
  private loading: boolean = false;
  private currentProductVariant: any = [];
  private showDeleteModal: boolean = false;
  private singleVariant = {
    value: '',
    variant: '',
  }

  onDelete() {
    this.$http.delete(this.$api(`/product-variants/${this.currentProductVariant.id}`)).then(response => {
      this.showDeleteModal = false;
      this.$notify({
        title: 'Success',
        message: 'Successfully Deleted',
        duration: 3000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
      this.productVariant.splice(this.productVariant.findIndex(variant => variant.id == this.currentProductVariant.id),
        1)
    })
  }

  onEdit(row: any) {
    this.currentProductVariant = row;
    this.singleVariant = {
      value: this.currentProductVariant.value,
      variant: this.currentProductVariant.variant_category_id,
    }
    this.isUpdateProductVariant = true;
    this.isActiveCreateVariant = true;
  }

  updateVariant(event: any) {
    this.productVariant.splice(this.productVariant.findIndex(variant => variant.id === event.id), 1, event);
    this.isActiveCreateVariant = false;
    this.isUpdateProductVariant = false;
  }

  addVariant(event: any) {
    this.productVariant.unshift(event);
  }

  fetchVariant() {
    this.loading = true;
    this.$http.get(this.$api(`/products/${this.product.id}?with=variants`)).then(response => {
      this.productVariant = response.data.product.variants;
      this.loading = false;
    })
  }

  created() {
    this.fetchVariant();
  }

  close() {
    this.$emit('update:isActive', false);
  }
}
</script>
