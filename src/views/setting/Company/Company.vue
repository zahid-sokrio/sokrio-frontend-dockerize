<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <div class="card">
      <div class="card-header border-0">
        <div class="row">
          <div class="col-6">
            <div class="form-inline">
              <h3 class="mb-0">Company</h3>
              <el-tooltip class="ml-3" content="Manage company settings" placement="right">
                <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="px-3 py-3"></div>
        <div class="list-group list-group-flush">
          <div class="list-group-item">
            <div class="row">
              <div class="col-6">
                <div class="mt-5">
                  <div>
                    <base-input name="logo" type="file" label="Logo">
                      <single-image-uploader class="my-2 py-2" :img.sync="image" image-max-height="100px"
                        uploadText="Select Image"
                        :img-get-url="form && form.logo ? form.logo : ''"></single-image-uploader>
                    </base-input>
                    <span class="text-muted">
                      Note: Image dimensions should follow a 5:1 ratio. (e.g 250 x 50 Pixels)
                    </span>
                    <br /><br />
                    <base-input type="color" name="themeColor" label="Theme Color" prepend-icon="fas fa-tint"
                      :rules="{ required: true }" v-model="form.theme_color">
                    </base-input>
                    <base-input name="address" v-model="form.reporting_emails" type="text"
                      placeholder="e.g. abc@mail.com,xyz@mail.com" label="Reporting Emails">
                    </base-input>
                    <span v-show="emailError" style="color: #eb0b0b">{{ emailError }}</span>

                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="mt-5">
                  <div>
                    <base-input name="address" v-model="extendInfo.address" type="text" placeholder="e.g. 123 Main St..."
                      label="Address">
                    </base-input>
                    <base-input name="phone_number" v-model="extendInfo.phone_number" type="tel"
                      placeholder="e.g. 017xxxxxxxx" label="Phone Number">
                    </base-input>
                    <base-input name="footer" v-model="extendInfo.footer" type="text" placeholder="e.g. Slogan"
                      label="Footer"> </base-input>
                    <span class="text-muted">
                      Note: Additional Info for Printer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="list-group-item">
            <div class="row">
              <div class="col-6">
                <div class="mt-5">
                  <div>
                    <base-input
                      type="color"
                      name="themeColor"
                      label="Theme Color"
                      prepend-icon="fas fa-tint"
                      :rules="{ required: true }"
                      v-model="form.theme_color"
                    >
                    </base-input>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
        </div>

        <div class="row my-5">
          <div class="col-6">
            <base-button @click="handleSubmit(updateCompanySettings)" type="success" class="mx-4">Save </base-button>
          </div>
          <div class="col-6">
            <base-button @click="handleSubmit(updatePrinterSettings)" type="success" class="mx-4">Save Printer
              Info</base-button>
          </div>
        </div>
      </div>
    </div>
  </validation-observer>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch
} from 'vue-property-decorator';
import {
  Popover,
  Switch,
  Select,
  Option
} from 'element-ui';
import SingleImageUploader from '@/components/ui/SingleImageUploader.vue';
import store from '@/store';

@Component({
  components: {
    SingleImageUploader,
    [Switch.name]: Switch,
    [Popover.name]: Popover,
    [Select.name]: Select,
    [Option.name]: Option
  }
})

export default class Company extends Vue {
  private form: any = {
    theme_color: '#3083a7',
    logo: ''
  };
  private extendInfo: any = {
    address: '',
    phone_number: '',
    footer: ''
  };
  image: any = '';
  private loading = false;
  public emailError = '';
  public fromError = false;

  async updateCompanySettings() {
    if (this.fromError) {
      this.$notify({
        message: 'Please provide correct Reporting Emails',
        title: 'Something went wrong!',
        type: 'warning'
      });
      return false;
    }
    this.loading = true;
    let form = new FormData();
    form.append('logo', this.image);
    form.append('theme_color', this.form.theme_color);
    await this.$http
      .post(this.$api('/company-settings'), this.image ? form : {
        theme_color: this.form.theme_color,
        reporting_emails: this.form.reporting_emails
      })
      .then(response => {
        if (response.status == 201) {
          store.dispatch('Theme/updateThemeColor', this.form.theme_color);
          store.dispatch('Theme/updateLogoUrl', JSON.parse(response.data.setting.company).logo);
          this.updateCompanyNotification(response.status);
          this.$http.get(this.$api(`/settings`)).then(response => {
            localStorage.setItem('settings', JSON.stringify(response.data.settings));
          });
          this.image = '';
        } else {
          this.updateCompanyNotification(response.status);
        }
      })
      .catch(error => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
        this.$notify({
          message: 'Please contact your service provider.',
          title: 'Something went wrong!',
          type: 'warning'
        });
      })
      .finally(() => (this.loading = false));
  }
  async updatePrinterSettings() {
    this.loading = true;
    let extendInfo = new FormData();
    extendInfo.append('address', this.extendInfo.address);
    extendInfo.append('phone_number', this.extendInfo.phone_number);
    extendInfo.append('footer', this.extendInfo.footer);
    await this.$http
      .post(this.$api('/orgs-infos'), extendInfo)
      .then(response => {
        if (response.status == 201) {
          this.extendInfo.address = response.data.org.address;
          this.extendInfo.phone_number = response.data.org.phone_number;
          this.extendInfo.footer = response.data.org.footer;
          this.$notify({
            title: 'Success',
            message: `Print Information successfully updated`,
            duration: 5000,
            iconClass: 'ni ni-bell-55',
            // @ts-ignore
            verticalAlign: 'top',
            horizontalAlign: 'right',
            type: 'success'
          });
        }
      })
      .catch(error => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
        this.$notify({
          message: 'Please contact your service provider.',
          title: 'Something went wrong!',
          type: 'warning'
        });
      })
      .finally(() => (this.loading = false));
  }

  fetchSettings() {
    this.$http.get(this.$api(`/settings`)).then(response => {
      if ('company' in response.data.settings) {
        if (response.data.settings.company) {
          const data = JSON.parse(response.data.settings.company);
          data.reporting_emails = response.data.settings.reporting_emails;
          this.form = data;
        } else {
          this.form = {
            theme_color: '#3083a7',
            logo: '',
            reporting_emails: ''
          };
        }
      }
    });
  }

  fetchPrinterInfo() {
    this.loading = true;
    this.$http.get(this.$api(`/orgs-infos`)).then(response => {
      this.extendInfo.address = response.data.org.address ?? '';
      this.extendInfo.phone_number = response.data.org.phone_number ?? '';
      this.extendInfo.footer = response.data.org.footer ?? '';
      this.loading = false;
    });
  }

  updateCompanyNotification(status: number) {
    this.$notify({
      title: status == 201 ? 'Success' : 'Error',
      message: status == 201 ? `Settings successfully updated` : `Settings could not be updated`,
      duration: 5000,
      iconClass: 'ni ni-bell-55',
      // @ts-ignore
      verticalAlign: 'bottom',
      horizontalAlign: 'right',
      type: status == 201 ? 'success' : 'error'
    });
  }

  created() {
    this.fetchPrinterInfo();
    this.fetchSettings();
  }
  @Watch('form.reporting_emails')
  validateEmail() {
    const getMessage = 'The Reporting Emails field must contain a comma-separated list of valid email addresses.';
    const emails = this.form.reporting_emails.split(',');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emails) {
      if (email === '') {
        this.emailError = 'After comma valid email is required';
        this.fromError = true;
      } else if (!regex.test(email.trim())) {
        this.emailError = `The ${email} not valid email address.`;
        this.fromError = true;
      } else {
        this.emailError = '';
        this.fromError = false;
      }
    }
  }
}
</script>
