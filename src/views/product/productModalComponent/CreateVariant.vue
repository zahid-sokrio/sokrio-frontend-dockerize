<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <form class="needs-validation" @submit.prevent="handleSubmit(save)">
      <modal :show="isActive" @close="close" size="sm">
        <template slot="header">
          <h5 class="modal-title"
              id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add' }} Variants</h5>
        </template>
        <div>
          <variant-category-lazydropdown label="Variant Category" placeholder="Select Variants" rules="required"
                                         name="variant category" v-model="singleVariant.variant">
          </variant-category-lazydropdown>
          <base-input label="Value" name="value" type="text" v-model="singleVariant.value" rules="required"></base-input>
        </div>
        <template slot="footer">
          <base-button type="secondary" @click="close">Close</base-button>
          <base-button @click="handleSubmit(save)">Save</base-button>
        </template>
      </modal>
    </form>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {Dropdown, DropdownItem, DropdownMenu, Upload} from 'element-ui';
import VariantCategory from "@/intefaces/VariantCategory";
import VariantCategoryLazydropdown from "@/components/lazyDropdown/VariantCategoryLazydropdown.vue";

@Component({
  [Dropdown.name]: Dropdown,
  [DropdownItem.name]: DropdownItem,
  [DropdownMenu.name]: DropdownMenu,
  components: {
    VariantCategoryLazydropdown
  }
})
export default class CreateVariant extends Vue {
  @Prop() isActive!: boolean;
  @Prop() singleVariant!: any;
  @Prop() isUpdate!: boolean;
  @Prop() product!: any;
  @Prop() currentProductVariant!: any;


  async createVariant() {
    let productBrandId = '';
    await this.$http.get(this.$api(`/base-products/${this.product.base_product_id}`)).then(response => {
      productBrandId = response.data.baseProduct.product_brand_id;
    })
    this.$http
      .post(this.$api('/product-variants'), {
        product_id: this.product.id,
        variant_category_id: this.singleVariant.variant,
        value: this.singleVariant.value,
        product_brand_id: productBrandId
      })
      .then(response => {
        this.$emit('addVariant', response.data.productVariant);
        this.notification('Success', 'Successfully Created', 'success')
        this.$emit('update:singleVariant', {variant: '', value: ''});
        this.$emit('update:isActive', false);
      })
      .catch(error => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  async updateVariant() {
    let productBrandId = '';
    await this.$http.get(this.$api(`/base-products/${this.product.base_product_id}`)).then(response => {
      productBrandId = response.data.baseProduct.product_brand_id;
    })
    this.$http
      .patch(this.$api(`/product-variants/${this.currentProductVariant.id}`), {
        product_id: this.product.id,
        variant_category_id: this.singleVariant.variant,
        value: this.singleVariant.value,
        product_brand_id: productBrandId
      })
      .then(response => {
        this.$emit('updateVariant', response.data.productVariant);
        this.$emit('update:singleVariant', {variant: '', value: ''});
        this.notification('Success', 'Successfully Updated', 'success')
      })
      .catch(error => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  notification(title: string, message: string, type: "success" | "warning" | "info" | "error" | undefined) {
    this.$notify({
      title: title,
      message: message,
      duration: 3000,
      iconClass: 'ni ni-bell-55',
      type: type
    });
  }

  save() {
    this.isUpdate ? this.updateVariant() : this.createVariant();
  }

  close() {
    this.$emit('update:isActive', false);
  }
}
</script>
