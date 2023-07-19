<template>
  <lazy-dropdown :add-button="addButton" :collapseTags="collapseTags" :disabled="disabled" :end-point="endPoint"
                 :label="label" :multiple="multiple" :name="name"
                 :fetch-on-change-disable="fetchOnChangeDisable" :placeholder="placeholder" :rules="rules"
                 :value="value"
                 resource-key="users"
                 :searchable-key="searchableKey" :item-text="itemText" @input="$emit('input', $event)">
    <template v-slot:createModal="{isActive, afterCreated}">
      <create-user v-if="isActive" :is-active.sync="isActive" @created="afterCreated($event)"></create-user>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import LazyDropdown from "../LazyDropdown.vue";
import DropdownField from "@/mixins/DropdownField";
import CreateUser from "@/views/user/user/CreateUser.vue";

@Component({
  components: {
    LazyDropdown,
    CreateUser
  }
})
export default class UserLazydropdown extends Mixins(DropdownField) {
  @Prop({default: 'users'}) endPoint!: string;
  @Prop({default: true}) addButton!: boolean;
  @Prop({default: false}) collapseTags!: boolean;
  @Prop({default: 'q'}) searchableKey!: string;
  @Prop({default: 'name'}) itemText!: string;
  @Prop({default: true})
  public fetchOnChangeDisable!: boolean;

}
</script>
