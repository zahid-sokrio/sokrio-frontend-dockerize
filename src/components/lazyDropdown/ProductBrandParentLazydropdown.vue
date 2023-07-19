<template>
    <lazy-dropdown :value="value" :placeholder="placeholder" :label="label" @input="$emit('input', $event)" searchable-key="name" end-point="product-brands" resource-key="productBrands">
    </lazy-dropdown>
</template>
<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import LazyDropdown from "../LazyDropdown.vue";
    import DropdownField from "../../mixins/DropdownField";
    import BrandForm from '@/components/products/BrandForm.vue';

    @Component({
        components: {
            LazyDropdown,
            BrandForm
        }
    })
    export default class ProductBrandParentLazydropdown extends Mixins(DropdownField) {
    }
</script>
