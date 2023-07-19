<template>
  <el-drawer :show-close="false" :visible="isFilterModelActive" direction="rtl">
    <template slot="title">
      {{ title }}
    </template>
    <div class="p-4">
      <base-input label="Type">
        <el-select v-model="invoiceType" placeholder="e.g. Order" clearable>
          <el-option
            v-for="(type, index) in [
              { title: getTaxonomy('order'), value: 'order' },
              { title: getTaxonomy('requisition'), value: 'requisition' }
            ]"
            :key="index"
            :label="type.title"
            :value="type.value"
          ></el-option>
        </el-select>
      </base-input>

      <base-input label="Status">
        <el-select v-model="invoiceStatus" placeholder="e.g. Paid" clearable filterable>
          <el-option v-for="(type, index) in invoiceStatuses" :key="index" :label="type.title"
                     :value="type.value"></el-option>
        </el-select>
      </base-input>

      <base-input label="Delivery Status">
        <el-select v-model="deliveryStatus" clearable filterable placeholder="e.g. Delivered">
          <el-option
            v-for="(type, index) in [
              { title: 'Delivered', value: 'delivered' },
              { title: 'Not Delivered', value: 'not-delivered' }
            ]"
            :key="index"
            :label="type.title"
            :value="type.value"
          ></el-option>
        </el-select>
      </base-input>

      <user-lazydropdown label="Creator" v-model="createdBy" :multiple="true"
                         placeholder="e.g. John Doe"></user-lazydropdown>

      <department-lazydropdown :label="'Buyer '+getTaxonomy('department')" v-model="buyerDepartmentId" :multiple="true"
                               placeholder="e.g. ABC Store"></department-lazydropdown>

      <department-lazydropdown :label="'Seller '+getTaxonomy('department')" v-model="sellerDepartmentId"
                               :multiple="true"
                               placeholder="e.g. Ma Enterprise"></department-lazydropdown>

      <date-range v-model="dateRange" label-prop="Date Range"></date-range>
      <base-button icon type="secondary" @click="close">
        <span class="btn-inner--text">Close</span>
      </base-button>
      <base-button icon type="primary" @click="resetBtn">
        <span class="btn-inner--text">Reset</span>
      </base-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { Col, Drawer, Row } from 'element-ui';
import MultiOptionSearchBox from '@/components/MultiOptionSearchBox.vue';
import DateRange from '@/components/DateRange.vue';
import InvoiceStatuses from '@/data/InvoiceStatus';
import DepartmentLazydropdown from '@/components/lazyDropdown/DepartmentLazydropdown.vue';
import { QueryBuilder } from '@/classes/QueryBuilder';
import UserLazydropdown from '@/components/lazyDropdown/UserLazydropdown.vue';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import moment from "moment";

@Component({
  components: {
    UserLazydropdown,
    [Drawer.name]: Drawer,
    [Row.name]: Row,
    [Col.name]: Col,
    MultiOptionSearchBox,
    DepartmentLazydropdown,
    DateRange
  }
})
export default class FilterDrawer extends Mixins(TaxonomyMixin) {
  @Prop({required: true})
  isFilterModelActive!: boolean;
  @Prop({required: true})
  title!: string;

  public queryBuilder: QueryBuilder = new QueryBuilder();

  public invoiceType: string = '';
  public invoiceStatus: string = '';
  public deliveryStatus: string = '';
  public buyerDepartmentId: [] = [];
  public sellerDepartmentId: [] = [];
  public dateRange: string = '';
  public createdBy: [] = [];

  get invoiceStatuses() {
    return InvoiceStatuses;
  }

  created() {
    this.queryBuilder.setParam('created_between', moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD'))
  }

  @Watch('queryBuilder.watch')
  onChangeQuery(value: string) {
    this.$emit('filters', this.queryBuilder.getFilters());
  }

  @Watch('invoiceType')
  onChangeInvoiceType(value: string) {
    this.queryBuilder.addListener('is_requisition', Number(value == 'requisition'));
  }

  @Watch('invoiceStatus')
  onChangeInvoiceStatus(value: string) {
    this.queryBuilder.addListener('status', value);
  }

  @Watch('deliveryStatus')
  onChangeDeliveryStatus(value: string) {
    this.queryBuilder.addListener('delivered', Number(value == 'delivered'));
  }

  @Watch('buyerDepartmentId')
  onChangeBuyerDepartmentId(value: []) {
    this.queryBuilder.addListener('buyer_id', value.join(','));
  }

  @Watch('sellerDepartmentId')
  onChangeSellerDepartmentId(value: []) {
    this.queryBuilder.addListener('seller_id', value.join(','));
  }

  @Watch('dateRange')
  onChangeDateRange(value: string) {
    this.queryBuilder.addListener('created_between', value);
  }

  @Watch('createdBy')
  onChangeCreatedBy(value: []) {
    this.queryBuilder.addListener('created_by', value.join(','));
  }

  resetBtn() {
    this.sellerDepartmentId = [];
    this.buyerDepartmentId = [];
    this.createdBy = [];
    this.deliveryStatus = '';
    this.invoiceType = '';
    this.invoiceStatus = '';
    this.dateRange = '';
  }

  close(): void {
    this.$emit('update:isFilterModelActive', false);
  }
}
</script>
