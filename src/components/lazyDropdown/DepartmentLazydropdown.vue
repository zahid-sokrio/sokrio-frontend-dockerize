<template>
  <lazy-dropdown :value="value" :rules="rules" :name="name" :placeholder="placeholder" :disabled="disabled"
                 :label="label" @input="$emit('input', $event)" :multiple="multiple" searchable-key="name"
                 :end-point="endPoint" resource-key="departments">
    <template v-if="createButton" v-slot:createModal="{isActive, afterCreated}">
      <createDepartmentForm v-if="isActive" @created="afterCreated($event)" :is-active.sync="isActive"></createDepartmentForm>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import LazyDropdown from "../LazyDropdown.vue";
import DropdownField from "../../mixins/DropdownField";
import CreateDepartmentForm from "@/views/department/CreateDepartmentForm.vue";

    @Component({
        components: {
            LazyDropdown,
            CreateDepartmentForm
        }
    })
    export default class DepartmentLazydropdown extends Mixins(DropdownField) {
        @Prop({default:'departments'})
        endPoint!:string;
        @Prop({default: false})
        disabled!: boolean;
    }
</script>
