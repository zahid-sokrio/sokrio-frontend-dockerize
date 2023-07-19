<template>
  <LazyDropdown :value="value" :label="label" @input="$emit('input',$event)" :rules="rules" searchable-key="name" end-point="badges" resource-key="badges" >
    <template v-slot:createModal="{ isActive, afterCreated }">
      <CreateBadgeForm @created="afterCreated($event)" :is-active.sync="isActive"></CreateBadgeForm>
    </template>
  </LazyDropdown>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import CreateBadgeForm from '@/views/department/CreateBadgeForm.vue';
import LazyDropdown from '@/components/LazyDropdown.vue';
import DropdownField from '@/mixins/DropdownField';

@Component({
  components: {
    LazyDropdown,
    CreateBadgeForm
  }
})
export default class BadgeAutocomplete extends Mixins(DropdownField) {}
</script>
