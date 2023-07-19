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

    <CreateChannelForm
      :currentEntity="isUpdate ? currentEntity : null"
      :form.sync="form"
      :available-territory-types="departmentTypes"
      :is-update.sync="isUpdate"
      :is-active.sync="isActive"
    >
      <template v-slot:footer="{ handleSubmit }">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" @click="handleSubmit(save)">Save</base-button>
      </template>
    </CreateChannelForm>
    <div class="row pr-4">
      <div class="col-md-7">
    <div class="container pl-5" v-for="(department, i) in departmentTypes" :key="department.level">
      <div class="row justify-content-end">
        <div class="col col-2">
          <div class="row" :class="i > 0 ? 'mt-3' : ''">
            <el-tooltip :disabled="!department.label" :content="department.label" placement="left">
              <base-button type="success" class="btn-block" size="sm" style="pointer-events: none;">{{ department.name }}</base-button>
            </el-tooltip>
          </div>
          <div class="row justify-content-center mt-2 mb-4">
            <div class="col col-3" v-if="i !== departmentTypes.length - 1">
              <span class="timeline-step badge-success">
                <i class="fas fa-arrow-circle-down fa-sm"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="col col-2">
          <div class="row justify-content-md-center">
            <a class="mt-0 ml-4" href="#!" @click.prevent="onEdit(department)">
              <i class="fas fa-edit fa-sm text-info"></i>
            </a>
            <el-tooltip class="ml-3" content="Root distributor channel cannot be deleted." placement="right"
                        v-if="i == 0">
              <i class="fas fa-info-circle fa-sm text-info" style="color: grey;font-size: 15px"></i>
            </el-tooltip>
            <a class="mt-0 ml-4" href="#!" @click.prevent="(showDeleteModal = true), (currentEntity = department)"
               v-if="i != 0">
              <i class="fas fa-trash fa-sm text-danger"></i>
            </a>
          </div>
        </div>
      </div>
      <br v-if="i !== departmentTypes.length - 1" />
    </div>
    <div class="container pl-5">
      <div class="row justify-content-end">
        <div class="col col-2">
          <div class="row justify-content-center mt-0 mb-2">
            <div class="col col-3">
              <el-tooltip content="Add New" placement="left">
                <a @click.prevent="isActive = true" href="#!" class="timeline-step badge-info">
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
            <h4>This is a proposed distribution structure, feel free to modify it.</h4>
          </div>
        </div>
        <h4>Instructions: </h4>
        <br>
        <div class="form-inline">
          <i class="fas fa-lightbulb fa-2x mr-3" style="color: yellow; font-size: 22px"></i>
          <span style="font-size: 12px"> Click on
                  <i  class="fas fa-plus fa-sm text-info"></i>
                  to add your distribution.
                </span>
        </div>
        <br>
        <div class="form-inline">
          <i class="fas fa-lightbulb mr-3" style="color: yellow; font-size: 22px"></i>
          <span style="font-size: 12px"> Click on <i class="fas fa-edit fa-sm text-info"></i> to edit distribution. </span>
        </div>
        <br>
        <div class="form-inline">
          <i class="fas fa-lightbulb fa-2x mr-3" style="color: yellow; font-size: 22px"></i>
          <span style="font-size: 12px"> Click on <i class="fas fa-trash fa-sm text-danger"></i> to delete distribution. </span>
        </div>
        <!--        <a href="#"> <small> Learn More </small> </a>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import DepartmentType from '@/intefaces/DepartmentType';
import CreateChannelForm from '@/views/department/CreateChannelForm.vue';
import { clone } from 'lodash';
@Component({
  components: { CreateChannelForm }
})
export default class SetupOrganization extends Vue {
  @Prop() departmentTypes !: DepartmentType[];
  private showDeleteModal: boolean = false;
  private isUpdate: boolean = false;
  private isActive: boolean = false;
  protected form: DepartmentType = {
    label: '',
    name: '',
    has_outlet: false,
    self_managed: false
  };
  private currentEntity!: DepartmentType;

  // Lifecycle hooks +++
  mounted() {
    this.$emit('departmentTypes', this.departmentTypes);
  }
  // Lifecycle hooks ---

  // Watcher +++
  @Watch('departmentTypes')
  onChangeDepartmentType() {
    this.$emit('departmentTypes', this.departmentTypes);
  }
  // Watcher ---

  onEdit(row: DepartmentType) {
    this.isUpdate = true;
    this.currentEntity = row;
    this.form = {
      self_managed: this.currentEntity.self_managed ? true : false,
      name: this.currentEntity.name,
      label: this.currentEntity.label,
      has_outlet: this.currentEntity.has_outlet ? true : false
    };
    this.isActive = true;
  }

  onClickAdd() {
    this.isActive = true;
  }

  removeEntity() {
    this.showDeleteModal = false;
    this.departmentTypes.splice(
      this.departmentTypes.findIndex((value, index) => value.name == this.currentEntity.name),
      1
    );
  }

  save() {
    if (this.isUpdate) {
      let itemIndex = this.departmentTypes.findIndex((value, index) => this.currentEntity.name == value.name);
      this.departmentTypes.splice(itemIndex, 1, clone(this.form));
    } else {
      this.departmentTypes.push(clone(this.form));
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
    this.form.has_outlet = false;
    this.form.self_managed=false;
    return this.form;
  }
}
</script>

<style scoped>
  .divider {
    width: 1px;
    margin: 6px 0;
    background: lightgray;
  }
</style>
