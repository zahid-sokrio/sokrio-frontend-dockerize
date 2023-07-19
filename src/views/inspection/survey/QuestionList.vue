<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Questions</h3>
            <el-tooltip class="ml-3" content="Manage your questions here." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Add New Question" placement="top" v-can="permissionEnum.CREATE_QUESTION">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <question-form
      :is-active.sync="isActive"
      :is-update.sync="isUpdate"
      :form.sync="form"
      :current-entity="currentQuestion"
      @created="createQuestion($event)"
      @updated="updateQuestion($event)"
    ></question-form>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="questions"
    >
      <el-table-column label="Title" name="title" min-width="250px" prop="title" sortable>
        <template v-slot="{ row }">
          <b>{{ row.title }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Type" name="type" min-width="250px" prop="type" sortable>
        <template v-slot="{ row }">
          <b>{{ row.type }}</b>
        </template>
      </el-table-column>

      <el-table-column label="Created At" name="created_at" min-width="250px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center">
        <div class="table-actions" slot-scope="{ row }">
          <el-tooltip content="Update Question" placement="top" v-can="permissionEnum.UPDATE_QUESTION">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit Asset">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
<!--          <el-tooltip content="Delete" placement="top">-->
<!--            <a-->
<!--              href="#!"-->
<!--              @click.prevent="(showDeleteModal = true), (currentQuestion = row)"-->
<!--              class="table-action"-->
<!--              data-toggle="tooltip"-->
<!--              data-original-title="Delete Asset"-->
<!--            >-->
<!--              <i class="fas fa-trash"></i>-->
<!--            </a>-->
<!--          </el-tooltip>-->
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      v-if="questions.length > 0"
      class="mt-3"
      align="center"
      :total="pagination.totalEntity"
      :perPage="pagination.entityPerPage"
      v-model="pagination.currentPage"
      :disabled="loading"
    ></base-pagination>
    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteQuestion" :disabled="disableBtn">Delete</base-button>
      </template>
    </modal>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Component, Mixins, Vue, Watch} from 'vue-property-decorator';
import QuestionForm from '@/views/inspection/survey/QuestionForm.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip, Button} from 'element-ui';
import Question from '@/intefaces/Question';
import Asset from '@/intefaces/Asset';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import { Permission as PermissionEnum } from '@/enums/Permission'

@Component({
  components: {
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Button.name]: Button,
    QuestionForm
  }
})
export default class QuestionList extends Mixins(PaginationComponentMixin) {
  private isActive = false;
  private isUpdate = false;
  private currentQuestion: any = [];
  private questions: any = [];
  private showDeleteModal = false;
  private disableBtn = false;
  private form = {
    title: '',
    type: '',
    options: []
  };
  private showGIF: boolean = false;
  private demoTourEntity: string = 'inspectionQuestions';
  private GIFs: Array<any> = [
    {
      label: 'Create a question',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a question',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a question',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of question';

  get permissionEnum () {
    return PermissionEnum;
  }

  createQuestion(question: Question) {
    this.isActive = false;
    this.questions.unshift(question);
  }

  updateQuestion(question: Question) {
    this.isUpdate = false;
    this.questions.splice(
      this.questions.findIndex((questionItem: any) => questionItem.id == question.id),
      1,
      question
    );
    this.isActive = false;
  }

  onEdit(row: Question) {
    this.isUpdate = true;
    this.currentQuestion = row;
    this.form = {
      title: this.currentQuestion.title,
      type: this.currentQuestion.type,
      options: this.currentQuestion.options
    };
    this.isActive = true;
  }

  deleteQuestion() {
    this.disableBtn = true;
    this.$http
      .delete(this.$api(`/questions/${this.currentQuestion.id}`))
      .then(response => {
        this.disableBtn = false;
        this.showDeleteModal = false;
        this.questions.splice(
          this.questions.findIndex((question: any) => question.id == this.currentQuestion.id),
          1
        );
        this.$notify({
          title: 'Success',
          message: 'Successfully Deleted',
          duration: 5000,
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
  }

  @Watch('pagination.currentPage')
  fetchQuestion() {
    this.loading = true;
    this.$http.get(this.$api(`/questions?page=${this.pagination.currentPage}`)).then(response => {
      this.questions = response.data.questions;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  created() {
    this.fetchQuestion();
  }
}
</script>
