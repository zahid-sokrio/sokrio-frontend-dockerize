<template>
  <div class="mt-2">
    <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
      <el-row :gutter="10">
        <el-col :span="6">
          <MultiOptionSearchBox
            prepend_icon="fa fa-search"
            @onChangeType="filters.nameORcode.type = $event"
            @input="filters.nameORcode.value = $event"
            placeholder="Search. . ."
            :types="[
              { value: 'p' +
               '', title: 'Name' },
              { value: 'code', title: 'Code' }
            ]"
          ></MultiOptionSearchBox>
        </el-col>
        <el-col :span="7">
          <MultiOptionSearchBox
            @onChangeType="filters.creditLimitORoutstandingBalance.type = $event"
            @input="filters.creditLimitORoutstandingBalance.value = $event"
            placeholder="Credit lim. & Outstanding bal."
            prepend_icon="fa fa-search"
            :types="[
              { value: 'ctgt', title: 'Credit Limit Greater Than' },
              { value: 'cllt', title: 'Credit Limit Less Than' },
              { value: 'obgt', title: 'Outstanding Bal. Greater Than' },
              { value: 'oblt', title: 'Outstanding Bal. Less Than' }
            ]"
          ></MultiOptionSearchBox>
        </el-col>
        <el-col :span="5">
          <BadgeAutocomplete placeholder="Badge" :multiple="true" :add-button="false" v-model="filters.badges_id"></BadgeAutocomplete>
        </el-col>
        <el-col :span="6">
          <DepartmentTypeAutocomplete
            placeholder="Department type"
            :multiple="true"
            :add-button="false"
            v-model="filters.department_type_id"
          ></DepartmentTypeAutocomplete>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mt-1">
        <el-col :span="8">
          <TerritoryTypeAutocomplete
            placeholder="Territory type"
            :multiple="true"
            :add-button="false"
            v-model="filters.territory_type_id"
          ></TerritoryTypeAutocomplete>
        </el-col>
        <el-col :span="8">
          <TerritoryAutocomplete placeholder="Territory" :multiple="true" v-model="filters.territory_id"></TerritoryAutocomplete>
        </el-col>
        <el-col :span="8">
          <MemberAutocomplete placeholder="Manager" :multiple="true"  v-model="filters.manager"></MemberAutocomplete>
        </el-col>
      </el-row>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import { Tooltip, Button, Row, Col, Container, Autocomplete } from 'element-ui';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import MemberAutocomplete from '@/components/resources-autocomplete/MemberAutocomplete.vue';
import TerritoryTypeAutocomplete from '@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue';
import TerritoryAutocomplete from '@/components/resources-autocomplete/TerritoryAutocomplete.vue';
import BadgeAutocomplete from '@/components/resources-autocomplete/BadgeAutocomplete.vue';
import DepartmentTypeAutocomplete from '@/components/resources-autocomplete/DepartmentTypeAutocomplete.vue';
import Collapse from '@/components/argon-core/Collapse/Collapse.vue';
import CollapseItem from '@/components/argon-core/Collapse/CollapseItem.vue';
import MultiOptionSearchBox from '@/components/MultiOptionSearchBox.vue';

@Component({
  components: {
    MultiOptionSearchBox,
    [Autocomplete.name]: Autocomplete,
    [Tooltip.name]: Tooltip,
    [Button.name]: Button,
    [Container.name]: Container,
    [Row.name]: Row,
    [Col.name]: Col,
    MemberAutocomplete,
    TerritoryTypeAutocomplete,
    TerritoryAutocomplete,
    BadgeAutocomplete,
    DepartmentTypeAutocomplete,
    Collapse,
    CollapseItem
  }
})
export default class OrderFilters extends Vue {
  @Prop({ required: true })
  isFilterModelActive!: boolean;

  private filters: any = {
    department_type_id: [],
    badges_id: [],
    territory_id: [],
    territory_type_id: [],
    nameORcode: { type: null, value: null },
    manager: [],
    creditLimitORoutstandingBalance: { type: null, value: null }
  };

  @Watch('filters', { immediate: true, deep: true })
  async onChangeFilter(val: any) {
    let query = [];
    val.department_type_id.length > 0 ? query.push(`dt=${val.department_type_id.join()}`) : '';
    val.badges_id.length > 0 ? query.push(`b=${val.badges_id.join()}`) : '';
    val.territory_id.length > 0 ? query.push(`t=${val.territory_id.join()}`) : '';
    val.territory_type_id.length > 0 ? query.push(`tt=${val.territory_type_id.join()}`) : '';
    val.nameORcode.type && val.nameORcode.value ? query.push(`${val.nameORcode.type}=${val.nameORcode.value}`) : '';
    val.manager.length > 0 ? query.push(`manager=${val.manager.join()}`) : '';
    val.creditLimitORoutstandingBalance.type && val.creditLimitORoutstandingBalance.value
      ? query.push(`${val.creditLimitORoutstandingBalance.type}=${val.creditLimitORoutstandingBalance.value}`)
      : '';

    const { data } = await this.$http.get(this.$api(`/departments${query.length > 0 ? '?' + query.join('&') : ''}`));
    this.$emit('update', data.departments);
  }

  save(): void {}

  close(): void {
    this.$emit('update:isFilterModelActive', false);
  }
}
</script>
<style>
.dropdown-group input:focus {
  border-color: #dcdfe6 !important;
}

.dropdown-group input:hover {
  border-color: #dcdfe6 !important;
}

.dropdown-group > .el-select {
  width: 60px !important;
}

.dropdown-group .el-input__inner {
  border-radius: 5px 0px 0px 5px !important;
  height: 46px !important;
}
</style>
