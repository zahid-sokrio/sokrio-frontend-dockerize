<template>
  <lazy-dropdown :value="value" :label="label" :disabled="disabled" :multiple="multiple" :add-button="addButton"
                 :has-all-option="hasAllOption" :placeholder="placeholder" @input="$emit('input', $event)"
                 :searchable-key="searchableKey" :end-point="endPoint" resource-key="territories" :rules="rules"
                 :name="name">
    <template v-slot:createModal="{isActive, afterCreated}">
      <CreateNewTerritoryForm @created="afterCreated($event)" :is-active.sync="isActive"></CreateNewTerritoryForm>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import LazyDropdown from "../LazyDropdown.vue";
import DropdownField from "../../mixins/DropdownField";

@Component({
  components: {
    LazyDropdown,
    CreateNewTerritoryForm: () => import('@/views/territory/CreateTerritoryForm.vue'),
  }
})
export default class TerritoryLazydropdown extends Mixins(DropdownField) {
  @Prop({default: 'territories'}) endPoint!: string;
  @Prop({default: 'name'}) searchableKey!: string;
  @Prop({default: true}) addButton!: boolean;
  @Prop({default: false}) hasAllOption!: boolean
  @Prop({default: false}) multiple!: boolean;
  @Prop({default: false}) disabled!: boolean;
}
</script>
