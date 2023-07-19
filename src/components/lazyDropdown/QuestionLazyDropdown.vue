<template>
  <lazy-dropdown :value="value" :label="label" :item-text="itemText" :collapseTags="collapseTags" :add-button="addButton" :placeholder="placeholder" :multiple="multiple" @input="$emit('input', $event)" searchable-key="name" :end-point="endPoint" resource-key="questions" :name="name" :rules="rules">
    <template v-slot:createModal="{isActive, afterCreated}">
      <question-form v-if="isActive" @created="afterCreated($event)" :is-active.sync="isActive"></question-form>
    </template>
  </lazy-dropdown>
</template>
<script lang="ts">
  import Vue from "vue";
  import {Component, Mixins, Prop} from "vue-property-decorator";
  import LazyDropdown from "../LazyDropdown.vue";
  import DropdownField from "@/mixins/DropdownField";
  import QuestionForm from "@/views/inspection/survey/QuestionForm.vue";
  @Component({
    components: {
      LazyDropdown,
      QuestionForm
    }
  })
  export default class QuestionLazyDropdown extends Mixins(DropdownField) {
    @Prop({default: 'questions'}) endPoint!: string;
    @Prop({default: true}) addButton!: boolean;
    @Prop({default: false}) collapseTags!: boolean;
    @Prop({default: 'title'}) itemText!: string;
  }
</script>
