<template>
  <LazyDropdown :value="value" :multiple="true" label="Role" searchable-key="name" end-point="roles" resource-key="roles">
    <template v-slot:createModal="{ isActive }">
      <create-role @created="afterCreated($event)" :new-role.sync="isActive"></create-role>
    </template>
  </LazyDropdown>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import LazyDropdown from '../LazyDropdown.vue';

import CreateRole from '@/views/user/role/CreateRole.vue';
import DropdownField from '../../mixins/DropdownField';
@Component({
  components: {
    LazyDropdown,
    CreateRole
  }
})
export default class RoleAutocomplete extends Mixins(DropdownField) {
  afterCreated(row: any) {
    console.log(row);
  }
}
</script>
