<template>
  <lazy-dropdown
    :value="value"
    :multiple="multiple"
    :add-button="addButton"
    :label="label"
    :placeholder="placeholder"
    @input="$emit('input', $event)"
    searchable-key="name"
    :disabled="disabled"
    :end-point="endPoint"
    resource-key="stocks"
    :item-text="itemText"
    :item-sub-text="itemSubText"
    :item-value="itemValue"
    :api-version="apiVersion"
  >
    <!--    <template v-slot:createModal="{ isActive, afterCreated }">-->
    <!--      <add-product v-if="isActive" @created="afterCreated($event)" :is-active.sync="isActive"></add-product>-->
    <!--    </template>-->
  </lazy-dropdown>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import LazyDropdown from '../LazyDropdown.vue';
import AddProduct from '@/views/product/AddProduct.vue';
import DropdownField from '../../mixins/DropdownField';

@Component({
  components: {
    LazyDropdown,
    AddProduct
  }
})
export default class StockLazydropdown extends Mixins(DropdownField) {
  @Prop() endPoint!: string;
  @Prop() disabled!: boolean;
  @Prop({ default: true }) addButton!: boolean;
  @Prop({ default: 'name' }) itemText!: string;
  @Prop({ default: '' }) itemSubText!: string;
  @Prop({ default: 'id' }) itemValue!: string;
  @Prop({ default: 1 })  apiVersion!: number;

}
</script>
