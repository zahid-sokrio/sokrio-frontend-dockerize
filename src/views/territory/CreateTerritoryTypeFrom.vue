<template>
  <validation-observer v-if="isActive" v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New' }} Territory Type</h5>
      </template>
      <div>
        <base-input name="name" v-model="form.name" label="Name" :rules="{ required: true }" placeholder="e.g. City"></base-input>
        <base-input
          name="description"
          v-model="form.description"
          label="Description"
          placeholder="e.g. This unit covers the City-level territories"
        ></base-input>
        <base-input label="Level">
          <el-select v-model="form.level" placeholder="Select Level">
            <el-option v-for="levels in availableLevels" :key="levels.id" :label="levels.name" :value="levels.id"></el-option>
          </el-select>
        </base-input>
        <base-checkbox v-if="!hasOutlet || form.has_outlet" class="mb-3" v-model="form.has_outlet">Has Outlets</base-checkbox>
      </div>
      <template slot="footer">
        <slot name="footer" v-bind:handleSubmit="handleSubmit">
          <base-button type="secondary" @click="close">Close</base-button>
          <base-button type="success" :loading="loading" @click="handleSubmit(save)">Save</base-button>
        </slot>
      </template>
    </modal>
  </validation-observer>
</template>

<script lang="ts">
  import {Component, Prop, Mixins, Watch} from 'vue-property-decorator';
import TerritoryType from '@/intefaces/TerritoryType';
import BaseCUModalComponentMixin from '@/mixins/BaseCUModalComponent';
import { AxiosResponse } from 'axios';
import { clone } from 'lodash';

@Component
export default class CreateTerritoryTypeForm extends Mixins(BaseCUModalComponentMixin) {
  @Prop({
    default: () => ({
      name: '',
      description: '',
      has_outlet: false,
      level: 1
    })
  })
  form!: {
    name: string;
    description: string;
    has_outlet: boolean;
    level: number;
  };

  @Prop()
  currentEntity!: TerritoryType;

  @Prop({ required: true })
  availableTerritoryTypes!: TerritoryType[];

  @Prop({default: false})
  hasOutlet!: boolean

  get createApi(): string {
    return '/territory-types';
  }
  get updateApi(): string {
    return `/territory-types/${this.currentEntity.id}`;
  }

  @Watch('form.has_outlet')
  visibleHasOutlet(newVal: any){
    if(!newVal && this.isUpdate){
      this.$emit('update:hasOutlet', false);
    }
  }

  get availableLevels(): any[] {
    let copyOfAvailableTerritoryTypes: Array<any> = clone(this.availableTerritoryTypes);
    copyOfAvailableTerritoryTypes.sort((a, b) => a.level - b.level);
    let levels: any[] = [];
    copyOfAvailableTerritoryTypes.forEach((value, index) => {
      if (this.isUpdate) {
        if (this.currentEntity.level === value.level) {
          levels.push({ name: `At level-${value.level} | Current Level`, id: value.level });
        } else {
          levels.push({ name: `At level-${value.level} | Swap with ${value.name}`, id: value.level });
        }
      }
      if (!this.isUpdate) {
        levels.push({ name: `At level-${value.level} | Before ${value.name}`, id: value.level });
        if (index === copyOfAvailableTerritoryTypes.length - 1) {
          levels.push({ name: `At level-${value.level + 1} | After ${value.name}`, id: value.level + 1 });
        }
      }
    });
    if (levels.length == 0) {
      levels.push({ name: 'level-1', id: 1 });
    }
    return levels;
  }
  set availableLevels(value) {}
  formReset(): any {
    this.form.name = '';
    this.form.description = '';
    this.form.has_outlet = false;
    this.form.level = 1;
    return this.form;
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.territoryType);
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.territoryType);
  }
}
</script>

<style scoped></style>
