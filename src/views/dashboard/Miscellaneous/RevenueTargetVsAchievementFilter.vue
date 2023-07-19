<template>
    <modal :show="isActive" @close="close">
        <template slot="header">
            <h5 class="modal-title" id="exampleModalLabel">Filter</h5>
        </template>
        <div class="row">
            <div class="col-md-6">
                <base-input>
                    <el-select  filterable
                                placeholder="Type"
                                v-model="filters.type"
                                clearable
                    >
                        <el-option v-for="(type,index) in types"
                                   :key="index"
                                   :label="type.label"
                                   :value="type.value"
                        >
                        </el-option>
                    </el-select>
                </base-input>
            </div>
            <div class="col-md-6">
                <territory-lazydropdown
                        class="ml-1"
                        placeholder="Territory"
                        v-model="filters.territories"
                        :end-point="'territories'"
                        :add-button="false"
                        :multiple="true"
                ></territory-lazydropdown>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <user-lazydropdown
                        class="ml-1"
                        placeholder="Field Force"
                        v-model="filters.fieldForces"
                        :end-point="'users?can=checkIn'"
                        :add-button="false"
                        :multiple="true"
                ></user-lazydropdown>
            </div>
            <div class="col-md-6">
                <product-lazydropdown
                        class="ml-1"
                        item-text="base_product.name"
                        item-sub-text="batch.name"
                        item-value="id"
                        placeholder="Select Product"
                        :end-point="'products'"
                        v-model="filters.products"
                        :add-button="false"
                        :multiple="true"
                ></product-lazydropdown>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <base-input prepend-icon="fas fa-calendar" class="ml-1">
                    <flat-picker
                            slot-scope="{ focus, blur }"
                            @on-open="focus"
                            @on-close="blur"
                            :config="{ allowInput: true, mode: 'range' }"
                            class="form-control datepicker"
                            v-model="filters.range"
                    >
                    </flat-picker>
                </base-input>
            </div>
        </div>
        <template slot="footer">
            <base-button @click="close" type="primary">Done</base-button>
            <base-button @click="close" type="secondary">Close</base-button>
        </template>
    </modal>
</template>
<script lang="ts">
    import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
    import {Drawer} from "element-ui";
    import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown.vue";
    import ProductLazydropdown from "@/components/lazyDropdown/ProductLazydropdown.vue";
    import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
    // @ts-ignore
    const flatPicker =require("vue-flatpickr-component");
    import "flatpickr/dist/flatpickr.css";
    @Component({
        components: {
            TerritoryLazydropdown,
            ProductLazydropdown,
            UserLazydropdown,
            flatPicker
        }
    })
    export default class RevenueTargetVsAchievementFilter extends Vue{
        @Prop()
        isActive!: boolean;
        @Prop({
            default: () => ({
                type: 'all',
                territories: [],
                fieldForces: [],
                products: [],
                range: 'string'
            })
        })
        filters!: {
            type: string
            territories: any,
            fieldForces: any,
            products: any,
            range: string
        }

        private data: any = [];
        private types: any = [
            {label: 'All', value: 'all'},
            {label: 'Territory', value: 'territory'},
            {label: 'Field Force', value: 'field_force'},
            {label: 'Product', value: 'product'},
        ]
        private query: any = [];
        private afterQuery: boolean = false;
        private selectedType: any = 'All';

        @Watch('filters', {immediate: true, deep: true})
        onChangeFilter(newVal: any){
            this.$emit('updateFilter', this.filters)
        }

        close(){
            this.$emit('update:isActive', false);
        }
    }
</script>
