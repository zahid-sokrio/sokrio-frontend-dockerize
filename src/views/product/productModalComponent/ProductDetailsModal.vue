<template>
  <modal :show="isActive" @close="close" size="lg" class="modal-dialog-scrollable">
    <div>
      <div class="row">
        <div class="col-md-12">
          <h2>{{ baseProduct.name }} | {{ baseProduct.sku }}
            <span v-if="baseProduct.is_free">(Free)</span> - <span
              :class="`text-${baseProduct.is_active ? 'success' : 'danger'}`"> ● </span> {{
              baseProduct.is_active ?
                'Active' :
                'Inactive'
            }}
          </h2>
          <small class="mt-2" v-if="baseProduct.usp"><b>{{ baseProduct.usp }}</b></small>
        </div>
      </div>
      <div class="row" style="margin-top: 15px">
        <div class="col-md-12">
              <span class="text-muted mb-0">
                Under <b v-if="baseProduct.product_brand">{{ baseProduct.product_brand.name }}</b> Brand and
                <b v-if="baseProduct.product_category">{{ baseProduct.product_category.name }}</b>
                Category. </span> <br/><br/>
          <span v-if="baseProduct.description"><b>Desc:</b> {{ baseProduct.description }}</span>
        </div>
        <div class="col-md-12">
          <hr>
          <h3>Product Batch</h3>
          <hr>
        </div>
        <div class="col-md-12">
          <ul class="list-group list-group-flush list my--3">
            <li class="list-group-item px-0"
                v-for="product in baseProduct.products"
                :key="product.id"
            >
              <div class="row align-items-center">
                <div class="col-auto">
                  <!-- Avatar -->
                  <a href="#" class="avatar rounded-circle">
                    <async-image v-if="product.image_url" v-slot="slotProps"
                                 :url="product.image_url">
                      <img :src="slotProps.imageSrc"/>
                    </async-image>
                    <i v-else class="ni ni-image"></i>
                  </a>
                </div>
                <div class="col ml--2">
                  <h4 class="mb-0">
                    <span v-if="product.batch">{{ product.batch.name }} </span>
                    <span v-if="product.variants.length > 0"> (
                        <span v-for="(variant,index) in product.variants" :key="variant.id">
                          <span>{{ variant.value }}</span><span v-if="product.variants.length > 1 &&
                          product.variants.length - 1 != index">, </span>
                        </span>
                      )</span> -
                    <span :class="`text-${product.active ? 'success' : 'danger'}`"> ● </span><span> {{
                      product.active ?
                        'Active' :
                        'Inactive'
                    }}</span>
                  </h4>
                  <span class="text-muted">Available only {{ product.qty }} pc at {{
                      product.mrp
                    }} MRP,
                    purchase price upto {{
                      product
                        .purchase_amount
                    }}</span>
                  <div class="mt-3" v-if="product.prices.length > 0">
                    <b>Prices: </b><br>
                    <b>Department Price - </b>
                    <span v-for="(price, index) in product.prices" :key="index">
                      <span v-if="price.priceable_type == 'dept'"> {{
                          departments.length > 0 ? departments.find(department => department.id ==
                            price.priceable_id).name : ''
                        }}: {{ price.price }}, </span></span><br>
                    <b>Channel Price - </b>
                    <span v-for="(price) in product.prices" :key="price.id">
                      <span v-if="price.priceable_type == 'depttype' && departmentTypes"> {{
                          departmentTypes.length > 0 ? departmentTypes.find(departmentType =>
                            departmentType.id == price.priceable_id).name : ''
                        }}: {{ price.price }}, </span>
                    </span>
                  </div>
                </div>
                <div class="col-auto">
                  <small v-if="product.mfg_date" style="color: #2dce89">MFG Date: {{
                      product.mfg_date | datetime('ll')
                    }}</small><br>
                  <small v-if="product.exp_date" style="color: palevioletred">Expires At: {{
                      product.exp_date | datetime('ll')
                    }}</small>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <template slot="footer">
      <base-button @click="close" type="secondary">Close</base-button>
    </template>
  </modal>
</template>
<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import BaseProduct from "@/intefaces/BaseProduct";
import Department from "@/intefaces/Department";
import DepartmentType from "@/intefaces/DepartmentType";
import AsyncImage from "@/components/AsyncImage.vue";

@Component({
  components: {
    AsyncImage
  }
})

export default class ProductDetailsModal extends Vue {
  @Prop() isActive!: boolean;
  @Prop() currentBaseProduct!: BaseProduct;
  private baseProduct: BaseProduct[] = [];
  private departments: Department[] = [];
  private departmentTypes: DepartmentType[] = [];

  async fetchBaseProduct() {
    await this.$http.get(this.$api(`/base-products/${this.currentBaseProduct.id}?with=productBrand,productCategory,products.batch,products.variants,products.prices`))
      .then(response => {
        this.baseProduct = response.data.baseProduct;
      })
  }

  async fetchDepartment() {
    await this.$http.get(this.$api(`/departments`)).then(response => {
      this.departments = response.data.departments;
    })
  }

  async fetchDepartmentType() {
    await this.$http.get(this.$api(`/department-types`)).then(response => {
      this.departmentTypes = response.data.departmentTypes;
    })
  }

  created() {
    this.fetchBaseProduct();
    this.fetchDepartment();
    this.fetchDepartmentType();
  }

  close() {
    this.$emit('update:isActive', false);
  }
}
</script>

