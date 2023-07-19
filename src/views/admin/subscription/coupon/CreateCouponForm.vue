<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add new' }} Coupon</h5>
      </template>
      <div>
        <base-input
          name="code"
          :rules="{required:true}"
          v-model="form.code"
          label="Coupon Code"
          placeholder="Type a code"
        ></base-input>
        <base-input
          prepend-icon="fas fa-percent"
          name="discount"
          :rules="{required:true}"
          v-model="form.discount"
          label="Discount"
          placeholder="Type a discount"
        ></base-input>
        <base-input label="Expiry Date" prepend-icon="ni ni-calendar-grid-58">
          <flat-picker
            slot-scope="{focus, blur}"
            placeholder="Pick an expiry date"
            @on-open="focus"
            @on-close="blur"
            :config="{allowInput: true}"
            class="form-control datepicker"
            v-model="form.expires_at"
          ></flat-picker>
        </base-input>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" :loading="loading" @click="handleSubmit(save)">Save</base-button>
      </template>
    </modal>
  </validation-observer>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator';
import AdminCUModalComponent from '@/mixins/AdminCUModalComponent';
import { AxiosResponse } from 'axios';
import Coupon from '@/intefaces/Coupon';

const flatPicker = require('vue-flatpickr-component');
import 'flatpickr/dist/flatpickr.css';

@Component({
  components: { flatPicker },
})
export default class CreateCouponForm extends Mixins(AdminCUModalComponent) {
  @Prop()
  currentEntity!: Coupon;

  @Prop({ default: () => ({ code: '', discount: 0, expires_at: '' }) })
  form!: {
    code: string;
    discount: number;
    expires_at: string;
  };

  formReset(): any {
    this.form.code = '';
    this.form.discount = 0;
    this.form.expires_at = '';
    return this.form;
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.coupon);
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.coupon);
  }

  get createApi(): string {
    return '/coupons';
  }

  get updateApi(): string {
    return `/coupons/${this.currentEntity.id}`;
  }
}
</script>
