<template>
  <LazyDropdown
    :value="value"
    :name="name"
    :label="label"
    @input="onChangeInput"
    :multiple="multiple"
    searchable-key="q"
    :end-point="endPoint"
    resource-key="departmentTypes"
    :placeholder="placeholder"
    :rules="rules"
    @entities="entities=$event"
  >
    <template v-if="createButton" v-slot:createModal="{ isActive, afterCreated }">
      <CreateChannelForm v-if="createButton" @created="afterCreated($event)" :is-active.sync="isActive"> </CreateChannelForm>
    </template>
  </LazyDropdown>
</template>

<script lang="ts">
  import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator';
import { Select, Option } from 'element-ui';
import CreateChannelForm from '@/views/department/CreateChannelForm.vue';
import DepartmentType from '@/intefaces/DepartmentType';
  import DropdownField from "@/mixins/DropdownField";
  import LazyDropdown from "@/components/LazyDropdown.vue";

@Component({
  components: {
    LazyDropdown,
    CreateChannelForm,
    [Select.name]: Select,
    [Option.name]: Option
  }
})
export default class DepartmentTypeAutocomplete extends Mixins(DropdownField) {

  private entities: DepartmentType[] = [];
  private createEntity: boolean = false;
  private loading: boolean = false;
  @Prop({default:'department-types'})
  endPoint!:string;

  @Watch('value')
  onChangeValue(value: any) {
    // this.onChangeInput(value.id);
    if (value === 0) {
      this.createEntity = true;
      this.$nextTick(() => {
        this.$emit('input', null);
      });
    }
    if(value != null && value != 0) {
      let selectedDepartmentType = this.entities[this.entities.findIndex((value1, index) => value1.id == value)];
      this.$emit('hasOutlet', selectedDepartmentType.has_outlet);
      this.$emit('isSelfManaged', selectedDepartmentType.self_managed);
    }
  }

  onChangeInput(value:any){
    this.$emit('input', value)
    if(value>0 && value != 0){
      let selectedDepartmentType = this.entities[this.entities.findIndex((value1, index) => value1.id==value)];
      this.$emit('hasOutlet', selectedDepartmentType.has_outlet);
      this.$emit('isSelfManaged', selectedDepartmentType.self_managed);
    }else {
      this.$emit('hasOutlet', 0);
      this.$emit('hasOutlet', 0);
    }

  }
}
</script>
