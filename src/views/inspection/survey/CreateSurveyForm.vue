<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" v-if="isActive" size="lg" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New' }} Survey</h5>
      </template>
      <div>
      <div class="row">
        <div class="col-md-6">
          <base-input name="name" v-model="form.name" label="Name" placeholder="e.g. App performance survey"></base-input>
        </div>
        <div class="col-md-6">
          <base-input name="code" v-model="form.code" label="Code" placeholder="e.g. survey-jan-001"></base-input>
        </div>
      </div>
      <div class="row">
          <div class="col-md-6">
            <base-input label="Timespan">
              <el-select placeholder="Timespan" v-model="form.timespan" filterable default-first-option allow-create clearable>
                <el-option v-for="option in timespan" :value="option" :label="option.toString().toUpperCase()" :key="option"></el-option>
              </el-select>
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input name="times" v-model="form.times" label="Times" placeholder="e.g. 2" type="number"></base-input>
          </div>
      </div>
        <div class="row">
          <div class="col-md-6">
            <base-input label="Start From" prepend-icon="ni ni-calendar-grid-58" name="start_form">
              <flat-picker
                placeholder="Start From"
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-control datepicker"
                :value="form.start_form"
                @input="form.start_form = $event + ' 00:00:00'"
              >
              </flat-picker>
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input label="Expires At" prepend-icon="ni ni-calendar-grid-58" name="expires_at">
              <flat-picker
                placeholder="Expires At"
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-control datepicker"
                :value="form.expires_at"
                @input="form.expires_at = $event + ' 00:00:00'"
              >
              </flat-picker>
            </base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <UserLazydropdown v-if="!isUpdate" label="Assign Users (Optional)" :multiple="true" v-model="users"></UserLazydropdown>
          </div>
          <div class="col-md-6">
            <QuestionLazyDropdown v-if="!isUpdate" label="Assign Questions (Optional)" :multiple="true" v-model="questions"></QuestionLazyDropdown>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <label>Status: </label>
<!--            <base-switch class="mr-1" v-model="form.active" type="success" :data-label-off="Inactive" :data-label-on="Active"></base-switch>-->
            <el-switch class="mr-2" v-model="form.active" active-color="#13ce66" inactive-color="#fb6340"></el-switch>
            <el-tag :type="`${form.active == true ? 'success' : 'warning'}`">
              <span v-text="`${form.active == true ? 'Active' : 'Inactive'}`"></span>
            </el-tag>
          </div>
          <div class="col-md-6">
            <base-input label="Survey For" name="for">
              <el-select placeholder="e.g. Consumer " v-model="form.for" multiple filterable default-first-option allow-create clearable>
                <el-option v-for="option in surveyTypes" :value="option" :label="option.toString().toUpperCase()" :key="option"></el-option>
              </el-select>
            </base-input>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <base-checkbox v-model="form.is_default">
            Default
          </base-checkbox>
        </div>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" :loading="loading" @click="handleSubmit(save)">Save </base-button>
      </template>
    </modal>
  </validation-observer>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import BaseCUModalComponent from '@/mixins/BaseCUModalComponent';
import { AxiosResponse } from 'axios';
import Survey from '@/intefaces/Survey';
const flatPicker = require('vue-flatpickr-component');
import 'flatpickr/dist/flatpickr.css';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import QuestionLazyDropdown from '@/components/lazyDropdown/QuestionLazyDropdown.vue'
import {Timespan} from "@/enums/Timespan";
import {Switch, Tag} from "element-ui";
@Component({
  components: { UserLazydropdown, flatPicker, QuestionLazyDropdown, [Tag.name]: Tag, [Switch.name]: Switch, }
})
export default class CreateSurveyForm extends Mixins(BaseCUModalComponent) {
  @Prop()
  currentEntity!: Survey;

  @Prop({ default: () => ({
      name: '',
      expires_at: null,
      code: '',
      timespan: null,
      times: 0,
      start_from: null,
      for: [],
      active: true,
      is_default: true,
  })
  })
  form!: {
    name: string;
    expires_at: string;
    code: string;
    timespan: string;
    times: number;
    start_form: string;
    for: string;
    active: boolean;
    is_default: boolean;
  };
  private users: any[] = [];
  private questions: any[] = [];
  private surveyTypes = [
    'consumer',
    'outlet',
    ]

  formReset(): any {
    this.form.name = '';
    this.form.expires_at = '';
    this.form.code = '';
    this.form.timespan = '';
    this.form.times = 0;
    this.form.start_form = '';
    this.form.for = '';
    this.users = [];
    return this.form;
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    if (this.users.length > 0) {
      await this.assignUsers(response.data.survey);
    }

    if(this.questions.length > 0) {
      await this.assignQuestion(response.data.survey)
    }
    this.$emit('created', response.data.survey);
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.survey);
  }

  get createApi(): string {
    return '/surveys';
  }

  get updateApi(): string {
    return `/surveys/${this.currentEntity.id}`;
  }

  get timespan(){
    return Timespan;
  }

  async assignUsers(survey: Survey) {
    for (const value of this.users) {
      await this.$http.post(this.$api(`/surveys/${survey.id}/assignees`), { user_id: value });
    }
  }

  async assignQuestion(survey: Survey) {
    for (const value of this.questions) {
      await this.$http.post(this.$api(`/surveys/${survey.id}/questions`), {question_id: value});
    }
  }
}
</script>
