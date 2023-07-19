<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <div class="card">
      <div class="card-header border-0">
        <div class="row">
          <div class="col-6">
            <div class="form-inline">
              <h3 class="mb-0">Attendance</h3>
              <el-tooltip class="ml-3" content="Manage attendance time limit for check-in and check-out"
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
            <div class="row align-items-center">
              <div class="col-3">
                Set time limit for daily <b class="text-success">check-in</b>:
              </div>
            </div>
            <div class="row my-4">
              <div class="col-3">
                <base-input label="In Time Start" name="In Time Start" prepend-icon="fas fa-clock"
                            :rules="{required:true}">
                  <flat-picker
                    slot-scope="{ focus, blur }"
                    @on-open="focus"
                    @on-close="blur"
                    :config="{ allowInput: true, enableTime: true, noCalendar: true, dateFormat: 'H:i:ss' }"
                    class="form-control datepicker"
                    v-model="form.in_time_start"
                  >
                  </flat-picker>
                </base-input>
              </div>
              <div class="offset-1 col-3">
                <base-input label="In Time End" name="In Time End" prepend-icon="fas fa-clock" :rules="{required:true}">
                  <flat-picker
                    slot-scope="{ focus, blur }"
                    @on-open="focus"
                    @on-close="blur"
                    :config="{ allowInput: true, enableTime: true, noCalendar: true, dateFormat: 'H:i:ss' }"
                    class="form-control datepicker"
                    v-model="form.in_time_end"
                  >
                  </flat-picker>
                </base-input>
              </div>
            </div>
          </div>
          <div class="list-group-item">
            <div class="row align-items-center">
              <div class="col-3">
                Set time limit for daily <b class="text-danger">check-out</b>:
              </div>
            </div>
            <div class="row my-4">
              <div class="col-3">
                <base-input label="Out Time Start" name="Out Time Start" prepend-icon="fas fa-clock"
                            :rules="{required:true}">
                  <flat-picker
                    slot-scope="{ focus, blur }"
                    @on-open="focus"
                    @on-close="blur"
                    :config="{ allowInput: true, enableTime: true, noCalendar: true, dateFormat: 'H:i:ss' }"
                    class="form-control datepicker"
                    v-model="form.out_time_start"
                  >
                  </flat-picker>
                </base-input>
              </div>
              <div class="offset-1 col-3">
                <base-input label="Out Time End" name="Out Time End" prepend-icon="fas fa-clock"
                            :rules="{required:true}">
                  <flat-picker
                    slot-scope="{ focus, blur }"
                    @on-open="focus"
                    @on-close="blur"
                    :config="{ allowInput: true, enableTime: true, noCalendar: true, dateFormat: 'H:i:ss' }"
                    class="form-control datepicker"
                    v-model="form.out_time_end"
                  >
                  </flat-picker>
                </base-input>
              </div>
            </div>
          </div>
        </div>
        <div class="row my-5">
          <div class="col-2">
            <base-button block class="mx-4" :loading="loading" @click="handleSubmit(updateAttendanceLimits)"
                         type="success">Save
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </validation-observer>
</template>
<script lang="ts">

const flatPicker = require('vue-flatpickr-component');
import {Component, Vue, Watch} from "vue-property-decorator";
import {Popover, Switch, Select, Option} from "element-ui";

@Component({
  components: {
    [Switch.name]: Switch,
    [Popover.name]: Popover,
    [Select.name]: Select,
    [Option.name]: Option,
    flatPicker
  }
})
export default class Attendance extends Vue {
  private form = {
    in_time_start: '',
    in_time_end: '',
    out_time_start: '',
    out_time_end: ''
  };
  private loading = false;

  updateAttendanceLimits() {

    this.loading = true;
    this.$http.patch(this.$api('/settings/1'), {attendance: this.form}).then(response => {

      if (response.status == 200) {
        this.updateAttendanceNotification(response.status);
      } else {
        this.updateAttendanceNotification(response.status);
      }
    }).catch(error => {
      (this.$refs.formValidator as Vue & {
        setErrors: (errors: []) => any;
      }).setErrors(error.response.data.errors);
      this.$notify({
        message: "Please contact your service provider.",
        title: "Something went wrong!",
        type: 'warning'})
    }).finally(
      () => (this.loading = false)
    );
  }


  fetchSettings() {
    this.$http.get(this.$api(`/settings`)).then(response => {
      if (response.data.settings.attendance != null) {
        this.form = JSON.parse(response.data.settings.attendance);
      }
    });
  }

  updateAttendanceNotification(status: number) {
    this.$notify({
      title: status == 200 ? 'Success' : 'Error',
      message: status == 200 ? "Attendance settings updated" : "Attendance settings could not be updated",
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
