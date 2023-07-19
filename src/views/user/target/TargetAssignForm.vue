<template>
  <div>
    <validation-observer ref="formValidator" v-slot="{ handleSubmit }">
      <!--      <form class="needs-validation"-->
      <!--            @submit.prevent="handleSubmit(save)">-->
      <modal :show="isTargetName" v-if="isTargetName" size="xl" @close="close" class="modal-dialog-scrollable">
        <template slot="header">
          <h5 class="modal-title">Add New Target Name</h5>
        </template>
        <div>
          <el-tabs tabNavClasses="nav-fill nav-wrapper" v-model="activeTab">
            <el-tab-pane label="Target Name" name="targetName">
              <target-name-component :form.sync="form"></target-name-component>
              <div class="card">
                <el-table
                  v-loading="loading"
                  class="table-responsive align-items-center table-flush table-striped"
                  header-row-class-name="thead-light"
                  :data="targetNames"
                >
                  <el-table-column label=" Target Name" min-width="250px" prop="name" align="center" sortable>
                    <template v-slot="{ row }">
                      <b>{{ row.target_name }}</b>
                    </template>
                  </el-table-column>

                  <el-table-column label="Start From" min-width="130px" prop="date_time" align="center" sortable>
                    <template v-slot="{ row }">
                      <b>{{ row.start_from | datetime('ll') }}</b>
                    </template>
                  </el-table-column>
                  <el-table-column label="Expires At" min-width="130px" prop="expires_at" align="center" sortable>
                    <template v-slot="{ row }">
                      <b>{{ row.expires_at | datetime('ll') }}</b>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="!isBulk" label="Assign To" min-width="200px" prop="assign" align="center" sortable>
                    <template v-slot="{ row }">
                      <a
                        href="#!"
                        @click.prevent="onValue(row)"
                        class="btn btn-primary btn-sm text-white"
                        data-toggle="tooltip"
                        @mouseover="upHere = true"
                        @mouseleave="upHere = false"
                      >
                        <i class="fas fa-plus"></i> Assign
                      </a>
                      <sub class="hover_fillup" v-if="upHere">{{ row.has_assigned == 0 ? 'yet to be assigned' : '' }}</sub>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="isBulk" label="Bulk Assign" min-width="150px" prop="bulk_assign" align="center" sortable>
                    <template v-slot="{ row }">
                      <a href="#!" @click.prevent="onValueForBulkAssign(row)" class="btn btn-primary btn-sm text-white" data-toggle="tooltip">
                        <i class="fas fa-plus"></i> Bulk Assign
                      </a>
                    </template>
                  </el-table-column>
                  <el-table-column label="Trash" min-width="180px" align="center">
                    <div slot-scope="{ row }" class="table-actions">
                      <el-tooltip content="Delete" placement="top">
                        <a
                          href="#!"
                          @click.prevent="(showDeleteModal = true), (currentTargetName = row)"
                          class="table-action table-action-delete"
                          data-toggle="tooltip"
                          data-original-title="Delete product"
                        >
                          <i class="fas fa-trash"></i>
                        </a>
                      </el-tooltip>
                    </div>
                  </el-table-column>
                </el-table>
                <modal :show.sync="showDeleteModal">
                  <template>
                    <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
                  </template>
                  <template slot="footer">
                    <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
                    <base-button type="danger" @click.prevent="onDelete">Delete</base-button>
                  </template>
                </modal>
              </div>
            </el-tab-pane>
          </el-tabs>
          <base-pagination
            class="mt-3"
            v-if="targetNames.length > 0"
            v-model="pagination.currentPage"
            :perPage="pagination.entityPerPage"
            :total="pagination.totalEntity"
            align="center"
            :disabled="loading"
          ></base-pagination>
        </div>
        <template slot="footer">
          <base-button type="secondary" @click="close">Close</base-button>
          <base-button type="success" v-if="activeTab == 'targetName'" :disabled="disableSaveBtn" @click="handleSubmit(save)"> Save </base-button>
        </template>
      </modal>
      <!--      </form>-->
    </validation-observer>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator';
import Target from '@/intefaces/Target';
import { QueryBuilder } from '@/classes/QueryBuilder';
import UserAutocomplete from '@/components/lazyDropdown/UserLazydropdown.vue';
import ProductLazydropdown from '@/components/lazyDropdown/ProductLazydropdown.vue';
import RegularTargetComponent from '@/views/user/target/RegularTargetComponent.vue';
import TargetNameComponent from '@/views/user/target/TargetNameComponent.vue';
import RouteWiseTargetComponent from '@/views/user/target/RouteWiseTargetComponent.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import { TabPane, Tabs, TableColumn } from 'element-ui';
import Role from '@/intefaces/Role';

@Component({
  components: {
    UserAutocomplete,
    ProductLazydropdown,
    RegularTargetComponent,
    TargetNameComponent,
    RouteWiseTargetComponent,
    [Tabs.name]: Tabs,
    [TableColumn.name]: TableColumn,
    [TabPane.name]: TabPane
  },
  name: 'TargetAssignForm'
})
export default class TargetAssignForm extends Mixins(PaginationComponentMixin) {
  @Prop() isActive!: boolean;
  @Prop() isTargetName!: boolean;
  @Prop() isBulk!: boolean;
  @Prop() currentTraget!: Target;
  @Prop() currentLableForInvoice!: string;
  @Prop() form!: {
    type: string;
    expiresDate: string;
    amount: number;
    unit: string;
    assignTo: any;
    scheme: string;
    target_name: string;
    start_from: string;
    status: boolean;
    territory_id: number | string;
  };
  @Prop() routeColumnTitle!: string;
  private disableSaveBtn = false;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  private activeTab: string = 'targetName';
  private targetAssignId: number = 0;
  public loading: boolean = false;
  public targetNames: string[] = [];
  public upHere = false;
  private currentEntity = [];
  private showDeleteModal = false;
  private currentTargetName: any = [];

  created() {
    this.fetchEntity();
  }

  formReset() {
    this.form.target_name = '';
    this.form.start_from = '';
    this.activeTab = 'targetName';
    (this.$refs.formValidator as Vue & {
      reset: () => any;
    }).reset();
  }

  notify(title: string, message: string, type: 'success' | 'warning' | 'info' | 'error') {
    this.$notify({
      title: title,
      message: message,
      duration: 3000,
      iconClass: 'ni ni-bell-55',
      type: type
    });
  }

  @Watch('pagination.currentPage')
  fetchEntity(): void {
    this.loading = true;
    this.$http.get(this.$api(`/target-name-with-range?page=${this.pagination.currentPage}`)).then(response => {
      this.targetNames = response.data.target_names_info;
      this.setPagination(response.data);
      this.loading = false;
    });
  }
  onValue(row: any) {
    this.$emit('targetAssignId', (this.targetAssignId = row.id));
    this.$emit('TargetNameUpdate', (this.isTargetName = false));
    this.formReset();
  }
  onValueForBulkAssign(row: any) {
    this.$emit('targetAssignId', (this.targetAssignId = row.id));
    this.$emit('TargetNameUpdateForBulkAssign', (this.isTargetName = false));
    this.formReset();
  }

  save() {
    this.disableSaveBtn = true;
    this.$http
      .post(this.$api(`/target-name-with-range`), {
        target_name: this.form.target_name,
        start_from: this.form.start_from
      })
      .then(response => {
        this.notify('Success', 'Successfully Created', 'success');
        this.afterCreated(response.data.target_name);
        this.formReset();
        this.disableSaveBtn = false;
      })
      .catch(error => {
        this.disableSaveBtn = false;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }
  async afterCreated(response: any) {
    this.targetNames.unshift(response);
  }

  onDelete() {
    this.$http
      .delete(this.$api(`/target-name-with-range/${this.currentTargetName.id}`))
      .then(response => {
        this.showDeleteModal = false;
        this.targetNames.splice(
          this.targetNames.findIndex((currentId: any) => currentId.id == this.currentTargetName.id),
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
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  close() {
    this.formReset();
    // this.$emit('update:isActive', false);
    this.$emit('targetAssignId', (this.targetAssignId = 0));
    this.$emit('TargetNameUpdate', (this.isTargetName = false));
    this.activeTab = 'targetName';
    this.disableSaveBtn = false;
  }
}
</script>
<style scoped>
.invalid-feedback {
  display: none;
}
.hover_fillup {
  color: blueviolet;
}
.el-table .cell {
  overflow: hidden !important;
  outline: none;
}
</style>
