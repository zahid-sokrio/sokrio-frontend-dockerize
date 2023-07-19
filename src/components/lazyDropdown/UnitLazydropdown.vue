<template>
  <lazy-dropdown :rules="rules" :value="value" :add-button="addButton" :placeholder="placeholder" :label="label"
                 :multiple="multiple" :name="name" @input="$emit('input',$event)" searchable-key="name"
                 end-point="units" resource-key="units" item-value="name">
    <template v-slot:createModal="{isActive, afterCreated}">
      <unit-form @created="afterCreated($event)" :is-active.sync="isActive"></unit-form>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import LazyDropdown from "../LazyDropdown.vue";
import DropdownField from "../../mixins/DropdownField";
import UnitForm from "@/components/products/UnitForm.vue";

@Component({
  components: {
    LazyDropdown,
    UnitForm
  }
})
export default class UnitCategoryLazydropdown extends Mixins(DropdownField) {
  @Prop() addButton!: boolean;
}
</script>
