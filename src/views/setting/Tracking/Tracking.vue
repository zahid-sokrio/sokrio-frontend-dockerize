<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <div class="card">
      <div class="card-header border-0">
        <div class="row">
          <div class="col-6">
            <div class="form-inline">
              <h3 class="mb-0">Tracking</h3>
              <el-tooltip class="ml-3" content="Manage tracking settings"
                          placement="right">
                <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">

        <div class="px-3 py-3">

        </div>

        <div class="list-group list-group-flush">

          <div class="list-group-item">
            <div class="row">
              <div class="col-6">
                Mandatory Selfie:
                <div class="mt-5">
                  <base-input label="">
                    <base-switch on-text="On" off-text="Off" v-model="selfieInterval"></base-switch>
                  </base-input>
                  <div v-if="selfieInterval">
                    <base-input type="number" min="0.1" name="Selfie Interval" v-model="form.selfie_interval"
                                label="Selfie Interval" prepend-icon="fas fa-portrait"
                                placeholder="e.g 1" :rules="{required:true}">
                      <template slot="append"> {{ form.selfie_interval > 1 ? 'Hours' : 'Hour' }}</template>
                    </base-input>
                  </div>
                  <span v-if="form.selfie_interval > 0 && selfieInterval" class="text-muted">
                    Note: Mobile user will get notified for selfie checkin in every
                    {{ form.selfie_interval }}
                    {{ form.selfie_interval > 1 ? 'hours' : 'hour' }}.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="list-group-item">
            <div class="row">
              <div class="col-6">
                Daily Check-In Limit in Same Outlet:
                <div class="mt-5">
                  <base-input label="">
                    <base-switch on-text="On" off-text="Off" v-model="checkinLimitPerOutlet"></base-switch>
                  </base-input>
                  <div v-if="checkinLimitPerOutlet">
                    <base-input type="number" min="1" name="Check-In Limit per Outlet"
                                label="Check-In Limit per Outlet"
                                placeholder="e.g: 1"
                                prepend-icon="fas fa-map-marker"
                                :rules="{required:true, regex: /^\d*$/}" v-model="form.checkin_limit_per_outlet">
                      <template slot="append"> {{ form.checkin_limit_per_outlet > 1 ? 'Times' : 'Time' }}</template>
                    </base-input>
                  </div>
                  <span v-if="form.checkin_limit_per_outlet > 0 && checkinLimitPerOutlet" class="text-muted">
                    Note: Mobile users can not check-in more than
                    {{ form.checkin_limit_per_outlet }}
                    {{ form.checkin_limit_per_outlet > 1 ? 'times ' : 'time ' }} in same outlet per day.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="list-group-item">
            <div class="row">
              <div class="col-6">
                Check-In Interval per Outlet:
                <div class="mt-5">
                  <base-input label="">
                    <base-switch on-text="On" off-text="Off" v-model="checkinIntervalPerOutlet"></base-switch>
                  </base-input>
                  <div v-if="checkinIntervalPerOutlet">
                    <base-input type="number" min="1" name="Check-In Interval per Outlet"
                                label="Check-In Interval per Outlet"
                                placeholder="e.g: 1"
                                prepend-icon="fas fa-clock"
                                :rules="{required:true}" v-model="form.checkin_interval_per_outlet">
                      <template slot="append"> {{
                          form.checkin_interval_per_outlet > 1 ? 'Minutes' : 'Minute'
                        }}
                      </template>
                    </base-input>
                  </div>
                  <span v-if="form.checkin_interval_per_outlet > 0 && checkinIntervalPerOutlet" class="text-muted">
                    Note: Mobile user can not check-in within
                    {{ form.checkin_interval_per_outlet }}
                    {{ form.checkin_interval_per_outlet > 1 ? 'minutes ' : 'minute ' }} on next outlet.
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="row my-5">
          <div class="col-2">
            <base-button block :loading="loading" @click="handleSubmit(updateTrackingSettings)"
                         type="success" class="mx-4">Save
            </base-button>
          </div>
        </div>

      </div>
    </div>
  </validation-observer>
</template>
<script lang="ts">

import {Component, Vue, Watch} from "vue-property-decorator";
import {Popover, Switch, Select, Option} from "element-ui";

@Component({
  components: {
    [Switch.name]: Switch,
    [Popover.name]: Popover,
    [Select.name]: Select,
    [Option.name]: Option,
  }
})

export default class Tracking extends Vue {
  private form: any = {
    selfie_interval: null,
    checkin_limit_per_outlet: null,
    checkin_interval_per_outlet: null
  };
  private selfieInterval = false;
  private checkinLimitPerOutlet = false;
  private checkinIntervalPerOutlet = false;
  private loading = false;

  updateTrackingSettings() {

    this.loading = true;
    this.$http.patch(this.$api('/settings/1'), {
      tracking: {
        selfie_interval: this.selfieInterval ? this.form.selfie_interval : null,
        checkin_limit_per_outlet: this.checkinLimitPerOutlet ? this.form.checkin_limit_per_outlet : null,
        checkin_interval_per_outlet: this.checkinIntervalPerOutlet ? this.form.checkin_interval_per_outlet : null,
      }
    }).then(response => {

      if (response.status == 200) {
        this.updateTrackingNotification(response.status);
      } else {
        this.updateTrackingNotification(response.status);
      }
    }).catch(error => {
      (this.$refs.formValidator as Vue & {
        setErrors: (errors: []) => any;
      }).setErrors(error.response.data.errors);
      this.$notify({
        message: "Please contact your service provider.",
        title: "Something went wrong!",
        type: 'warning'
      })
    }).finally(
      () => (this.loading = false)
    );
  }


  fetchSettings() {
    this.$http.get(this.$api(`/settings`)).then(response => {
      if (response.data.settings.tracking != null) {
        this.form = JSON.parse(response.data.settings.tracking);
        this.selfieInterval = !!this.form.selfie_interval;
        this.checkinLimitPerOutlet = !!this.form.checkin_limit_per_outlet;
        this.checkinIntervalPerOutlet = !!this.form.checkin_interval_per_outlet;
      }
    });
  }

  updateTrackingNotification(status: number) {
    this.$notify({
      title: status == 200 ? 'Success' : 'Error',
      message: status == 200 ? "Settings successfully updated" : "Settings could not be updated",
      duration: 5000,
      iconClass: 'ni ni-bell-55',
      // @ts-ignore
      verticalAlign: 'bottom',
      horizontalAlign: 'right',
      type: 'success'
    });
  }

  created() {
    this.fetchSettings();
  }
}
</script>
