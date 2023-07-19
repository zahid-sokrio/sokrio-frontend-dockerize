<template>
  <lazy-dropdown :label="label" :placeholder="placeholder" :name="name" :value="value" :rules="rules"
                 @input="$emit('input', $event)" searchable-key="name" end-point="department-types"
                 resource-key="departmentTypes">
    <template v-slot:createModal="{isActive, afterCreated}">
      <create-channel-form v-if="isActive" @created="afterCreated($event)" :is-active.sync="isActive"></create-channel-form>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import LazyDropdown from "../LazyDropdown.vue";
import DropdownField from "../../mixins/DropdownField";
import CreateChannelForm from "@/views/department/CreateChannelForm.vue";
    @Component({
        components: {
            LazyDropdown,
            CreateChannelForm
        }
    })
    export default class DepartmentTypeLazydropdown extends Mixins(DropdownField) {
    }
</script>
