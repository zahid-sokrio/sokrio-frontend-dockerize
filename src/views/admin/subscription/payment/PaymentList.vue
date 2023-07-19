<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <h3 class="mb-0">Payments</h3>
        </div>
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="payments"
    >
      <el-table-column label="Invoice No." min-width="140px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.invoice.code }}</b>
        </template>
      </el-table-column>
      <el-table-column label="ORG" min-width="120px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{row.org ? row.org.name : 'Anonymous'}}</b>
        </template>
      </el-table-column>

      <el-table-column label="Payment Method" min-width="160px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{row.medium.charAt(0).toUpperCase() + row.medium.slice(1)}}</b>
        </template>
      </el-table-column>
      <el-table-column label="Transaction Id" min-width="150px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{row.txn_no}}</b>
        </template>
      </el-table-column>
      <el-table-column label="Amount" min-width="120px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{row.invoice.amount}}</b>
        </template>
      </el-table-column>
      <el-table-column label="Paid At" min-width="150px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{row.invoice.paid_at | datetime('ll')}}</b>
        </template>
      </el-table-column>
      <el-table-column label="Status" min-width="150px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <el-tooltip :content="row.rejection_reason" placement="top">
            <a href>
              <b style="color: #fb6340" v-if="row.rejected_at !== null">Rejected</b>
            </a>
          </el-tooltip>
          <b style="color: green" v-if="row.approved_at !== null">Approved</b>
          <b
            style="color: #11cdef"
            v-if="row && (!row.rejected_at && !row.approved_at )"
          >Payment Requested</b>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="payments.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag } from 'element-ui';
import PaginationComponentMixin from '@/mixins/PaginationComponent';

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
  },
})
export default class PaymentList extends Mixins(PaginationComponentMixin) {
  private payments: any[] = [];

  created() {
    this.fetchEntity();
  }

  @Watch('pagination.currentPage')
  fetchEntity(): void {
    this.loading = true;
    this.$http.get(this.$landLordApi(`/org-payments?page=${this.pagination.currentPage}`)).then((response) => {
      this.payments = response.data.orgPayments;
      this.setPagination(response.data);
      this.loading = false;
    });
  }
}
</script>
