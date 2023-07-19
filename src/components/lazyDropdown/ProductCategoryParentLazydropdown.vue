<template>
    <lazy-dropdown :value="value" :label="label" :placeholder="placeholder" @input="$emit('input', $event)" searchable-key="name" end-point="product-categories" resource-key="productCategories">
    </lazy-dropdown>
</template>
<script lang="ts">
    import {Component, Mixins, Prop} from "vue-property-decorator";
    import LazyDropdown from "../LazyDropdown.vue";
    import DropdownField from "../../mixins/DropdownField";
    @Component({
        components: {
            LazyDropdown,
        }
    })
    export default class ProductCategoryParentLazydropdown extends Mixins(DropdownField) {
    }
</script>
