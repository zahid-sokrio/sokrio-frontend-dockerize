<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0"> {{getTaxonomy('salesReturn') }}</h3>
            <el-tooltip class="ml-3" :content="'Monitor your '+getTaxonomy('salesReturn')" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="salesReturn"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="card">
            <div class="card-header border-0 p-5">
              <el-table :data="props.row.returned_products" class="table-responsive align-items-center table-flush table-striped">
                <el-table-column label="Product" min-width="100px" prop="product" sortable>
                  <template v-slot="{ row }">
                    <b>{{ row.product.base_product ? row.product.base_product.name : '' }}</b>
                  </template>
                </el-table-column>
                <el-table-column label="Qty" min-width="100px" prop="product" sortable>
                  <template v-slot="{ row }">
                    <b>{{ row.qty }}</b>
                  </template>
                </el-table-column>
                <el-table-column label="Price" min-width="100px" prop="product" sortable>
                  <template v-slot="{ row }">
                    <b>{{ row.price }}</b>
                  </template>
                </el-table-column>
                <el-table-column label="Amount" min-width="100px" prop="product" sortable>
                  <template v-slot="{ row }">
                    <b>{{ row.amount }}</b>
                  </template>
                </el-table-column>
                <el-table-column label="Paid" min-width="100px" prop="product" sortable>
                  <template v-slot="{ row }">
                    <b>{{ row.paid }}</b>
                  </template>
                </el-table-column>
                <el-table-column label="Reason" min-width="100px" prop="product" sortable>
                  <template v-slot="{ row }">
                    <b>{{ row.reason }}</b>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="View" min-width="100px" sortable>
        <template v-slot="{ row }">
          <a @click.prevent="onView(row)" style="color: cornflowerblue" href="#!">View {{ row.is_requisition == 1 ? getTaxonomy('order') : getTaxonomy('requisition') }}</a>
        </template>
      </el-table-column>
      <el-table-column label="Return By" min-width="110px" prop="creator" sortable>
        <template v-slot="{ row }">
          <b>{{ row.creator ? row.creator.name : '' }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Outlet" min-width="110px" prop="outlet" sortable>
        <template v-slot="{ row }">
          <b>{{ row.buyer ? row.buyer.name : '-' }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Created At" min-width="110px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b v-if="row.created_at">{{ row.created_at | datetime('ll') }}</b>
          <b v-else> - </b>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      v-if="pagination.total > pagination.perPage"
      class="mt-2"
      align="center"
      :total="pagination.total"
      :perPage="pagination.perPage"
      @input="fetchSalesReturn"
      v-model="pagination.currentPage"
      :disabled="loading"
    ></base-pagination>
    <order-details :show-order.sync="showOrder" :current-order-details="currentOrderDetails"></order-details>
    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Component, Mixins, Prop, Vue} from 'vue-property-decorator';
import OrderDetails from '@/components/order/OrderDetails.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import {Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip} from 'element-ui';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";

@Component({
  components: {
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    OrderDetails
  }
})
export default class SalesReturnList extends Mixins(TaxonomyMixin) {
  private salesReturn: any = [];
  private showOrder: boolean = false;
  private currentOrderDetails: any = [];
  private events: any = [];
  private loading = false;
  private pagination = {
    currentPage: 1,
    total: 0,
    perPage: 0
  };
  private showGIF: boolean = false;
  private demoTourEntity: string = 'salesReturn';
  private GIFs: Array<any> = [
    {
      label: 'Create a sales return',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a sales return',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a sales return',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of sales return';

  onView(row: any) {
    this.$http.get(this.$api(`/orders/${row.order.id}`)).then(response => {
      this.currentOrderDetails = response.data.order;
    });
    this.events = [
      {
        label: 'Outlet',
        icon: 'ni ni-bell-55',
        type: 'success'
      },
      {
        label: 'Expected Delivery Date',
        name: this.currentOrderDetails.expected_delivery_date,
        icon: 'ni ni-html5',
        type: 'danger'
      },
      {
        label: 'Created At',
        name: this.currentOrderDetails.created_at,
        icon: 'ni ni-like-2',
        type: 'info'
      }
    ];
    this.showOrder = true;
  }

  fetchSalesReturn() {
    this.loading = true;
    let isFirstPage = this.pagination.currentPage < 2;
    let url = isFirstPage ? '/sales-returns' : `/sales-returns?page=${this.pagination.currentPage}`;

    this.$http.get(this.$api(url)).then(response => {
      this.salesReturn = response.data.salesReturns;
      this.pagination.total = response.data.total;
      this.pagination.perPage = response.data.per_page;
      this.loading = false;
    });
  }

  created() {
    this.fetchSalesReturn();
  }
}
</script>
