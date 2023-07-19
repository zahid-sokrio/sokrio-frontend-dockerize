<template>
    <modal :show="showOrder" @close="close" size="lg">
        <template slot="header">
            <h5 class="modal-title" id="exampleModalLabel">{{this.currentOrderDetails.is_requisition == 1 ? 'Requisition' : 'Order'}} Details
                | {{this.currentOrderDetails.is_requisition == 1 ? 'Requisition' : 'Order'}} No. #{{this.currentOrderDetails.code}}</h5>
        </template>
        <div class="row">
            <div class="col-md-6">
                <div class="timeline timeline-one-side" data-timeline-content="axis" data-timeline-axis-style="dashed">
                    <div class="timeline-block">
          <span class="timeline-step badge-success">
            <i class="ni ni-building"></i>
          </span>
                        <div class="timeline-content">
                            <div class="d-flex justify-content-between pt-1">
                                <div>
                                    <span class="text-muted text-sm font-weight-bold">Outlet</span>
                                </div>
                            </div>
                            <h6 v-if="currentOrderDetails.buyer" class="text-sm mt-1 mb-0">{{this.currentOrderDetails.buyer.name}}</h6>
                        </div>
                    </div>
                    <div class="timeline-block">
          <span class="timeline-step badge-info">
            <i class="ni ni-delivery-fast"></i>
          </span>
                        <div class="timeline-content">
                            <div class="d-flex justify-content-between pt-1">
                                <div>
                                    <span class="text-muted text-sm font-weight-bold">Expected Delivery Date</span>
                                </div>
                            </div>
                            <h6 class="text-sm mt-1 mb-0">{{this.currentOrderDetails.expected_delivery_date | datetime('ll')}}</h6>
                        </div>
                    </div>
                    <div class="timeline-block">
          <span class="timeline-step badge-success">
            <i class="ni ni-calendar-grid-58"></i>
          </span>
                        <div class="timeline-content">
                            <div class="d-flex justify-content-between pt-1">
                                <div>
                                    <span class="text-muted text-sm font-weight-bold">Created At</span>
                                </div>
                            </div>
                            <h6 class="text-sm mt-1 mb-0">{{this.currentOrderDetails.created_at | datetime('ll')}}</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="timeline timeline-one-side" data-timeline-content="axis" data-timeline-axis-style="dashed">
                    <div class="timeline-block">
          <span class="timeline-step badge-success">
            <i class="ni ni-money-coins"></i>
          </span>
                        <div class="timeline-content">
                            <div class="d-flex justify-content-between pt-1">
                                <div>
                                    <span class="text-muted text-sm font-weight-bold">Amount</span>
                                </div>
                            </div>
                            <h6 class="text-sm mt-1 mb-0">{{this.currentOrderDetails.amount}} tk</h6>
                        </div>
                    </div>
                    <div class="timeline-block">
          <span class="timeline-step badge-info">
            <i class="fas fa-percentage"></i>
          </span>
                        <div class="timeline-content">
                            <div class="d-flex justify-content-between pt-1">
                                <div>
                                    <span class="text-muted text-sm font-weight-bold">Discount</span>
                                </div>
                            </div>
                            <h6 class="text-sm mt-1 mb-0">{{this.currentOrderDetails.discount}} tk</h6>
                        </div>
                    </div>
                    <div class="timeline-block">
          <span class="timeline-step badge-success">
            <i class="ni ni-notification-70"></i>
          </span>
                        <div class="timeline-content">
                            <div class="d-flex justify-content-between pt-1">
                                <div>
                                    <span class="text-muted text-sm font-weight-bold">Promotional Discount</span>
                                </div>
                            </div>
                            <h6 class="text-sm mt-1 mb-0">{{this.currentOrderDetails.promotion_discount}} tk</h6>
                        </div>
                    </div>
            </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-12">
                <h4 class="heading-margin text-align">Products</h4><br>
            </div>
        </div>
        <div class="row">
            <el-table
                    :data="currentOrderDetails.products"
                    class="table-responsive align-items-center table-flush table-striped"

            >
                <el-table-column label="Name" min-width="100px" sortable>
                    <template v-slot="{row}">
                        <b>{{row.product.base_product.name}}</b>
                    </template>
                </el-table-column>
                <el-table-column label="Qty" min-width="100px" sortable>
                    <template v-slot="{row}">
                        <b>{{row.qty}}</b>
                    </template>
                </el-table-column>
                <el-table-column label="Price" min-width="100px" sortable>
                    <template v-slot="{row}">
                        <b>{{row.price}}</b>
                    </template>
                </el-table-column>
                <el-table-column label="Total" min-width="100px" sortable>
                    <template v-slot="{row}">
                        <b>{{row.qty * row.price}}</b>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <template slot="footer">
            <base-button type="secondary" @click="close">Close</base-button>
        </template>
    </modal>
</template>
<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    import {
        Table,
        TableColumn,
        DropdownMenu,
        DropdownItem,
        Dropdown,
        Tooltip,
    } from "element-ui";
    @Component({
        name: 'OrderDetails',
        components: {
            [Tooltip.name]: Tooltip,
            [Table.name]: Table,
            [TableColumn.name]: TableColumn,
            [Dropdown.name]: Dropdown,
            [DropdownItem.name]: DropdownItem,
            [DropdownMenu.name]: DropdownMenu,
        }
    })
    export default class OrderDetails extends Vue{
        @Prop() showOrder!: boolean;
        @Prop() currentOrderDetails!: any;

        close(){
            this.$emit('update:showOrder', false);
        }
    }
</script>
<style>
   .heading-margin{
       display: flex;
       align-items: center;
       font-weight: bold;
       font-family: sans-serif;
       margin: 1em 0;
   }
   .heading-margin:after {
        content: '';
        border-bottom: 1px solid gray;
        height: 1px;
        margin-left: 0.75em;
        flex-grow: 1;
    }

   .heading-margin:before {
        content: '';
        border-bottom: 1px solid gray;
        height: 1px;
        margin-right: 0.75em;
        flex-grow: 1;
    }
</style>
