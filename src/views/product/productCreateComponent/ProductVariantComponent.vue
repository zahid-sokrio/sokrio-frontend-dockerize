<template>
  <div>
    <div class="row mb-1">
      <div class="col-md-12">
        <h3>Product Variant (Optional)</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-md-5">
        <variant-category-lazydropdown v-model="singleVariant.variant" label="Variant Category"
                                       placeholder="Select Variants" @newCreatedEntity="newCreatedEntity($event)">
        </variant-category-lazydropdown>
      </div>
      <div class="col-md-5">
        <base-input v-model="singleVariant.value" label="Value" name="value" type="text"></base-input>
      </div>
      <div class="col-md-2 text-right" style="margin-top:20px;">
        <el-tooltip :content="disabled ?
        'Fill up necessary field to enable this button, then click this button to add product variant in the list, ' +
        'only listed variant will be assigned for this product.' :
        'Click this button, to add product variant in the below list, only listed variant will be assigned for this product.'"
                    placement="top">
          <div style="display: inline-block;">
            <base-button type="success" @click="saveProductVariant()" :disabled="disabled">
            <span class="btn-inner--icon">
              <i class="fas fa-check-circle"></i>
            </span>
            </base-button>
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="col-md-12" v-if="variantError">
      <span class="text-warning text-sm">Error: This variant has already been added!</span>
    </div>
    <div class="col-md-12">
      <span v-if="productVariants.length <= 0" class="text-center"><h4>No product variant selected.</h4></span>
      <span class="mr-4" v-for="(productVariant, index) in productVariants" :key="index">
          <b>{{ variantCategories.find(variantCategory => variantCategory.id == productVariant.variant).name }}
          :</b> {{ productVariant.value }}
          <el-tooltip content="Delete" placement="top">
                <base-button size="sm" type="danger"
                             @click="deleteVaraint(index)"><i class="fas fa-times"/></base-button>
          </el-tooltip>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator';
import VariantCategoryLazydropdown from "@/components/lazyDropdown/VariantCategoryLazydropdown.vue";
import VariantCategory from "@/intefaces/VariantCategory";

@Component({
  components: {
    VariantCategoryLazydropdown,
  }
})
export default class ProductVariantComponent extends Vue {
  @Prop() productVariants!: any;
  private disabled = true;
  private variantError = false;
  private variantCategories: VariantCategory[] = []
  private singleVariant = {
    value: '',
    variant: '',
    id: '',
  }

  @Watch('singleVariant', {deep: true})
  enableAddButton() {
    if (this.singleVariant.value && this.singleVariant.variant) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }

  singleVariantReset() {
    this.singleVariant.value = '';
    this.singleVariant.variant = '';
  }

  deleteVaraint(index: number) {
    this.productVariants.splice(index, 1);
  }

  saveProductVariant() {
    if (this.productVariants.length > 0) {
      if (this.productVariants.find((element: any) => element.variant == this.singleVariant.variant)) {
        this.variantError = true;
      } else {
        this.productVariants.push({...this.singleVariant});
        this.singleVariantReset();
        this.variantError = false;
      }
    } else {
      this.productVariants.push({...this.singleVariant});
      this.singleVariantReset();
    }
  }

  newCreatedEntity(event: VariantCategory) {
    this.variantCategories.unshift(event);
  }


  fetchVariantCategory() {
    this.$http.get(this.$api('/variant-categories')).then(response => {
      this.variantCategories = response.data.variantCategories;
    })
  }

  created() {
    this.fetchVariantCategory();
  }
}
</script>
