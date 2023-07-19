<template>
  <div>
    <modal :show="isViewRevision" v-if="isViewRevision" size="lg" @close="close">
      <template slot="header">
        <h5 class="modal-title">Revision List |
          {{ isRequisition ? getTaxonomy('requisition') : isInvoiceForRevision ? getTaxonomy('invoice') : getTaxonomy('order') }} No.:
          #{{ currentEntity.code }}</h5>
      </template>
      <div>
        <el-table
          :data="orderRevisions"
          class="table-responsive align-items-center table-flush table-striped"
          header-row-class-name="thead-light"
        >
          <el-table-column align="center" label="Sl." min-width="100px" sortable type="index">
            <!--                    <template v-slot="{ row}">-->
            <!--                        <b></b>-->
            <!--                    </template>-->
          </el-table-column>
          <el-table-column align="center" label="Amount" min-width="100px" prop="code" sortable>
            <template v-slot="{ row }">
              <b>{{ row.amount }}</b>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Discount" min-width="100px" prop="code" sortable>
            <template v-slot="{ row }">
              <b>{{ row.discount }}</b>
            </template>
          </el-table-column>
          <el-table-column v-if="!isInvoiceForRevision" align="center" label="Delivery Date" min-width="100px"
                           prop="code" sortable>
            <template v-slot="{ row }">
              <b v-if="row.expected_delivery_date">{{ row.expected_delivery_date | datetime('ll') }}</b>
              <b v-else> - </b>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Comment" min-width="100px" prop="code" sortable>
            <template v-slot="{ row }">
              <b>{{ row.comment ? row.comment : 'N/A' }}</b>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Created At" min-width="100px" prop="code" sortable>
            <template v-slot="{ row }">
              <b v-if="row.created_at">{{ row.created_at | datetime('ll') }}</b>
              <b v-else> - </b>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="100px" prop="id">
            <template v-slot="{ row }">
              <!--  Order Product List    -->
              <el-popover
                placement="bottom-end"
                trigger="click"
                width="400">
                <!--    <modal :show.sync="isRevisionDetails">-->
                <template slot="header">
                  <h5 class="modal-title">Revision Details</h5>
                </template>
                <div class="card">
                  <div class="card-header">
                    <h5 class="h3 mb-0">Requested Products</h5>
                  </div>
                  <div class="card-body">
                    <ul class="list-group list-group-flush list my--4">
                      <li v-for="product in currentValue.ordered_products" :key="product.id" class="list-group-item px-0">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <a class="avatar rounded-circle" href="#">
                              <async-image v-if="product.product.image_url" v-slot="slotProps"
                                           :url="product.product.image_url">
                                <img :src="slotProps.imageSrc"/>
                              </async-image>
                              <i v-else class="ni ni-image"></i>
                            </a>
                          </div>
                          <div class="col ml--2">
                            <h4 v-if="product.product" class="mb-0">{{ product.product.base_product.name }}
                              ({{ product.product.base_product.sku }})</h4>
                            <small>Quantity :{{ product.qty }} | Custom Discount: {{ product.custom_discount }} |
                              Price :{{ product.price + ' ' + getCurrency }}</small>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-if="currentValue.returned_products && !isInvoiceForRevision" class="card">
                  <div class="card-header">
                    <div class="form-inline">
                      <div class="col-md-6">
                        <h5 class="h3 mb-0">Sales Return</h5>
                      </div>
                      <div class="col-md-6 text-right">
                        <el-tag class="ml-2" type="danger"><span v-text="'Returned Products'"></span></el-tag>
                      </div>
                    </div>
                  </div>
                  <div class="card-body" style="background: #fcefef">
                    <ul class="list-group list-group-flush list my--4">
                      <li v-for="product in currentValue.returned_products" :key="product.id" class="list-group-item px-0"
                          style="background: #fcefef">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <a class="avatar rounded-circle" href="#">
                              <img v-if="product.image_url" :src="product.image_url" alt="Image placeholder"/>
                              <i v-else class="ni ni-image"></i>
                            </a>
                          </div>
                          <div class="col ml--2">
                            <h4  v-if="product.product && product.product.base_product" class="mb-0">{{
                                product.product.base_product.name }}</h4>
                           <h4 v-else>  <async-render
                                          :callback="(response) => { return response.data.product.base_product.name}"
                                          :url="`/products/${product.product_id}`">
                            </async-render> </h4>
                            <small>Quantity :{{ product.qty }} | Price :{{ product.price }}</small>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <base-button slot="reference" outline size="sm"
                             type="info" @click="isInvoiceForRevision ? isInvoiceDetails =  true: isRevisionDetails = true, currentValue = row">
                  Details
                </base-button>
              </el-popover>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
      </template>
    </modal>

    <invoice-details
      v-if="isInvoiceForRevision"
      :invoice-details.sync="currentValue"
      :is-active.sync="isInvoiceDetails"
      :is-revisition-details.sync="isInvoiceDetails"
    ></invoice-details>


  </div>
</template>
<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import OrderRevision from "@/intefaces/OrderRevision";
import {Table, TableColumn, Tag} from "element-ui";
import InvoiceDetails from "@/views/order/invoice/InvoiceDetails.vue";
import AsyncImage from "@/components/AsyncImage.vue";
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import AsyncRender from "@/components/AsyncRender.vue";

@Component({
  components: {
    AsyncRender,
    AsyncImage,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Tag.name]: Tag,
    InvoiceDetails
  }
})
export default class RevisionList extends Mixins(TaxonomyMixin) {
  @Prop() isViewRevision!: boolean;
  @Prop() currentEntity!: any;
  @Prop() orderRevisions!: OrderRevision;
  @Prop() isRequisition!: boolean;
  @Prop() isInvoiceForRevision!: boolean;
  private isRevisionDetails: boolean = false;
  private currentValue: any[] = [];
  private isInvoiceDetails: boolean = false;

  get getCurrency() {
    return this.$store.getters['Settings/getCurrency']
  }

  close() {
    this.$emit('update:isViewRevision', false);
    this.$emit('update:isRequisition', false);
  }

}
</script>
