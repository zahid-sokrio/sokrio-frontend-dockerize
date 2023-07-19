<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add new' }} Transport</h5>
      </template>
      <div>
        <base-input name="name"  v-model="form.name" label="Name" placeholder="e.g. Bus, Train, Taxi"></base-input>
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
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator';
import BaseCUModalComponent from '@/mixins/BaseCUModalComponent';
import { AxiosResponse } from 'axios';
import Transport from '@/intefaces/Transport.js';

@Component({
  components: {}
})
export default class CreateTransportForm extends Mixins(BaseCUModalComponent) {
  @Prop()
  currentEntity!: Transport;

  @Prop({ default: () => ({ name: '' }) })
  form!: {
    name: string;
  };

  formReset(): any {
    this.form.name = '';
    return this.form;
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.transport);
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.transport);
  }

  get createApi(): string {
    return '/transports';
  }

  get updateApi(): string {
    return `/transports/${this.currentEntity.id}`;
  }
}
</script>
