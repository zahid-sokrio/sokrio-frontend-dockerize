<template>
  <LazyDropdown
    :value="value"
    :name="name"
    :label="label"
    @input="$emit('input', $event)"
    :multiple="multiple"
    searchable-key="q"
    end-point="route-plans"
    resource-key="routePlans"
    :placeholder="placeholder"
    :add-button="addButton"
    :rules="rules"
  >
    <template v-slot:createModal="{ isActive, afterCreated }">
      <RoutePlanForm v-if="isActive" @created="afterCreated($event)" :is-active.sync="isActive"></RoutePlanForm>
    </template>
  </LazyDropdown>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator';
import { Select, Option } from 'element-ui';
import Territory from '@/intefaces/Territory';
import DropdownField from '@/mixins/DropdownField';
import LazyDropdown from '@/components/LazyDropdown.vue';
import RoutePlanForm from "@/components/tracking/RoutePlanForm.vue";

@Component({
  components: {
    LazyDropdown,
    RoutePlanForm,
    [Select.name]: Select,
    [Option.name]: Option
  }
})
export default class RoutePlanAutocomplete extends Mixins(DropdownField) {
  @Prop() addButton!: boolean;
  private createEntity: boolean = false;


}
</script>
