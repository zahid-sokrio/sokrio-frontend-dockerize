<template>
  <div class="bg-secondary">
    <!-- Header -->
    <div class="header py-7 py-lg-8 pt-lg-9">
      <div class="container">
        <div class="header-body text-center mb-7">
          <div class="row justify-content-center">
            <div class="col-xl-5 col-lg-6 col-md-8 px-5">
              <div class="d-flex justify-content-center">
                <async-image-for-land-lord v-slot="slotProps" v-if="logo && logo != 'null'"
                                           :url="logo" alt="Logo" height="60px">
                  <img class="navbar-brand-img" :src="slotProps.imageSrc" alt="Logo"/>
                </async-image-for-land-lord>
              </div>
              <!--              <p class="ml-3 mt-2 text-gray text-center font-weight-600">Empowering Your Workforce</p>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Page content -->
    <div class="container pb-5">
      <div class="row justify-content-center">
        <div class="col-lg-6 mt--8 vh-100">
          <div class="card bg-neutral border-0 mb-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="text-center mb-4">
                <p class="text-blue text-xl font-weight-900" style="max-height: 15px;">Sokrio Login</p>
                <p class="text-sokrio text-md font-weight-600">({{
                     orgName.charAt(0).toUpperCase() + orgName.slice(1)
                  }})</p>
                <p class="text-muted font-weight-500">Log in to your Sokrio DMS account.</p>
              </div>
              <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
                <form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input
                    label="Email"
                    alternative
                    class="mb-3"
                    name="email"
                    :rules="{ required: true, email: true }"
                    prepend-icon="ni ni-email-83"
                    placeholder="yourname@email.com"
                    v-model="fields.email"
                  ></base-input>

                  <base-input
                    label="Password"
                    alternative
                    class="mb-3"
                    name="password"
                    :rules="{ required: true }"
                    prepend-icon="ni ni-lock-circle-open"
                    type="password"
                    placeholder="**********"
                    v-model="fields.password"
                  ></base-input>

                  <base-checkbox v-model="fields.remember_me">Remember me</base-checkbox>
                  <div class="py-3">
                    <span class="text-warning" style="font-size: 82%" v-if="showError">{{ error }}</span>
                  </div>
                  <div>
                    <base-button block size="lg" type="primary" :loading="loading" native-type="submit" class="my-4"
                    ><i class="ni ni-check-bold"></i>Sign in
                    </base-button
                    >
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mt--8 vh-100">
          <img height="400" width="600" :src="`${$cdn}/img/svg/report.svg`" alt="Report"/>
        </div>
        <p class="text-muted text-center font-weight-500">
          &copy; {{ new Date().getFullYear() }}, <a href="https://sokrio.com">Sokrio Technologies Ltd.</a>
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import AsyncImageForLandLord from "@/components/AsyncImageForLandLord.vue";

const auth = namespace('Auth');
@Component({
  components: {AsyncImageForLandLord}
})
export default class Login extends Vue {
  fields = {
    email: '',
    password: '',
    device_name: '',
    remember_me: false,
  };
  private showError: boolean = false;
  private error: string = '';
  private loading: boolean = false;
  private is_validateRoute: boolean = false;

  get logo() {
    return this.$store.getters['Theme/orgLogo'];
  }

  get orgName() {
    return this.$store.getters['Theme/orgName'];
  }

  @auth.Getter
  public isLoggedIn!: boolean;

  @auth.Action
  public login!: (payload: any) => Promise<any>;

  loginErrorNotification(message: string) {
    this.$notify({
      title: 'Error',
      message: message,
      type: 'warning',
      position: 'top-left',
      duration: 5000,
      iconClass: 'ni ni-bell-55',
    });
  }

  get permissionmenu() {
    return this.$store.getters['Auth/menus'];
  }

  onSubmit() {
    this.fields.device_name = navigator.userAgent;
    this.loading = true;
    this.login({vm: this, fields: this.fields})
      .then((response) => {
        this.$notify({
          title: 'Success',
          message: 'Login successful',
          duration: 5000,
          iconClass: 'ni ni-bell-55',
          type: 'success',
        });
        this.permissionmenu.forEach((menu: any) => {
          if (Object.values(menu)[0] === true && !this.is_validateRoute) {
            this.is_validateRoute = true;
            return this.$router.push({name: Object.keys(menu)[0]});
          }
        });
      })
      .catch((error) => {
        this.error = error.response.data.errors.message[0];
        this.showError = true;
        this.loginErrorNotification(error.response.data.errors.message[0]);
      })
      .finally(() => (this.loading = false));
  }
}
</script>

<style scoped>
/* @import "~sweetalert2/dist/sweetalert2.css"; */
</style>
