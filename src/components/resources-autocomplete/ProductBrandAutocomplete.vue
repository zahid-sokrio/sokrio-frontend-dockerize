<template>
  <lazy-dropdown :value="value" label="Product" searchable-key="name" end-point="product-brands" resource-key="productBrands">
    <template v-slot:createModal="{ isActive, afterCreated }">
      <brand-form @created="afterCreated($event)" :is-active.sync="isActive"></brand-form>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Mixins } from 'vue-property-decorator';
import LazyDropdown from '../LazyDropdown.vue';
import BrandForm from '@/components/products/BrandForm.vue';
import DropdownField from '@/mixins/DropdownField';
@Component({
  components: {
    LazyDropdown,
    BrandForm,
  },
})
export default class ProductBrandAutocomplete extends Mixins(DropdownField) {}
</script>
