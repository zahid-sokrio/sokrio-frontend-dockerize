<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <form role="form" @submit.prevent="handleSubmit(onSubmit)">
      <div class="row">
        <div class="col-md-6">
          <base-input
            label="Domain"
            alternative
            class="mb-3"
            name="domain"
            :rules="{ required: true, regex: /(?![0-9._-])(^(?![0-9._-])(?!.*[._]$)(?!.*\d_)(?!.*_\d))[a-zA-Z0-9]+$/, min: 3 }"
            prepend-icon="ni ni-planet"
            placeholder="e.g. sokrio"
            v-model="fields.domain"
          >
            <small slot="append" class="font-weight-bold">.sokrio.com</small>
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input
            label="Organization Name"
            alternative
            class="mb-3"
            name="org_name"
            :rules="{ required: true }"
            prepend-icon="ni ni-shop"
            placeholder="e.g. Sokrio Technologies Ltd."
            v-model="fields.org_name"
          ></base-input>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <base-input
            label="Your Name"
            alternative
            class="mb-3"
            name="name"
            :rules="{ required: true }"
            prepend-icon="ni ni-circle-08"
            placeholder="e.g. John Doe"
            v-model="fields.name"
          ></base-input>
        </div>
        <div class="col-md-6">
          <base-input
            label="Your Email"
            alternative
            class="mb-3"
            name="email"
            :rules="{ required: true, email: true }"
            prepend-icon="ni ni-email-83"
            placeholder="e.g. john@example.com"
            v-model="fields.email"
          ></base-input>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <base-input
            label="Password"
            alternative
            class="mb-3"
            name="password"
            :rules="{ required: true, min: 6 }"
            prepend-icon="ni ni-lock-circle-open"
            :type="showPassword ? 'type' : 'password'"
            placeholder="******"
            v-model="fields.password"
          >
            <template slot="append"
            ><i @mouseover="showPassword = true" @mouseleave="showPassword = false"
                :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i
            ></template>
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input
            label="Confirm Password"
            alternative
            class="mb-3"
            name="password_confirmation"
            :rules="{ required: true, min: 6 }"
            prepend-icon="ni ni-lock-circle-open"
            type="password"
            placeholder="Re-type password"
            v-model="fields.password_confirmation"
          ></base-input>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-6">
              <base-input label="Country">
                <el-select v-model="countryIndex" filterable placeholder="Select Country Code" class="Elselect">
                  <el-option v-for="(countryCode, index) in countryCodes" :key="countryCode.key"
                             :label="countryCode.name" :value="index">
                  </el-option>
                </el-select>
              </base-input>
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-12">
                  <base-input
                    label="Number (Optional)"
                    alternative
                    class="mb-3 mt-3"
                    name="phone"
                    type="number"
                    :rules="{ length: maxPhoneDigit }"
                    placeholder="e.g. 0123456789"
                    v-model="phoneNumber"
                    min="0"
                    :length="maxPhoneDigit"
                  >
                    <template slot="prepend"
                    ><span style="font-size: 0.74rem"> +{{ countryPhoneCode }} </span></template
                    >
                  </base-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <base-input label="I am a (Optional)">
            <select v-model="fields.gender" class="form-control">
              <option value="">Select Gender</option>
              <option value="m">Male</option>
              <option value="f">Female</option>
              <option value="o">Prefer not to say</option>
            </select>
          </base-input>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <base-input label="Your Address (Optional)" alternative class="mb-3" name="address"
                      :rules="{ required: false }"
                      v-model="fields.address"><textarea class="form-control" rows="3"
                                                         placeholder="e.g. Shap-21, 131/1, BCC Road, Dhaka"></textarea>
          </base-input>
        </div>
        <div class="col-6">
          <div>
            <base-input name="logo" type="file"
                        label="Logo (Optional)">
              <single-image-uploader
                class="pt-3 pb-3 bg-white"
                :img.sync="image"
                image-max-height="60px"
                uploadText="Select Image"
              ></single-image-uploader>
            </base-input>
          </div>
        </div>
      </div>
      <div class="text-center">
        <base-button :loading="loading" type="primary" native-type="submit" class="my-4">Sign up</base-button>
      </div>
    </form>
    <modal :show.sync="creatingDB" gradient="primary" modal-classes="modal-danger modal-dialog-centered"
           :show-close="false">
      <!--      <h6 slot="header" class="modal-title" id="modal-title-notification">Your attention is required</h6>-->

      <div class="py-3 text-center">
        <i class="fa fa-sync fa-5x fa-spin" aria-hidden="true"></i>

        <h3 class="text-white mt-5">Creating account...</h3>
      </div>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { AxiosPromise, AxiosResponse } from 'axios';
import { Radio } from 'element-ui';
import { localize } from 'vee-validate';
import countryCodes from '@/assets/json/CountryCodes.json';
import en from 'vee-validate/dist/locale/en.json';
import SingleImageUploader from "@/components/ui/SingleImageUploader.vue";

localize('en', en);
localize({
  en: {
    names: {
      domain: 'Domain',
      org_name: 'Organization Name',
      email: 'Email',
      password: 'Password',
      password_confirmation: 'Password Confirmation',
      name: 'Name',
      gender: 'Gender',
      phone: 'Phone',
      address: 'Address',
    },
  },
});

const auth = namespace('Auth');

@Component({
  components: {
    [Radio.name]: Radio,
    SingleImageUploader
  },
})
export default class RegisterInfo extends Vue {
  @Prop({required: true})
  selectedPackage!: any;
  private countryIndex: number = 18;
  private countryPhoneCode: string = '880';
  private phoneNumber: any = '';
  private image: any = '';
  public countryCodes: any = countryCodes;
  private currency: string = 'BDT';
  private maxPhoneDigit = 10;
  private showPassword: boolean = false;
  private creatingDB: boolean = false;

  fields = {
    domain: '',
    org_name: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    device_name: '',
    gender: '',
    phone: '',
    address: '',
    scheme_id: '',
    user_quota: '',
    coupon_code: '',
    currency: 'BDT',
  };
  loading: boolean = false;
  @auth.Getter
  public isLoggedIn!: boolean;

  @auth.Action
  public register!: (payload: any) => AxiosPromise<any>;

  @Watch('countryIndex')
  onChangeCountryIndex(newVal: any) {
    this.currency = this.countryCodes[newVal].currency;
    this.countryPhoneCode = this.countryCodes[newVal].phone;
    this.maxPhoneDigit = this.countryCodes[newVal].maxPhoneDigit;
  }

  async onSubmit() {
    this.loading = true;
    let form = new FormData();
    if (this.image) {
      form.append('domain', this.fields.domain);
      form.append('org_name', this.fields.org_name);
      form.append('name', this.fields.name);
      form.append('email', this.fields.email);
      form.append('password', this.fields.password);
      form.append('password_confirmation', this.fields.password_confirmation);
      form.append('gender', this.fields.gender);
      form.append('address', this.fields.address);
      form.append('scheme_id', this.selectedPackage.scheme_id);
      form.append('logo', this.image);
      form.append('device_name', navigator.userAgent);
      if (this.selectedPackage.coupon_code) {
        form.append('coupon_code', this.selectedPackage.coupon_code);
      }
      if (this.selectedPackage.user_quota) {
        form.append('user_quota', this.selectedPackage.user_quota);
      }
      form.append('phone', '+' + this.countryPhoneCode + '-' + this.phoneNumber);
      form.append('currency', this.currency);
    }
    this.fields.device_name = navigator.userAgent;
    this.fields.scheme_id = this.selectedPackage.scheme_id;
    this.fields.user_quota = this.selectedPackage.user_quota;
    this.selectedPackage.coupon_code ? (this.fields.coupon_code = this.selectedPackage.coupon_code) : delete this.fields.coupon_code;
    this.fields.phone = '+' + this.countryPhoneCode + '-' + this.phoneNumber;
    this.fields.currency = this.currency;
    let self = this;
    try {
      await this.register({vm: this, fields: this.image ? form : this.fields})
      this.creatingDB = true;
      setInterval(async () => {
        try {
          await this.$http.post(Vue.prototype.$landLordApi('/validate-org'), {domain: this.fields.domain})
          this.creatingDB = false
          this.$notify({
            title: 'Success',
            message: 'Registration successful',
            duration: 5000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
          window.location.replace(this.$appBaseUrl.replace('app', this.$store.getters['Auth/getDomain']));
        } catch (e) {
          this.creatingDB = true
        }
      }, 3500)
    } catch (error) {
      (self.$refs.formValidator as Vue & {
        setErrors: (errors: []) => any;
      }).setErrors(error.response.data.errors);
    } finally {
      self.loading = false;
    }
  }

  mounted() {
    // swal.fire("The Internet?", "That thing is still around?", "question");
  }
}
</script>

<style scoped>
/* @import "~sweetalert2/dist/sweetalert2.css"; */
</style>
