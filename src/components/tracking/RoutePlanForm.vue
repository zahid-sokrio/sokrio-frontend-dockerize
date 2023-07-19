<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <form class="needs-validation" @submit.prevent="handleSubmit(save)">
      <modal :show="isActive" size="lg" @close="close" :close-on-click-modal="false">
        <template slot="header">
          <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New' }} Visit Plan</h5>
        </template>
        <div>
          <div class="row">
            <div class="col-md-6">
              <base-input name="name" v-model="form.routeName" label="Name" placeholder="e.g. Savar" prepend-icon="fas fa-route"></base-input>
            </div>
            <div class="col-md-6">
              <base-input label="Timespan" name="timespan">
                <el-select v-model="form.timespans" filterable placeholder="Select Timespans">
                  <el-option v-for="(timespan, index) in timespans" :key="index" :label="_.startCase(_.toLower(timespan))"
                             :value="timespan"></el-option>
                </el-select>
              </base-input>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <base-input v-if="form.timespans != 'tour'" :label="form.timespans != 'tour' ? 'Days' : 'Dates'" name="days">
                <el-select
                  v-if="form.timespans != 'tour'"
                  v-model="form.days"
                  multiple
                  filterable
                  :placeholder="form.timespans != 'tour' ? 'Select Days' : 'Select Dates'"
                >
                  <el-option v-for="(day, index) in days" :key="index" :label="day.name" :value="day.id"></el-option>
                </el-select>
              </base-input>
              <base-input v-else label="Tour Dates" name="tour_dates" prepend-icon="fas fa-calendar">
                <flat-picker
                  slot-scope="{ focus, blur }"
                  @on-open="focus"
                  @on-close="blur"
                  :config="{ allowInput: true, mode: 'multiple', time_24hr: true }"
                  class="form-control datepicker"
                  v-model="form.tour_dates"
                >
                </flat-picker>
              </base-input>
            </div>
            <div class="col-md-6">
              <base-input label="Reporting Time" name="reporting_time" prepend-icon="fas fa-clock">
                <flat-picker
                  slot-scope="{ focus, blur }"
                  @on-open="focus"
                  @on-close="blur"
                  :config="{ allowInput: true, enableTime: true, noCalendar: true, dateFormat: 'h:iK' }"
                  class="form-control datepicker"
                  v-model="form.reporting_time"
                >
                </flat-picker>
              </base-input>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <base-input label="Expires At" name="expires_at">
                <flat-picker
                  slot-scope="{ focus, blur }"
                  @on-open="focus"
                  @on-close="blur"
                  :config="{ allowInput: true }"
                  class="form-control datepicker"
                  v-model="form.expiresAt"
                >
                </flat-picker>
              </base-input>
            </div>
            <div class="col-md-6">
              <TerritoryLazydropdown label="Territory"
                                     name="territory_id"
                                     :end-point="'/territories?has_outlet=1'"
                                     v-model="form.territory"
                                     @change="onChangeTerritory"
                                     searchable-key="q">
              </TerritoryLazydropdown>
            </div>
            <el-tooltip :disabled="!!form.territory" content="Please select a territory first." placement="top">
              <div class="col-md-6">
                <user-lazydropdown :disabled="!form.territory" label="Assign To" v-model="form.user" name="assign to"
                                   rules="required" v-if="isUpdate" @remove-tag="onRemoveUser"></user-lazydropdown>
                <user-lazydropdown :disabled="!form.territory" label="Assign To" v-model="form.user" name="assign to"
                                   rules="required" :multiple="true" v-else @remove-tag="onRemoveUser"></user-lazydropdown>
              </div>
            </el-tooltip>
            <div class="col-md-6">
              <base-input label="Active">
                <base-switch class="mr-1 p-1" on-text="On" off-text="Off" v-model="form.active"></base-switch>
              </base-input>
            </div>
          </div>
        </div>
        <template slot="footer">
          <div class="col md-6" v-if="listOfAssignedUser.length > 0">
            <span style="color: indianred">
              <i class="fas fa-exclamation-triangle mr-2"></i>
            <small v-for="(assignedUser, index) in listOfAssignedUser" :key="assignedUser.id">
              <span v-if="assignedUser.assignee">{{ assignedUser.assignee.name }}</span> <span
              v-if="listOfAssignedUser.length > 1 && listOfAssignedUser.length - 1 != index">, </span>
            </small>
            <small> is already assigned to
            <span v-if="territories">{{
                territories.find(territory => territory.id ==
                  form.territory).name
              }}</span> territory, select different user. </small>
            </span>
          </div>
          <div style="float: right">
            <span class="information"><i class="fas fa-info-circle"></i> visit any one
              <span v-if="form.days != ''">
                <span v-for="(selectedDay, index) in form.days" :key="index">
                  {{
                    form.days.length > 1 && form.days.length - 1 == index
                      ? ' and ' + days.find(day => day.id == selectedDay).name
                      : days.find(day => day.id == selectedDay).name
                  }}
                </span>
              </span>
              <span v-else> ? </span>
              in
              {{
                form.timespans == 'weekly'
                  ? '7 days till'
                  : form.timespans == 'biweekly'
                  ? '15 days till'
                  : form.timespans == 'monthly'
                    ? '30 days till'
                    : form.timespans == 'quarterly'
                      ? '90 days till'
                      : form.timespans == 'yearly'
                        ? '365 days till'
                        : form.timespans == 'tour'
                          ? 'selected dates'
                          : '?'
              }}
              <span v-if="form.expiresAt != ''">
                {{ form.expiresAt | datetime('ll') }}
              </span>
              <span v-else>
                ?
              </span>
            </span>
            <base-button type="secondary" @click="close">Close</base-button>
            <base-button native-type="submit" type="success" :disabled="disableBtn">Save</base-button>
          </div>
        </template>
      </modal>
    </form>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

const flatPicker = require('vue-flatpickr-component');
import 'flatpickr/dist/flatpickr.css';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown.vue";
import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip} from 'element-ui';
import RoutePlan from '@/intefaces/RoutePlan';
import {RoutePlanTimespan} from '@/enums/RoutePlanTimespan.ts';
import Days from '@/data/Days.ts';
import Territory from "@/intefaces/Territory";

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    ElTable: Table,
    flatPicker,
    UserLazydropdown,
    TerritoryLazydropdown
  },
  name: 'RoutePlanForm'
})
export default class RoutePlanForm extends Vue {
  @Prop({type: Boolean, default: false})
  public isActive!: boolean;
  @Prop({type: Boolean, default: false})
  public isUpdate!: boolean;
  @Prop() currentRoutePlan!: RoutePlan;
  @Prop({
    default: () => ({
      routeName: '',
      timespans: '',
      user: [],
      days: [],
      expiresAt: '',
      tour_dates: [],
      reporting_time: '',
      territory: '',
      active: true,
      outletList: [],
    })
  })
  form!: {
    routeName: string;
    timespans: string;
    user: any;
    days: any;
    expiresAt: any;
    tour_dates: any;
    reporting_time: string;
    territory: any,
    active: boolean,
    outletList: any,
  };
  private outlets: any[] = [];

  private checkList = [];
  private disableBtn = false;
  private removeUser: boolean = false;
  private listOfAssignedUser: any = [];
  private territories: Territory[] = [];

  get tourDatesArray() {
    return this.form.tour_dates.split(',');
  }

  get timespans() {
    return RoutePlanTimespan;
  }

  get days() {
    return Days;
  }

  @Watch('isUpdate')
  outletList(newVal: any) {
    if (newVal == true) {
      this.$http(this.$api(`/route-plans/${this.currentRoutePlan.id}/outlets`)).then(response => {
        this.outlets = response.data.outlets;
      });
    } else {
      this.outlets = [];
    }
  }

  onChangeTerritory() {
    if (this.isUpdate) {
      this.form.user = '';
    } else {
      this.form.user = [];
    }
    this.listOfAssignedUser = [];
  }

  checkRoutePlanTerritoryUser(userId: number) {
    this.$http.get(this.$api(`/route-plan/territory/${this.form.territory}/user/${userId}`)).then(response => {
      if (response.data.routePlans) {
        response.data.routePlans.forEach((routePlan: RoutePlan) => {
          this.listOfAssignedUser.push(routePlan);
        })
      }
    });
  }

  @Watch('form.user')
  onUserChange(old: any, current: any) {
    if (this.isUpdate) {
      if (this.currentRoutePlan.assigned_to != old) {
        this.checkRoutePlanTerritoryUser(old);
      }
      if (this.listOfAssignedUser.length > 0) {
        this.listOfAssignedUser = [];
      }
    } else {
      if (old.length > 0 && !this.removeUser) {
        if (current.length > 0) {
          this.checkRoutePlanTerritoryUser(old[old.length - 1]);
        } else {
          this.checkRoutePlanTerritoryUser(old[0])
        }
      } else {
        this.removeUser = false;
      }
    }
  }

  @Watch('listOfAssignedUser')
  updateListOfAssignedUser() {
    if (this.listOfAssignedUser.length > 0) {
      this.disableBtn = true;
    } else {
      this.disableBtn = false;
    }
  }

  onRemoveUser(remove: any) {
    this.removeUser = true;
    let index = this.listOfAssignedUser.findIndex((assingedUser: any) => assingedUser.assigned_to === remove);
    if (index != -1) {
      this.listOfAssignedUser.splice(index, 1);
    }
  }

  formReset() {
    this.form.routeName = '';
    this.form.timespans = '';
    this.form.days = [];
    this.form.user = '';
    this.form.expiresAt = '';
    this.form.reporting_time = '';
    this.form.tour_dates = [];
    this.form.territory = '';
    this.form.active = true;
    this.disableBtn = false;
  }

  createRoute() {
    this.disableBtn = true;
    if (this.form.timespans == 'tour') {
      this.form.user.forEach((assignee: any) => {
        this.$http
          .post(this.$api('/route-plans'), {
            assigned_to: assignee,
            name: this.form.routeName,
            days: [],
            expires_at: this.form.expiresAt,
            timespan: this.form.timespans,
            tour_dates: this.tourDatesArray,
            reporting_time: this.form.reporting_time,
            territory_id: this.form.territory,
            active: this.form.active,
          })
          .then(response => {
            this.$notify({
              title: 'Success',
              message: 'Successfully Created',
              duration: 3000,
              iconClass: 'ni ni-bell-55',
              type: 'success'
            });

            this.$http.get(this.$api(`/route-plans/${response.data.routePlan.id}`)).then(responseRoute => {
              this.$emit('created', responseRoute.data.routePlan);
            });
            this.formReset();
          })
          .catch(error => {
            this.disableBtn = false;
            (this.$refs.formValidator as Vue & {
              setErrors: (errors: []) => any;
            }).setErrors(error.response.data.errors);
          });
      });
    } else {
      this.form.user.forEach((assignee: any) => {
        this.$http
          .post(this.$api('/route-plans'), {
            assigned_to: assignee,
            days: this.form.days,
            name: this.form.routeName,
            expires_at: this.form.expiresAt,
            timespan: this.form.timespans,
            tour_dates: [],
            reporting_time: this.form.reporting_time,
            territory_id: this.form.territory,
            active: this.form.active
          })
          .then(response => {
            this.form.outletList.forEach((outlet: any) => {
              this.$http.post(this.$api(`/route-plans/${response.data.routePlan.id}/outlets`), {department_id: outlet});
            });

            this.$notify({
              title: 'Success',
              message: 'Successfully Created',
              duration: 3000,
              iconClass: 'ni ni-bell-55',
              type: 'success'
            });

            this.$http.get(this.$api(`/route-plans/${response.data.routePlan.id}`)).then(responseRoute => {
              this.$emit('created', responseRoute.data.routePlan);
            });
            this.formReset();
          })
          .catch(error => {
            this.disableBtn = false;
            (this.$refs.formValidator as Vue & {
              setErrors: (errors: []) => any;
            }).setErrors(error.response.data.errors);
          });
      });
    }
  }

  updateRoute() {
    this.disableBtn = true;
    if (this.form.timespans == 'tour') {
      this.$http
        .patch(this.$api(`/route-plans/${this.currentRoutePlan.id}`), {
          name: this.form.routeName,
          days: [],
          expires_at: this.form.expiresAt,
          timespan: this.form.timespans,
          assigned_to: this.form.user,
          tour_dates: this.form.tour_dates.split(','),
          reporting_time: this.form.reporting_time,
          territory_id: this.form.territory,
          active: this.form.active
        })
        .then(response => {
          this.$emit('updated', response.data.routePlan);
          this.formReset();
          this.$notify({
            title: 'Success',
            message: 'Successfully Updated',
            duration: 3000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
        })
        .catch(error => {
          this.disableBtn = false;
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
    } else {
      this.$http
        .patch(this.$api(`/route-plans/${this.currentRoutePlan.id}`), {
          name: this.form.routeName,
          expires_at: this.form.expiresAt,
          timespan: this.form.timespans,
          days: this.form.days,
          tour_dates: [],
          assigned_to: this.form.user,
          reporting_time: this.form.reporting_time,
          territory_id: this.form.territory,
          active: this.form.active
        })
        .then(response => {
          this.$notify({
            title: 'Success',
            message: 'Successfully Updated',
            duration: 3000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
          this.$emit('updated', response.data.routePlan);
          this.formReset()
        })
        .catch(error => {
          this.disableBtn = false;
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
    }
  }

  save() {
    this.isUpdate ? this.updateRoute() : this.createRoute();
  }

  close() {
    this.$parent.$emit('update:isActive', false);
    this.$emit('update:isActive', false);
    this.listOfAssignedUser = [];
    this.$emit('update:form', {
      routeName: '',
      timespans: '',
      days: [],
      user: '',
      expiresAt: '',
      tourDates: [],
      reporting_time: '',
      active: true
    });
    this.$emit('update:isUpdate', false);
  }

  fetchTerritory() {
    this.$http.get(this.$api('/territories')).then(response => {
      this.territories = response.data.territories;
    })
  }

  created() {
    this.fetchTerritory();
  }
}
</script>
<style lang="scss" scoped>
/*.el-table tr input[type='checkbox'] {*/
/*  width: 20px;*/
/*}*/
.el-table i.sort-caret {
  display: none
}
</style>
