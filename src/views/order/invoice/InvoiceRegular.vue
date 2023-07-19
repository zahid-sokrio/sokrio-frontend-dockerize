<template>
    <modal :show="isActive" @close="close" size="lg">
<!--        <template slot="header" class="text-center">-->
<!--            <div class="form-inline">-->
<!--                <h5 class="modal-title" id="exampleModalLabel">Invoice Details</h5>-->
<!--                <el-tag v-if="isDeliver" class="ml-3" type="success">-->
<!--                    <span>Delivered</span>-->
<!--                </el-tag>-->
<!--            </div>-->
<!--        </template>-->
        <form id="app">
        <div class="row justify-content-center">
            <h2>{{orgDetails.org.name}}</h2>
        </div>
        <hr>
        <div class="row p-4">
<!--            {{ invoiceDetails}}-->
            <div class="col-md-6">
                <div class="row mb-2">
                    <div class="col-md-6">
                        <h4 class="mb-2">Customer Code:</h4>
                    </div>
                    <span v-if="invoiceDetails.buyer"> {{invoiceDetails.buyer.code}} </span>
                </div>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <h4 class="mb-2">Outlet Name: </h4>
                    </div>
                        <span v-if="invoiceDetails.buyer"> {{invoiceDetails.buyer.name}} </span>
                </div>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <h4 class="mb-2">Address: </h4>
                    </div>
                        <span v-if="invoiceDetails.buyer"> {{invoiceDetails.buyer.address ? invoiceDetails.buyer.address : 'N/A' }}</span>
                </div>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <h4 class="mb-2">Owner Name: </h4>
                    </div>
                        <span v-if="invoiceDetails.buyer"> {{invoiceDetails.buyer.owner_name}}</span>
                </div>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <h4 class="mb-2">Contact No.: </h4>
                    </div>
                        <span v-if="invoiceDetails.buyer"> {{invoiceDetails.buyer.phone_no}} </span>
                </div>
            </div>
            <div class="divider"></div>
            <div class="col-md-5">
                <div class="row mb-2">
                    <div class="col-md-5">
                        <h4 class="mb-2">Invoice No.: </h4>
                    </div>
                    <span> {{invoiceDetails.code}} </span>
                </div>
                <div class="row mb-3">
                    <div class="col-md-5">
                        <h4 class="mb-2">Date: </h4>
                    </div>
                    <span> {{invoiceDetails.created_at | datetime('ll')}} </span>
                </div>
                <div class="row mb-2">
                    <div class="col-md-5">
                        <h4 class="mb-2">Order By: </h4>
                    </div>
                    <span v-if="invoiceDetails.buyer"> {{invoiceDetails.buyer.name}} </span>
                </div>
            </div>
        </div>
        <hr>
        <div class="col-xs-12 text-center mt-2 mb-3">
            INVOICE PRODUCTS
        </div>
        <el-table
                v-if="invoiceDetails.products"
                class="table-responsive align-items-center table-flush table-striped"
                :data="invoiceDetails.products"
        >
            <el-table-column
                    label="Sl."
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column label="Product Name" min-width="100px" prop="invoice">
                <template v-slot="{ row }">
                    <b v-if="row.product">{{ row.product.name }}</b>
                </template>
            </el-table-column>
            <el-table-column label="Qty" min-width="100px" prop="invoice">
                <template v-slot="{ row }">
                    <b>{{ row.qty }}</b>
                </template>
            </el-table-column>
            <el-table-column label="Price" min-width="100px" prop="invoice">
                <template v-slot="{ row }">
                    <b>{{ row.price }}</b>
                </template>
            </el-table-column>
            <el-table-column label="Amount" min-width="100px" prop="invoice">
                <template v-slot="{ row }">
                    <b>{{ row.qty * row.price }}</b>
                </template>
            </el-table-column>
        </el-table>
        <div class="row">
        <div class="col-md-6">
            <div class="row m-2 mt-3">
                <h5>In words: {{ amoutToWord }} </h5>
            </div>
            <hr class="header-content-hr" style="width: 200px;">
            <div class="row text-center header-content ml-2 mt-5" style="text-align: center">
                <h4>Receiver's Signature</h4>
            </div>
        </div>
        <div class="col-md-6">
        <ul class="list-group list-group-flush list my--1">
                <li class="list-group-item px-0">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <small>Sub Total</small>
                    </div>
                    <div class="col-md-6">
                        <small><b> {{amount}} </b></small>
                    </div>
                </div>
                </li>
            <li class="list-group-item px-0">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <small>Discount</small>
                    </div>
                    <div class="col-md-6">
                        <small><b>{{isRevisitionDetails ? invoiceDetails.invoice.discount : invoiceDetails.discount}}</b></small>
                    </div>
                </div>
            </li>
            <li class="list-group-item px-0">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <small>Amount Payable</small>
                    </div>
                    <div class="col-md-6">
                        <small><b>{{isRevisitionDetails ? invoiceDetails.invoice.payable : invoiceDetails.payable}}</b></small>
                    </div>
                </div>
            </li>
        </ul>
        </div>
        </div>
        </form>
        <template slot="footer">
            <div style="float: left">
                <base-button type="primary" icon size="sm" onclick="print({ printable: 'app', type: 'html'})">
                                <span class="btn-inner--icon">
                                    <i class="fas fa-print"></i>
                                </span>
                    <span class="btn-inner--text">Print</span>
                </base-button>
            </div>
            <base-button @click="close" type="secondary">Close</base-button>
        </template>
    </modal>
</template>
<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    // var converter = require('number-to-words');
    import { ToWords } from 'to-words';
    const toWords = new ToWords();
    import {
        Table,
        TableColumn,
        DropdownMenu,
        DropdownItem,
        Dropdown,
        Tooltip,
        Tag,
    } from "element-ui";
    import {Invoice} from "../../../intefaces/Invoice";
    //@ts-ignore
    import print from 'print-js';
    @Component({
        components: {
            [Tooltip.name]: Tooltip,
            [Table.name]: Table,
            [TableColumn.name]: TableColumn,
            [Dropdown.name]: Dropdown,
            [DropdownItem.name]: DropdownItem,
            [DropdownMenu.name]: DropdownMenu,
            [Tag.name]: Tag,
        }
    })

    export default class InvoiceRegular extends Vue{
        @Prop() isActive!: boolean;
        @Prop() invoiceDetails!: any;
        @Prop() isDeliver!: boolean;
        @Prop() isRevisitionDetails!: boolean;
        private orgDetails: any = '';

        get amoutToWord(){
            return 0
            // return toWords.convert(this.invoiceDetails.payable);
        }

        get amount(){
            var subTotal = 0;
            if(this.invoiceDetails.products) {
                this.invoiceDetails.products.forEach((product: any) => {
                    subTotal += product.qty * product.price;
                })
            }
            return subTotal;
        }

        close(){
            this.$emit('update:isActive', false);
            this.$emit('update:isRevisitionDetails', false);
        }

        created(){
            var org: any = localStorage.getItem('user');
            this.orgDetails = JSON.parse(org);
        }
    }
</script>
<style>
    .divider {
        width: 1px;
        margin: 6px 0;
        background: #e5e5e5;
    }
    .header-content {
        position: absolute;
        bottom: 0;
    }
    .header-content-hr{
        position: absolute;
        bottom: 10px;
        left: 10px;
    }
</style>
