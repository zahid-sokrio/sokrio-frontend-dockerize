<template>
  <modal size="lg" :show="setupModal" finish-status="success">
    <div class="card-header" v-if="currentStep != 0">
      <el-steps :active="currentStep - 1" finish-status="success" align-center>
        <el-step v-for="step in steps.slice(1)" :key="step.title">
          <template v-slot:title>
            {{ step.title }}
            <el-tooltip :content="step.description" placement="top">
              <i class="fa fa-info-circle"></i>
            </el-tooltip>
          </template>
        </el-step>
      </el-steps>
    </div>
    <br/>
    <component
      :is="currentStep == 4 ? steps[3].componentName : steps[currentStep].componentName"
      :territory-types.sync="territoryTypes"
      :department-types.sync="departmentTypes"
      :user-roles-primary.sync="userRolesPrimary"
      :user-roles.sync="userRoles"
      @territoryTypes="territoryTypes = $event"
      @departmentTypes="departmentTypes = $event"
      @userRoles="userRoles = $event"
      @userRolesPrimary="userRolesPrimary = $event"
      @department="department = $event"
    ></component>
    <SummaryReview
      v-if="currentStep == 4"
      :is-active.sync="isActive"
      :territory-types="territoryTypes"
      :user-roles="userRoles"
      :user-roles-primary="userRolesPrimary"
      :department-types="departmentTypes"
    ></SummaryReview>
    <template slot="footer">
      <base-button type="secondary" @click.prevent="previous()" v-if="currentStep > 0">
        <span v-text="'Previous'"></span>
      </base-button>
      <base-button v-if="currentStep < totalSteps" type="info" @click.prevent="next()">
        <span v-text="currentStep == 0 ? 'Start' : 'Next'"></span>
      </base-button>
      <base-button v-else type="info" @click.prevent="confirmationPermissionModal()">
        <span v-text="'Review'"></span>
      </base-button>
    </template>

    <modal :show.sync="confirmationAssignPermission">
      <template>
        <h5 class="modal-title p-2" id="exampleModalLabel1">You did not assign any permissions to the roles.</h5>
      </template>
      <template slot="footer">
        <base-button type="info" @click="confirmationAssignPermission = false">Assign Now</base-button>
        <base-button type="success" @click.prevent="(confirmationAssignPermission = false), next()">Later</base-button>
      </template>
    </modal>
  </modal>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {Step, Steps} from 'element-ui';
import User from '@/intefaces/User';
import SetupTerritory from '@/views/setup-wizard/SetupTerritory.vue';
import SetupOrganization from '@/views/setup-wizard/SetupOrganization.vue';
import SetupWarehouse from '@/views/setup-wizard/SetupWarehouse.vue';
import SetupRole from "@/views/setup-wizard/SetupRole.vue";
import TerritoryType from '@/intefaces/TerritoryType';
import DepartmentType from '@/intefaces/DepartmentType';
import {SetupWizardSteps} from '@/enums/SetupWizardSteps';
import Department from '@/intefaces/Department';
import swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import SummaryReview from "@/views/setup-wizard/SummaryReview.vue";
import SetupWelcome from "@/views/setup-wizard/SetupWelcome.vue";
import Role from "@/intefaces/Role";

@Component({
  components: {
    [Step.name]: Step,
    [Steps.name]: Steps,
    SetupTerritory,
    SetupOrganization,
    SetupWarehouse,
    SetupRole,
    SummaryReview,
    SetupWelcome
  }
})
export default class SetupWizard extends Vue {
  // private currentStep: SetupWizardSteps = SetupWizardSteps.TerritoryStructure;
  private confirmation: boolean = false;
  private setupModal: boolean = false;
  private isActive: boolean = false;
  private errorMessage: string = '';
  private confirmationAssignPermission: boolean = false;
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
  private disableNext: boolean = true;
  private loading: boolean = false;
  private territoryTypes: TerritoryType[] = [
    {name: 'Country', description: '', has_outlet: false, level: 1},
    {name: 'Division', description: '', has_outlet: false, level: 2},
    {name: 'District', description: '', has_outlet: false, level: 3},
    {name: 'Subdistrict', description: '', has_outlet: false, level: 4},
    {name: 'City', description: '', has_outlet: false, level: 5},
    {name: 'Route', description: '', has_outlet: true, level: 6}
  ];
  private departmentTypes: DepartmentType[] = [
    { name: 'Warehouse', label: '', has_outlet: false, self_managed: true },
    { name: 'Depo', label: '', has_outlet: false, self_managed: true },
    { name: 'Distributor', label: '', has_outlet: false, self_managed: false },
    { name: 'Dealer', label: '', has_outlet: false, self_managed: false },
    { name: 'Retailer', label: '', has_outlet: true, self_managed: false }
  ];
  private userRolesPrimary: Role[] = [
    { name: 'National Sales Director', label: 'National Sales Director', permissions: []},
    { name: 'Depo Manager', label: 'Depo Manager', permissions: [] },
    { name: 'Distribution Manager', label: 'Distribution Manager', permissions: []},
    { name: 'Dealer Manager', label: 'Dealer Manager', permissions: [] }
  ];
  private userRoles: Role[] = [
    { name: 'Divisional Manager', label: 'Divisional Manager', permissions: [] },
    { name: 'Regional Manager', label: 'Regional Manager', permissions: [] },
    { name: 'Area Manager', label: 'Area Manager', permissions: [] },
    { name: 'Sales Representative', label: 'Sales Representative', permissions: [] },
  ]


  mounted() {
    this.setupModal = this.isCompleted;
  }

  // Watchers +++++
  @Watch('department', {deep: true})
  @Watch('departmentTypes')
  @Watch('territoryTypes')
  @Watch('userRoles')
  onChangeTerritoryType() {
    switch (this.currentStep) {
      case SetupWizardSteps.TerritoryStructure:
        this.disableNext = this.territoryTypes.length == 0;
        break;
      case SetupWizardSteps.OrganizationStructure:
        this.disableNext = this.departmentTypes.length == 0;
        break;
      case SetupWizardSteps.RoleStructure:
        this.disableNext = this.userRoles.length == 0
        && this.territoryTypes.length == 0
        && this.departmentTypes.length == 0 ? false : true;
        break;
    }
  }

  @Watch('isCompleted')
  onChangeIsComplete(value: boolean) {
    this.setupModal = value;
  }

  // Watchers -----

  // Computed +++++
  get isCompleted() {
    return !this.$store.getters['SetupWizard/isCompleted'];
  }

  get currentStep(): SetupWizardSteps {
    return parseInt(this.$store.getters['SetupWizard/getCurrentStep']);
  }

  get totalSteps(): number {
    return this.steps.length - 1;
  }

  get steps(): any[] {
    return [
      {
        title: 'Welcome',
        componentName: 'SetupWelcome',
      },
      {
        title: 'Territory Types',
        componentName: 'SetupTerritory',
        description: 'Organize your territory typea according to your business need and local convention.'
      },
      {
        title: 'Channels',
        componentName: 'SetupOrganization',
        description: 'Organize your distributional channels to your business.'
      },
      {
        title: 'Roles',
        componentName: 'SetupRole',
        description: 'Organize your user roles according to your business.'
      }
    ];
  }

  // Computed ------
  async confirmationPermissionModal() {
    var permissionExist = false;
    if(this.currentStep == this.totalSteps) {
      this.userRolesPrimary.concat(this.userRoles).forEach((role: any) => {
        if( role.permissions?.length > 0 ){
          permissionExist = true;
          return
        }
      })
    }
    if (!permissionExist) {
      this.confirmationAssignPermission = true;
    } else {
      this.next();
    }
  }

  async next() {
    this.loading = true;
    this.confirmation = false;
    try {
      if (this.territoryTypes.length > 0 && this.departmentTypes.length > 0 && this.userRoles.length > 0) {
        this.isActive = true;
      } else {
        this.errorMessage = this.checkCondition();
      }
      if (this.currentStep != 4) {
        this.$store.commit('SetupWizard/nextStep');
        this.confirmation = false;
      }
    } catch (e) {
      this.$notify({message: 'Something Went Wrong', title: 'Error', type: 'warning'});
    } finally {
      this.loading = false;
    }
  }

  async previous() {
    this.$store.commit('SetupWizard/previousStep');
  }

  checkCondition(){
    if(this.territoryTypes.length === 0) {
      return ' Set your territory type structure';
    }
    else {
      if(this.territoryTypes.length === 0 ){
        return 'Set your inventory Structure'
      }
      else {
        if(this.userRoles.length === 0){
         return 'Set your role structure'
        }
        else {
          return 'necessary structure'
        }
      }
    }
  }
}
</script>
