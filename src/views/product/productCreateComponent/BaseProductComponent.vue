<template>
  <div>
    <div class="row mb-1">
      <div class="col-md-12">
        <h3>Base Product</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <base-input label="Name" name="base product name" placeholder="e.g. Lux" prepend-icon="ni ni-basket"
                    v-model="productForm.name"
                    rules="required"></base-input>
      </div>
      <div class="col-md-6">
        <base-input label="SKU" name="sku" placeholder="e.g. Lux-001" prepend-icon="ni ni-basket" v-model="productForm.sku"
                    rules="required"></base-input>
      </div>
      <div class="col-md-6">
        <product-brand-lazydropdown
          label="Product Brand"
          placeholder="Select Brand"
          name="product brand"
          v-model="productForm.product_brand_id"
          rules="required"
        ></product-brand-lazydropdown>
      </div>
      <div class="col-md-6">
        <product-category-autocomplete
          placeholder="Select Category"
          label="Product Category"
          name="product category"
          v-model="productForm.product_category_id"
          rules="required"
        ></product-category-autocomplete>
      </div>
      <div class="col-md-6">
        <base-input label="Description (Optional)" name="description">
          <textarea class="form-control" placeholder="Product Description ..." rows="3" v-model="productForm.description"></textarea>
        </base-input>
      </div>
      <div class="col-md-6">
        <base-input label="USP (Optional)" name="usp">
          <textarea class="form-control" placeholder="Product USP ..." rows="3" v-model="productForm.usp"></textarea>
        </base-input>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import ProductLazydropdown from "@/components/lazyDropdown/ProductLazydropdown.vue";
import ProductBrandLazydropdown from '@/components/lazyDropdown/ProductBrandLazydropdown.vue';
import ProductCategoryAutocomplete from '@/components/lazyDropdown/ProductCategoryLazydropdown.vue';

@Component({
  components: {
    ProductLazydropdown,
    ProductBrandLazydropdown,
    ProductCategoryAutocomplete
  }
})

export default class BaseProductComponent extends Vue {
  @Prop() productForm!: any;
}
</script>
