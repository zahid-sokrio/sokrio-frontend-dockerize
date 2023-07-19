<template>
  <modal v-if="isActiveRevision" :show="isActiveRevision" @close="close" class="modal-dialog-scrollable" size="sm">
    <template slot="header">
      <h5 class="modal-title">Revision List</h5>
    </template>
    <div>
      <div class="text-center mt-3" v-if="revisionList.length <= 0">
        <span>No Revision Found.</span>
      </div>
      <el-timeline v-else>

        <el-timeline-item :timestamp="revision.created_at | datetime('lll')"
                          :color="index==0 ? '#8ce5b5' : '#a9b4c1'"
                          placement="top"
                          v-for="(revision, index) in revisionList" :key="revision.id">

          <h5 class=" mt-3 mb-0 font-weight-bold">Revised By: {{ revision.creator ? revision.creator.name : '-' }}</h5>
          <p class=" text-sm mt-1 mb-0 font-weight-bold">Amount: {{ revision.amount }} | Discount:
            {{ revision.discount }}</p>
          <div class="mt-3">
            <el-popover
              placement="bottom"
              trigger="hover"
              width="400">
              <!--    <modal :show.sync="isRevisionDetails">-->
              <template slot="header">
                <h5 class="modal-title">Details</h5>
              </template>
              <div class="card">
                <div class="card-header">
                  <h5 class="h3 mb-0">Requested Products</h5>
                </div>
                <div class="card-body">
                  <ul class="list-group list-group-flush list my--4">
                    <li v-for="orderedProduct in revision.ordered_products" :key="orderedProduct.id"
                        class="list-group-item px-0">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <a class="avatar rounded-circle" href="#">
                            <async-image v-if="orderedProduct.product.image_url" v-slot="slotProps"
                                         :url="orderedProduct.product.image_url">
                              <img :src="slotProps.imageSrc"/>
                            </async-image>
                            <i v-else class="ni ni-image"></i>
                          </a>
                        </div>
                        <div class="col ml--2">
                          <h4 v-if="orderedProduct.product" class="mb-0">
                            {{
                              orderedProduct.product.hasOwnProperty("full_name") ? orderedProduct.product.full_name
                                : orderedProduct.product.base_product.name
                            }}
                          </h4>
                          <small>Quantity :{{ orderedProduct.qty }} | Price :{{
                              orderedProduct.price + ' ' + getCurrency
                            }} | </small>
                          <small v-if="orderedProduct.product.hasOwnProperty('custom_discount')">
                            Custom Discount: {{ orderedProduct.product.custom_discount }}
                          </small> <small v-else> Custom Discount: 0 </small>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-if="revision.returned_products != null" class="card">
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
                    <li v-for="returnedProduct in revision.returned_products" :key="returnedProduct.id"
                        class="list-group-item px-0"
                        style="background: #fcefef">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <a class="avatar rounded-circle" href="#">
                            <async-image v-if="returnedProduct.product.image_url" v-slot="slotProps"
                                         :url="returnedProduct.product.image_url">
                              <img :src="slotProps.imageSrc"/>
                            </async-image>
                            <i v-else class="ni ni-image"></i>
                          </a>
                        </div>
                        <div class="col ml--2">
                          <h4 class="mb-0"></h4>
                          <small>Quantity :{{ returnedProduct.qty }} | Price :{{ returnedProduct.price }}</small>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <base-button rounded slot="reference" outline size="sm"
                           type="info">
                Details
              </base-button>
            </el-popover>
          </div>

        </el-timeline-item>
      </el-timeline>
    </div>
  </modal>
</template>
<script lang="ts">
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator';
import OrderRevision from "@/intefaces/OrderRevision";
import AsyncImage from "@/components/AsyncImage.vue";
import PaginationComponentMixin from "@/mixins/PaginationComponent";
import { Timeline, TimelineItem } from "element-ui";

@Component({
  components: {
    AsyncImage,
    [Timeline.name]: Timeline,
    [TimelineItem.name]: TimelineItem,
  }
})

export default class RevisionList extends Mixins(PaginationComponentMixin) {
  @Prop() isActiveRevision!: boolean;
  @Prop() entityId!: number;
  @Prop() revisionList!: OrderRevision[];

  get getCurrency() {
    return this.$store.getters['Settings/getCurrency']
  }

  close(): void {
    this.$emit('update:isActiveRevision', false);
  }
}
</script>
