<template>
    <lazy-dropdown :value="value" :placeholder="placeholder" :multiple="true" :label="label" @input="$emit('input', $event)" searchable-key="name" :end-point="'departments?has_outlet=1'" resource-key="departments">
        <template v-slot:createModal="{isActive, afterCreated}">
            <create-department-form v-if="isActive" @created="afterCreated($event)" :is-active.sync="isActive"></create-department-form>
        </template>
    </lazy-dropdown>
</template>
<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import LazyDropdown from "../LazyDropdown.vue";
    import CreateDepartmentForm from "@/views/department/CreateDepartmentForm.vue";
    import DropdownField from "../../mixins/DropdownField";

    @Component({
        components: {
            LazyDropdown,
            CreateDepartmentForm
        }
    })
    export default class OutletLazydropdown extends Mixins(DropdownField) {
    }
</script>
