<template>
    <lazy-dropdown :value="value" label="Assets" @input="$emit('input',$event)" searchable-key="name" end-point="assets" resource-key="assets">
        <template v-slot:createModal="{isActive, afterCreated}">
            <asset-form @created="afterCreated($event)" :is-active.sync="isActive"></asset-form>
        </template>
    </lazy-dropdown>
</template>
<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import LazyDropdown from "../LazyDropdown.vue";
    import DropdownField from "../../mixins/DropdownField";
    import AssetForm from "@/views/inspection/auditable/AssetForm.vue"
    @Component({
        components: {
            LazyDropdown,
            AssetForm
        }
    })
    export default class AssignAutocomplete extends Mixins(DropdownField) {
    }
</script>
