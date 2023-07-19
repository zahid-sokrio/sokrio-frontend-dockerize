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

    <CreateTerritoryTypeFrom
      :currentEntity="isUpdate ? currentEntity : null"
      :form.sync="form"
      :available-territory-types="territoryTypes"
      :is-update.sync="isUpdate"
      :is-active.sync="isActive"
      :has-outlet.sync="hasOutlet"
    >
      <template v-slot:footer="{ handleSubmit }">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" @click="handleSubmit(save)">Save</base-button>
      </template>
    </CreateTerritoryTypeFrom>
    <div class="row pr-4">
      <div class="col-md-7">
        <div class="container pl-5" v-for="(territoryType, i) in territoryTypeByLevel" :key="territoryType.level">
          <div class="row justify-content-end">
            <div class="col col-2">
              <div class="row" :class="i > 0 ? 'mt-3' : ''">
                <el-tooltip :content="territoryType.description" :disabled="!territoryType.description" placement="left">
                  <base-button type="success" size="sm" class="btn-block" style="pointer-events: none;">{{ territoryType.name }}</base-button>
                </el-tooltip>
              </div>
              <div class="row justify-content-center mt-2 mb-4">
                <div class="col col-3" v-if="i !== territoryTypes.length - 1">
              <span class="timeline-step badge-success small">
                <i class="fas fa-arrow-circle-down fa-sm"></i>
              </span>
                </div>
              </div>
            </div>
            <div class="col col-2">
              <div class="row justify-content-md-center">
                <a class="mt-0 ml-3" href="#!" @click.prevent="onEdit(territoryType)">
                  <i class="fas fa-edit fa-sm text-info"></i>
                </a>
                <el-tooltip class="ml-3" content="Root territory type cannot be deleted." placement="right"
                            v-if="i == 0">
                  <i class="fas fa-info-circle fa-sm text-info" style="color: grey;font-size: 15px"></i>
                </el-tooltip>
                <a class="mt-0 ml-3" href="#!" @click.prevent="(showDeleteModal = true), (currentEntity = territoryType)"
                   v-if="i != 0">
                  <i class="fas fa-trash fa-sm text-danger"></i>
                </a>
              </div>
            </div>
          </div>
          <br v-if="i !== territoryTypes.length - 1"/>
        </div>
        <div class="container pl-5">
          <div class="row justify-content-end">
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
            <h4>This is a proposed territory structure, feel free to modify it.</h4>
          </div>
        </div>
        <h4>Instructions: </h4>
        <br>
        <div class="form-inline">
          <i class="fas fa-lightbulb fa-2x mr-3" style="color: yellow; font-size: 22px"></i>
          <span style="font-size: 12px"> Click on
                  <i class="fas fa-plus fa-sm text-info"></i>
                  to add your territory type
                </span>
        </div>
        <br>
        <div class="form-inline">
          <i class="fas fa-lightbulb mr-3" style="color: yellow; font-size: 22px"></i>
          <span style="font-size: 12px"> Click on <i class="fas fa-edit fa-sm text-info"></i> to edit territory type. </span>
        </div>
        <br>
        <div class="form-inline">
          <i class="fas fa-lightbulb fa-2x mr-3" style="color: yellow; font-size: 22px"></i>
          <span style="font-size: 12px"> Click on <i class="fas fa-trash fa-sm text-danger"></i> to delete territory type. </span>
        </div>
        <!--        <a href="#"> <small> Learn More </small> </a>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import TerritoryType from '@/intefaces/TerritoryType';
import CreateTerritoryForm from '@/views/territory/CreateTerritoryForm.vue';
import CreateTerritoryTypeFrom from '@/views/territory/CreateTerritoryTypeFrom.vue';
import {clone} from 'lodash';

@Component({
  components: {CreateTerritoryTypeFrom, CreateTerritoryForm}
})
export default class SetupTerritory extends Vue {
  @Prop() territoryTypes!: any[];
  private showDeleteModal: boolean = false;
  private isUpdate: boolean = false;
  private isActive: boolean = false;
  private hasOutlet: boolean = false;
  protected form: TerritoryType = {
    name: '',
    description: '',
    has_outlet: false,
    level: 1
  };

  private currentEntity!: TerritoryType;

  // Lifecycle hooks +++
  mounted() {
    this.$emit('territoryTypes', this.territoryTypes);
    this.checkTerritoryTypesHasOutlet();
  }

  // Lifecycle hooks ---

  // Watcher +++
  @Watch('territoryTypes')
  onChangeTerritoryType() {
    this.$emit('territoryTypes', this.territoryTypes);
  }

  // Watcher ---

  // Computed property +++
  get territoryTypeByLevel(): TerritoryType[] {
    return this.territoryTypes.sort((a, b) => a.level - b.level);
  }

  // Computed property ---

  onEdit(row: TerritoryType) {
    this.isUpdate = true;
    this.currentEntity = row;
    this.form = {
      name: this.currentEntity.name,
      description: this.currentEntity.description,
      has_outlet: this.currentEntity.has_outlet ? true : false,
      level: this.currentEntity.level
    };
    this.isActive = true;
  }

  removeEntity() {
    this.showDeleteModal = false;
    if (this.territoryTypes.find((value, index: number) => value.level == this.currentEntity.level).has_outlet) {
      this.territoryTypes[this.territoryTypes.length ===
      this.currentEntity.level ? this.territoryTypes.length - 2 : this.territoryTypes.length - 1].has_outlet = true;
    }
    this.territoryTypes.splice(
      this.territoryTypes.findIndex((value, index) => value.level == this.currentEntity.level),
      1
    );
    this.resortTheLevel();
  }

  resortTheLevel() {
    this.territoryTypeByLevel.forEach((value, index) => {
      this.territoryTypes[this.territoryTypes.findIndex(value1 => value.level == value1.level)].level = index + 1;
    });
  }

  checkTerritoryTypesHasOutlet() {
    this.territoryTypes.forEach((territoryType: any) => {
      if (territoryType.has_outlet == 1) {
        this.hasOutlet = true;
      }
    })
  }

  save() {
    if (this.isUpdate) {
      let indexOfSwapTerritoryType = this.territoryTypes.findIndex((value, index) => this.form.level == value.level);
      let indexOfTargetTerritoryType = this.territoryTypes.findIndex((value, index) => value.level == this.currentEntity.level);
      if (this.form.level !== this.currentEntity.level) {
        this.territoryTypes[indexOfSwapTerritoryType].level = this.currentEntity.level;
      }
      this.territoryTypes.splice(indexOfTargetTerritoryType, 1, clone(this.form));
    } else {
      this.territoryTypes.forEach(value => {
        if (value.level >= this.form.level) {
          value.level++;
        }
      });
      this.territoryTypes.push(clone(this.form));
    }
    this.checkTerritoryTypesHasOutlet();
    this.close();
  }

  close() {
    this.isActive = false;
    this.isUpdate = false;
    this.formReset();
  }

  formReset(): any {
    this.form.name = '';
    this.form.description = '';
    this.form.has_outlet = false;
    this.form.level = 1;
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

ul {
  list-style: none;
  padding: 0;
}
</style>
