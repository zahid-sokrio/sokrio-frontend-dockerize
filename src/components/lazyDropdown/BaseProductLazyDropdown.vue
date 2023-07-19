<template>
  <lazy-dropdown
    :collapseTags="collapseTags"
    :value="value"
    :multiple="multiple"
    :rules="rules"
    :name="name"
    :placeholder="placeholder"
    :disabled="disabled"
    :label="label"
    @input="$emit('input', $event)"
    searchable-key="name"
    end-point="base-products"
    resource-key="products">
  </lazy-dropdown>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import LazyDropdown from '../LazyDropdown.vue';
import DropdownField from '../../mixins/DropdownField';
@Component({
  components: {
    LazyDropdown
  }
})
export default class BaseProductLazydropdown extends Mixins(DropdownField) {
  @Prop({ default: 'base-products' })
  endPoint!: string;
  @Prop({ default: false })
  disabled!: boolean;
} 
</script>
