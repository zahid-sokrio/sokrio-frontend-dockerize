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
          <div class="row">
            <div class="col-md-6">
              <h4>Order Approval:</h4>
            </div>
            <div class="col-md-6">
              <h4>Place Order With Zero Quantity:</h4>
            </div>
          </div>
          <div class="row my-3">
            <div class="col-md-1">
              <base-switch class="mr-2" v-model="approval" type="success" on-text="On" off-text="Off"> </base-switch>
            </div>
            <div class="col-md-3">
              <base-input type="number" v-if="!approval" name="delay time" v-model="approvalDelayTime" min="0" max="60">
                <template v-slot:prepend>
                  Delay Time:
                </template>
                <template v-slot:append>
                  Min
                </template>
              </base-input>
            </div>
            <div class="col-md-2"></div>
            <div class="col-md-6">
              <span class="span-area" @click.prevent="quantityApproval">
                <base-switch class="mr-2" type="success" on-text="On" v-model="quantity_zero_approval" off-text="Off"> </base-switch>
              </span>
            </div>
          </div>
        </div>
        <div class="list-group-item">
          <div class="row">
            <div class="col-md-6">
              <h4>Currency:</h4>
            </div>
          </div>
          <div class="row my-3">
            <div class="col-md-6">
              <el-select v-model="currency" filterable placeholder="Select Currency" class="Elselect">
                <el-option v-for="(currency, index) in currencies" :key="index" :label="currency.name + ' - ' + currency.code" :value="currency.code">
                </el-option>
              </el-select>
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
import Currencies from '@/assets/json/Currencies.json';

@Component({
  components: {
    [Switch.name]: Switch,
    [Popover.name]: Popover,
    [Select.name]: Select,
    [Option.name]: Option
  }
})
export default class Miscellaneous extends Vue {
  private approval: boolean = false;
  private approvalDelayTime: number = 0;
  private currency: string = '';
  private retrievedSettings: any = '';
  private currencies: any = Currencies;
  private loading: boolean = false;
  public quantity_zero_approval: boolean = false;

  quantityApproval() {
    this.quantity_zero_approval = !this.quantity_zero_approval;
    this.$http
      .post(this.$api2('/order-quantity-approval'), { quantity_zero_approval: this.quantity_zero_approval })
      .then(response => {
        this.$notify({
          title: 'Success',
          message: 'Successfully Approved!',
          duration: 5000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.$http.get(this.$api2('/order-quantity-approval')).then(response => {
          this.quantity_zero_approval = response.data.quantityZeroApproval == -1 ? true : false;
        });
      })
      .catch(error => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }
  updateSettings() {
    this.loading = true;
    this.$http
      .patch(this.$api('/settings/1'), {
        order_approval: this.approval,
        order_approval_delay_time: this.approvalDelayTime,
        currency: this.currency
      })
      .then(response => {
        this.updateSettingsNotification();
        this.currencySyncLocalStorage();
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

  updateSettingsNotification() {
    this.$notify({
      title: 'Success',
      message: 'Settings Updated',
      duration: 5000,
      iconClass: 'ni ni-bell-55',
      // @ts-ignore
      verticalAlign: 'bottom',
      horizontalAlign: 'right',
      type: 'success'
    });
  }

  async currencySyncLocalStorage() {
    if (localStorage.settings) {
      this.retrievedSettings = JSON.parse(localStorage.settings);
      if (this.retrievedSettings.currency) {
        this.retrievedSettings.currency = this.currency;
      } else {
        this.retrievedSettings.push({ currency: this.currency });
      }
      localStorage.removeItem('settings');
      this.$store.dispatch('Settings/updateSettings', this.retrievedSettings);
      this.$store.dispatch('Settings/updateCurrency', this.currency);
    } else {
      let settings = [];
      settings.push({ currency: this.currency });
      this.$store.dispatch('Settings/updateSettings', this.retrievedSettings);
      this.$store.dispatch('Settings/updateCurrency', this.currency);
    }
  }

  fetchSettings() {
    this.$http.get(this.$api(`/settings`)).then(response => {
      this.approval = Boolean(response.data.settings.order_approval);
      this.approvalDelayTime = Number(response.data.settings.order_approval_delay_time);
      this.currency = response.data.settings.currency;
    });
    this.$http.get(this.$api2('/order-quantity-approval')).then(response => {
      this.quantity_zero_approval = response.data.quantityZeroApproval == -1 ? true : false;
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
