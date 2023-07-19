<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'New' }} Leave Request</h5>
      </template>
      <div>
        <base-input label="Reason" name="reason">
          <el-input

            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4 }"
            placeholder="Describe the reason for leave...."
            v-model="form.reason"
          >
          </el-input>
        </base-input>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" :loading="loading" @click="handleSubmit(save)">Submit</base-button>
      </template>
    </modal>
  </validation-observer>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator';
import BaseCUModalComponent from '@/mixins/BaseCUModalComponent';
import { AxiosResponse } from 'axios';
import Badge from '@/intefaces/Badge.js';
import LeaveRequest from '@/intefaces/LeaveRequest';

@Component({
  components: {}
})
export default class CreateBadgeForm extends Mixins(BaseCUModalComponent) {
  @Prop()
  currentEntity!: LeaveRequest;

  @Prop()
  form!: {
    user_id: number | null;
    reason: string | null;
    approved_at: string | null;
    actor_id: number | null;
  };

  formReset(): any {
    this.form.user_id = null;
    this.form.reason = '';
    this.form.approved_at = '';
    this.form.actor_id = null;
    return this.form;
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.leaveRequest);
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.leaveRequest);
  }

  get createApi(): string {
    return '/own-leave-requests';
  }

  get updateApi(): string {
    return `/own-leave-requests/${this.currentEntity.id}`;
  }
}
</script>
