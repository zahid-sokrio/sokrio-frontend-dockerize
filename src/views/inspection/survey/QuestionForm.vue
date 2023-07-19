<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" v-if="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New' }} Questions</h5>
      </template>
      <div class="row justify-content-center mt-2">
        <div class="col-12">
          <base-input
            name="title"
            :rules="{ required: true }"
            v-model="form.title"
            placeholder="Type your question here.."
            label="Title"
          ></base-input>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-12">
          <base-input name="type" :rules="{ required: true }" label="Type">
            <el-select v-model="form.type" id="type" :value="form.type" placeholder="Survey type">
              <el-option v-for="item in Types" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </base-input>
        </div>
      </div>

      <transition name="el-fade-in-linear">
        <div v-show="form.type === 'radio' || form.type === 'checkbox'" class="row transition-box justify-content-center mt-2">
          <div class="col-12">
            <hr class="mt-0" />
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

          <div class="col-12 text-right">
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
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';
import Asset from '@/intefaces/Asset';
import { Tooltip, Button } from 'element-ui';
import Question from '@/intefaces/Question';
import BaseCUModalComponentMixin from '@/mixins/BaseCUModalComponent';
import { AxiosResponse } from 'axios';

@Component({
  name: 'Question',
  components: {
    [Tooltip.name]: Tooltip,
    [Button.name]: Button
  }
})
export default class QuestionForm extends Mixins(BaseCUModalComponentMixin) {
  @Prop() currentEntity!: any;
  @Prop({
    default: () => ({
      title: '',
      type: '',
      options: []
    })
  })
  form!: {
    title: string;
    type: string | null;
    options: Array<string | number> | null;
  };

  private Types = [
    { value: 'radio', label: 'MCQ' },
    { value: 'checkbox', label: 'MCQ with multiple ans' },
    { value: 'rating', label: 'Rating' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'image', label: 'Image' },
  ];

  formReset(): any {
    this.form.options = ['', ''];
    this.form.title = '';
    this.form.type = null;
    return this.form;
  }

  get createApi(): string {
    return '/questions';
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.question);
  }

  get updateApi(): string {
    return `/questions/${this.currentEntity.id}`;
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.question);
  }

  private addClue() {
    if (!this.form.options) return;
    this.form.options.push('');
  }

  private removeClue(index: number) {
    if (!this.form.options) return;
    this.form.options.splice(index, 1);
  }

  formData(): any {
    let question = {
      options: this.form.options,

      title: this.form.title,
      type: this.form.type
    };
    if (this.form.type === 'rating') {
      question.type = 'radio';
      question.options = [1, 2, 3, 4, 5];
    }
    if (this.form.type === 'textarea') {
      // delete question.options;
      question.options = [];
    }

    return question;
  }
}
</script>
