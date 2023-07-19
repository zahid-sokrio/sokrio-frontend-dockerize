<template>
  <div style="background-color: #162B4D">
    <!-- Header -->
    <div class="header bg-gradient-info py-7 py-lg-8 pt-lg-9">
      <div class="container">
        <div class="header-body text-center mb-7">
          <div class="row justify-content-center">
            <div class="col-xl-5 col-lg-6 col-md-8 px-5">
              <div class="d-flex justify-content-center">
                <img :src="`${$cdn}/img/logo.png`" alt="Sokrio" height="60px" />
              </div>
              <!-- <h1 class="text-white">Welcome!</h1> -->
              <p class="ml-3 mt-2 text-lead text-white text-center">
                Empowering Your Workforce.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100" />
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <div class="mt--9 p-5">
      <div class="row justify-content-center">
<!--        <div :class="currentStep == 1 ? 'col-lg-10' : 'col-lg-6'">-->
        <div class="col-lg-9">
          <div class="card bg-secondary border-0 mb-0">
            <div class="card-body px-lg-5 py-lg-5">
              <el-steps :active="active" finish-status="success" align-center>
                <el-step title="Choose Your Package"></el-step>
                <el-step title="Your Company Information"></el-step>
              </el-steps>
              <hr class="mt-0" />
              <PackageSelection @next="nextStep" :selected-package.sync="selectedPackage"  v-if="currentStep == 1"></PackageSelection>
              <RegisterInfo :selected-package.sync="selectedPackage" @previous="previousStep" v-else></RegisterInfo>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Radio, Steps, Step } from 'element-ui';
import RegisterInfo from '@/views/auth/Register/RegisterInfo.vue';
import PackageSelection from '@/views/auth/Register/PackageSelection.vue';
const auth = namespace('Auth');
@Component({
  components: {
    PackageSelection,
    RegisterInfo,
    [Steps.name]: Steps,
    [Step.name]: Step
  }
})
export default class Register extends Vue {
  currentStep: number = 1;
  active: number = 0;
  selectedPackage: any = {
    scheme_id: null,
    user_quota: null,
    coupon_code: null
  };

  nextStep() {
    this.currentStep = 2;
    this.active = 1;
  }
  previousStep() {
    this.currentStep = 1;
    this.active = 0;
  }




}
</script>
