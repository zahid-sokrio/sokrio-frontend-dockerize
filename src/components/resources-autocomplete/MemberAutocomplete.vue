<template>
  <LazyDropdown
    :value="value"
    :name="name"
    :label="label"
    @input="$emit('input', $event)"
    :multiple="multiple"
    searchable-key="q"
    :end-point="endPoint"
    resource-key="users"
    :placeholder="placeholder"
    :rules="rules"
    aria-autocomplete="false"
  >
    <template v-if="createButton" v-slot:createModal="{ isActive, afterCreated }">
      <CreateUser @created="afterCreated($event)" :is-active.sync="isActive"></CreateUser>
    </template>
  </LazyDropdown>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';
import { Select, Option } from 'element-ui';
import CreateUser from '@/views/user/user/CreateUser.vue';
import DropdownField from '@/mixins/DropdownField';
import LazyDropdown from '@/components/LazyDropdown.vue';

@Component({
  components: {
    LazyDropdown,
    CreateUser,
    [Select.name]: Select,
    [Option.name]: Option
  }
})
export default class MemberAutocomplete extends Mixins(DropdownField) {
  @Prop({default: 'users'})
  public endPoint!:string;
}
</script>
