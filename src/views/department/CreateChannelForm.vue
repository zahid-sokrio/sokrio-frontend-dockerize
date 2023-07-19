<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New' }} Channel</h5>
      </template>
      <div>
        <base-input name="name" v-model="form.name" label="Name" placeholder="e.g. Depo, Distributor, Dealer"></base-input>
        <base-input name="label" v-model="form.label" label="Label" placeholder="e.g. Some description"></base-input>
      </div>
      <base-checkbox class="mb-5" v-model="form.has_outlet" :disabled="isUpdate ? (form.has_outlet || form.self_managed) : false">
        <h4>Is Outlet</h4>
        <h5 class="text-muted">
            If you mark this Channel as "Is Outlet", any department you create with this type, will be treated as "Outlet"
        </h5>
      </base-checkbox>
      <br>
      <br>
      <base-checkbox class="mb-5" v-model="form.self_managed" :disabled="isUpdate ? (form.has_outlet || form.self_managed) : false">
        <h4>Is Self Managed</h4>
        <h5 class="text-muted">
            These types of departments are typically depos, godowns and low level warehouses. Will be ignored from sales transactions.
        </h5>
      </base-checkbox>
      <br>
      <code v-if="isUpdate ? !(form.has_outlet || form.self_managed) : true">N.B. Type cannot be changed once selected.</code>
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
  import {Vue, Component, Prop, Mixins, Watch} from 'vue-property-decorator';
import BaseCUModalComponent from '@/mixins/BaseCUModalComponent';
import { AxiosResponse } from 'axios';
import DepartmentType from '@/intefaces/DepartmentType.js';

@Component({
  components: {}
})
export default class CreateChannelForm extends Mixins(BaseCUModalComponent) {
  @Prop()
  currentEntity!: DepartmentType;

  @Prop({ default: () => ({ name: '', label: '', has_outlet: false, self_managed:false }) })
  form!: {
    name: string;
    label: string;
    has_outlet: boolean;
    self_managed:boolean
  };

  @Prop()
  private departmentTypes!: DepartmentType[];
  public departmentHasOutletUpdate: boolean = false;

  formReset(): any {
    this.form.name = '';
    this.form.label = '';
    this.form.has_outlet = false;
    this.form.self_managed = false;
    return this.form;
  }

  created() {
    if (this.form.has_outlet) {
      this.departmentHasOutletUpdate = true;
    }
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.departmentType);
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.departmentType);
  }

  get createApi(): string {
    return '/department-types';
  }

  get updateApi(): string {
    return `/department-types/${this.currentEntity.id}`;
  }

  @Watch('form.has_outlet')
  onChangeOutlet(value:boolean){
    if (value){
      this.form.self_managed=false;
    }
  }

  @Watch('form.self_managed')
  onChangeManaged(value:boolean){
    if (value){
      this.form.has_outlet=false;
    }
  }
}
</script>
