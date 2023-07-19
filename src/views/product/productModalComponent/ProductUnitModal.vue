<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <modal :show="showUnitModal" @close="close" class="modal-dialog-scrollable" size="lg">
      <template slot="header">
        <h5 class="modal-title">Product Units</h5>
      </template>
      <div>
        <product-unit-component v-if="isProductUnitAvailable" :product-units.sync="productUnits" :product="product"
                                :is-update="isUpdate"></product-unit-component>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" @click="handleSubmit(save)">Save</base-button>
      </template>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ProductUnitComponent from "@/views/product/productCreateComponent/ProductUnitComponent.vue";

@Component({
  components: {
    ProductUnitComponent
  }
})
export default class ProductUnitModal extends Vue {
  @Prop() isActive!: boolean;
  @Prop() product!: any;
  @Prop() units!: any;
  @Prop() showUnitModal!: boolean;
  private productUnits: any[] = [];
  private loading: boolean = false;
  private isUpdate: boolean = true;
  private isProductUnitAvailable: boolean = false;


  fetchProductUnits() {
    this.loading = true;
    this.$http.get(this.$api(`/base-products/${this.product.id}?with=units`)).then(response => {
      this.productUnits = JSON.parse(response.data.baseProduct.units) ?? [];
      this.isProductUnitAvailable = true;
      this.loading = false;
    })
  }

  save() {
    this.$http.patch(this.$api(`/base-products/${this.product.id}`), {
      units: this.productUnits,
      name: this.product.name,
      product_brand_id: this.product.product_brand_id,
      product_category_id: this.product.product_category_id,
      sku: this.product.sku
    })
      .then(response => {
        this.$emit('updated', response.data.baseProduct);
        this.$notify({
          title: 'Success',
          message: 'Successfully Updated',
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.$nextTick(() => {
          (this.$refs.formValidator as HTMLFormElement).reset();
        });
      })
      .catch(error => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      }).finally(()=>{
      this.close();
    });
  }

  created() {
    this.fetchProductUnits();
  }

  close() {
    this.$emit('update:units', this.productUnits);
    this.$emit('update:showUnitModal', false);
  }
}
</script>
