<template>
  <span>
    <base-input :name="name" :label="label">
      <el-select
        :automatic-dropdown="true"
        :multiple="multiple"
        :value="value"
        :collapse-tags="multiple"
        @input="$emit('input', $event)"
        :placeholder="placeholder"
        remote
        clearable
        reserve-keyword
        filterable
        :remote-method="fetchEntries"
        :loading="loading"
      >
        <el-option v-for="entity in entities" :key="entity.id" :label="`${entity.name} | ${entity.code}`" :value="entity.id"></el-option>
        <el-option v-if="addButton" :value="0" label="Create new"><b> Create New </b> </el-option>
      </el-select>
    </base-input>
    <CreateDepartmentForm v-if="addButton" @created="afterCreated($event)" :is-active.sync="createEntity"></CreateDepartmentForm>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Select, Option } from 'element-ui';
import Department from '@/intefaces/Department';
import CreateDepartmentForm from '@/views/department/CreateDepartmentForm.vue';

@Component({
  components: {
    CreateDepartmentForm,
    [Select.name]: Select,
    [Option.name]: Option
  }
})
export default class DepartmentAutocomplete extends Vue {
  @Prop()
  value!: number | null;
  @Prop({ default: false })
  multiple!: boolean;
  @Prop({ default: false })
  addButton!: boolean;
  @Prop({ default: 'Select Department' })
  placeholder!: string;
  @Prop({ default: null })
  label!: string | null;
  @Prop({ default: 'territory' })
  name!: string;

  private createEntity: boolean = false;
  private entities: Department[] = [];
  private loading: boolean = false;

  async fetchEntries(query: string) {
    if (query == '') return;
    this.loading = true;
    const { data } = await this.$http.get(this.$api(`/departments?q=${query}`));
    this.loading = false;
    this.entities = data.departments;
  }

  afterCreated(value: Department) {
    this.createEntity = false;
    this.entities.unshift(value);
    this.$emit('input', value.id);
  }
  @Watch('value')
  onChangeValue(value: any) {
    if (value === 0) {
      this.createEntity = true;
      this.$nextTick(() => {
        this.$emit('input', null);
      });
    }
  }
}
</script>
