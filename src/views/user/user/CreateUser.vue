<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <modal :show="isActive" size="lg" @close="close">
      <template slot="header">
        <h5 id="exampleModalLabel" class="modal-title"> {{ isUpdate ? 'Update' : 'Add New' }} User</h5>
      </template>
      <div>
        <div class="row">
          <div class="col-md-6">
            <base-input v-model="form.name" label="Name" name="name" placeholder="e.g. John Doe"/>
          </div>
          <div class="col-md-6">
            <base-input v-model="form.code" label="Code" name="code" placeholder="e.g. 101"/>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <base-input v-model="form.email" label="Email" name="email" placeholder="e.g. john@email.com"/>
          </div>
          <div class="col-md-6">
            <base-input v-model="form.password" :type="showPassword ? 'type' : 'password'" label="Password"
                        name="password" placeholder="">
              <template slot="append"><i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                                         @click="togglePassword"></i></template>
            </base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <base-input v-model="form.password_confirmation" label="Confirm Password" name="password_confirmation"
                        placeholder=""
                        type="password"></base-input>
          </div>
          <div class="col-md-6">
            <base-input v-model="form.phone" label="Phone No. (Optional)" name="phone" placeholder="e.g. 01800000000"/>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <base-input v-model="form.address" label="Address (Optional)" name="address"
                        placeholder="e.g. Mirpur, Dhaka"/>
          </div>
          <div class="col-md-6">
            <base-input label="Gender (Optional)">
              <el-select v-model="form.gender"
                         filterable
                         placeholder="e.g Male">
                <el-option v-for="gender in selectGender"
                           :key="gender.label"
                           :label="gender.value"
                           :value="gender.label">
                </el-option>
              </el-select>
            </base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <territory-lazydropdown v-model="form.territory_id" end-point="territories" label="Territory"
                                    name="territory"
                                    searchableKey="q"
                                    :rules="{ required: true }"
                                    placeholder="Select Territory"></territory-lazydropdown>
          </div>
          <div class="col-md-6">
            <role-lazydropdown v-model="form.roles" :multiple="true" label="Roles (Optional)" placeholder="Select Role"
                               @remove-tag="onRemoveRole"></role-lazydropdown>
          </div>
        </div>
        <div class="row">

          <div class="col-md-6">
            <base-input label="Active" style="width: 50%;">
              <base-switch on-text="Yes" off-text="No" v-model="form.status"></base-switch>
            </base-input>
            <base-input label="Available on Report">
              <base-switch :value="form.is_report" v-model="form.is_report"></base-switch>
            </base-input>
          </div>
          <div class="col-md-6">
            <el-button type="text" icon="el-icon-key"
                       @click="isActivePermission = true">Permissions
            </el-button>
            <permission-modal
              :current-role="currentUser"
              :error-message.sync="errorMessage"
              :form-permissions.sync="form.permissions"
              :is-active.sync="isActivePermission"
              :is-update.sync="isUpdate"
              @checkedPermissions="checkedPermissions($event)"
              @updatePermission="updatePermission($event)"
            ></permission-modal>
          </div>
          <div v-if="isUpdate" class="col-md-6">
            <base-input group class="mb-3" label="Device Id">
              <input type="text" disabled :value="currentUser.device_id" class="form-control" placeholder="No Info."
                     aria-describedby="button-addon2">
              <div class="input-group-append">
                <button class="btn btn-outline-primary" type="warning" @click="onClickResetUserDevice">
                  <i class="fas fa-recycle"></i>
                  RESET
                </button>
              </div>
            </base-input>
          </div>
        </div>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button :disabled="disableBtn" type="success" @click.prevent="handleSubmit(save)">Save</base-button>
      </template>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {Button, Option, Select, Switch, Tag} from "element-ui";
import Territory from "@/intefaces/Territory";
import Permission from "@/intefaces/Permission";
import Role from "@/intefaces/Role";
import CreateRole from "@/views/user/role/CreateRole.vue";
import RoleLazydropdown from "@/components/lazyDropdown/RoleLazydropdown.vue";
import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown.vue";
import PermissionModal from "@/views/user/permission-grouping/PermissionModal.vue";
import UserForm from "@/intefaces/UserForm";
import {key} from "flatpickr/dist/types/locale";

@Component({
  name: 'CreateUser',
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    CreateRole,
    RoleLazydropdown,
    TerritoryLazydropdown,
    [Switch.name]: Switch,
    [Tag.name]: Tag,
    ElButton: Button,
    PermissionModal
  }
})
export default class CreateUser extends Vue {
  @Prop() isActive!: boolean;
  @Prop() isUpdate!: boolean;
  @Prop() territories!: Territory;
  @Prop() currentUser!: any;
  @Prop({
    default: () => ({
      name: '',
      email: '',
      phone: '',
      address: '',
      gender: '',
      territory_id: '',
      password: '',
      password_confirmation: '',
      permissions: [],
      roles: [],
      status: true,
      code: '',
      is_report: false,
    })
  })
  form!: {
    name: string,
    email: string,
    phone: string | number,
    address: string,
    gender: string,
    territory_id: any,
    password: string,
    password_confirmation: string,
    permissions: any,
    roles: any,
    status: boolean,
    code: string,
    is_report: boolean,
  }
  private showPassword = false;
  private needsRoleRemoval = false;
  private needsPermissionRemoval = false;
  private roles: Role[] = [];
  private newAddedRole: any = '';
  private permissions: Permission[] = [];
  private isActivePermission: boolean = false;
  private errorMessage: string = ''
  private roleForm: { label: string, name: string, permissions: string | number } = {
    label: '',
    name: '',
    permissions: ''
  }
  private selectGender = [
    {
      label: 'm',
      value: 'Male'
    },
    {
      label: 'f',
      value: 'Female'
    },
    {
      label: 'o',
      value: 'Others'
    }
  ];
  private disableBtn = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  checkedPermissions(event: any) {
    this.form.permissions = event;
  }

  updatePermission(event: any) {
    if (this.isUpdate && this.isActivePermission) {
      if (event[0].indeterminate && event[0].checked.id) {
        event[1].forEach((permission: any) => {
          this.$http
            .post(this.$api(`/users/${this.currentUser.id}/permissions`), {permission_id: permission})
            .catch(error => {
              this.errorMessage = error.response.data[0];
            })
        })
      } else if (!event[0].indeterminate) {
        event[1].forEach((permission: any) => {
          this.$http
            .delete(this.$api(`/users/${this.currentUser.id}/permissions/${permission}`))
        });
      }
    }
  }

  onRemovePermission(remove: any) {
    if (this.isUpdate == true) {
      this.$http
        .delete(this.$api(`/users/${this.currentUser.id}/permissions/${remove}`))
        .then(response => {
          this.needsPermissionRemoval = false;
        })
    }
  }

  onRemoveRole(remove: any) {
    if (this.isUpdate == true) {
      this.needsRoleRemoval = true;
      this.$http
        .delete(this.$api(`/users/${this.currentUser.id}/roles/${remove}`))
        .then(response => {
          this.needsRoleRemoval = false;
        })
    }
  }

  @Watch('form.roles')
  selectValueRole(old: any, current: any) {
    if (this.isUpdate && !this.needsRoleRemoval && this.currentUser.roles.findIndex((role: any) => role.id == old) == -1) {
      let newRole = '';
      if (this.form.roles != '' && current != '') {
        newRole = old.filter((item: any) => {
          return current.indexOf(item) === -1
        })
      }
      if (old.length == 1 && current.length == 0) {
        this.$http
          .post(this.$api(`/users/${this.currentUser.id}/roles`), {role_id: old[0]})
      }
      if (newRole != '' && old.includes('0') == false || old.includes(this.newAddedRole) == true) {
        this.$http
          .post(this.$api(`/users/${this.currentUser.id}/roles`), {role_id: newRole != '' ? newRole[0] : this.newAddedRole})
        this.newAddedRole = '';
      }
    }
    if (old.includes(0)) {
      this.form.roles.splice((role: any) => role == 0, 1);
    }
  }

  formReset() {
    this.form.name = '';
    this.form.email = '';
    this.form.address = '';
    this.form.gender = '';
    this.form.phone = '';
    this.form.territory_id = '';
    this.form.password = '';
    this.form.password_confirmation = '';
    this.form.permissions = [];
    this.form.roles = [];
    this.form.status = true;
    this.form.code = '';
    this.form.is_report = false;
    this.disableBtn = false;
  }

  inputObject(except: any = null) {
    let inputs: UserForm = {
      name: this.form.name,
      email: this.form.email,
      address: this.form.address,
      phone: this.form.phone,
      password: this.form.password,
      password_confirmation: this.form.password_confirmation,
      gender: this.form.gender,
      territory_id: this.form.territory_id,
      active: this.form.status,
      code: this.form.code,
      is_report: this.form.is_report,
    }
    if (except) {
      except.forEach((key: keyof UserForm) => {
        delete inputs[key];
      })
    }
    return inputs;
  }

  createUser() {
    this.disableBtn = true;
    this.$http.post(this.$api("/users"), this.inputObject())
      .then(response => {
        var count = 0;
        this.form.permissions.forEach((permission: any) => {
          ++count;
          this.$http
            .post(this.$api(`/users/${response.data.user.id}/permissions`), {permission_id: permission})
        });
       // if (this.form.permissions.length == count) { // Permissions & Role are both assign at a time
          this.form.roles.forEach((role: any) => {
            this.$http
              .post(this.$api(`/users/${response.data.user.id}/roles`), {role_id: role})
          });
       // }
        this.$notify({
          title: 'Success',
          message: 'Successfully Created',
          duration: 5000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.$http.get(this.$api(`/users/${response.data.user.id}`)).then(responseUser => {
          this.afterCreate(responseUser.data.user);
        })
        this.formReset();
      })
      .catch(error => {
        this.disableBtn = false;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  async afterCreate(responseUser: any) {
    this.$emit('created', responseUser);
  }

  updateUser() {
    this.disableBtn = true;
    var updateForm: any = ''
    this.inputObject(['password', 'password_confirmation']);
    if (this.form.password == '') {
      updateForm = this.inputObject(['password', 'password_confirmation']);
    } else {
      updateForm = this.inputObject();
    }
    this.$http
      .patch(this.$api(`/users/${this.currentUser.id}`), updateForm)
      .then(response => {
        this.$notify({
          title: 'Success',
          message: 'Successfully Updated',
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.$emit('updated', response.data.user);
        this.formReset();
      })
      .catch(error => {
        this.disableBtn = false;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  save() {
    this.isUpdate ? this.updateUser() : this.createUser();
  }

  fetchRole() {
    this.$http.get(this.$api("/roles")).then(response => {
      this.roles = response.data.roles;
    });
  }

  fetchPermission() {
    this.$http.get(this.$api("/permissions")).then(response => {
      this.permissions = response.data.permissions;
    })
  }

  created() {
    this.fetchRole();
    this.fetchPermission();
  }

  close() {
    this.$parent.$emit('update:isActive', false);
    this.$emit('update:isActive', false);
    this.$emit('update:isUpdate', false);
    this.$emit('update:form', {
      name: '',
      email: '',
      address: '',
      gender: '',
      phone: '',
      territory_id: '',
      password: '',
      password_confirmation: '',
      permissions: [],
      roles: [],
      status: true,
      is_report: false
    });
  }

  async onClickResetUserDevice() {
    await this.$http.patch(this.$api("/users/" + this.currentUser.id + '/reset-device'))
    this.currentUser.device_id = null;
    this.$notify({title: 'Success', message: 'Device reset successfully.', type: 'success'})
  }

}
</script>
