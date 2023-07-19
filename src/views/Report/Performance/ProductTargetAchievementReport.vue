<template>
  <div class="row pl-3" v-can="permissionEnum.TARGET_VS_ACHIEVEMENT_REPORT">
    <div class="col-12">
      <div class="card">
        <el-table
          v-loading="loading"
          :data="filterTargetList"
          class="table-responsive align-items-center table-flush table-striped"
          header-row-class-name="thead-light"
        >
          <el-table-column label="Target Name" min-width="200px" prop="type" align="center" sortable>
            <template v-slot="{ row }">
              <b>{{ row.target_name }}</b>
            </template>
          </el-table-column>
          <el-table-column label="Start From" min-width="50px" prop="scheme" sortable>
            <template v-slot="{ row }">
              {{ row.start_from | datetime('ll') }}
            </template>
          </el-table-column>
          <el-table-column label="Expires At" min-width="50px" prop="scheme" sortable>
            <template v-slot="{ row }">
              {{ row.expires_at | datetime('ll') }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="Total Assigned" min-width="50px" prop="amount" align="center" sortable>
            <template v-slot="{ row }">
              <b>{{ row.target_asigned_count }}</b>
            </template>
          </el-table-column> -->

          <el-table-column label="Action" min-width="50px" prop="active" align="center" sortable>
            <template v-slot="{ row }">
              <a href="#!" @click.prevent="onValue(row)" class="btn btn-primary btn-sm text-white" data-toggle="tooltip">
                <i class="fa fa-download"></i> Download
              </a>
            </template>
          </el-table-column>
        </el-table>
        <base-pagination
          class="mt-3"
          v-if="targetList.length > 0"
          v-model="pagination.currentPage"
          :perPage="pagination.entityPerPage"
          :total="pagination.totalEntity"
          align="center"
          :disabled="loading"
        ></base-pagination>
      </div>
    </div>
    <modal :show="showDownloadModal" @close="showDownloadModal = false">
      <template slot="header">
        <h5 class="modal-title">Download Product Target Achievement Report</h5>
      </template>
      <div class="card">
        <div class="card-body">
          <base-input label="Recipient (Optional)" v-model="recipient" :placeholder="$user ? $user.email : ''"></base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="showDownloadModal = false" type="secondary">Close</base-button>
        <base-button :loading="loading" type="primary" @click.prevent="downloadPerformanceBoard">
          <i class="fa fa-envelope"></i>
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator';
import { QueryBuilder } from '@/classes/QueryBuilder';
import moment from 'moment';
import DepartmentLazydropdown from '@/components/lazyDropdown/DepartmentLazydropdown.vue';
import printJS from 'print-js';
import DateRange from '@/components/DateRange.vue';
import { Permission as PermissionEnum } from '@/enums/Permission';
import { Tag } from 'element-ui';
import TerritoryTypeAutocomplete from '@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import 'flatpickr/dist/flatpickr.css';
import swal from 'sweetalert2';

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    UserLazydropdown,
    TerritoryTypeAutocomplete,
    DepartmentLazydropdown,
    flatPicker,
    DateRange,
    [Tag.name]: Tag
  }
})
export default class PerformanceBoardReport extends Mixins(PaginationComponentMixin) {
  public downloading: boolean = false;
  public loading: boolean = false;
  public printing: boolean = false;
  public created_by: number | null = null;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public theManagers: any = [];
  public targetList: any = [];
  public showDownloadModal: boolean = false;
  public recipient: string = '';
  public targetNameId: string = '';
  public startFrom: string = '';
  public filterTargetList: any = [];
  public rangeSelectConfig = {
    allowInput: true,
    disable: [
      function(range: Date) {
        return moment().diff(range) < 0;
      }
    ]
  };

  @Watch('queryBuilder.watch')
  @Watch('pagination.currentPage')
  async fetchTarget() {
    this.loading = true;
    await this.$http.get(this.$api(`/target-name-list?page=${this.pagination.currentPage}`)).then(response => {
      this.targetList = response.data.TargetNameList;
      this.targetList.map((singleTargetList: any) => {
        if (singleTargetList.target_asigned_count > 0) {
          this.filterTargetList.push(singleTargetList);
        }
      });
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  created() {
    this.fetchTarget();
  }

  public filters: any = {
    range: '',
    territory_type: null,
    user_id: null
  };
  onValue(row: any) {
    this.targetNameId = row.id;
    this.startFrom = row.start_from;
    this.showDownloadModal = true;
  }

  async downloadPerformanceBoard(status: string) {
    this.loading = true;
    try {
      let { data, headers } = await this.$http.get(
        this.$api(
          '/product-target-achievement-report?' +
            'target_name_id=' +
            this.targetNameId +
            '&' +
            'start_from=' +
            this.startFrom +
            '&' +
            'recipient=' +
            this.recipient
        )
      );
      await swal.fire('Thanks For Entering Your Mail', 'You will receive the report within a few minutes.', 'success');
    } catch (e) {
      this.$notify({ title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.' });
    } finally {
      this.loading = false;
      this.showDownloadModal = false;
      this.targetNameId = '';
      this.recipient = '';
      this.startFrom = '';
    }
  }
  get permissionEnum() {
    return PermissionEnum;
  }
}
</script>

<style lang="css">
.el-select {
  position: relative;
  display: unset !important;
}
</style>
