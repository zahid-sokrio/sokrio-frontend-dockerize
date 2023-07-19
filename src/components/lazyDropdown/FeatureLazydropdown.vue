<template>
  <lazy-dropdown
    :value="value"
    :placeholder="placeholder"
    :label="label"
    :multiple="multiple"
    @input="$emit('input', $event)"
    searchable-key="name"
    end-point="features"
    resource-key="features"
    landlord="true"
    itemText="title"
  >
    <template v-slot:createModal="{ isActive, afterCreated }">
      <create-feature-form @created="afterCreated($event)" :is-active.sync="isActive"></create-feature-form>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import LazyDropdown from '../LazyDropdown.vue';
import DropdownField from '../../mixins/DropdownField';
import CreateFeatureForm from '@/views/admin/subscription/feature/CreateFeatureForm.vue';

@Component({
  components: {
    LazyDropdown,
    CreateFeatureForm,
  },
})
export default class FeatureLazydropdown extends Mixins(DropdownField) {}
</script>
