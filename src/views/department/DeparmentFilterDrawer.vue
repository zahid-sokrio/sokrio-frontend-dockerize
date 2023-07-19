<template>
  <el-drawer
    :before-close="handleClose"
    :title="getTaxonomy('department')+' Filter'"
    :visible.sync="drawer"
    direction="rtl"
  >
    <div class="col-md-12 my-2">
      <base-input label="Name / Code">
        <MultiOptionSearchBox
          :types="[
              { value: 'name', title: 'Name' },
              { value: 'code', title: 'Code' }
            ]"
          placeholder="Search. . ."
          prepend_icon="fa fa-search"
          @input="filters.nameORcode.value = $event"
          @onChangeType="filters.nameORcode.type = $event"
          class="m-2"
        ></MultiOptionSearchBox>
      </base-input>
    </div>
    <div class="col-md-12">
      <base-input label="Credit lim. & Outstanding bal.">
        <MultiOptionSearchBox
          :types="[
              { value: 'ctgt', title: 'Credit Limit Greater Than' },
              { value: 'cllt', title: 'Credit Limit Less Than' },
              { value: 'obgt', title: 'Outstanding Bal. Greater Than' },
              { value: 'oblt', title: 'Outstanding Bal. Less Than' }
            ]"
          placeholder="e.g. 50000"
          prepend_icon="fa fa-search"
          @input="filters.creditLimitORoutstandingBalance.value = $event"
          @onChangeType="filters.creditLimitORoutstandingBalance.type = $event"
          class="m-2"
        ></MultiOptionSearchBox>
      </base-input>
    </div>
    <div class="col-md-12 mb-2 mt-4 ml-1">
      <LazyDropdown label="Badge" v-model="filters.badges_id" :multiple="true" end-point="/badges" name="badge"
                    placeholder="e.g. Silver" resource-key="badges"
                    searchable-key="name"></LazyDropdown>
    </div>
    <div class="col-md-12 m-2">
      <DepartmentTypeAutocomplete
        label="Department Type"
        v-model="filters.department_type_id"
        :add-button="false"
        :multiple="true"
        placeholder="e.g. Retail"
      ></DepartmentTypeAutocomplete>
    </div>
    <div class="col-md-12 m-2">
      <TerritoryTypeAutocomplete
        label="Territory Type"
        v-model="filters.territory_type_id"
        :add-button="false"
        :multiple="true"
        placeholder="e.g. District"
      ></TerritoryTypeAutocomplete>
    </div>
    <div class="col-md-12 m-2">
      <LazyDropdown label="Territory" v-model="filters.territory_id" :multiple="false" end-point="/territories"
                    name="territory"
                    placeholder="e.g. Gulshan" resource-key="territories"
                    searchable-key="q"></LazyDropdown>
      <!--          <TerritoryAutocomplete placeholder="Territory" :multiple="true" :add-button="false" v-model="filters.territory_id"></TerritoryAutocomplete>-->
    </div>
    <div class="col-md-12 m-2">
      <MemberAutocomplete label="Manager" v-model="filters.manager"
                          end-point="users?manager"
                          placeholder="e.g. Jane Doe">

      </MemberAutocomplete>
    </div>
    <div class="col-md-12 m-2">
      <MemberAutocomplete label="Creator" v-model="filters.created_by" :multiple="true"
                          placeholder="e.g. John Doe"></MemberAutocomplete>
    </div>
    <div class="col-md-12 m-2">
      <date-range v-model="filters.range" label-prop="Date Range"></date-range>
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
import { Col, Drawer, Row } from "element-ui";
import MultiOptionSearchBox from '@/components/MultiOptionSearchBox.vue';
import LazyDropdown from "@/components/LazyDropdown.vue";
import DepartmentTypeAutocomplete from '@/components/resources-autocomplete/DepartmentTypeAutocomplete.vue';
import TerritoryTypeAutocomplete from '@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue';
import MemberAutocomplete from '@/components/resources-autocomplete/MemberAutocomplete.vue';
import Department from '@/intefaces/Department';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import DateRange from '@/components/DateRange.vue';
import { QueryBuilder } from "@/classes/QueryBuilder";

@Component({
  components: {
    [Drawer.name]: Drawer,
    [Row.name]: Row,
    [Col.name]: Col,
    MultiOptionSearchBox,
    LazyDropdown,
    DepartmentTypeAutocomplete,
    TerritoryTypeAutocomplete,
    MemberAutocomplete,
    DateRange
  }
})
export default class DepartmentFilterDrawer extends Mixins(TaxonomyMixin) {
  @Prop({required: true})
  isFilterModelActive!: boolean

  public queryBuilder: QueryBuilder = new QueryBuilder();
  private drawer: boolean = false;

  private filters: any = {
    department_type_id: [],
    badges_id: [],
    territory_id: null,
    territory_type_id: [],
    nameORcode: {type: null, value: null},
    manager: null,
    created_by: [],
    range: '',
    creditLimitORoutstandingBalance: {type: null, value: null}
  };

  @Watch('isFilterModelActive')
  changeDrawerValue(newVal: any) {
    if (newVal) {
      this.drawer = true
    }
  }

  @Watch('filters.department_type_id', {immediate: true, deep: true})
  onChangeDepartmentType(value: []) {
    this.queryBuilder.addListener('dt', value.join())
  }

  @Watch('filters.badges_id')
  onChangeBadgeId(value: []) {
    this.queryBuilder.addListener('b', value?.join())
  }

  @Watch('filters.territory_id', {deep: true})
  onChangeTerritoryId(value: number) {
    this.queryBuilder.addListener('ut', value)
  }

  @Watch('filters.territory_type_id')
  onChangeTerritoryTypeId(value: []) {
    this.queryBuilder.addListener('tt', value?.join())
  }

  @Watch('filters.nameORcode', {immediate: true, deep: true})
  onChangeNameOrCode(value: { type: string, value: string }) {
    this.queryBuilder.addListener('name', null);
    this.queryBuilder.addListener('code', null);
    this.queryBuilder.addListener(value.type, value.value)
  }

  @Watch('filters.creditLimitORoutstandingBalance', {immediate: true, deep: true})
  onChangeCreditLimitORoutstandingBalance(value: { type: string, value: string }) {
    this.queryBuilder.addListener('ctgt', null);
    this.queryBuilder.addListener('cllt', null);
    this.queryBuilder.addListener('obgt', null);
    this.queryBuilder.addListener('oblt', null);
    this.queryBuilder.addListener(value.type, value.value)
  }

  @Watch('filters.manager', {immediate: true, deep: true})
  onChangeManager(value: number) {
    this.queryBuilder.addListener('manager', value)
  }

  @Watch('filters.created_by', {immediate: true, deep: true})
  onChangeCreatedBy(value: []) {
    this.queryBuilder.addListener('created_by', value?.join())
  }

  @Watch('filters.range', {immediate: true, deep: true})
  onChangeRange(value: string) {
    this.queryBuilder.addListener('range', value)
  }

  @Watch('queryBuilder.watch')
  onChangeFilter(value: string) {
    this.$emit('filters', value);
  }

  save(): void {

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
    this.$emit('update:isFilterModelActive', false);
    this.filters.territory_id = '';
    this.filters.territory_type_id = [];
    this.filters.nameORcode.type = null;
    this.filters.nameORcode.value = null;
    this.filters.department_type_id = [];
    this.filters.badges_id = [];
    this.filters.manager = null;
    this.filters.range = '';
    this.filters.creditLimitORoutstandingBalance.type = null;
    this.filters.creditLimitORoutstandingBalance.value = null;
    this.filters.created_by = null;
  }
}
</script>
