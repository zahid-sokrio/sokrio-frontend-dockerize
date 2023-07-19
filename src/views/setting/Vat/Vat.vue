<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Settings</h3>
            <el-tooltip class="ml-3" content="Manage basic configuration settings for your account" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <!-- Dropdown header -->
      <div class="py-3">
        <!--        <h3 class="text-sm  m-0">-->
        <!--          <strong>Settings</strong>-->
        <!--        </h3>-->
      </div>
      <!-- List group -->
      <div class="list-group list-group-flush">
        <div class="list-group-item">
          <div class="row my-3">
            <div class="col-md-6">
              <base-input v-model="vat" min="0" max="100" name="vat" type="number" label="VAT (%)"> </base-input>
            </div>
          </div>
        </div>

        <div class="row my-5">
          <div class="col-2">
            <base-button block :loading="loading" @click="updateSettings" type="success" class="mx-4">Save </base-button>
          </div>
        </div>
      </div>
      <div href="#!" class="dropdown-item text-center text-primary font-weight-bold py-3"></div>
    </div>
  </div>
</template>
    <script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Popover, Switch, Select, Option } from 'element-ui';
@Component({
  components: {
    [Switch.name]: Switch,
    [Popover.name]: Popover,
    [Select.name]: Select,
    [Option.name]: Option,
  },
})
export default class Vat extends Vue {
  private vat: number = 0;
  private retrievedSettings: any = '';
  private loading: boolean = false;
  updateSettings() {
    this.loading = true;
    this.$http
      .patch(this.$api('/settings/1'), {
        vat: this.vat,
      })
      .then((response) => {
        this.updateSettingsNotification();
      })
      .catch((error) => {
        (
          this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }
        ).setErrors(error.response.data.errors);
        this.$notify({
          message: 'Please contact your service provider.',
          title: 'Something went wrong!',
          type: 'warning',
        });
      })
      .finally(() => (this.loading = false));
  }
  updateSettingsNotification() {
    this.$notify({
      title: 'Success',
      message: 'Settings Updated',
      duration: 5000,
      iconClass: 'ni ni-bell-55',
      // @ts-ignore
      verticalAlign: 'bottom',
      horizontalAlign: 'right',
      type: 'success',
    });
  }
  fetchSettings() {
    this.$http.get(this.$api(`/settings`)).then((response) => {
      this.vat = response.data.settings.vat;
    });
  }
  created() {
    this.fetchSettings();
  }
}
</script>
    <style lang="css">
.span-area {
  padding: 0;
  margin: 0;
  border-radius: 50%;
  border: none;
  background: transparent;
}
</style>
  