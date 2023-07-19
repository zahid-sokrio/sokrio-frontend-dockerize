<template>
  <lazy-dropdown cle :value="value" :add-button="addButton" :placeholder="placeholder" :multiple="multiple"
                 :disabled="disabled" :label="label" :name="name" :rules="rules" @input="$emit('input', $event)"
                 searchable-key="name" end-point="product-brands" resource-key="productBrands" :collapseTags="true">
    <template v-slot:createModal="{isActive, afterCreated}">
      <brand-form @created="afterCreated($event)" :is-active.sync="isActive"></brand-form>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import LazyDropdown from "../LazyDropdown.vue";
import DropdownField from "../../mixins/DropdownField";
import BrandForm from '@/components/products/BrandForm.vue';

    @Component({
        components: {
            LazyDropdown,
            BrandForm
        }
    })
    export default class ProductBrandLazydropdown extends Mixins(DropdownField) {
        @Prop() addButton!: boolean;
        @Prop() disabled!: boolean;
    }
</script>
