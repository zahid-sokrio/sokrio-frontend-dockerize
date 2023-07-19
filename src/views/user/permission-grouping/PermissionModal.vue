<template>
  <modal :show="isActive" @close="close" aria-hidden="true" class="modal-dialog-scrollable" size="lg">
    <template slot="header">
      <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New' }} Permission</h5>
    </template>
    <div>

      <div class="row">
        <div :key="index" class="col-md-6" v-for="(permission, index) in permissions">
          <div class="card p-2">
            <PermissionGroup
              :checked-permission.sync="formPermissions"
              :current-role="currentRole"
              :index="index"
              :is-update.sync="isUpdate"
              :permission="permission"
              @handleCheckChange="handleCheckChange($event)"
            ></PermissionGroup>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div class="form-inline">
        <span style="color: red">{{ errorMessage }}</span>
        <base-button @click="close" type="secondary">Close</base-button>
        <base-button @click="save" type="success">Save</base-button>
      </div>
    </template>
  </modal>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import Permissions from '@/data/Permission.ts';
import PermissionGroup from "@/views/user/permission-grouping/PermissionGroup.vue";
import Permission from "@/intefaces/Permission";

@Component({
  components: {
    PermissionGroup,
  }
})
export default class PermissionModal extends Vue {
  @Prop() isActive!: boolean;
  @Prop() isUpdate!: boolean;
  @Prop() formPermissions!: any;
  @Prop() currentRole!: any;
  @Prop() isForSetupWizard!: boolean | string;
  @Prop({default: ''}) errorMessage!: string;
  public checkedPermissions: any[] = [];
  private updateDeletedPermission = false;
  private updatePermission = false;
  private updateCheckedPermission: any[] = [];

  get permissions() {
    return this.$store.getters['Auth/permissionGroup']
  }
  //TODO: Optimize this function to handle element-tree
  handleCheckChange(event: any) {
    let allPermission = localStorage.getItem('allPermissions');
    let allPermissionArray: Permission[] = [];
    allPermissionArray = typeof allPermission == 'string' ? JSON.parse(allPermission) : allPermission;
    if (this.errorMessage) {
      this.$emit('update:errorMessage', '');
    }
    //Add depended permission
    if (event.indeterminate && event.checked.id && !this.checkedPermissions.includes(event.checked.id) &&
      ![1000, 2000].includes(event.checked.id)) {
      this.updatePermission = true;
      this.checkedPermissions.push(event.checked.id)
      if
      (this.isUpdate && !this.isForSetupWizard && !this.updateCheckedPermission.includes(event.checked.id)) {
        this.updateCheckedPermission.push(event.checked.id)
      }
      this.$emit('checkedPermissions', this.checkedPermissions)
      let splitPermissionLevel = event.checked.label.split(" ");
      if (['Create', 'Update', 'Delete'].includes(event.checked.label.split(" ")[0])) {
        this.getDepandedPermission(event, event.checked.label.split(" ").slice(1).join(' '), allPermissionArray)
      } else if (event.checked.label.split(" ").slice(1).join(' ') == 'Settings') {
        this.getDepandedPermission(event, event.checked.label.split(" ").slice(1).join(' '), allPermissionArray)
      } else if (splitPermissionLevel[splitPermissionLevel.length - 1] == 'Report') {
        this.getDepandedPermission(event, splitPermissionLevel[splitPermissionLevel.length - 1], allPermissionArray)
      } else if (event.checked.name == 'leaveRequestMobile') {
        this.getDepandedPermission(event, 'leaveRequestMobile', allPermissionArray)
      }
      if(this.isUpdate && !this.isForSetupWizard) {  //Logic for or on check update
        this.$emit('updatePermission', [event, this.updateCheckedPermission])
        this.updateCheckedPermission = [];
      }
    }
    // Handle delete depended permission
    else if (!event.indeterminate && event.checked.id && ![1000, 2000].includes(event.checked.id)) {
      this.updateDeletedPermission = true;
      var getUncheckedPermission: any[] = [];
      var getDependedPermission: any[] = [];
      if (this.checkedPermissions.includes(event.checked.id)) {
        if (!getUncheckedPermission.includes(event.checked.id)) {
          getUncheckedPermission.push(event.checked.id)
          if (event.checked.label.split(" ")[0] == 'View' || event.checked.name == 'leaveRequestMobile') {
            allPermissionArray.filter(function (result: any) {
              if (event.checked.label.split(" ").slice(1).join(' ') == result.label.split(" ").slice(1).join(' ') &&
                result.label.split(" ")[0] != 'View') {
                getDependedPermission.push(result.id)
              } else if (result.name == 'createLeave') {
                getDependedPermission.push(result.id)
              }
            })
          }
          getDependedPermission.forEach((permission: any) => {
            if (this.checkedPermissions.includes(permission)) {
              getUncheckedPermission.push(permission);
            }
          })
        }
        getUncheckedPermission.forEach((permission: any) => {
          this.checkedPermissions.splice(this.checkedPermissions.findIndex((checkedPermission: any) =>
            checkedPermission == permission), 1);
        })
        if(this.isUpdate && !this.isForSetupWizard) {
          this.$emit('updatePermission', [event, getUncheckedPermission])
        }
      }
    }
  }

  getDepandedPermission(event: any, permissionFor: any, allPermissionArray: Permission[]) {
    let depandedPermission = '';
    allPermissionArray.filter(function (result: any) {
      if (result.label.split(" ")[0] == 'View' && result.label.split(" ").slice(1).join(' ') ==
        permissionFor) {
        depandedPermission = result.id;
      } else if (result.label == 'Update Setting' && permissionFor == 'Settings') {
        depandedPermission = result.id;
      } else if (result.name == 'createLeave') {
        depandedPermission = result.id;
      }
    })
    if (this.checkedPermissions.includes(depandedPermission) == false) {
      this.checkedPermissions.push(depandedPermission);
      if (this.isUpdate && !this.isForSetupWizard) { //Logic for or on check update
        this.updateCheckedPermission.push(depandedPermission)
      }
      this.$emit('checkedPermissions', this.checkedPermissions);
    }
    return;
  }

  @Watch('updateDeletedPermission')
  onUpdate(newVal: any) {
    if(newVal && this.isUpdate) {
      this.checkedPermissions = this.formPermissions;
    }
  }

  @Watch('isActive')
  onUpdatePermission(newVal: any) {
    if(newVal && this.isUpdate) {
      this.checkedPermissions = this.formPermissions;
    }
  }

  save() {
    this.$emit('checkedPermissions', this.checkedPermissions);
    this.$emit('update:isActive', false);
    this.$emit('update:errorMessage', '');
    this.updatePermission = false;
    this.updateDeletedPermission = false;
  }

  close() {
    this.$emit('update:isActive', false);
    this.$emit('update:errorMessage', '');
    this.updatePermission = false;
    this.updateDeletedPermission = false;
  }
}
</script>
