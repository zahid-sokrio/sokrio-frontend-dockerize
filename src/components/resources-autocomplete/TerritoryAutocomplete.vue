<template>
  <LazyDropdown
    :value="value"
    :name="name"
    :label="label"
    @input="$emit('input', $event)"
    :multiple="multiple"
    searchable-key="q"
    :end-point="endPoint"
    resource-key="territories"
    :placeholder="placeholder"
    :disabled="disabled"
    :rules="rules"
    :collapseTags="collapseTags"
    :fetch-on-change-disable="fetchOnChangeDisable"
  >
    <template v-if="createButton" v-slot:createModal="{ isActive, afterCreated }">
      <CreateNewTerritoryForm @created="afterCreated($event)" :is-active.sync="isActive"></CreateNewTerritoryForm>
    </template>
  </LazyDropdown>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator';
import { Select, Option } from 'element-ui';
import Territory from '@/intefaces/Territory';
import DropdownField from '@/mixins/DropdownField';
import LazyDropdown from '@/components/LazyDropdown.vue';

@Component({
  components: {
    LazyDropdown,
    CreateNewTerritoryForm: () => import('@/views/territory/CreateTerritoryForm.vue'),
    [Select.name]: Select,
    [Option.name]: Option,
  },
})
export default class TerritoryAutocomplete extends Mixins(DropdownField) {
  @Prop({default: 'territories'})
  public endPoint!: string;

  @Prop({default: true})
  public fetchOnChangeDisable!: boolean;
}
</script>
