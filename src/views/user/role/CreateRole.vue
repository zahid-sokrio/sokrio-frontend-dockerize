<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="newRole" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New ' }} Role</h5>
      </template>
      <div>
        <base-input v-model="form.name" label="Name" name="name" placeholder="e.g. Manager" />
        <base-input name="label" v-model="form.label" label="Label" placeholder="e.g. General Manager" />
        <base-button type="primary" class="btn mb-2" @click="isActivePermission = true">Permissions</base-button>
        <permission-modal
          :is-active.sync="isActivePermission"
          :is-update.sync="isUpdate"
          :form-permissions.sync="form.permissions"
          :current-role="currentRole"
          :isForSetupWizard="isForSetupWizard"
          @checkedPermissions="checkedPermissions($event)"
          @updatePermission="updatePermission($event)"
        ></permission-modal>
      </div>
      <template slot="footer">
        <slot name="footer" v-bind:handleSubmit="handleSubmit">
          <base-button type="secondary" @click="close">Close</base-button>
          <base-button type="success" @click="handleSubmit(save)" :disabled="disableBtn">Save</base-button>
        </slot>
      </template>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Role from '@/intefaces/Role';
import Permission from '@/intefaces/Permission';
import PermissionModal from '@/views/user/permission-grouping/PermissionModal.vue';

@Component({
  name: 'CreateRole',
  components: {
    PermissionModal,
  },
})
export default class CreateRole extends Vue {
  @Prop() newRole!: boolean;
  @Prop() isUpdate!: boolean;
  @Prop() isForSetupWizard!: boolean;
  @Prop() currentRole!: any;
  @Prop({
    default: () => ({
      name: '',
      label: '',
      permissions: [],
    }),
  })
  form!: {
    name: string;
    label: string;
    permissions: any;
  };
  private is_remove_permission = false;
  private permissions: Permission[] = [];
  private disableBtn = false;
  private isActivePermission: boolean = false;

  updatePermission(event: any) {
    if (this.isUpdate) {
      if (event[0].indeterminate && event[0].checked.id) {
        event[1].forEach((permission: any) => {
          this.$http.post(this.$api(`/roles/${this.currentRole.id}/permissions`), { permission_id: permission });
        });
      } else if (!event[0].indeterminate) {
        event[1].forEach((permission: any) => {
          this.$http.delete(this.$api(`/roles/${this.currentRole.id}/permissions/${permission}`));
        });
      }
    }
  }

  createRole() {
    this.disableBtn = true;
    this.$http
      .post(this.$api('/roles'), this.form)
      .then((response) => {
        this.form.permissions.length &&
          this.form.permissions.forEach((permission: any) => {
            this.$http.post(this.$api(`/roles/${response.data.role.id}/permissions`), { permission_id: permission });
          });
        this.$notify({
          title: 'Success',
          message: 'Successfully Created',
          duration: 5000,
          iconClass: 'ni ni-bell-55',
          type: 'success',
        });
        this.$http.get(this.$api(`/roles/${response.data.role.id}`)).then((responseRole) => {
          this.afterCreated(responseRole.data.role);
        });
        this.form.label = '';
        this.form.name = '';
        this.form.permissions = [];
        this.disableBtn = false;
      })
      .catch((error) => {
        this.disableBtn = false;
        (
          this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }
        ).setErrors(error.response.data.errors);
      });
  }

  async afterCreated(response: any) {
    this.$emit('created', response);
  }

  updateRole() {
    this.disableBtn = true;
    this.$http
      .patch(this.$api(`/roles/${this.currentRole.id}`), this.form)
      .then((response) => {
        this.$notify({
          title: 'Success',
          message: 'Successfully Updated',
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success',
        });
        this.$emit('updated', response.data.role);
        this.form.label = '';
        this.form.name = '';
        this.form.permissions = [];
        this.disableBtn = false;
      })
      .catch((error) => {
        this.disableBtn = false;
        (
          this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }
        ).setErrors(error.response.data.errors);
      });
  }

  checkedPermissions(event: any) {
    this.form.permissions = event;
  }

  save() {
    this.isUpdate ? this.updateRole() : this.createRole();
  }

  fetchPermission() {
    this.$http.get(this.$api('/permissions')).then((response) => {
      this.permissions = response.data.permissions;
    });
  }

  created() {
    this.fetchPermission();
  }

  close() {
    this.$parent.$emit('update:newRole', false);
    this.$emit('update:newRole', false);
    this.$emit('update:isUpdate', false);
    this.$emit('update:form', { name: '', label: '', permissions: [] });
    this.$emit('onCloseSetRole');
  }
}
</script>
