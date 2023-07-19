<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <ul class="list-group list-group-flush list my--3">
            <li class="list-group-item px-0">
              <div class="row align-items-center">
                <div class="col-auto">
                  <el-button @click="$router.back()" icon="fa fa-arrow-left" circle> </el-button>
                </div>
                <div class="col ml--2">
                  <h4 class="mb-0">{{ currentSurvey ? currentSurvey.name : '' }}</h4>
                  <small>List of Questions</small>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-6">

        </div>
        <div class="col-md-7">
          <QuestionLazyDropdown placeholder="Add Question" :multiple="true" :end-point="`questions${this.queryBuilder.getFilters(true)}`" v-model="selectedQuestions"></QuestionLazyDropdown>
        </div>
        <div class="col-md-3">
          <base-button v-if="selectedQuestions.length > 0" type="success" @click="addQuestion" :loading="addingQuestion">Add</base-button>
        </div>
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="questions"
    >
      <el-table-column align="center" label="Title" min-width="210px" sortable prop="name">
        <template v-slot="{ row }">
          <b>{{ row.title }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Type" min-width="170px" sortable prop="type">
        <template v-slot="{ row }">
          <b>{{ row.type }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Answers" min-width="90px" prop="id">
        <template v-slot="{ row }">
          <el-tooltip content="Answers" placement="top">
            <a href="#!" @click.prevent="onDetails(row)" class="table-action" data-toggle="tooltip" data-original-title="Details">
              <i class="fa fa-inbox fa-2x text-info"></i>
            </a>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Options" min-width="210px" sortable prop="options">
        <template v-slot="{ row }">
          <CustomTooltip v-if="row.type != 'textarea' && row.type != 'image'"
                         :entities="row.options" title="Options"
                         button-text="View Option">
          </CustomTooltip>
          <b v-else> - </b>
        </template>
      </el-table-column>
      <el-table-column label="Created At" align="center" min-width="170px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Delete" placement="top">
            <a
              href="#!"
              @click.prevent="(showDeleteModal = true), (currentEntity = row)"
              class="table-action table-action-delete"
              data-toggle="tooltip"
              data-original-title="Delete survey"
            >
              <i class="fas fa-trash text-danger"></i>
            </a>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="questions.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>
    <!--        Delete Modal-->
    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteEntity">Delete</base-button>
      </template>
    </modal>
    <!--        End Delete Modal     -->
    <SurveyQuestionDetailsModal
      :is-active-details.sync="isActiveDetails"
      :current-entity="isActiveDetails ? currentEntity : null"
    ></SurveyQuestionDetailsModal>
  </div>
</template>
<script lang="ts">
  import {Vue, Component, Prop, Mixins, Watch} from 'vue-property-decorator';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Button } from 'element-ui';
import Survey from '@/intefaces/Survey';
import CreateSurveyForm from '@/views/inspection/survey/CreateSurveyForm.vue';
import CreateQuestionForm from '@/views/inspection/survey/CreateQuestionForm.vue';
import SurveyQuestionDetailsModal from '@/views/inspection/survey/SurveyQuestionDetailsModal.vue';
import Question from '@/intefaces/Question';
import PaginationComponentMixin from "@/mixins/PaginationComponent";
import QuestionLazyDropdown from "@/components/lazyDropdown/QuestionLazyDropdown.vue";
import {QueryBuilder} from "@/classes/QueryBuilder";
import User from "@/intefaces/User";
import CustomTooltip from "@/components/CustomTooltip.vue";

@Component({
  components: {
    CreateQuestionForm,
    SurveyQuestionDetailsModal,
    CreateSurveyForm,
    QuestionLazyDropdown,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [Button.name]: Button,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    CustomTooltip
  }
})
export default class SurveyQuestionList extends Mixins(PaginationComponentMixin) {
  @Prop()
  public currentSurvey!: Survey;
  private questions: Survey[] = [];
  private showDeleteModal: boolean = false;
  private isActive: boolean = false;
  private isActiveDetails: boolean = false;
  private isUpdate: boolean = false;
  private currentEntity!: Question;
  private selectedQuestions: Question[] = [];
  private addingQuestion: boolean = false;
  private form: Question = {
    for: '',
    options: ['', ''],
    survey_id: '',
    title: '',
    type: null
  };
  queryBuilder = new QueryBuilder();

  @Watch('questions')
  onChangePagination(value: Question[]) {
    this.queryBuilder.addListener('except_id', value.map(question => question.id).join(','));
  }

  async created() {
     if(this.currentSurvey == null){
      await this.$router.push("/inspection")
    }
    this.fetchEntity();
  }
  entityCreated(survey: Survey) {
    this.questions.unshift(survey);
  }

  onEdit(row: Question) {
    this.isUpdate = true;
    this.currentEntity = row;
    this.form = {
      for: this.currentEntity.for,
      options: this.currentEntity.options,
      survey_id: this.currentEntity.survey_id,
      title: this.currentEntity.title,
      type: this.currentEntity.type
    };
    this.isActive = true;
  }

  onDetails(row: Question) {
    this.isActiveDetails = true;
    this.currentEntity = row;
  }

  @Watch('pagination.currentPage')
  async fetchEntity() {
    this.loading = true;
    if (!this.currentSurvey) return;
    const { data } = await this.$http.get(this.$api(`/surveys/${this.currentSurvey.id}/questions?page=${this.pagination.currentPage}`));
    this.questions = data.questions;
    this.setPagination(data)
    this.loading = false;
  }

  entityUpdated(survey: Survey) {
    this.questions.splice(
      this.questions.findIndex(value => value.id == survey.id),
      1,
      survey
    );
  }

  async addQuestion() {
    this.addingQuestion = true;
    for (const value of this.selectedQuestions) {
      let { data } = await this.$http.post(this.$api(`/surveys/${this.currentSurvey.id}/questions`), { question_id: value});
      this.questions.push(data.question);
    }
    this.addingQuestion = false;
    this.selectedQuestions = [];
    this.$notify({
      title: 'Success',
      message: 'Successfully Added',
      duration: 5000,
      iconClass: 'ni ni-bell-55',
      type: 'success'
    });
  }

  deleteEntity(): void {
    this.$http.delete(this.$api(`/surveys/${this.currentSurvey.id}/questions/${this.currentEntity.id}`)).then(response => {
      this.showDeleteModal = false;
      this.questions.splice(
        this.questions.findIndex(value => value.id == this.currentEntity.id),
        1
      );
      this.$notify({
        title: 'Success',
        message: 'Successfully Deleted',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
    });
  }
}
</script>
