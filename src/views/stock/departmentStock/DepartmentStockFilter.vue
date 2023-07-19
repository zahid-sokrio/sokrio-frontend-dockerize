<template>
    <div class="mt-2">
        <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
            <el-row :gutter="10">
                <el-col :span="8">
                    <departmentLazydropdown
                            placeholder="Department"
                            :multiple="true"
                            v-model="filters.buyerId"
                    ></departmentLazydropdown>
                </el-col>

                <el-col :span="8">
                    <product-brand-lazydropdown
                            placeholder="Product Brand"
                            :multiple="true"
                            :add-button="false"
                            v-model="filters.brand"
                    ></product-brand-lazydropdown>
                </el-col>

                <el-col :span="8">
                    <product-category-lazydropdown
                            placeholder="Product Category"
                            :multiple="true"
                            :add-button="false"
                            v-model="filters.category"
                    ></product-category-lazydropdown>
                </el-col>
            </el-row>

            <el-row :gutter="10">
                <el-col :span="8">
                    <variant-category-lazydropdown
                            placeholder="Variant Category"
                            :multiple="true"
                            :add-button="false"
                            v-model="filters.variantId"
                    ></variant-category-lazydropdown>
                </el-col>

                <el-col :span="8">
                    <base-input placeholder="Product (e.g. Lux, Dove)" v-model="filters.product"></base-input>
                </el-col>

                <el-col :span="8">
                    <base-input placeholder="Variant (e.g. Red, 20gm)" v-model="filters.variantValue"></base-input>
                </el-col>

                <el-col :span="8">
                    <base-input placeholder="Pending Percent" v-model="filters.belowProduct"></base-input>
                </el-col>

                <el-col :span="8">
                    <base-checkbox class="mb-3" v-model="filters.promotion">
                        <span>With Promotion</span>
                    </base-checkbox>
                </el-col>

            </el-row>
        </validation-observer>
    </div>
</template>
<script lang="ts">
    import {Tooltip, Button, Row, Col, Container, Autocomplete, Dropdown, DropdownItem, Switch, Tag} from 'element-ui';
    import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
    import Collapse from "@/components/argon-core/Collapse/Collapse.vue";
    import CollapseItem from "@/components/argon-core/Collapse/CollapseItem.vue";
    import DepartmentLazydropdown from "@/components/lazyDropdown/DepartmentLazydropdown.vue";
    import ProductBrandLazydropdown from "@/components/lazyDropdown/ProductBrandLazydropdown.vue";
    import ProductCategoryLazydropdown from "@/components/lazyDropdown/ProductCategoryLazydropdown.vue";
    import VariantCategoryLazydropdown from "@/components/lazyDropdown/VariantCategoryLazydropdown.vue";
    import ProductBrandAutocomplete from "@/components/resources-autocomplete/ProductBrandAutocomplete.vue";
    @Component({
        components: {
            DepartmentLazydropdown,
            ProductBrandLazydropdown,
            ProductCategoryLazydropdown,
            VariantCategoryLazydropdown,
            ProductBrandAutocomplete,
            [Autocomplete.name]: Autocomplete,
            [Tooltip.name]: Tooltip,
            [Button.name]: Button,
            [Container.name]: Container,
            [Row.name]: Row,
            [Col.name]: Col,
            [Dropdown.name]: Dropdown,
            [DropdownItem.name]: DropdownItem,
            [Switch.name]: Switch,
            [Tag.name]: Tag,
            Collapse,
            CollapseItem
        }
    })
    export default class DepartmentStockFilter extends Vue{
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
        private departmentQuery: any = '';
        private filters: any= {
            buyerId : [],
            brand: [],
            belowProduct: '',
            category: [],
            product: '',
            variantId: [],
            variantValue: '',
            promotion: false

        };
        private afterQuery: boolean = false;

        @Watch('filters', {immediate: true, deep: true})
        onChangeFilter(newVal: any){
            this.query = ['page=1'];
            this.afterQuery = true;
            newVal.belowProduct != '' ? this.query.push(`below=${newVal.belowProduct}`) : '';
            newVal.buyerId != '' ? this.query.push(`department_id=${newVal.buyerId}`) : '';
            newVal.brand != '' ? this.query.push(`brand_id=${newVal.brand}`) : '';
            newVal.category != '' ? this.query.push(`category_id=${newVal.category}`) : '';
            newVal.product != '' ? this.query.push(`q=${newVal.product}`) : '';
            newVal.variantId != '' ? this.query.push(`variant_id=${newVal.variantId}`) : '';
            newVal.variantValue != '' ? this.query.push(`variant_value=${newVal.variantValue}`) : '';
            newVal.promotion != '' ? this.query.push(`promotion=${newVal.promotion}`) : '';
            if(this.entityCurrentPage == 1){
                this.fetchDepartmentStock();
                return;
            }
            this.$emit('update:entityCurrentPage',1);
        }

        @Watch('entityCurrentPage')
        onChangePage(val: any, oldVal: any) {
            this.query[0] = `page=${this.entityCurrentPage}`;
            this.fetchDepartmentStock();
        }

        async fetchDepartmentStock()
        {
            this.$emit('update:loading', true);
            const { data } = await this.$http.get(this.$api(`/stocks${this.query.length > 0 ? '?' + this.query.join('&') : ''}`))
            this.$emit('update',  data.stocks);
            this.$emit('update:entityPerPage', data.per_page);
            this.$emit('update:totalEntity', data.total);
            this.$emit('update:entityCurrentPage', data.current_page);
            this.$emit('update:loading', false);
        }

        close(): void {
            this.$emit('update:isFilterModelActive', false);
        }
    }
</script>
<style>
    input.form-control{
        height: calc(1.5em + 1.25rem + 2px);
    }
</style>
