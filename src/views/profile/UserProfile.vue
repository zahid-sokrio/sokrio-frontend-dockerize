<template>
  <div>
    <base-header class="header pb-6 pt-4 pt-lg-8 d-flex align-items-center"
                 style="background-size: cover; background-position: center top;">
      <span class="mask opacity-8"></span>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
          <div class="card card-profile shadow">
            <div class="row justify-content-center">
              <div class="col-lg-5 order-lg-2">
                <div class="card-profile-image" v-if="disabled">
                  <a href="#" class="profile-picture">
                    <async-image v-slot="slotProps" v-if="me.propic_url"
                                 :url="me.propic_url">
                      <img :src="slotProps.imageSrc" class="rounded-circle" height="130px" width="130px"
                           alt="Profile Picture"/>
                    </async-image>
                    <img v-else :src="`${$cdn}/img/avatar.png`" class="rounded-circle" height="130px" width="130px"
                         alt="Profile Picture"/>

                  </a>
                </div>

                <div class="mt-5 mb-1" v-if="!disabled">
                  <base-input label="" name="propic">
                    <single-image-uploader
                      :img.sync="propic"
                      image-max-height="100px"
                      uploadText="Select Image"
                      :img-get-url="me.propic_url ? me.propic_url : ''"
                    ></single-image-uploader>
                  </base-input>
                </div>
              </div>
            </div>

            <div class="card-body pt-0 md-4" :class="{ 'pt-4': disabled }">
              <div class="row">
                <div class="col">
                  <div class="card-profile-stats d-flex justify-content-center md-5"
                       :class="{ 'mt-5': disabled }"></div>
                </div>
              </div>
              <div class="text-center">
                <h3>
                  {{ model.name }}
                  <span class="font-weight-light">{{ this.model.dob ? ' ' + birthday : '' }} </span>
                </h3>
                <div class="h5 font-weight-300">
                  <i class="fa fa-home" aria-hidden="true"></i>
                  {{ model.address ? model.address : '' }}
                </div>
                <div class="h5 mt-3"><i class="fas fa-mars"></i> {{ getGender ? getGender : '' }}</div>
                <div><i class="fa fa-mobile-alt mt-2"></i> {{ phone }}</div>
                <hr class="my-4"/>
              </div>
            </div>
          </div>
        </div>

        <div class="col order-xl-1">
          <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mt-1 mb-2">My account</h3>
                </div>
                <div class="col-4 text-right">
                  <a @click.prevent="disabled = false" href="#" class="btn btn-sm btn-primary" v-if="disabled">
                    <el-tooltip content="Edit Profile" placement="top">
                      <i class="fa fa-edit ml-1"></i>
                    </el-tooltip>
                  </a>
                </div>
              </div>
            </div>
            <template>
              <form @submit.prevent>
                <h6 class="heading-small text-muted mb-4">User information</h6>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-lg-6">
                      <base-input
                        alternative
                        label="Name"
                        placeholder="Name"
                        input-classes="form-control-alternative"
                        v-model="model.name"
                        :disabled="disabled"
                      />
                    </div>
                    <div class="col-lg-6">
                      <base-input
                        label="Birthday"
                        :disabled="disabled"
                        placeholder="yyyy-mm-dd"
                        input-classes="form-control-alternative"
                        v-model="model.dob"
                        min="1900"

                      >
                        <flat-picker
                          v-if="!disabled"
                          slot-scope="{ focus, blur }"
                          @on-open="focus"
                          @on-close="blur"
                          :config="{ allowInput: true }"
                          class="form-control datepicker"
                          :placeholder="me.dob"
                          v-model="model.dob"
                        >
                        </flat-picker>
                      </base-input>
                    </div>
                    <div class="col-lg-6">
                      <base-input
                        v-if="disabled"
                        alternative
                        label="Gender"
                        placeholder="e.g Male"
                        input-classes="form-control-alternative"
                        :value="getGender"
                        :disabled="disabled"
                      />
                      <base-input label="Gender" :disabled="disabled" v-if="!disabled">
                        <el-select v-model="model.gender" filterable placeholder="Male" class="Elselect">
                          <el-option v-for="gender in selectGender" :key="gender.label" :label="gender.label"
                                     :value="gender.value"></el-option>
                        </el-select>
                      </base-input>
                    </div>
                  </div>
                </div>
                <hr class="my-4"/>
                <!-- Address -->
                <h6 class="heading-small text-muted mb-4">Contact information</h6>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-lg-6">
                      <base-input
                        alternative
                        label="Address"
                        placeholder="Home Address"
                        input-classes="form-control-alternative"
                        v-model="model.address"
                        :disabled="disabled"
                      />
                    </div>
                    <div class="col-lg-6" v-if="disabled">
                      <base-input
                        alternative
                        label="Phone No."
                        placeholder="Phone No."
                        input-classes="form-control-alternative"
                        v-model="phone"
                        :disabled="disabled"
                      />
                    </div>
                    <div class="col-lg-3" v-if="!disabled">
                      <base-input label="Country Code" :disabled="disabled" v-if="!disabled">
                        <el-select v-model="countryCode" filterable placeholder="Select Country Code" class="Elselect">
                          <el-option
                            v-for="countryCode in countryCodes"
                            :key="countryCode.key"
                            :label="countryCode.name + ' +'+ countryCode.phone"
                            :value="countryCode.phone"
                          >
                          </el-option>
                        </el-select>
                      </base-input>
                    </div>
                    <div class="col-lg-3" v-if="!disabled">
                      <base-input
                        alternative
                        label="Phone No."
                        placeholder="Phone No."
                        input-classes="form-control-alternative"
                        v-model="phoneNumber"
                        type="number"
                        :disabled="disabled"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-content-end mt-3">
                  <base-button v-if="!disabled" @click="disabled = true" type="secondary">Close</base-button>
                  <base-button v-if="!disabled" type="success" @click.prevent="updateProfile(model)">Save</base-button>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
//@ts-ignore
import {Vue, Component, Mixins, Watch} from 'vue-property-decorator';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import {Tooltip} from 'element-ui';

const flatPicker = require('vue-flatpickr-component');
import 'flatpickr/dist/flatpickr.css';
import SingleImageUploader from '@/components/ui/SingleImageUploader.vue';

const moment = require('moment');
import countryCodes from '@/assets/json/CountryCodes.json';
import AsyncImage from "@/components/AsyncImage.vue";

@Component({
  components: {
    AsyncImage,
    [Tooltip.name]: Tooltip,
    flatPicker,
    SingleImageUploader
  }
})
export default class UserProfile extends Mixins(PaginationComponentMixin) {
  private me: Object = {};
  activeTab: number | null = 0;
  showModal: boolean = false;
  disabled: boolean = true;
  countryCode: string = '';
  phoneNumber: any = '';
  formErrors: any = {};
  formInputs: any = {};
  propic: any = '';
  imageSource: string = '';
  countryCodes: any = countryCodes;
  model: any = {
    name: '',
    dob: '',
    address: '',
    gender: '',
    phone: '',
    propic_url: ''
  };

  get user_id() {
    return this.$store.getters['Auth/user'].id;
  }

  get imageSrc() {
    return this.imageSource;
  }

  get getGender() {
    if (this.model.gender == 'm') {
      return 'Male';
    } else if (this.model.gender == 'f') {
      return 'Female'
    } else {
      return 'Others';
    }
  }

  private selectGender = [
    {
      label: 'Male',
      value: 'm'
    },
    {
      label: 'Female',
      value: 'f'
    },
    {
      label: 'Others',
      value: 'o'
    }
  ];

  get birthday() {
    if (!this.model.dob) {
      return '';
    } else {
      return moment().diff(moment(this.model.dob), 'years');
    }
  }

  async updateProfile(model: any) {
    let form = new FormData();
    form.append('propic', this.propic);
    form.append('name', model.name);
    form.append('address', model.address ? model.address : '');
    form.append('gender', model.gender);
    form.append('phone', this.phone);
    form.append('dob', model.dob ? model.dob : '');
    form.append('_method', 'patch');
    let {data} = await this.$http.post(
      this.$api(`/users/${this.user_id}/profiles/`),
      this.propic
        ? form
        : {
          name: model.name,
          address: model.address ? model.address : '',
          gender: model.gender,
          phone: this.phone,
          dob: model.dob ? model.dob : '',
          _method: 'patch'
        }
    );

    await this.fetchEntity();
    await this.$store.dispatch('Auth/updateCurrentUser', data.profile);
    await localStorage.setItem('currentUser', JSON.stringify(data.profile));
    this.$store.dispatch('Auth/updateNavbarKey');
    this.propic = '';
    this.disabled = true;
  }

  get phone() {
    return this.countryCode + '-' + this.phoneNumber;
  }

  created() {
    this.fetchEntity();
  }

  fetchEntity(): void {
    this.$http.get(this.$api(`/users/${this.user_id}/profiles/`)).then(response => {
      this.me = response.data.profile;
      this.model = response.data.profile;
      if (this.model.phone != null) {
        let phone = this.model.phone.split('-');
        this.countryCode = phone[0];
        this.phoneNumber = phone[1];
      }
    });
  }
}
</script>
<style>


/*input[type='text']:disabled {*/
/*  background: #fdffff;*/
/*}*/
</style>
