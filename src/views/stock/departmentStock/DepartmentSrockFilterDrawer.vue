<template>
  <el-drawer :before-close="handleClose" :title="getTaxonomy('department') + ' Stock Filter'" :visible.sync="drawer" direction="rtl">
    <div class="col-md-12 m-2">
      <departmentLazydropdown label="Department" v-model="filters.buyerId" :multiple="true" placeholder="e.g. ABC Store"></departmentLazydropdown>
    </div>
    <div class="col-md-12 m-2">
      <product-brand-lazydropdown
        v-model="filters.brand"
        :add-button="false"
        :multiple="true"
        label="Product Brand"
        placeholder="e.g. Coca-Cola"
      ></product-brand-lazydropdown>
    </div>
    <div class="col-md-12 m-2">
      <product-category-lazydropdown
        v-model="filters.category"
        :add-button="false"
        :multiple="true"
        label="Product Category"
        placeholder="e.g. Soft Drinks"
      ></product-category-lazydropdown>
    </div>
    <div class="col-md-12 m-2">
      <variant-category-lazydropdown
        v-model="filters.variantId"
        :add-button="false"
        label="Variant Category"
        placeholder="e.g. Color"
      ></variant-category-lazydropdown>
    </div>
    <div class="col-md-12 m-2">
      <base-input label="Variant" v-model="filters.variantValue" placeholder="e.g Red"></base-input>
    </div>
    <div class="col-md-12 m-2">
      <label for="Product">Product</label>
      <el-select v-model="filters.product" filterable allow-create default-first-option placeholder="e.g. Coke Zero">
        <el-option v-for="item in base_products" :key="item.id" :label="item.name" :value="item.name"> </el-option>
      </el-select>
    </div>
    <div class="col-md-12 m-2">
      <batch-lazydropdown v-model="filters.batchId" :add-button="false" label="Product Batch" placeholder="e.g CokeZero-001"></batch-lazydropdown>
    </div>
    <div class="col-md-12 m-2">
      <base-input type="number" min="0" label="Pending Percent (%)" v-model="filters.belowProduct" placeholder="e.g. 10"></base-input>
      <el-popover
        class="ml-3"
        content="Filter those products according to your inputted percentage, that are lower in quantity compared to products requested via order"
        placement="bottom-end"
        width="480"
        trigger="hover"
      >
        <i class="fas fa-info-circle" slot="reference" style="color: rgba(57,102,147,0.6); font-size: 18px"></i>
      </el-popover>
    </div>
    <div class="col-md-12 m-2 pt-2">
      <base-checkbox v-model="filters.promotion" class="mb-3">
        <span>With Promotion</span>
      </base-checkbox>
    </div>
    <div class="col-md-12 text-left">
      <base-button icon type="primary" @click="closeBtn">
        <span class="btn-inner--text">Done</span>
      </base-button>
      <base-button icon type="primary" @click="resetBtn">
        <span class="btn-inner--text">Reset</span>
      </base-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import DepartmentLazydropdown from '@/components/lazyDropdown/DepartmentLazydropdown.vue';
import ProductBrandLazydropdown from '@/components/lazyDropdown/ProductBrandLazydropdown.vue';
import ProductCategoryLazydropdown from '@/components/lazyDropdown/ProductCategoryLazydropdown.vue';
import VariantCategoryLazydropdown from '@/components/lazyDropdown/VariantCategoryLazydropdown.vue';
import { Drawer } from 'element-ui';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import BatchLazydropdown from '@/components/lazyDropdown/BatchLazydropdown.vue';
import BaseProductLazydropdown from '@/components/lazyDropdown/BaseProductLazyDropdown.vue';

@Component({
  components: {
    [Drawer.name]: Drawer,
    DepartmentLazydropdown,
    ProductBrandLazydropdown,
    ProductCategoryLazydropdown,
    VariantCategoryLazydropdown,
    BatchLazydropdown,
    BaseProductLazydropdown
  }
})
export default class DepartmentStockFilterDrawer extends Mixins(TaxonomyMixin) {
  @Prop({ required: true })
  isFilterModelActive!: boolean;
  @Prop({ required: true })
  entityPerPage!: number;
  @Prop({ required: true })
  totalEntity!: number;
  @Prop({ required: true, default: 1 })
  entityCurrentPage!: number;

  private drawer: boolean = false;
  private query: any = [];
  private departmentQuery: any = '';
  private afterQuery: boolean = false;
  public base_products: any = [];
  private filters: any = {
    buyerId: [],
    brand: [],
    belowProduct: '',
    category: [],
    product: '',
    variantId: [],
    variantValue: '',
    promotion: false,
    batchId: ''
  };

  @Watch('isFilterModelActive')
  changeDrawerValue(newVal: any) {
    if (newVal) {
      this.drawer = true;
    }
  }

  @Watch('filters', { immediate: true, deep: true })
  onChangeFilter(newVal: any) {
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
    newVal.batchId != '' ? this.query.push(`batch_id=${newVal.batchId}`) : '';
    if (this.entityCurrentPage == 1) {
      this.fetchDepartmentStock();
      return;
    }
    this.$emit('update:entityCurrentPage', 1);
  }

  @Watch('entityCurrentPage')
  onChangePage(val: any, oldVal: any) {
    this.query[0] = `page=${this.entityCurrentPage}`;
    this.fetchDepartmentStock();
  }

  async fetchDepartmentStock() {
    this.$emit('update:loading', true);
    const { data } = await this.$http.get(this.$api(`/stocks${this.query.length > 0 ? '?' + this.query.join('&') : ''}`));
    this.$emit('update', data.stocks);
    this.$emit('update:entityPerPage', data.per_page);
    this.$emit('update:totalEntity', data.total);
    this.$emit('update:entityCurrentPage', data.current_page);
    this.$emit('update:loading', false);
  }

  async mounted() {
    this.$http.get(await this.$api(`/base-product-lists`)).then(response => {
      this.base_products = response.data.baseproducts;
    });
  }

  closeBtn(): void {
    this.drawer = false;
    this.$emit('update:isFilterModelActive', false);
  }

  filterReset() {
    this.filters.buyerId = [];
    this.filters.brand = [];
    this.filters.belowProduct = '';
    this.filters.category = [];
    this.filters.product = '';
    this.filters.manager = [];
    this.filters.variantId = [];
    this.filters.variantValue = '';
    this.filters.promotion = false;
    this.filters.batchId = '';
  }

  handleClose(done: any) {
    done();
    this.$emit('update:isFilterModelActive', false);
    this.filterReset();
  }

  resetBtn() {
    this.filterReset();
  }
}
</script>
