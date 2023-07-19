<template>
  <validation-observer v-if="isActive" v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add new' }} Badge</h5>
      </template>
      <div>
        <base-input name="name"  v-model="form.name" label="Name" placeholder="e.g. Silver, Gold, Platinum"></base-input>
        <base-input name="MRP discount" :rules="{required:true}" v-model="form.mrp_discount" label="MRP Discount (%)" placeholder="e.g. 100"></base-input>
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
import Badge from '@/intefaces/Badge.js';

@Component({
  components: {}
})
export default class CreateBadgeForm extends Mixins(BaseCUModalComponent) {
  @Prop()
  currentEntity!: Badge;

  @Prop({ default: () => ({ name: '', mrp_discount: 0 }) })
  form!: {
    name: string;
    mrp_discount: number
  };

  formReset(): any {
    this.form.name = '';
    this.form.mrp_discount = 0;
    return this.form;
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.badge);
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.badge);
  }

  get createApi(): string {
    return '/badges';
  }

  get updateApi(): string {
    return `/badges/${this.currentEntity.id}`;
  }
}
</script>
