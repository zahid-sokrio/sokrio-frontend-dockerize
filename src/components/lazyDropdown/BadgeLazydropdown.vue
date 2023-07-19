<template>
  <lazy-dropdown :label="label" :placeholder="placeholder" :value="value" @input="$emit('input', $event)"
                 searchable-key="name" end-point="badges" resource-key="badges" :rules="rules" :name="name">
    
  </lazy-dropdown>
</template>
<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import LazyDropdown from "../LazyDropdown.vue";
import DropdownField from "../../mixins/DropdownField";
    @Component({
        components: {
            LazyDropdown,
        }
    })
    export default class BadgeLazydropdown extends Mixins(DropdownField) {
    }
</script>
