<template>
  <section>
    <div class="card">
      <div class="card-header border-0">
        <div class="row">
          <div class="col-6">
            <div class="form-inline">
              <h3 class="mb-0">Payments</h3>
              <el-tooltip class="ml-3" content="Manage advance and invoice payment for your company" placement="right">
                <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
              </el-tooltip>
              <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
                <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <el-table v-loading="loading" class="table-responsive  table-flush table-striped" header-row-class-name="thead-light" :data="entities">
        <el-table-column label="Method" min-width="100px" prop="name" sortable>
          <template v-slot="{ row }">
            <b>{{ row.method.toUpperCase() }}</b>
          </template>
        </el-table-column>
        <el-table-column label="Advance" align="center" min-width="100px" prop="code" sortable>
          <template v-slot="{ row }">
            {{ row.advance ? 'Yes' : 'No' }}
          </template>
        </el-table-column>
        <el-table-column label="Created By" align="center" min-width="180px" prop="territory" sortable>
          <template v-slot="{ row }">
            {{ row.creator ? row.creator.name : '' }}
            <br/>
          </template>
        </el-table-column>
        <el-table-column label="Buyer" align="center" min-width="180px" prop="department_id">
          <template v-slot="{ row }">{{ row.department ? row.department.name : '-' }}</template>
        </el-table-column>
        <el-table-column label="Seller" align="center" min-width="180px" prop="seller_id">
          <template v-slot="{ row }">{{ row.seller ? row.seller.name : '-' }}</template>
        </el-table-column>
        <el-table-column label="Amount" align="center" min-width="180px" prop="amount">
          <template v-slot="{ row }">{{ row.amount }}</template>
        </el-table-column>
        <el-table-column label="Paid At" min-width="180px" prop="badge" align="center">
          <template v-slot="{ row }">
            <b v-if="row.paid_at">{{ row.paid_at | datetime('ll') }}</b>
            <b v-else> - </b>
          </template>
        </el-table-column>
        <el-table-column label="Created At" min-width="180px" prop="created_at" align="center" sortable>
          <template v-slot="{ row }">
            <b v-if="row.created_at">{{ row.created_at | datetime('ll') }}</b>
            <b v-else> - </b>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        class="mt-3"
        v-if="entities.length > 0"
        v-model="pagination.currentPage"
        :perPage="pagination.entityPerPage"
        :total="pagination.totalEntity"
        align="center"
        :disabled="loading"
      ></base-pagination>
      <!--        Payment Confirm Modal-->

      <modal :show.sync="showConfirmModal">
        <template>
          <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ?</h5>
        </template>
        <template slot="footer">
          <base-button type="secondary" @click="showConfirmModal = false">Close</base-button>
          <base-button type="danger" @click.prevent="deleteEntity">Confirm</base-button>
        </template>
      </modal>

      <!--        End Payment Confirm Modal     -->

      <!--        Demo Tour GIF Modal-->
      <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
    </div>
  </section>
</template>

<script lang="ts">
  //@ts-ignore
  import {Component, Mixins, Vue, Watch} from 'vue-property-decorator';
  import Payment from '@/intefaces/Payment';
  import CreatePaymentForm from '@/views/payment/CreatePaymentForm.vue';
  import PaginationComponentMixin from '@/mixins/PaginationComponent';
  import GIFModal from '@/components/tour/GIFModal.vue';

  @Component({
    components: {CreatePaymentForm, GIFModal}
  })
  export default class AdvancePaymentList extends Mixins(PaginationComponentMixin) {
    private entities: Payment[] = [];
    private showConfirmModal: boolean = false;
    private isActive: boolean = false;
    private currentEntity!: Payment;
    private form: Payment = {
      advance: false,
      amount: null,
      created_by: 0,
      department_id: null,
      invoices: [],
      method: null,
      paid_at: null
    };
    loading = false;
    private showGIF: boolean = false;
    private demoTourEntity: string = 'paymentList';
    private GIFs: Array<any> = [
      {
        label: 'Create a payment',
        url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
      },
      {
        label: 'Update a payment',
        url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
      },
      {
        label: 'Delete a payment',
        url: 'https://www.youtube.com/embed/LeAltgu_pbM'
      }
    ];
    private demoTourTitle: string = 'A quick demo of payment';

    mounted() {
      this.fetchEntity();
    }

    @Watch('pagination.currentPage')
    async fetchEntity() {
      this.loading = true;
      let {data} = await
        this.$http.get(this.$api(`/payments?advance=1&page=${this.pagination.currentPage}&with=department,seller`));
      this.entities = data.payments;
      this.setPagination(data);
      this.loading = false;
    }

    entityCreated(department: Payment) {
      this.entities.unshift(department);
    }
  }
</script>
