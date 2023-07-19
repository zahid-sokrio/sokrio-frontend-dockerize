import swal from "sweetalert2";
<template>
  <modal :show="isActive" size="lg">
    <!--        <template slot="header">-->
    <div class="card-header">
      <div class="form-inline">
        <h1 style="font-size: 40px"><i class="fas fa-info-circle" style="color: dodgerblue"></i></h1>
        <h5 id="exampleModalLabel1" class="modal-title ml-2"> Set-up Summary </h5>
        <h5>You are about to create
          <el-tag type="success">
            <span>Territory types structure</span>
          </el-tag>
          ,
          <el-tag type="warning">
            <span> Channels structure </span>
          </el-tag>
          and
          <el-tag>
            <span> Roles structure </span>
          </el-tag>
          for your organization.
        </h5>
      </div>
    </div>
    <!--        </template>-->
    <div class="row m-1 justify-content-center">
      <div class="col-md-4 border shadow" style="background: #f0f9eb">
        <h5 class="text-center mt-2"> Territory Type Structure</h5>
        <summary-review-diagram
          :current-entities="territoryTypes"
          :step="1"
          @triggerEdit="updateTerritoryType"
        ></summary-review-diagram>
      </div>
      <!--            <div class="divider"></div>-->
      <div class="col-md-4 border shadow" style="background: #fdf6ec">
        <h5 class="text-center  mt-2"> Distribution Structure </h5>
        <summary-review-diagram
          :current-entities="departmentTypes"
          :step="2"
          @triggerEdit="updateChannels"
        ></summary-review-diagram>
      </div>
      <!--            <div class="divider"></div>-->
      <div class="col-md-4 border shadow" style="background: #ecf5ff">
        <h5 class="text-center mt-2"> Role Structure </h5>
        <div class="container p-2">
          <div class="row justify-content-center p-2">
            <!--                    <div class="col col-4">-->
            <div v-if="userRolesPrimary" class="row">
              <el-tooltip :content="userRolesPrimary[0].name" placement="left">
                <base-button class="btn-block p-1" size="sm" style="pointer-events: none;" type="secondary">{{
                    userRolesPrimary[0].name
                  }}
                </base-button>
              </el-tooltip>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="row justify-content-center">
                  <div class="col col-3">
                                <span class="small">
                                    <i class="fas fa-arrow-down fa-sm"></i>
                                </span>
                  </div>
                </div>
                <div v-for="(role, i) in userRoles" :key="i" class="container">
                  <div class="row justify-content-start">
                    <div class="col col-9">
                      <div class="row">
                        <el-tooltip :content="role.label" :disabled="!role.label" placement="left">
                          <base-button class="btn-block p-2" size="sm" style="pointer-events: none;" type="secondary">{{ role ? role.name : '' }}
                          </base-button>
                        </el-tooltip>
                      </div>
                      <div class="row justify-content-center">
                        <div v-if="i !== userRoles.length - 1" class="col col-3">
                                                  <span class="small">
                                                    <i class="fas fa-arrow-down fa-sm"></i>
                                                  </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br v-if="i !== userRoles.length - 1"/>
                </div>
              </div>
              <div class="col-md-6">
                <div class="row justify-content-center">
                  <div class="col col-3">
                                <span class="small">
                                    <i class="fas fa-arrow-down fa-sm"></i>
                                </span>
                  </div>
                </div>
                <div v-for="(role, i) in userRolesPrimary.slice(1)" :key="i" class="container">
                  <div class="row justify-content-end">
                    <div class="col col-9">
                      <div class="row">
                        <el-tooltip :content="role.label" :disabled="!role.label" placement="left">
                          <base-button class="btn-block p-1" size="sm" style="pointer-events: none;" type="secondary">{{
                              role ? role.name : ''
                            }}
                          </base-button>
                        </el-tooltip>
                      </div>
                      <div class="row justify-content-center">
                        <div v-if="i !== userRolesPrimary.length - 2" class="col col-3">
                                                  <span class="small">
                                                    <i class="fas fa-arrow-down fa-sm"></i>
                                                  </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br v-if="i !== userRolesPrimary.length - 1"/>
                </div>
              </div>
            </div>
            <!--                    </div>-->
          </div>
          <!--          <div class="row justify-content-center mb-1">-->
          <div class="row justify-content-center mb-2">
            <el-tooltip content="Edit" placement="left">
              <a class="step-edit badge-info small" href="#!" @click.prevent="updateStep">
                <i class="fas fa-edit"></i>
              </a>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <base-button :disabled="disabled" :loading="loading" type="success" @click.prevent="save">Save</base-button>
    </template>
  </modal>
</template>
<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Tag} from "element-ui";
import User from "@/intefaces/User";
import swal from 'sweetalert2';
import SummaryReviewDiagram from "@/views/setup-wizard/SummaryReviewDiagram.vue";
import {SetupWizardSteps} from "@/enums/SetupWizardSteps";

@Component({
  components: {
    [Tag.name]: Tag,
    SummaryReviewDiagram
  }
})
export default class SummaryReview extends Vue {
  @Prop() isActive!: boolean;
  @Prop() territoryTypes!: any[];
  @Prop() userRolesPrimary!: any[];
  @Prop() userRoles!: any[];
  @Prop() departmentTypes!: any[];
  private department: any = {
    address: '',
    badge_id: null,
    code: null,
    created_by: null,
    credit_limit: 0,
    department_type_id: 1,
    lat: null,
    long: null,
    name: '',
    outstanding_balance: 0,
    owner_name: '',
    phone_no: '',
    photo: '',
    photo_url: '',
    territory_id: 1,
    supplier: null,
    supplier_id: null
  };
  private disabled: boolean = false;
  private loading: boolean = false;
  private errorMsg: string = '';

  async save() {
    await this.saveSetupData();
  }

  updateStep() {
    this.$emit('updateRole', this.userRolesPrimary, this.userRoles)
    this.$store.dispatch('SetupWizard/updateCurrentStep', '3');

  }

  close() {
    this.$store.commit('SetupWizard/previousStep');
    this.$emit('update:isActive', false);
  }

  updateTerritoryType() {
    this.$emit('updatedTerritoryTypes', this.territoryTypes);
  }

  updateChannels() {
    this.$emit('updateChannels', this.departmentTypes);
  }

  private async saveSetupData() {
    var setupData: any = {};
    this.disabled = true;
    this.loading = true;
    setupData['territoryTypes'] = this.territoryTypes;
    setupData['departmentTypes'] = this.departmentTypes;
    setupData['roles'] = this.userRolesPrimary.concat(this.userRoles);
    let {data} = await this.$http.get(this.$api('/setup-wizard-status'))

    if(data.completed) {
      this.showWelcomeMessage(data.completed);
      this.$store.commit('SetupWizard/nextStep');
    } else {
      this.$http.post(this.$api('/setup-wizard'), setupData).then(response => {
        this.disabled = false;
        this.loading = false;
        this.showWelcomeMessage();
        this.$store.commit('SetupWizard/nextStep');
      })
        .catch(error => {
          this.errorMsg = error.response.data.message
          this.showErrorMessage();
          localStorage.setItem('currentStep', SetupWizardSteps.Welcome.toString());
          this.$store.commit('SetupWizard/errorStep');
          this.disabled = false;
          this.loading = false;
        });
    }
  }

  private async saveTerritoryTypeStructure() {
    let warehouse;
    for (let i = 0; i < this.territoryTypes.sort((a, b) => a.level - b.level).length; i++) {
      let {data} = await this.$http.post(this.$api('/territory-types'), this.territoryTypes[i]);
      if (i == 0) warehouse = data.territoryType;
    }
    let territory: any = {
      code: `${warehouse.name}-1`,
      managed_by: await this.$store.getters['Auth/user'].id,
      // name: `Default Territory for type ${warehouse.name}`,
      name: 'Bangladesh',
      parent_id: null,
      territory_type_id: 1
    };
    await this.$http.post(this.$api('/territories'), territory);
  }

  private async saveDepartmentTypeStructure() {
    for (let i = 0; i < this.departmentTypes.length; i++) {
      await this.$http.post(this.$api('/department-types'), this.departmentTypes[i]);
    }
    await this.saveWarehouse();
  }

  private async saveWarehouse() {
    let domain = await this.$store.getters['Auth/getDomain'];
    let user: User = await this.$store.getters['Auth/user'];
    this.department.name = domain.charAt(0).toUpperCase() + domain.slice(1) + ' central warehouse';
    this.department.code = `${domain}-warehouse-1`;
    this.department.owner_name = user.name;
    this.department.phone_no = user.phone || null;

    await this.$http.post(this.$api('/departments'), this.department);
  }

  private async saveRoleStructure() {
    for (let i = 0; i < this.userRoles.length; i++) {
      await this.$http.post(this.$api('/roles'), this.userRoles[i]);
    }
  }

  private showWelcomeMessage(setupWizardCompleted: boolean = false) {
    swal.fire({
      title: 'Congratulations!',
      text: setupWizardCompleted ? 'Looks like you have already completed the wizard.' : 'You have successfully set up your company profile.',
      icon: 'success',
      confirmButtonText: 'Next'
    });
  }

  private showErrorMessage() {
    swal.fire({
      title: 'Warning!',
      text: this.errorMsg,
      icon: 'error',
      confirmButtonText: 'Close'
    });
  }
}
</script>

<style scoped>
.step-edit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  left: 0;
  width: 33px;
  height: 33px;
  border-radius: 50%;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  z-index: 1;
}
</style>
