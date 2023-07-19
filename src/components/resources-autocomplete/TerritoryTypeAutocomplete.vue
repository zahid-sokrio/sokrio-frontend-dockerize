<template>
  <span>
    <base-input :label="label" :name="name" :rules="rules">
      <el-select
        :loading="loading"
        :multiple="multiple"
        :collapse-tags="multiple"
        :value="value"
        @input="$emit('input', $event)"
        clearable
        :placeholder="placeholder"
      >
        <el-option
          v-for="entity in sortedTerritoryType"
          :key="entity.id"
          :label="`Level-${entity.level} | ${entity.name}`"
          :value="entity.id"
        ></el-option>
        <el-option v-if="createButton" :value="0" label="Create new"><b> Create New </b> </el-option>
      </el-select>
    </base-input>
    <CreateTerritoryTypeFrom :available-territory-types="entities" v-if="createButton" @created="afterCreate($event)" :is-active.sync="createEntity">
    </CreateTerritoryTypeFrom>
  </span>
</template>

<script lang="ts">
  import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator';
  import { Select, Option } from 'element-ui';
  import CreateTerritoryTypeFrom from '@/views/territory/CreateTerritoryTypeFrom.vue';
  import TerritoryType from '@/intefaces/TerritoryType';
  import DropdownField from "@/mixins/DropdownField";

@Component({
  components: {
    CreateTerritoryTypeFrom,
    [Select.name]: Select,
    [Option.name]: Option
  }
})
export default class TerritoryTypeAutocomplete extends Mixins(DropdownField) {

  private entities: TerritoryType[] = [];
  private createEntity: boolean = false;
  private loading: boolean = false; 
  @Prop({
    default: null
  })
  public removeRoot!: number | null;
  created() {
    this.fetchEntries();
  }

  async fetchEntries() {
    this.loading = true;
    const { data } = await this.$http.get(this.$api('/territory-types'));
    this.entities = data.territoryTypes;
    this.loading = false;
  }
  private afterCreate(newTerritoryType: TerritoryType) {
    this.entities.forEach(value => {
      if (value.level >= newTerritoryType.level) {
        value.level++;
      }
    });
    this.entities.unshift(newTerritoryType);
    this.$emit('input', newTerritoryType.id);
  }
  get sortedTerritoryType() { 
    if (this.removeRoot) {
      return JSON.parse(JSON.stringify(this.entities)).sort((a: any, b: any) => a.level - b.level).splice(1, this.entities.length);
    } 
    return JSON.parse(JSON.stringify(this.entities)).sort((a: any, b: any) => a.level - b.level);
  }
  @Watch('value')
  onChangeValue(value: any) {
    if (value === 0) {
      this.createEntity = true;
      this.$nextTick(() => {
        this.$emit('input', null);
      });
    }
    let entity = this.entities.find(value1 => value1.id == value);
    entity ? this.$emit('level', entity.level) : this.$emit('level', null);
  }
}
</script>