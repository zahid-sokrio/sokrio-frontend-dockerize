<template>
  <lazy-dropdown :value="value" :add-button="addButton" :placeholder="placeholder" :disabled="disabled" :label="label"
                 :name="name" :rules="rules" :multiple="multiple" @input="$emit('input', $event)" searchable-key="name"
                 end-point="product-categories" resource-key="productCategories" :collapseTags="true">
    <template v-slot:createModal="{isActive, afterCreated}">
      <category-form @created="afterCreated($event)" :is-active.sync="isActive"></category-form>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import LazyDropdown from "../LazyDropdown.vue";
import DropdownField from "../../mixins/DropdownField";
import CategoryForm from "@/components/products/CategoryForm.vue";

@Component({
  components: {
    LazyDropdown,
    CategoryForm
  }
})
export default class ProductCategoryLazydropdown extends Mixins(DropdownField) {
  @Prop() addButton!: boolean;
  @Prop() disabled!: boolean;
}
</script>
