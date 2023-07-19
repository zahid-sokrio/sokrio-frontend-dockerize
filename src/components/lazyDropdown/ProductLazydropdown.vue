<template>
  <lazy-dropdown :value="value" :multiple="multiple" :add-button="addButton" :label="label" :placeholder="placeholder"
                 @input="$emit('input', $event)" searchable-key="name" :disabled="disabled" :end-point="endPoint"
                 resource-key="products" :item-text="itemText" :item-sub-text="itemSubText" :item-value="itemValue"
                 :collapseTags="true"
                 :rules="rules" :name="name">
  </lazy-dropdown>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import LazyDropdown from "../LazyDropdown.vue";
import AddProduct from "@/views/product/AddProduct.vue"
import DropdownField from "../../mixins/DropdownField";

  @Component({
    components: {
      LazyDropdown,
      AddProduct
    }
  })
  export default class ProductLazydropdown extends Mixins(DropdownField) {
    @Prop() endPoint!: string;
    @Prop() disabled!: boolean;
    @Prop({default: true}) addButton!: boolean;
    @Prop({default: false}) multiple!: boolean;
    @Prop({default: 'name'}) itemText!: string;
    @Prop({default: ''}) itemSubText!: string;
    @Prop({ default: 'id' }) itemValue!: string;
  }
</script>
