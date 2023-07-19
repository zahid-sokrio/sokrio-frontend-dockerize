<template>
  <lazy-dropdown :rules="rules" :value="value" :add-button="addButton" :placeholder="placeholder" :label="label"
                 :multiple="multiple" :name="name" @input="$emit('input',$event)" searchable-key="name"
                 end-point="variant-categories?except_name=default" resource-key="variantCategories">
    <template v-slot:createModal="{isActive, afterCreated}">
      <variant-category-form @created="afterCreated($event)" :is-active.sync="isActive"></variant-category-form>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import LazyDropdown from "../LazyDropdown.vue";
import DropdownField from "../../mixins/DropdownField";
import VariantCategoryForm from "@/components/products/VariantCategoryForm.vue";
import VariantCategory from "@/intefaces/VariantCategory";

@Component({
  components: {
    LazyDropdown,
    VariantCategoryForm
  }
})
export default class VariantCategoryLazydropdown extends Mixins(DropdownField) {
  @Prop() addButton!: boolean;
}
</script>
