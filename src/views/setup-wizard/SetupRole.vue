<template>
  <div>
    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to remove this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">No</base-button>
        <base-button type="danger" @click.prevent="removeEntity">Yes</base-button>
      </template>
    </modal>
    <CreateRole
      :current-role="isUpdate? currentEntity : null"
      :form.sync="form"
      :is-update.sync="isUpdate"
      :new-role.sync="isActive"
      :is-for-setup-wizard="true"
    >
      <template v-slot:footer="{ handleSubmit }">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" @click="handleSubmit(save)">Save</base-button>
      </template>
    </CreateRole>
    <div class="row pr-4">
      <div class="col-md-7 pl-5">
        <div class="row justify-content-center p-3">
          <div class="col col-4">
            <div class="row">
              <el-tooltip :content="userRolesPrimary[0].name" placement="left">
                <base-button type="success" size="sm" class="btn-block" style="pointer-events: none;">{{ userRolesPrimary[0].name }}</base-button>
              </el-tooltip>
              <div class="row justify-content-center mb-4 mt-2" style="margin-left: 45px">
                <div class="col col-3">
                                <span class="timeline-step badge-success small">
                                    <i class="fas fa-arrow-circle-down fa-sm"></i>
                                </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col col-2 mt-3">
            <div class="row justify-content-center">
              <a class="mt-0 ml-3" href="#!" @click.prevent="onEdit(userRolesPrimary[0]), (roleType = 'primary')">
                <i class="fas fa-edit fa-sm text-info"></i>
              </a>
              <el-tooltip class="ml-3" content="Root role cannot be deleted." placement="right">
                <i class="fas fa-info-circle fa-sm text-info" style="color: grey;font-size: 15px"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
        <hr class="divider-role">
        <div class="row">
          <div class="col-md-6">
            <div class="row justify-content-center mr-5" style="margin-bottom: 40px">
              <div class="col col-3">
                                <span class="timeline-step badge-success small">
                                    <i class="fas fa-arrow-circle-down fa-sm"></i>
                                </span>
              </div>
            </div>
            <div class="container" v-for="(territoryType, i) in userRoles" :key="i">
              <div class="row justify-content-start">
                <div class="col col-9">
                  <div class="row" :class="i > 0 ? 'mt-3' : ''">
                    <el-tooltip :content="territoryType.description" :disabled="!territoryType.description" placement="left">
                      <base-button type="success" size="sm" class="btn-block" style="pointer-events: none;">{{ territoryType.name }}</base-button>
                    </el-tooltip>
                  </div>
                  <div class="row justify-content-center mt-2 mb-4">
                    <div class="col col-3" v-if="i !== userRoles.length - 1">
              <span class="timeline-step badge-success small">
                <i class="fas fa-arrow-circle-down fa-sm"></i>
              </span>
                    </div>
                  </div>
                </div>
                <div class="col col-3 mt-2">
                  <div class="row justify-content-center">
                    <a class="mt-0 ml-3" href="#!" @click.prevent="onEdit(territoryType), (roleType = 'primary')">
                      <i class="fas fa-edit fa-sm text-info"></i>
                    </a>
                    <a class="mt-0 ml-3" href="#!" @click.prevent="(showDeleteModal = true), (currentEntity = territoryType), (roleType = 'primary')">
                      <i class="fas fa-trash fa-sm text-danger"></i>
                    </a>
                  </div>
                </div>
              </div>
              <br v-if="i !== userRolesPrimary.length - 1"/>
            </div>
          </div>
          <div class="col-md-6">
            <div class="row justify-content-center mr-4" style="margin-bottom: 40px">
              <div class="col col-3">
                                <span class="timeline-step badge-success small">
                                    <i class="fas fa-arrow-circle-down fa-sm"></i>
                                </span>
              </div>
            </div>
            <div class="container pl-5" v-for="(territoryType, i) in userRolesPrimary.slice(1)" :key="i">
              <div class="row justify-content-end">
                <div class="col col-9">
                  <div class="row" :class="i > 0 ? 'mt-3' : ''">
                    <el-tooltip :content="territoryType.description" :disabled="!territoryType.description" placement="left">
                      <base-button type="success" size="sm" class="btn-block" style="pointer-events: none;">{{ territoryType.name }}</base-button>
                    </el-tooltip>
                  </div>
                  <div class="row justify-content-center mt-2 mb-4">
                    <div class="col col-3" v-if="i !== userRolesPrimary.length - 2">
              <span class="timeline-step badge-success small">
                <i class="fas fa-arrow-circle-down fa-sm"></i>
              </span>
                    </div>
                  </div>
                </div>
                <div class="col col-3 mt-2">
                  <div class="row justify-content-center">
                    <a class="mt-0 ml-3" href="#!" @click.prevent="onEdit(territoryType), (roleType = 'secondary')">
                      <i class="fas fa-edit fa-sm text-info"></i>
                    </a>
                    <a class="mt-0 ml-3" href="#!"
                       @click.prevent="(showDeleteModal = true), (currentEntity = territoryType), (roleType = 'secondary')">
                      <i class="fas fa-trash fa-sm text-danger"></i>
                    </a>
                  </div>
                </div>
              </div>
              <br v-if="i !== userRolesPrimary.length - 1"/>
            </div>
          </div>
        </div>
        <div class="container pl-5">
          <div class="row justify-content-center">
            <div class="col col-2">
              <div class="row justify-content-center mt-0 mb-2">
                <div class="col col-3">
                  <el-tooltip content="Add New" placement="left">
                    <a @click.prevent="isActive = true" href="#!" class="timeline-step badge-info small">
                      <i class="fas fa-plus fa-sm"></i>
                    </a>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="col col-2"></div>
          </div>
        </div>
      </div>
      <div class="divider ml-5 shadow"></div>
      <div class="col-md-4 pl-3 pt-3 mt-2">
        <div class="text-center mb-3">
          <div class="form-inline">
            <h4>This is a proposed role structure, feel free to modify it.</h4>
          </div>
        </div>
        <h4>Instructions: </h4>
        <br>
        <div class="form-inline">
          <i class="fas fa-lightbulb fa-2x mr-3" style="color: yellow; font-size: 22px"></i>
          <span style="font-size: 12px"> Click on
                  <i class="fas fa-plus fa-sm text-info"></i>
                  to add your user role
                </span>
        </div>
        <br>
        <div class="form-inline">
          <i class="fas fa-lightbulb mr-3" style="color: yellow; font-size: 22px"></i>
          <span style="font-size: 12px"> Click on <i class="fas fa-edit fa-sm text-info"></i> to edit user role. </span>
        </div>
        <br>
        <div class="form-inline">
          <i class="fas fa-lightbulb fa-2x mr-3" style="color: yellow; font-size: 22px"></i>
          <span style="font-size: 12px"> Click on <i class="fas fa-trash fa-sm text-danger"></i> to delete user role. </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import TerritoryType from "../../intefaces/TerritoryType";
import CreateRole from "@/views/user/role/CreateRole.vue";
import {clone} from "lodash";
import Role from "@/intefaces/Role";

@Component({
  components: {
    CreateRole
  }
})
export default class SetupRole extends Vue {
  @Prop() userRolesPrimary!: Role[];
  @Prop() userRoles!: Role[];
  private showDeleteModal: boolean = false;
  private currentEntity: any = [];
  private roleType: any = '';
  private isUpdate: boolean = false;
  protected form: any = {
    name: '',
    label: '',
    permissions: []
  };
  private isActive: boolean = false;

  @Watch('userRolesPrimary')
  onChangeRolePrimary() {
    this.$emit('userRolesPrimary', this.userRolesPrimary);
  }

  @Watch('userRoles')
  onchageRole() {
    this.$emit('userRoles', this.userRoles);
  }


  onEdit(row: any) {
    this.isUpdate = true;
    this.currentEntity = row;
    this.form = {
      name: this.currentEntity.name,
      label: this.currentEntity.label,
      permissions: this.currentEntity.permissions,
    };
    this.isActive = true;
  }

  removeEntity() {
    this.showDeleteModal = false;
    if (this.roleType == 'primary') {
      this.userRoles.splice(
        this.userRoles.findIndex((value, index) => value.name == this.currentEntity.name),
        1
      );
    } else {
      this.userRolesPrimary.splice(
        this.userRolesPrimary.findIndex((value, index) => value.name == this.currentEntity.name),
        1
      );
    }
  }

  // Lifecycle hooks +++
  mounted() {
    this.$emit('userRolesPrimary', this.userRolesPrimary);
    this.$emit('userRoles', this.userRoles);
  }

  // Lifecycle hooks ---

  save() {
    if (this.isUpdate) {
      if (this.roleType == 'primary') {
        let itemIndex = this.userRoles.findIndex((value, index) => this.currentEntity.name == value.name);
        this.userRoles.splice(itemIndex, 1, clone(this.form));
      } else {
        let itemIndex = this.userRolesPrimary.findIndex((value, index) => this.currentEntity.name == value.name);
        this.userRolesPrimary.splice(itemIndex, 1, clone(this.form));
      }
    } else {
      if (this.roleType == 'primary') {
        this.userRoles.push(clone(this.form));
      } else {
        this.userRolesPrimary.push(clone(this.form));
      }
    }
    this.close();
  }

  close() {
    this.isActive = false;
    this.isUpdate = false;
    this.formReset();
  }

  formReset(): any {
    this.form.name = '';
    this.form.label = '';
    return this.form;
  }
}
</script>
<style scoped>
.divider-role {
  width: 300px;
}

.divider {
  width: 1px;
  margin: 6px 0;
  background: lightgray;
}
</style>
