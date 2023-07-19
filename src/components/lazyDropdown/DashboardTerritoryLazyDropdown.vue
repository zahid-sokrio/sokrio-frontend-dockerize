<template>
    <lazy-dropdown :value="value" :label="label" :placeholder="placeholder" @input="$emit('input', $event)" searchable-key="name" :end-point="endPoint" resource-key="territories">
    </lazy-dropdown>
</template>
<script lang="ts">
    import {Component, Mixins, Prop} from "vue-property-decorator";
    import LazyDropdown from "../LazyDropdown.vue";
    import DropdownField from "../../mixins/DropdownField";
    import CreateTerritoryForm from "@/views/territory/CreateTerritoryForm.vue";
    @Component({
        components: {
            LazyDropdown,
        }
    })
    export default class TerritoryLazydropdown extends Mixins(DropdownField) {
        @Prop() endPoint!: string;
    }
</script>
