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
    <div class="container pb-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7 mt--8 vh-100">
          <div class="card bg-secondary border-0 mb-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="text-center mb-4">
                <p class="text-blue text-xl font-weight-900">Sokrio Admin</p>
                <p class="text-muted">Log in to your Sokrio Admin account.</p>
              </div>
              <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
                <form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input
                    alternative
                    class="mb-3"
                    name="Email"
                    :rules="{ required: true, email: true }"
                    prepend-icon="ni ni-email-83"
                    placeholder="Email"
                    v-model="fields.email"
                  ></base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    name="Password"
                    :rules="{ required: true, min: 6 }"
                    prepend-icon="ni ni-lock-circle-open"
                    type="password"
                    placeholder="Password"
                    v-model="fields.password"
                  ></base-input>

                  <base-checkbox v-model="fields.remember_me">Remember me</base-checkbox>
                  <div class="text-center">
                    <base-button type="primary" :loading="loading" native-type="submit" class="my-4">Sign in</base-button>
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// import swal from "sweetalert2";

import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { ElNotificationOptions } from 'element-ui/types/notification';

const auth = namespace('AdminAuth');
@Component
export default class AdminLogin extends Vue {
  private loading: boolean = false;
  fields = {
    email: '',
    password: '',
    device_name: '',
    remember_me: false
  };

  @auth.Getter
  public isLoggedIn!: boolean;

  @auth.Action
  public login!: (payload: any) => Promise<any>;

  notifyTopLeft() {
    this.$notify({
      title: 'Foo',
      message: 'Incorrect username or password.',
      type: 'warning',
      position: 'top-left',
      duration: 5000,
      iconClass: 'ni ni-bell-55'
    });
  }

  async onSubmit() {
    this.loading = true;
    this.fields.device_name = navigator.userAgent;
    try {
      await this.login({ vm: this, fields: this.fields });
      this.$notify({
        title: 'Success',
        message: 'Login successful',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
      await this.$router.push({ name: 'admin-home' });
    } catch (error) {
      if (error.response.status === 422) {
        this.$notify({
          title: 'Error',
          message: 'Incorrect username or password.',
          duration: 5000,
          iconClass: 'ni ni-bell-55',
          type: 'warning'
        });
      }
    } finally {
      this.loading = false;
    }
  }

  mounted() {
    // swal.fire("The Internet?", "That thing is still around?", "question");
  }
}
</script>
