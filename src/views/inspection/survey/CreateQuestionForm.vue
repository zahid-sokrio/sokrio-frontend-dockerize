<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" v-if="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New' }} Question</h5>
      </template>
      <div class="row justify-content-center mt-2">
        <div class="col-10">
          <base-input name="title" :rules="{ required: true }" v-model="form.title" placeholder="Type your question here.."></base-input>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-5">
          <base-input name="type" :rules="{ required: true }">
            <el-select v-model="form.type" vid="type" :value="form.type" placeholder="Survey type">
              <el-option v-for="item in surveyTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </base-input>
        </div>
        <div class="col-5">
          <base-input name="for" :rules="{ required: true }">
            <el-select v-model="form.for" placeholder="Survey for">
              <el-option v-for="item in surveyFor" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </base-input>
        </div>
      </div>

      <transition name="el-fade-in-linear">
        <div v-show="form.type === 'radio' || form.type === 'checkbox'" class="row transition-box justify-content-center mt-2">
          <div class="col-10">
            <hr class="mt-0"/>
            <el-tooltip v-for="(clue, index) in form.options" :key="index" :disabled="index <= 1" placement="right">
              <template slot="content">
                <el-button @click="removeClue(index)" size="mini" type="danger" icon="el-icon-close" circle></el-button>
              </template>
              <base-input
                v-model="form.options[index]"
                :rules="{ required_if: form.type == 'radio' || form.type == 'checkbox' }"
                :name="`Clue ${index + 1}`"
                :placeholder="`Clue ${index + 1} ${index === 0 ? ', e.g. YES' : index === 1 ? ', e.g. NO' : ''}`"
              >
              </base-input>
            </el-tooltip>
          </div>

          <div class="col-10 text-right">
            <el-tooltip content="Add more clue." placement="top">
              <base-button @click="addClue" size="sm" type="primary" class="btn-icon-only rounded-circle">
                <span class="btn-inner--icon"><i class="fa fa-plus"></i></span>
              </base-button>
            </el-tooltip>
          </div>
        </div>
      </transition>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" :loading="loading" @click="handleSubmit(save)">Save</base-button>
      </template>
    </modal>
  </validation-observer>
</template>

<script lang="ts">
  import {Component, Prop, Mixins, Vue} from 'vue-property-decorator';
  import BaseCUModalComponent from '@/mixins/BaseCUModalComponent';
  import {AxiosResponse} from 'axios';
  import {RadioGroup, Radio, Badge, Button} from 'element-ui';
  import Question from '@/intefaces/Question';
  import Survey from '@/intefaces/Survey';

  @Component({
    components: {
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Badge.name]: Badge,
      [Button.name]: Button
    }
  })
  export default class CreateQuestionForm extends Mixins(BaseCUModalComponent) {
    @Prop()
    currentEntity!: Question;
    @Prop()
    currentSurvey!: Survey;
    @Prop()
    form!: {
      for: string;
      options: Array<string | number> | null;
      survey_id: number | null;
      title: string;
      type: string | null;
    };
    private surveyTypes = [
      {value: 'radio', label: 'MCQ'},
      {value: 'checkbox', label: 'MCQ with multiple ans'},
      {value: 'rating', label: 'Rating'},
      {value: 'textarea', label: 'Textarea'}
    ];
    private surveyFor = [
      {value: 'consumer', label: 'Customer'},
      {value: 'outlet', label: 'Outlet'}
    ];

    formReset(): any {
      this.form.for = '';
      this.form.options = ['', ''];
      this.form.survey_id = null;
      this.form.title = '';
      this.form.type = null;
      return this.form;
    }

    async afterCreate(response: AxiosResponse<any>): Promise<void> {
      this.$emit('created', response.data.question);
    }

    afterUpdate(response: AxiosResponse<any>): void {
      this.$emit('updated', response.data.question);
    }

    get createApi(): string {
      return `/surveys/${this.currentSurvey.id}/questions`;
    }

    get updateApi(): string {
      return `/surveys/${this.currentSurvey.id}/questions/${this.currentEntity.id}`;
    }

    private addClue() {
      if(!this.form.options) return;
      this.form.options.push('');
    }

    private removeClue(index: number) {
      if(!this.form.options) return;
      this.form.options.splice(index, 1);
    }

    formData(): any {
      let question = {
        for: this.form.for,
        options: this.form.options,
        survey_id: this.form.survey_id,
        title: this.form.title,
        type: this.form.type
      };
      if (this.form.type === 'rating') {
        question.type = 'radio';
        question.options = [1, 2, 3, 4, 5];
      }
      if (this.form.type === 'textarea') {
        // delete question.options;
        question.options = []
      }

      return question;
    }

  }
</script>
