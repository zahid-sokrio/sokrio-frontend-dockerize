<template>
  <el-drawer
    title="Product Filter"
    :visible.sync="drawer"
    direction="rtl"
    :before-close="handleClose"
  >
    <div class="col-md-12 m-2">
      <base-input label="Name" placeholder="e.g. Coke Zero"
                  v-model="filter.product"></base-input>
    </div>
    <div class="col-md-12 m-2">
      <product-brand-lazydropdown
        label="Brand"
        placeholder="e.g. Coca-Cola"
        :multiple="true"
        :add-button="false"
        v-model="filter.brand"
      ></product-brand-lazydropdown>
    </div>
    <div class="col-md-12 m-2">
      <product-category-lazydropdown
        label="Category"
        placeholder="e.g. Soft Drinks"
        :multiple="true"
        :add-button="false"
        v-model="filter.category"
      ></product-category-lazydropdown>
    </div>
    <div class="col-md-12 text-left">
      <base-button type="primary" icon @click="closeBtn">
        <span class="btn-inner--text">Done</span>
      </base-button>
      <base-button type="primary" icon @click="resetBtn">
        <span class="btn-inner--text">Reset</span>
      </base-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import ProductBrandLazydropdown from "@/components/lazyDropdown/ProductBrandLazydropdown.vue";
import ProductCategoryLazydropdown from "@/components/lazyDropdown/ProductCategoryLazydropdown.vue";

import { Drawer } from "element-ui";

@Component({
  components: {
    [Drawer.name]: Drawer,
    ProductBrandLazydropdown,
    ProductCategoryLazydropdown,
  }
})
export default class ProductFilterDrawer extends Vue {
  @Prop({required: true})
  isFilterModelActive!: boolean;
  @Prop({required: true})
  entityPerPage!: number;
  @Prop({required: true})
  totalEntity!: number;
  @Prop({required: true, default: 1})
  entityCurrentPage!: number;
  @Prop({required: true})
  loading!: boolean;

  private drawer: boolean = false;
  private query: any = [];
  private afterQuery: boolean = false;
  private filter: any = {
    product: '',
    brand: [],
    category: []
  }

  @Watch('isFilterModelActive')
  changeDrawerValue(newVal: any) {
    if (newVal) {
      this.drawer = true
    }
  }

  @Watch('filter', {immediate: true, deep: true})
  onChangeFilter(newVal: any) {
    this.query = ['page=1'];
    this.query.push('with=products.batch,productBrand,productCategory')
    this.afterQuery = true;
    newVal.brand != '' ? this.query.push(`brand=${newVal.brand}`) : '';
    newVal.category != '' ? this.query.push(`category=${newVal.category}`) : '';
    newVal.product != '' ? this.query.push(`name=${newVal.product}`) : '';
    if (this.entityCurrentPage == 1) {
      this.fetchProduct();
      return;
    }
    this.$emit('update:entityCurrentPage', 1);
  }

  @Watch('entityCurrentPage')
  onChangePage(val: any, oldVal: any) {
    this.query[0] = `page=${this.entityCurrentPage}`;
    this.fetchProduct();
  }


  async fetchProduct() {
    this.$emit('update:loading', true);
    const {data} = await this.$http.get(this.$api(`/base-products${this.query.length > 0 ? '?' + this.query.join('&') : ''}`));
    this.$emit('update', data.products);
    this.$emit('update:entityPerPage', data.per_page);
    this.$emit('update:totalEntity', data.total);
    this.$emit('update:entityCurrentPage', data.current_page);
    this.$emit('update:loading', false);
  }

  closeBtn(): void {
    this.drawer = false
    this.$emit('update:isFilterModelActive', false);
  }

  handleClose(done: any) {
    this.$emit('update:isFilterModelActive', false);
    done();
  }

  resetBtn() {
    this.filter.brand = [];
    this.filter.category = [];
    this.filter.product = '';
  }
}
</script>
