<template>
  <modal v-if="isActiveAssigneeList" :show="isActiveAssigneeList" @close="close">
    <template slot="header">
      <h5 class="modal-title">Assignees of Survey "{{ currentEntity.name }}"</h5>
    </template>
    <div class="row">
      <div class="col">
        <UserLazydropdown
          :collapse-tags="true"
          placeholder="Add Assignee"
          :multiple="true"
          :end-point="`users${this.queryBuilder.getFilters(true)}`"
          v-model="selectedAssignees"
        ></UserLazydropdown>
      </div>
      <div class="col">
        <base-button v-if="selectedAssignees.length > 0" type="success" @click="addAssignee" :loading="addingAssignee">Add</base-button>
      </div>
    </div>

    <el-table v-loading="loading" class="table-responsive align-items-center" header-row-class-name="thead-light" :data="assignees">
      <el-table-column label="Name" min-width="250px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="Actions" width="80">
        <template v-slot="{ row, $index }">
          <el-tooltip content="Remove Assignee" placement="top">
            <a
              href="#!"
              @click.prevent="(showDeleteModal = true), (currentAssignee = row)"
              class="table-action table-action-delete"
              data-toggle="tooltip"
              data-original-title="Remove Assignee"
            >
              <i class="fas fa-trash text-danger"></i>
            </a>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="assignees.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>
    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure want to remove this assignee ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click.prevent="showDeleteModal = false">Close</base-button>
        <base-button type="danger" :loading="deletingAssignee" @click.prevent="removeAssignee">Delete</base-button>
      </template>
    </modal>
    <template slot="footer">
      <base-button type="secondary" @click="close">Close</base-button>
    </template>
  </modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import Survey from '@/intefaces/Survey';
import BaseCUModalComponentMixin from '@/mixins/BaseCUModalComponent';
import { AxiosResponse } from 'axios';
import User from '@/intefaces/User';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import { QueryBuilder } from '@/classes/QueryBuilder';

@Component({
  components: { UserLazydropdown }
})
export default class SurveyAssigneeListModal extends Mixins(PaginationComponentMixin, BaseCUModalComponentMixin) {
  @Prop({ default: null })
  currentEntity!: Survey;
  @Prop()
  isActiveAssigneeList!: boolean;
  loading: boolean = false;
  assignees: User[] = [];
  form: any;
  showDeleteModal: boolean = false;
  addingAssignee: boolean = false;
  currentAssignee!: User;
  deletingAssignee: boolean = false;
  selectedAssignees: User[] = [];
  queryBuilder = new QueryBuilder();

  @Watch('isActiveAssigneeList')
  async onOpenModal() {
    if (this.isActiveAssigneeList) {
      this.loading = true;
      let { data } = await this.$http.get(this.$api(`/surveys/${this.currentEntity.id}/assignees`));
      this.assignees = data.assignees;
      this.setPagination(data);
      this.loading = false;
    }
  }
  @Watch('assignees')
  onChangePagination(value: User[]) {
    this.queryBuilder.addListener('except_id', value.map(user => user.id).join(','));
  }
  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    return Promise.resolve(undefined);
  }

  afterUpdate(response: AxiosResponse<any>): void {}

  get createApi(): string {
    return '';
  }

  formReset(): any {}

  get updateApi(): string {
    return '';
  }

  async removeAssignee() {
    this.deletingAssignee = true;
    await this.$http.delete(this.$api(`/surveys/${this.currentEntity.id}/assignees/${this.currentAssignee.id}`));
    this.assignees.splice(
      this.assignees.findIndex(value => value.id == this.currentAssignee.id),
      1
    );
    this.$notify({
      title: 'Success',
      message: 'Successfully Deleted',
      duration: 5000,
      iconClass: 'ni ni-bell-55',
      type: 'success'
    });
    this.showDeleteModal = false;
    this.deletingAssignee = false;
  }
  async addAssignee() {
    this.addingAssignee = true;
    for (const value of this.selectedAssignees) {
      let { data } = await this.$http.post(this.$api(`/surveys/${this.currentEntity.id}/assignees`), { user_id: value });
      this.assignees.push(data.assignee);
    }
    this.addingAssignee = false;
    this.selectedAssignees = [];
    this.$notify({
      title: 'Success',
      message: 'Successfully Added',
      duration: 5000,
      iconClass: 'ni ni-bell-55',
      type: 'success'
    });
  }
  close(): void {
    // super.close();
    this.$emit('update:isActiveAssigneeList', false);
  }
}
</script>
