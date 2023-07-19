<template>
  <lazy-dropdown :value="value" :label="label" :placeholder="placeholder" :multiple="multiple" @input="$emit('input', $event)" searchable-key="q" end-point="users?can=checkin"  resource-key="users">
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
  export default class RoutePlanProposalLazyDropdown extends Mixins(DropdownField) {
  }
</script>
