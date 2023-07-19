<template>
  <div class="container login-container">
    <div class="row d-flex justify-content-center">
      <div class="col-12"><h1 class="text-center mb-5 welcome-sokrio">Welcome to Sokrio DMS</h1></div>
      <div class="col-md-6 login-form-1">
        <img :src="`${$cdn}/img/Sokrio-DMS-dashboard01.jpg`" width="100%" height="100%">
      </div>
      <div class="col-md-6 login-form-2">
        <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
          <form role="form" @submit.prevent="handleSubmit(onSubmit)">
            <div class="d-flex justify-content-center">
              <img :src="`${$cdn}/img/logo.png`" width="40%" class="mt-6">
            </div>
            <div><p class="ml-3 mt-2 text-center">
              Empowering Your Workforce
            </p></div>
            <div class="row mt-5">
              <div class="col-md-12">
                <base-input
                  label="Domain"
                  alternative
                  class="mb-3"
                  name="domain"
                  :rules="{ required: true, regex: /^[a-zA-Z0-9]*$/ }"
                  prepend-icon="ni ni-planet"
                  placeholder="e.g. sokrio"
                  v-model="fields.domain"
                >
                  <small slot="append" class="font-weight-bold">.sokrio.com</small>
                </base-input>
              </div>
            </div>
            <div class="pt-1">
              <span class="text-warning" style="font-size: 82%" v-if="domainError">Domain not found</span>
            </div>
            <div class="pt-2">
              <base-button :loading="loading" type="primary" native-type="submit">Next <i
                class="ni ni-bold-right"></i>
              </base-button>
            </div>
            <div class="py-4">
              Need an account? <a href="#" class="ForgetPwd" value="Register" @click.prevent="goToRegister">
              Register</a>
            </div>
          </form>
        </validation-observer>
      </div>
    </div>
    <content-footer></content-footer>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from "vuex-class";
import ContentFooter from "@/components/layouts/argon/ContentFooter.vue";

const auth = namespace('Auth');
@Component({
  components: {ContentFooter}
})
export default class Welcome extends Vue {

  private loading: boolean = false;
  private domainError: boolean = false;
  fields = {
    domain: ''
  };

  domainErrorNotification() {
    this.$notify({
      title: 'Error',
      message: 'Domain not found',
      type: 'warning',
      position: 'top-left',
      duration: 5000,
      iconClass: 'ni ni-bell-55'
    });
  }

  async onSubmit() {
    await Vue.prototype.$http.get(Vue.prototype.$landLordApi('/sanctum/csrf-cookie', true));
    this.$http.post(Vue.prototype.$landLordApi('/validate-org'), {domain: this.fields.domain}).then(response => {
      if (response.status == 200) {
        window.location.replace(this.$appBaseUrl.replace('app', this.fields.domain));
      } else {
        this.domainErrorNotification();
        this.domainError = true;
      }
    }).catch(error => {
      if (error.response.status === 404) {
        this.domainError = true;
        this.domainErrorNotification();
      }
    })
  }

  goToRegister() {
    this.$router.push("register")
  }
}


</script>
<style scoped>
.login-container {
  margin-top: 5%;
  margin-bottom: 5%;
}

.login-form-2 {
  padding: 5%;
  background: #f5f9fa;;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 16px 0 rgba(0, 0, 0, 0.19);
}

@media only screen and (max-width: 768px) {
  .login-form-1 {
    display: none !important;
  }

  .welcome-sokrio {
    display: none !important;
  }

}
</style>
