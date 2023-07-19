<template>
  <lazy-dropdown :add-button="addButton" :placeholder="placeholder" :label="label" :value="value" :name="name" :multiple="multiple"
                 @input="$emit('input', $event)" searchable-key="name" end-point="roles" resource-key="roles">
    <template v-slot:createModal="{isActive, afterCreated}">
      <create-role v-if="isActive" @created="afterCreated($event)" :new-role.sync="isActive"></create-role>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import LazyDropdown from "../LazyDropdown.vue";
import DropdownField from "../../mixins/DropdownField";
import CreateRole from "@/views/user/role/CreateRole.vue";

@Component({
  components: {
    LazyDropdown,
    CreateRole
  }
})
export default class RoleLazydropdown extends Mixins(DropdownField) {
  @Prop({default: true}) addButton!: boolean;
}
</script>
