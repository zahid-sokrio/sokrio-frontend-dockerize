<template>
  <div class="card">
    <validation-observer ref="formValidator" v-slot="{handleSubmit}">
      <div class="card-header border-0">
        <div class="row">
          <div class="col-6">
            <div class="form-inline">
              <h3 class="mb-0">Bulk</h3>
              <el-tooltip class="ml-3" content="Send and manage SMS campaigns to your audience" placement="right">
                <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
              </el-tooltip>
              <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
                <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                   @click="showGIF = true"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <template>
        <!-- Dropdown header -->
        <div class="px-3 py-3">
        </div>
        <!-- List group -->
        <div class="list-group list-group-flush">
          <div class="list-group-item">
            <div class="row align-items-center">
              <div class="col-md-3">
                <role-lazydropdown placeholder="Select Role" v-model="selectedRole" label="Roles"
                                   :multiple="multiple"></role-lazydropdown>
              </div>
              <div class="col-md-3">
                <territory-lazydropdown placeholder="Select Territory" v-if="selectedRole.length>0"
                                        v-model="selectedTerritory" label="Territory"
                                        :end-point="'territories?parent_id=1'"
                                        :multiple="multiple"></territory-lazydropdown>
              </div>
              <div class="offset-5 col-md-1">
                <base-button type="success" v-if="selectedRows.length>0" @click="isActive = true">Send</base-button>
              </div>
            </div>
          </div>
          <div class="list-group-item" v-if="selectedTerritory.length>0">
            <div class="row align-items-center">
              <div class="col-md-12">
                <div v-show="selectedRows.length > 0 || allItemSelected">
                  <p v-if="allItemSelected" class="text-center">
                    All {{ pagination.totalEntity }} items are selected.
                    <a href="#" @click.prevent="deselectAllItems">Deselect All {{ pagination.totalEntity }} items.</a>
                  </p>
                  <p v-else class="text-center">
                    {{ selectedRows.length == 1 ? '1 item' : `${selectedRows.length} items are` }} selected.
                    <a href="#" @click.prevent="selectAllItems">Select all {{ pagination.totalEntity }} items.</a>
                  </p>
                </div>
                <el-table
                  v-loading="loading"
                  class="table-responsive align-items-center table-flush table-striped"
                  header-row-class-name="thead-light"
                  :data="users"
                  ref="multipleTable"
                  @selection-change="handleSelectionChange"
                  :row-key="getRowKeys"
                >
                  <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                  <el-table-column label="Name" min-width="200px" prop="name">
                    <template v-slot="{ row }">
                      <b>{{ row.name }}</b>
                    </template>
                  </el-table-column>
                  <el-table-column label="Number" min-width="200px" prop="phone">
                    <template v-slot="{ row }">
                      <b>{{ row.phone ? row.phone : '-' }}</b>
                    </template>
                  </el-table-column>

                </el-table>
                <base-pagination
                  class="mt-3"
                  v-if="users.length > 0"
                  v-model="pagination.currentPage"
                  :perPage="pagination.entityPerPage"
                  :total="pagination.totalEntity"
                  align="center"
                  :disabled="loading"
                ></base-pagination>
              </div>
            </div>
          </div>
        </div>
        <div href="#!" class="dropdown-item text-center text-primary font-weight-bold py-3"></div>
        <modal :show.sync="isActive">
          <h6 slot="header" class="modal-title" id="modal-title-default">SMS Format</h6>
          <base-input alternative
                      class="mb-3"
                      placeholder="SMS Body"
                      type="textarea">
          <textarea class="form-control" rows="4" v-model="smsBody"
                    placeholder="e.g. Save Now! Gabi’s Gifts is offering 30% off all items up to 7pm Tues. Discount applied at checkout. Don’t miss out."></textarea>
          </base-input>
          <small class="ml-1" v-if="smsBody.length != 0 && smsBody.length <= 160"> SMS length: {{ smsBody.length }}
            characters <br></small>
          <small class="text-danger" v-if="smsBody.length > 160"> SMS length exceeds 160 characters limit. Total SMS
            count: {{ Math.ceil(smsBody.length / 160) }}</small>

          <template slot="footer">
            <base-button class="ml-auto" type="primary" @click="submitBulkSMSCampaign()"
                         :disabled="smsBody.length == 0">Send
            </base-button>
          </template>
        </modal>
      </template>
    </validation-observer>
  </div>

</template>
<script lang="ts">
import {Component, Mixins, Vue, Watch} from "vue-property-decorator";
import {Popover, Switch, Select, Option, Table, TableColumn} from "element-ui";
import MultiSelectRow from '@/mixins/MultiSelectRow';
import PaginationComponentMixin from "@/mixins/PaginationComponent";
import RoleLazydropdown from "@/components/lazyDropdown/RoleLazydropdown.vue";
import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown.vue";

@Component({
  components: {
    [Switch.name]: Switch,
    [Popover.name]: Popover,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    RoleLazydropdown,
    TerritoryLazydropdown
  }
})
export default class Bulk extends Mixins(PaginationComponentMixin, MultiSelectRow) {
  private selectedTerritory: Array<Number> = [];
  private selectedRole: Array<Number> = [];
  private isActive: boolean = false;
  private multiple: boolean = true;
  private smsBody: string = '';
  private users: any = [];


  bulkSmsDispatchNotification() {
    this.$notify({
      title: 'Success',
      message: "Bulk SMS campaign dispatched",
      duration: 5000,
      iconClass: 'ni ni-bell-55',
      // @ts-ignore
      verticalAlign: 'bottom',
      horizontalAlign: 'right',
      type: 'success'
    });
  }

  submitBulkSMSCampaign() {
    this.isActive = false;
    this.$http
      .post(this.$api(`/bulk-messages`), {
        users: this.selectedRows.map(user => user.id),
        message: this.smsBody
      }).then(response => {
      this.bulkSmsDispatchNotification();
      this.selectedRole = [];
      this.selectedRows = [];
      this.selectedTerritory = [];
      this.smsBody = ''
      this.$nextTick(() => {
        (this.$refs.formValidator as HTMLFormElement).reset();
      })
    })
      .catch(error => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  fetchUser() {
    this.loading = true;
    this.$http.get(this.$api(`/users?role=${this.selectedRole.join()}&t=${this.selectedTerritory.join()}&page=${this.pagination.currentPage}`))
      .then(response => {
        this.users = response.data.users;
        this.setPagination(response.data);
        this.loading = false;
      })
  }

  @Watch('selectedRole')
  updateUserOnRoleChange() {
    this.fetchUser();
    if (this.selectedRole.length == 0) {
      this.selectedTerritory = [];
    }
  }

  @Watch('selectedTerritory')
  updateUserOnTerritoryChange() {
    this.fetchUser();
  }

}
</script>
