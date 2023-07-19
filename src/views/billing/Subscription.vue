<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <h3 class="mb-0">
            Your Subscription Plan
            <base-button size="sm" type="primary" v-if="currentSubscription">
              <span v-text="currentSubscription.scheme_meta.package.name"></span>
            </base-button>
            <i v-else class="fa fa-cog fa-spin fa-2x fa-fw text-info"></i>
          </h3>
        </div>
      </div>
    </div>
    <div class="card-body">
      <PackageSelection>
        <template v-slot:footer="{ requireUserQuota, selectedSchemeId }">
          <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
            <div class="container">
              <div class="row justify-content-end">
                <div class="col-3" v-if="requireUserQuota">
                  <base-input name="user quota" placeholder="User Quota" :rules="{ required: true, numeric: true }" v-model="userQuota"></base-input>
                </div>
                <div class="col-3">
                  <base-input name="coupon code" placeholder="Coupon. e.g. CV2019" v-model="coupon"></base-input>
                </div>
                <div class="col-auto">
                  <base-button :disabled="!selectedSchemeId" @click="handleSubmit(onUpgrade)" type="primary">
                    <span class="btn-inner--icon">
                      <i class="fas fa-rocket"></i>
                    </span>
                    <span class="btn-inner--text">Upgrade</span>
                  </base-button>
                  <el-tooltip content="Increase your user quota." placement="top">
                    <base-button type="primary">
                      <span class="btn-inner--icon">
                        <i class="fas fa-plus"></i>
                      </span>
                      <span class="btn-inner--text">Add User</span>
                    </base-button>
                  </el-tooltip>
                  <el-tooltip content="Cancel Your Subscription" placement="top">
                    <base-button type="warning" @click="isActive = true">
                      <span class="btn-inner--icon">
                        <i class="fas fa-trash"></i>
                      </span>
                      <span class="btn-inner--text">Cancel Subscription</span>
                    </base-button>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </validation-observer>
        </template>
      </PackageSelection>
    </div>

    <!--        End LeaveRequest Delete Modal     -->

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"></GIFModal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip } from 'element-ui';
import CreateLeaveRequestForm from '@/views/attendance/CreateLeaveRequestForm.vue';
import LeaveRequest from '@/intefaces/LeaveRequest';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import PackageSelection from '@/views/auth/Register/PackageSelection.vue';
import Subscription from '@/intefaces/Subscription';
import GIFModal from '@/components/tour/GIFModal.vue';

@Component({
  components: {
    PackageSelection,
    GIFModal,
    CreateLeaveRequestForm,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu
  }
})
export default class ClientSubscription extends Mixins(PaginationComponentMixin) {
  private currentSubscription: Subscription | null = null;
  private coupon: string = '';
  private userQuota = null;
  private isActive: boolean = false;
  private isUpdate: boolean = false;
  private demoTourEntity: string = 'billingSubscription';
  private GIFs: Array<any> = [
    {
      label: 'Create a subscription',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a subscription',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a subscription',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of subscription';
  private currentEntity!: LeaveRequest;
  private form: LeaveRequest = {
    actor_id: null,
    approved_at: null,
    reason: '',
    user_id: null,
    user: null,
    actor: null
  };

  created() {
    this.fetchEntity();
  }

  get currentPackage(): any {
    return '';
  }

  @Watch('pagination.currentPage')
  async fetchEntity() {
    this.loading = true;
    const { data } = await this.$http.get(this.$api('/subscriptions'));
    this.currentSubscription = data.subscriptions[0];
    // this.setPagination(data);
    // this.loading = false;
  }

  entityCreated(leaveRequest: LeaveRequest) {
    // this.leaveRequests.unshift(leaveRequest);
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

  onUpgrade(leaveRequest: LeaveRequest) {
    // this.leaveRequests.splice(
    //   this.leaveRequests.findIndex(value => value.id == leaveRequest.id),
    //   1,
    //   leaveRequest
    // );
  }

  cancelSubscription() {}
}
</script>
