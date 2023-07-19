<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Survey</h3>
            <el-tooltip class="ml-3" content="Manage survey to get your product feedback from customer"
                        placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                 @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Filters" placement="top">
            <base-button
              type="primary"
              icon
              size="sm"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)"
            >
              <span class="btn-inner--text">Filters</span>
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
            </base-button>
          </el-tooltip>
          <el-tooltip content="Add New Survey" placement="top" v-can="permissionEnum.CREATE_SURVEY">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
        <el-drawer title="Survey Filter" :visible.sync="isFilterModelActive" direction="rtl"
                   :before-close="handleClose">
          <div class="col-md-12 m-2">
            <base-input label="Type">
              <el-select filterable placeholder="e.g. Archived" v-model="selectedFilter" clearable>
                <el-option v-for="(type, index) in filter" :key="index" :label="type.replace(/^\w/, c => c.toUpperCase())" :value="type"></el-option>
              </el-select>
            </base-input>
          </div>
          <div class="col-md-12 text-left">
            <base-button type="primary" icon @click="closeBtn">
              <span class="btn-inner--text">Done</span>
            </base-button>
            <base-button type="primary" icon @click="resetBtn">
              <span class="btn-inner--text">Reset</span>
            </base-button>
          </div>
        </el-drawer>
        <!--        Create and update Modal-->
        <CreateSurveyForm
          :current-entity="isUpdate ? currentEntity : null"
          :form="form"
          :is-active.sync="isActive"
          :is-update.sync="isUpdate"
          @created="entityCreated($event)"
          @updated="entityUpdated($event)"
        ></CreateSurveyForm>
        <!--        Create and update Modal-->
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="surveys"
    >
      <el-table-column align="center" label="Name" min-width="210px" sortable prop="name">
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Code" min-width="150px" sortable prop="code">
        <template v-slot="{ row }">
          <b>{{ row.code }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Timespan" min-width="150px" sortable prop="name">
        <template v-slot="{ row }">
          <b>{{ row.timespan }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Completed" min-width="120px" sortable prop="name">
        <template v-slot="{ row }">
          <b :style="row.completed >= row.times && row.completed > 0 ? 'color: green' : ''">{{
              row.completed ? row.completed : 0
            }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Start From" min-width="130px" sortable prop="name">
        <template v-slot="{ row }">
          <b>{{ row.start_form | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Expires At" align="center" min-width="130px" prop="expires_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.expires_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Created At" align="center" min-width="130px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column v-if="selectedFilter == 'archived'" label="Deleted At" align="center" min-width="130px" prop="deleted_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.deleted_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80px" prop="name">
        <template v-slot="{ row }">
          <b><badge v-if="row.is_default" rounded type="default">Default</badge></b>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" v-if="selectedFilter != 'archived'">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Question Details" placement="top">
            <a href="#!" @click.prevent="onDetails(row)" class="table-action" data-toggle="tooltip"
               data-original-title="Details">
              <i class="fas fa-question-circle text-info"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Update Survey" placement="top" v-can="permissionEnum.UPDATE_SURVEY">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip"
               data-original-title="Edit survey">
              <i class="fas fa-edit text-info"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Assignee Details" placement="top" v-can="permissionEnum.ASSIGNED_USER_SURVEY">
            <a href="#!" @click.prevent="onAssigneeDetails(row)" class="table-action" data-toggle="tooltip"
               data-original-title="Edit survey">
              <i class="fas fa-users text-info"></i>
            </a>
          </el-tooltip>
          <el-tooltip content="Report" placement="top" v-can="permissionEnum.REPORT_SURVEY">
            <a
              href="#!"
              @click.prevent="(showReportModal = true), (currentEntity = row)"
              class="table-action table-action-delete"
              data-toggle="tooltip"
              data-original-title="Get Survey Report"
            >
              <i class="fas fa-file text-primary"></i>
            </a>
          </el-tooltip>
          <!--          <el-tooltip content="Delete" placement="top">-->
          <!--            <a-->
          <!--              href="#!"-->
          <!--              @click.prevent="(showDeleteModal = true), (currentEntity = row)"-->
          <!--              class="table-action table-action-delete"-->
          <!--              data-toggle="tooltip"-->
          <!--              data-original-title="Delete survey"-->
          <!--            >-->
          <!--              <i class="fas fa-trash text-danger"></i>-->
          <!--            </a>-->
          <!--          </el-tooltip>-->
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="surveys.length > 0"
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
    <modal :show.sync="showReportModal" v-if="showReportModal">
      <template slot="header">
        <h5 class="modal-title">Survey Report</h5>
      </template>
      <div class="row">
        <div class="col-6">
          <DateRange v-model="reportDateRange" label-prop="Date Range"></DateRange>
        </div>
        <div class="col-6">
          <UserLazydropdown v-model="reportTakenBy" label="Taken By"></UserLazydropdown>
        </div>
        <div class="col-lg-6 offset-3" style="cursor: pointer" @click.prevent="downloadSurveyReport">
          <stats-card class="bg-gradient-primary">
            <!-- Card body -->
            <div class="row">
              <div class="offset-3 col-lg-6 text-center">
                <div class="icon icon-shape bg-white text-dark rounded-circle shadow">
                  <i class="ni ni-cloud-download-95"></i>
                </div>
              </div>
            </div>
            <p class="mt-3 mb-0 text-md">
              <span class="text-nowrap text-light">Click here to download.</span>
            </p>
          </stats-card>
        </div>
      </div>
    </modal>
    <AssigneeSurveyForm :is-assignee-model.sync="isAssigneeModel"
                        :current-entity="isAssigneeModel ? currentEntity : null"></AssigneeSurveyForm>
    <SurveyAssigneeListModal
      :is-active-assignee-list.sync="isActiveAssigneeList"
      :current-entity="isActiveAssigneeList ? currentEntity : null"
    ></SurveyAssigneeListModal>
    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"
              :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator';
import { Drawer, Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip } from 'element-ui';
import Survey from '@/intefaces/Survey';
import DateRange from '@/components/DateRange.vue';
import CreateSurveyForm from '@/views/inspection/survey/CreateSurveyForm.vue';
import SurveyQuestionList from '@/views/inspection/survey/SurveyQuestionList.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import AssigneeSurveyForm from '@/views/inspection/survey/AssigneeSurveyForm.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import SurveyAssigneeListModal from '@/views/inspection/survey/SurveyAssigneeListModal.vue';
import swal from 'sweetalert2';
import { Permission as PermissionEnum } from '@/enums/Permission'
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import { QueryBuilder } from "@/classes/QueryBuilder";

@Component({
  components: {
    UserLazydropdown,
    SurveyAssigneeListModal,
    AssigneeSurveyForm,
    SurveyDetailsForm: SurveyQuestionList,
    CreateSurveyForm,
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Drawer.name]: Drawer,
    DateRange
  }
})
export default class SurveyList extends Mixins(PaginationComponentMixin) {
  private surveys: Survey[] = [];
  private showDeleteModal: boolean = false;
  private showReportModal: boolean = false;
  private reportDateRange: string = '';
  private reportTakenBy: number | null = null;
  private recipient: string = '';
  private downloadingReport: boolean = false;
  private isActive: boolean = false;
  private isAssigneeModel: boolean = false;
  private isActiveAssigneeList: boolean = false;
  public isUpdate: boolean = false;
  private currentEntity!: Survey;
  private isFilterModelActive: boolean = false;
  private selectedFilter: any = '';
  private filter: any = ['archived', 'On going'];
  private form: Survey = {
    name: '',
    expires_at: null,
    code: '',
    timespan: null,
    times: 0,
    start_form: null,
    for: [],
    active: true,
    is_default: true
  };
  private showGIF: boolean = false;
  private demoTourEntity: string = 'inspectionSurvey';
  private GIFs: Array<any> = [
    {
      label: 'Create a survey',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a survey',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a survey',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of survey';
  private queryBuilder: QueryBuilder = new QueryBuilder();

  get permissionEnum() {
    return PermissionEnum;
  }

  entityCreated(survey: Survey) {
    this.resetDefault(survey)
    this.surveys.unshift(survey);
  }

  onEdit(row: Survey) {
    this.isUpdate = true;
    this.currentEntity = row;
    this.form = {
      name: this.currentEntity.name,
      expires_at: this.currentEntity.expires_at,
      code: this.currentEntity.code,
      timespan: this.currentEntity.timespan,
      times: this.currentEntity.times,
      start_form: this.currentEntity.start_form,
      for: this.currentEntity.for,
      active: Boolean(this.currentEntity.active),
      is_default: Boolean(this.currentEntity.is_default),
    };
    this.isActive = true;
  }

  onDetails(row: any) {
    this.$router.push({name: 'survey-questions', params: {surveyId: row.id, currentSurvey: row}});
  }

  onAssignee(row: Survey) {
    this.isAssigneeModel = true;
    this.currentEntity = row;
  }

  onAssigneeDetails(row: Survey) {
    this.isActiveAssigneeList = true;
    this.currentEntity = row;
  }

  @Watch('selectedFilter')
  filterSurvey(newVal: any) {
    this.fetchEntity();
  }

  @Watch('pagination.currentPage')
  async fetchEntity() {
    this.loading = true;
    let url = this.selectedFilter == 'archived' ? `/surveys?page=${this.pagination.currentPage}&filter=trashed` : `/surveys?page=${this.pagination.currentPage}`;
    const {data} = await this.$http.get(this.$api(url));
    this.surveys = data.surveys;
    this.setPagination(data);
    this.loading = false;
  }

  async entityUpdated(survey: Survey) {
    this.resetDefault(survey);
    this.surveys.splice(
      this.surveys.findIndex(value => value.id == survey.id),
      1,
      survey
    );

  }

  resetDefault(survey:Survey){
    if (survey.is_default) {
      this.surveys.map(function (value) {
        value.is_default = false;
        return value;
      })
    }
  }

  deleteEntity(): void {
    this.$http.delete(this.$api(`/surveys/${this.currentEntity.id}`)).then(response => {
      this.showDeleteModal = false;
      this.surveys.splice(
        this.surveys.findIndex(value => value.id == this.currentEntity.id),
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

  created() {
    this.fetchEntity();
  }

  @Watch('reportTakenBy')
  onChangeTakenBy(value: any) {
    this.queryBuilder.addListener('taken_by', value)
  }

  @Watch('reportDateRange')
  onChangeDateRange(value: any) {
    this.queryBuilder.addListener('range', value)
  }

  async downloadSurveyReport() {
    this.downloadingReport = true;
    try {
      let {data, headers} = await this.$http.post(this.$api(`/surveys/${this.currentEntity.id}/reports`),
        {
          range: this.reportDateRange,
          taken_by: this.reportTakenBy
        },
        {
          responseType:
            'arraybuffer'
        });
      const blob = await new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const link = document.createElement("a");
      link.href = await URL.createObjectURL(blob);
      link.download = this.$getFileNameFromContentDisposition(headers);
      link.click();
    } catch (e) {
      swal.fire('Error', 'Something went wrong.', 'error');
    } finally {
      this.downloadingReport = false;
      this.showReportModal = false;
    }
  }

  closeBtn() {
    this.isFilterModelActive = false;
  }

  handleClose(done: any) {
    done();
  }

  resetBtn() {
    this.selectedFilter = '';
    this.isFilterModelActive = false;
  }
}
</script>
