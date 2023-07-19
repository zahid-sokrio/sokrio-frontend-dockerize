<template>
  <validation-observer v-if="isActive" v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add new' }} Location Type</h5>
      </template>
      <div>
        <base-input name="name"  v-model="form.name" label="Name"
                    placeholder="e.g. Urban, Rural, City" @keyup.enter="handleSubmit(save)"></base-input>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" :loading="loading" @click="handleSubmit(save)">Save </base-button>
      </template>
    </modal>
  </validation-observer>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator';
import BaseCUModalComponent from '@/mixins/BaseCUModalComponent';
import { AxiosResponse } from 'axios';
import LocationType from '@/intefaces/LocationType.js';

@Component({
  components: {}
})
export default class CreateLocationTypeForm extends Mixins(BaseCUModalComponent) {
  @Prop()
  currentEntity!: LocationType;

  @Prop({ default: () => ({ name: '' }) })
  form!: {
    name: string;
  };

  formReset(): any {
    this.form.name = '';
    return this.form;
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.departmentLocationType);
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.departmentLocationType);
  }

  get createApi(): string {
    return '/department-location-types';
  }

  get updateApi(): string {
    return `/department-location-types/${this.currentEntity.id}`;
  }
}
</script>
