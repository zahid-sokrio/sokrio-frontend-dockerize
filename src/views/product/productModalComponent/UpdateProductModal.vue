<template>
  <div>
    <validation-observer ref="formValidator" v-slot="{ handleSubmit }">
      <modal :show="isActive" @close="close" size="lg">
        <template slot="header">
          <h5 class="modal-title" id="exampleModalLabel">Update Product</h5>
        </template>
        <div class="row">
          <div class="col-md-6">
            <base-input label="Name" name="name" placeholder="e.g. Lux" v-model="form.name" rules=
              'required' prepend-icon="ni ni-basket"></base-input>
          </div>
          <div class="col-md-6">
            <base-input label="SKU" name="sku" placeholder="e.g. SKU-1234" v-model="form.sku" rules=
              'required' prepend-icon="fab fa-codepen"></base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <product-brand-lazydropdown
              label="Product Brand"
              placeholder="Select Brand"
              v-model="form.productBrandId"
              name="product_brand_id"
              rules='required'
            ></product-brand-lazydropdown>
          </div>
          <div class="col-md-6">
            <product-category-autocomplete
              placeholder="Select Category"
              label="Product Category"
              v-model="form.productCategoryId"
              name="product_category_id"
              rules='required'
            ></product-category-autocomplete>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <base-input label="Description (Optional)" name="description">
              <textarea class="form-control" placeholder="Product Description ..." rows="3"
                        v-model="form.description"></textarea>
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input label="USP (Optional)" name="usp">
              <textarea class="form-control" placeholder="Product USP ..." rows="3" v-model="form.usp"></textarea>
            </base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <base-input label="Units (Required)" name="units">
              <base-button @click="showUnitModal = true">Units</base-button>
            </base-input>
          </div>
        </div>
        <template slot="footer">
          <base-button type="secondary" @click="close">Close</base-button>
          <base-button @click="handleSubmit(updateProduct)" type="success" :disabled="disableButton">Save</base-button>
        </template>
      </modal>
    </validation-observer>
    <product-unit-modal v-if="showUnitModal" :show-unit-modal.sync="showUnitModal"
                        :product="currentProduct" :units.sync="form.units"></product-unit-modal>
  </div>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import ProductBrandLazydropdown from '@/components/lazyDropdown/ProductBrandLazydropdown.vue';
import ProductCategoryAutocomplete from '@/components/lazyDropdown/ProductCategoryLazydropdown.vue';
import ProductUnitModal from "@/views/product/productModalComponent/ProductUnitModal.vue";

@Component({
  components: {
    ProductUnitModal,
    ProductBrandLazydropdown,
    ProductCategoryAutocomplete
  }
})
export default class UpdateProductModal extends Vue {
  @Prop() currentProduct!: any;
  @Prop() isActive!: boolean;
  @Prop({
    default: () => ({
      name: '',
      is_free: false,
      productBrandId: '',
      productCategoryId: '',
      description: '',
      usp: '',
      sku: '',
      units: [],
    })
  })
  form!: {
    name: string;
    productBrandId: any;
    productCategoryId: any;
    description: string;
    usp: string;
    sku: string;
    units: Array<Object>;
  };
  private loading = true;
  private showUnitModal = false;
  private disableButton = false;

  formReset() {
    this.form.name = '';
    this.form.productBrandId = '';
    this.form.productCategoryId = '';
    this.form.description = '';
    this.form.usp = '';
    this.form.sku = '';
    this.form.units = [];
    this.disableButton = false;
  }

  updateProduct() {
    this.disableButton = true;
    this.$http.patch(this.$api(`/base-products/${this.currentProduct.id}`), {
      name: this.form.name,
      sku: this.form.sku,
      product_brand_id: this.form.productBrandId,
      product_category_id: this.form.productCategoryId,
      description: this.form.description,
      usp: this.form.usp,
      units: this.form.units,
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
        this.formReset();
        this.$nextTick(() => {
          (this.$refs.formValidator as HTMLFormElement).reset();
        });
      })
      .catch(error => {
        this.disableButton = false;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  close() {
    this.$parent.$emit('update:isActive', false);
    this.$emit('update:isActive', false);
    this.$emit('update:form', {
      name: '',
      productBrandId: '',
      productCategoryId: '',
      description: '',
      usp: '',
      sku: '',
      units: []
    });
    this.disableButton = false;
  }
}
</script>
