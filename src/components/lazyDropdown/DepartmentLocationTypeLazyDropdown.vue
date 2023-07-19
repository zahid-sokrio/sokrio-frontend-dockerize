<template>
  <lazy-dropdown :collapseTags="collapseTags"
                 :disabled="disabled"
                 :end-point="endPoint"
                 :label="label"
                 :name="name"
                 :fetch-on-change-disable="fetchOnChangeDisable"
                 :placeholder="placeholder"
                 :rules="rules"
                 :value="value"
                 resource-key="departmentLocationTypes"
                 :searchable-key="searchableKey"
                 @input="$emit('input', $event)">
<!--    <template v-slot:createModal="{isActive, afterCreated}">-->
<!--&lt;!&ndash;      <create-user v-if="isActive" :is-active.sync="isActive" @created="afterCreated($event)"></create-user>&ndash;&gt;-->
<!--    </template>-->
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
export default class DepartmentLocationTypeLazyDropdown extends Mixins(DropdownField) {
  @Prop({default: 'department-location-types'})
  public endPoint!: string;

  @Prop({default: false})
  public collapseTags!: boolean;

  @Prop({default: 'name'})
  public searchableKey!: string;


  @Prop({default: true})
  public fetchOnChangeDisable!: boolean;

}
</script>
