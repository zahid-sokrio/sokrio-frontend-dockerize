<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Leave requests</h3>
            <el-tooltip class="ml-3" content="Manage employee's attendace for your business" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div v-can="permissionEnum.CREATE_LEAVE" class="col-6 text-right">
          <el-tooltip content="Request for leave" placement="top" >
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Take leave</span>
            </base-button>
          </el-tooltip>
        </div>
        <!--        Create and update Modal-->
        <CreateLeaveRequestForm
          :current-entity="isUpdate ? currentEntity : null"
          :form="form"
          :is-active.sync="isActive"
          :is-update.sync="isUpdate"
          @created="entityCreated($event)"
          @updated="entityUpdated($event)"
        ></CreateLeaveRequestForm>
        <!--        Create and update Modal-->
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="leaveRequests"
    >
      <el-table-column v-if="$hasPermission('manageLeaveRequest')" align="center" label="Requested by" min-width="160px" prop="user" sortable>
        <template v-slot="{ row }">
          <b>{{ row.user ? row.user.name : '-' }}</b>
          <br/>
          <span class="text-xs">{{ row.user ? row.user.email : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :align="$hasPermission('manageLeaveRequest') ? 'center' : 'left'" label="Reason" min-width="250px" prop="reason">
        <template v-slot="{ row }">
          <b>{{ row.reason }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" min-width="120px" prop="approved_at" sortable>
        <template v-slot="{ row }">
          <badge rounded :type="row.approved_at ? 'success' : row.actor ? 'danger' : 'info'" size="md">
            {{ row.approved_at ? 'Approved' : row.actor ? 'Rejected' : 'Pending' }}
          </badge>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Approved at" min-width="160px" prop="approved_at" sortable>
        <template v-slot="{ row }">
          <b v-if="row.approved_at">{{ row.approved_at | datetime('ll') }}</b>
          <b v-else>--</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actor" min-width="180px" prop="actor" sortable>
        <template v-slot="{ row }">
          <b>{{ row.actor ? row.actor.name : '-' }}</b>
          <br/>
          <span class="text-xs">{{ row.actor ? row.actor.email : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Requested At" align="center" min-width="190px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Edit" placement="top" v-can="permissionEnum.CREATE_LEAVE">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit reason">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
          <el-tooltip
            v-can="permissionEnum.APPROVE_LEAVE"
            :content="!row.approved_at ? 'Approve leave request' : 'Reject leave request'"
            placement="top"
          >
            <a
              href="#!"
              @click.prevent="(currentEntity = row), !row.approved_at ? (showApproveModal = true) : (showRejectModal = true)"
              class="table-action"
              data-toggle="tooltip"
              :data-original-title="!row.approved_at ? 'Approve leave request' : 'Approved'"
            >
              <i :class="!row.approved_at ? 'text-success fas fa-check-circle' : 'text-danger fas fa-times-circle'"></i>
            </a>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="leaveRequests.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>
    <!--        LeaveRequest Delete Modal-->
    <modal :show="showApproveModal || showRejectModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">Are you sure want to {{ showApproveModal ? 'approve' : 'reject' }} this leave request ?</h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="(showApproveModal = false), (showRejectModal = false)">Close</base-button>
        <base-button
          :loading="loading"
          :type="showApproveModal ? 'success' : 'warning'"
          @click.prevent="showApproveModal ? approveLeaveRequest() : rejectLeaveRequest()"
        >{{ showApproveModal ? 'Approve' : 'Reject' }}
        </base-button
        >
      </template>
    </modal>

    <!--        End LeaveRequest Delete Modal     -->

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Mixins, Watch} from 'vue-property-decorator';
import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip} from 'element-ui';
import CreateLeaveRequestForm from '@/views/attendance/CreateLeaveRequestForm.vue';
import LeaveRequest from '@/intefaces/LeaveRequest';
import GIFModal from '@/components/tour/GIFModal.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import { Permission as PermissionEnum } from '@/enums/Permission'

@Component({
  components: {
    CreateLeaveRequestForm,
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu
  }
})
export default class LeaveList extends Mixins(PaginationComponentMixin) {
  private leaveRequests: LeaveRequest[] = [];
  private showApproveModal: boolean = false;
  private showRejectModal: boolean = false;
  private isActive: boolean = false;
  private isUpdate: boolean = false;
  private loadingApproval: boolean = false;
  private currentEntity!: LeaveRequest;
  private demoTourEntity: string = 'attendanceLeave';
  private showGIF: boolean = false;
  private GIFs: Array<any> = [
    {
      label: 'Create an leave',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update an leave',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete an leave',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of leave';
  private form: LeaveRequest = {
    actor_id: null,
    approved_at: null,
    reason: '',
    user_id: null,
    user: null,
    actor: null
  };

  get permissionEnum () {
    return PermissionEnum;
  }

  entityCreated(leaveRequest: LeaveRequest) {
    this.leaveRequests.unshift(leaveRequest);
  }

  onEdit(row: LeaveRequest) {
    this.isUpdate = true;
    this.currentEntity = row;
    this.form = {
      actor_id: this.currentEntity.actor_id,
      approved_at: this.currentEntity.approved_at,
      id: this.currentEntity.id,
      reason: this.currentEntity.reason,
      user_id: this.currentEntity.user_id,
      user: this.currentEntity.user,
      actor: this.currentEntity.actor
    };
    this.isActive = true;
  }

  @Watch('pagination.currentPage')
  async fetchEntity() {
    this.loading = true;
    let uri: string = this.$hasPermission('manageLeaveRequest')
      ? `/leave-requests?page=${this.pagination.currentPage}`
      : `/own-leave-requests?page=${this.pagination.currentPage}`;
    const {data} = await this.$http.get(this.$api(uri));
    this.leaveRequests = data.leaveRequests;
    this.setPagination(data);
    this.loading = false;
  }

  entityUpdated(leaveRequest: LeaveRequest) {
    this.leaveRequests.splice(
      this.leaveRequests.findIndex(value => value.id == leaveRequest.id),
      1,
      leaveRequest
    );
  }

  async approveLeaveRequest() {
    this.loadingApproval = true;
    try {
      const {data} = await this.$http.post(this.$api('/approved-leave-requests'), {leave_request_id: this.currentEntity.id});
      const levelRequest = this.leaveRequests[this.leaveRequests.findIndex(value => value.id == data.approvedLeaveRequest.id)];
      levelRequest.approved_at = data.approvedLeaveRequest.approved_at;
      levelRequest.actor_id = this.$user.id;
      levelRequest.actor = this.$user;
      this.$notify({
        title: 'Success',
        message: 'Request approved.',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
    } catch (e) {
      this.$notify({title: 'Failed', message: 'Something want wrong', duration: 5000, iconClass: 'ni ni-bell-55', type: 'warning'});
    }
    this.showApproveModal = false;
    this.loadingApproval = false;
  }

  async rejectLeaveRequest() {
    this.loadingApproval = true;
    try {
      const {data} = await this.$http.delete(this.$api(`/approved-leave-requests/${this.currentEntity.id}`));
      this.leaveRequests[this.leaveRequests.findIndex(value => value.id == this.currentEntity.id)].approved_at = null;
      this.$notify({
        title: 'Success',
        message: 'Request rejected.',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
    } catch (e) {
      this.$notify({title: 'Failed', message: 'Something want wrong', duration: 5000, iconClass: 'ni ni-bell-55', type: 'warning'});
    }
    this.showRejectModal = false;
    this.loadingApproval = false;
  }

  created() {
    this.fetchEntity();
  }
}
</script>
