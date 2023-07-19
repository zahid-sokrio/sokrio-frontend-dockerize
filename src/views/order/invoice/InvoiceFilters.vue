<template>
    <div class="mt-2">
<!--        <validation-observer v-slot="{ handleSubmit }" ref="formValidator">-->
        <el-drawer
                title="Invoice Filter"
                :visible.sync="drawer"
                direction="rtl"
        >
            <div class="col-md-12 m-2">
                    <base-input label="Type">
                        <el-select  filterable
                                    placeholder="Type"
                                    v-model="filters.type"
                                    clearable
                        >
                            <el-option v-for="(type,index) in types"
                                       :key="index"
                                       :label="type.title"
                                       :value="type.value"
                            >
                            </el-option>
                        </el-select>
                    </base-input>
            </div>
            <div class="col-md-12 m-2">
                    <base-input label="Status">
                        <el-select  filterable
                                    placeholder="Status"
                                    v-model="filters.status"
                                    clearable
                        >
                            <el-option v-for="(type,index) in statuses"
                                       :key="index"
                                       :label="type.title"
                                       :value="type.value"
                            >
                            </el-option>
                        </el-select>
                    </base-input>
            </div>
            <div class="col-md-12 m-2">
                    <base-input label="Delivery Status">
                        <el-select  filterable
                                    placeholder="Delivery Status"
                                    v-model="filters.delivered"
                                    clearable
                        >
                            <el-option v-for="(type,index) in deliveredTypes"
                                       :key="index"
                                       :label="type.title"
                                       :value="type.value"
                            >
                            </el-option>
                        </el-select>
                    </base-input>
            </div>

            <div class="col-md-12 m-2">
                    <department-lazydropdown
                            label="Buyer Department"
                            placeholder="Buyer Department"
                            :multiple="true"
                            v-model="filters.buyerId"
                    ></department-lazydropdown>
            </div>
            <div class="col-md-12 m-2">
                    <department-lazydropdown
                            label="Seller Department"
                            placeholder="Seller Department"
                            :multiple="true"
                            v-model="filters.sellerId"
                    ></department-lazydropdown>
            </div>
        </el-drawer>
<!--        </validation-observer>-->
    </div>
</template>
<script lang="ts">
    import {Tooltip, Button, Row, Col, Container, Autocomplete, Dropdown, DropdownItem} from 'element-ui';
    import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
    import Collapse from '@/components/argon-core/Collapse/Collapse.vue';
    import CollapseItem from '@/components/argon-core/Collapse/CollapseItem.vue';
    import MultiOptionSearchBox from '@/components/MultiOptionSearchBox.vue';
    import Department from "@/intefaces/Department";
    import statuses from "@/data/InvoiceStatus";
    import DepartmentLazydropdown from "@/components/lazyDropdown/DepartmentLazydropdown.vue";

    @Component({
        components: {
            MultiOptionSearchBox,
            DepartmentLazydropdown,
            [Autocomplete.name]: Autocomplete,
            [Tooltip.name]: Tooltip,
            [Button.name]: Button,
            [Container.name]: Container,
            [Row.name]: Row,
            [Col.name]: Col,
            [Dropdown.name]: Dropdown,
            [DropdownItem.name]: DropdownItem,
            Collapse,
            CollapseItem
        }
    })
    export default class InvoiceFilters extends Vue{
        @Prop({ required: true })
        isFilterModelActive!: boolean;
        @Prop({ required: true })
        entityPerPage!: number;
        @Prop({ required: true })
        totalEntity!: number;
        @Prop({ required: true, default: 1 })
        entityCurrentPage!: number;
        @Prop({ required: true })
        loading!: boolean;

        private query: any = [];
        private types: any = [{ title: 'Order', value: 'order' }, { title: 'Requisition', value: 'requisition' }]
        private deliveredTypes: any = [{ title: 'Delivered', value: 1 }, { title: 'Not Delivered', value: '0' }]
        private afterQuery: boolean = false;
        private filters: any = {
            type: '',
            status: '',
            delivered: '',
            buyerId: [],
            sellerId: []
        }

        @Watch('filters', {immediate: true, deep: true})
        onChangeFilter(newVal: any){
            this.query = ['page=1'];
            this.afterQuery = true;
            newVal.status != '' ? this.query.push(`status=${newVal.status}`) : '';
            newVal.type != '' ? this.query.push(`is_requisition=${newVal.type == 'order' ? 0 : 1}`) : '';
            newVal.delivered != '' ? this.query.push(`delivered=${newVal.delivered}`) : '';
            newVal.buyerId.length > 0 ? this.query.push(`buyer_id=${newVal.buyerId}`) : '';
            newVal.sellerId.length > 0 ? this.query.push(`seller_id=${newVal.sellerId}`) : '';
            if(this.entityCurrentPage == 1){
                this.fetchInvoice();
                return;
            }
            this.$emit('update:entityCurrentPage',1);
        }
        get statuses(){
            let data = [...statuses];
            return data;
        }

        @Watch('entityCurrentPage')
        onChangePage(val: any, oldVal: any) {
            this.query[0] = `page=${this.entityCurrentPage}`;
            this.fetchInvoice();
        }

        async fetchInvoice(){
            this.$emit('update:loading', true)
            const { data } = await this.$http.get(this.$api(`/invoices${this.query.length > 0 ? '?' + this.query.join('&') : ''}`));
            this.$emit('update', data.invoices);
            this.$emit('update:entityPerPage', data.per_page);
            this.$emit('update:totalEntity', data.total);
            this.$emit('update:entityCurrentPage', data.current_page);
            this.$emit('update:loading', false);
        }

        save(): void {}

        close(): void {
            this.$emit('update:isFilterModelActive', false);
        }
    }
</script>
