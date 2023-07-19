<template>
  <lazy-dropdown :label="label" :placeholder="placeholder" :value="value" @input="$emit('input', $event)"
                 searchable-key="name" end-point="batches" resource-key="batches" :rules="rules" :name="name">
    <template v-slot:createModal="{isActive, afterCreated}">
      <create-batch v-if="isActive" @created="afterCreated($event)" :is-active.sync="isActive"></create-batch>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import LazyDropdown from "../LazyDropdown.vue";
import DropdownField from "../../mixins/DropdownField";
import CreateBatch from "@/views/product/CreateBatch.vue";
    @Component({
        components: {
            LazyDropdown,
            CreateBatch
        }
    })
    export default class DepartmentTypeLazydropdown extends Mixins(DropdownField) {
    }
</script>
