<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <modal :show="isActive" @close="close" class="modal-dialog-scrollable">
      <template slot="header">
        <h5 class="modal-title"
            id="exampleModalLabel">View Product Price</h5>
      </template>
      <div>
        <div class="col-md-12 text-right" style="margin-bottom: 8px">
          <el-tooltip content="Add Product Price" placement="top" class="ml-3">
            <base-button size="sm" type="primary" icon @click="isActiveCreateProductPrice = true">
              <span class="btn-inner--icon"><i class="fas fa-plus"></i></span>
              <span class="btn-inner--text"> Add </span>
            </base-button>
          </el-tooltip>
        </div>
        <el-table
            v-loading="loading"
            :data="productPrices"
            class="table-responsive align-items-center"
        >
          <el-table-column label="Name" min-width="100px" sortable>
            <template v-slot="{ row }">
              <span v-if="row.priceable_type == 'depttype'">
                <span v-if="departmentTypes">
                  {{
                    departmentTypes.find(type => type.id === row.priceable_id) ? departmentTypes.find(type => type.id
                        === row.priceable_id).name : 'Not Found'
                  }}</span>
              </span>
              <span v-else>
                <span v-if="departments">
                  {{
                    departments.find(type => type.id == row.priceable_id) ? departments.find(type => type.id ==
                        row.priceable_id).name : 'Not Found'
                  }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Type" min-width="100px" sortable>
            <template v-slot="{ row }">
              {{ row.priceable_type == 'depttype' ? 'Channel' : 'Department' }}
            </template>
          </el-table-column>
          <el-table-column label="Old Price" min-width="115px" align="center" sortable>
            <template v-slot="{ row }">
              <span style="color:red">{{ row.old_price > 0 ? row.old_price: 'N/A'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Price Now" min-width="120x" align="center" sortable>
            <template v-slot="{ row }">
              <strong style="color:green">{{ row.price}}</strong>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="70px">
            <div slot-scope="{ row }" class="table-actions">
              <el-tooltip content="Update Product Price" placement="top">
                <a class="table-action" data-original-title="Update product price" data-toggle="tooltip"
                   @click.prevent="onEdit(row)" href="#!">
                  <i class="fas fa-edit"></i>
                </a>
              </el-tooltip>
              <el-tooltip content="Delete Product Price" placement="top">
                <a class="table-action" @click.prevent="showDeleteModal = true, currentProductPrice = row"
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
            <base-button type="secondary" @click.prevent="showDeleteModal = false">Close</base-button>
            <base-button type="danger" @click.prevent="onDelete">Delete</base-button>
          </template>
        </modal>

      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
      </template>
    </modal>
    <create-product-price
        v-if="isActiveCreateProductPrice"
        :is-active.sync="isActiveCreateProductPrice"
        :is-update.sync="isUpdateProductPrice"
        :single-price.sync="singlePrice"
        :department-types.sync="departmentTypes"
        :departments.sync="departments"
        :is-update-single-product-price.sync="isUpdateProductPrice"
        :current-product-id="product.id"
        :current-product-price="currentProductPrice"
        @addPrice="addPrice"
        @updatePrice="updatePrice"
    ></create-product-price>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import DepartmentType from "@/intefaces/DepartmentType";
import CreateProductPrice from "@/views/product/productModalComponent/CreateProductPrice.vue";

@Component({
  name: 'viewProductPrice',
  components: {
    CreateProductPrice
  }
})
export default class ViewProductPrice extends Vue {
  @Prop() isActive!: boolean;
  @Prop() isUpdate!: boolean;
  @Prop() product!: any;
  private departments: any[] = [];
  private departmentTypes: DepartmentType[] = [];
  private isActiveCreateProductPrice = false;
  private isUpdateProductPrice: boolean = false;
  private productPrices: any[] = [];
  private currentProductPrice: any = [];
  private showDeleteModal: boolean = false;
  private loading: boolean = false;
  private singlePrice = {
    priceable_id: '',
    price: '',
    priceable_type: '',
  };

  onDelete() {
    this.$http.delete(this.$api(`/product-prices/${this.currentProductPrice.id}`)).then(response => {
      this.showDeleteModal = false;
      this.productPrices.splice(this.productPrices.findIndex(price => price.id == this.currentProductPrice.id),
          1)
      this.$notify({
        title: 'Success',
        message: 'Successfully Deleted',
        duration: 3000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
    })
  }

  updatePrice(event: any) {
    this.productPrices.splice(this.productPrices.findIndex((price: any) => price.id == event.id),
        1, event);
  }

  addPrice(event: any) {
    this.productPrices.unshift(event);
  }

  onEdit(row: any) {
    this.currentProductPrice = row;
    this.singlePrice = {
      priceable_id: this.currentProductPrice.priceable_id,
      price: this.currentProductPrice.price,
      priceable_type: this.currentProductPrice.priceable_type,
    }
    this.isUpdateProductPrice = true;
    this.isActiveCreateProductPrice = true;
  }

  fetchDepartmentType() {
    this.$http.get(this.$api('/department-types')).then(response => {
      this.departmentTypes = response.data.departmentTypes;
    });
  }

  fetchDepartment() {
    this.$http.get(this.$api('/departments')).then(response => {
      this.departments = response.data.departments;
    });
  }

  fetchProductPrice() {
    this.loading = true;
    this.$http.get(this.$api(`/products/${this.product.id}?with=prices`)).then(response => {
      this.productPrices = response.data.product.prices;
      this.loading = false;
    })
  }

  created() {
    this.fetchDepartment();
    this.fetchDepartmentType();
    this.fetchProductPrice();
  }

  close() {
    this.$emit('update:isActive', false);
    this.$emit('update:isAUpdate', false);
    this.$emit('update:variant', {variantValues: [], variantCategories: [], departmentTypes: [], prices: [], departmentId: []})
  }
}
</script>

<style lang="css">
.disabled-color{
  background-color: rgb(205, 205, 205);
}
</style>
