<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isAssigneeModel" v-if="isAssigneeModel" size="sm" @close="close">
      <template slot="header">
        <h5 class="modal-title">{{ currentEntity ? currentEntity.name : '' }}</h5>
      </template>
      <div>
        <UserLazydropdown label="Survey Manager" v-model="assigneeId"></UserLazydropdown>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" :loading="loading" @click="handleSubmit(save)">Assign</base-button>
      </template>
    </modal>
  </validation-observer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Survey from '@/intefaces/Survey';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';

@Component({
  components: { UserLazydropdown }
})
export default class AssigneeSurveyForm extends Vue {
  @Prop()
  currentEntity!: Survey;
  @Prop({ default: false })
  isAssigneeModel!: boolean;
  assigneeId: number | null = null;
  private loading = false;

  async save() {
    this.loading = true;
    try {
      let { data } = await this.$http.post(this.$api(`/surveys/${this.currentEntity.id}/assignees`), { user_id: this.assigneeId });
      this.$notify({ type: 'success', title: 'Success', message: 'Successfully Assign Manager!' });
      this.close();
    } catch (e) {
      this.$notify({ type: 'warning', title: 'Error', message: 'Something wants wrong!' });
    } finally {
      this.loading = false;
    }
  }

  close() {
    this.assigneeId = null;
    this.$emit('update:isAssigneeModel', false);
  }
}
</script>
