<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-8">
          <div class="form-inline">
            <h3 class="mb-0">Outlet Report</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-xs-12 col-sm-4 col-lg-2">
          <DateRange v-model="query.range" label-prop="Date Range (Required)" name="range"></DateRange>
        </div>
        <div class="col-xs-12 col-sm-4 col-lg-2">
          <TerritoryCascaderDropdown label="Select Territory" v-model="query.ut" name="territory_id">
          </TerritoryCascaderDropdown>
        </div>
        <div class="col-xs-12 col-sm-4 col-lg-2">
          <ChannelLazydropdown :collapseTags="true" label="Channel Type" :multiple="false" v-model="query.dt"
            :isActive="false">
          </ChannelLazydropdown>
        </div>
        <div class="col-xs-12 col-sm-4 col-lg-2">
          <DepartmentCategoryLazyDropdown :collapseTags="true" label="Select Outlet Category" name="departmentCat_name"
            :addButton="false" :multiple="true" v-model="query.category_id">
          </DepartmentCategoryLazyDropdown>
        </div>
        <div class="col-xs-12 col-sm-4 col-lg-2">
          <DepartmentLocationTypeLazyDropdown :collapseTags="true" label="Outlet Location Type" :addButton="false"
            :multiple="true" v-model="query.location_type_id">
          </DepartmentLocationTypeLazyDropdown>
        </div>
        <div class="col-xs-12 col-sm-4 col-lg-2">
          <BadgeLazydropdown :collapseTags="true" label="Select Outlet Badge" :addButton="false" :multiple="true"
            v-model="query.b">
          </BadgeLazydropdown>
        </div>
        <div class="col-xs-12 col-sm-4 col-lg-2">
          <UserLazydropdown :collapseTags="true" label="Select User" :addButton="false" :multiple="false"
            v-model="query.created_by">
          </UserLazydropdown>
        </div>
        <div class="col-xs-12 col-sm-4 col-lg-2">
          <DepartmentLazydropdown end-point="departments?has_outlet=0" :collapseTags="true" label="Supplier Name"
            :addButton="false" v-model="query.supplier_department_id">
          </DepartmentLazydropdown>
        </div>

        <div class="col-xs-12 col-sm-4 col-lg-2 ml-4">
          <base-input label="Address" name="address" :rules="{ required: true }">
            <el-radio-group v-model="query.address">
              <el-radio label="Yes"></el-radio>
              <el-radio label="No"></el-radio>
            </el-radio-group>
          </base-input>
        </div>

        <div class="col-xs-12 col-sm-4 col-lg-2">
          <base-input label="Lat/Long" name="letLong" :rules="{ required: true }">
            <el-radio-group v-model="query.latlong">
              <el-radio label="Yes"></el-radio>
              <el-radio label="No"></el-radio>
            </el-radio-group>
          </base-input>
        </div>

        <div class="col-xs-12 col-sm-4 col-lg-2">
          <!-- :disabled="disableSearch" -->
          <base-button class="btn-block" @click="onClickGenerate" :loading="loading" type="success"
            style="margin-top: 20px;">
            <i class="fa fa-search"></i> Search
          </base-button>
        </div>
      </div>
      <br>
      <div v-if="searchMsg && !downloadbtn" class="w-100 overflow-auto text-center">
        <base-button type="warning" :disabled="true" style="margin-top: 20px;"> Total Data Found {{
          totalRecords
        }} <br> Data is larger than 5 laks. Add some filter to Download
        </base-button>
      </div>
      <div class="w-100 overflow-auto" v-if="downloadbtn">
        <div class="text-center">
          <p>Records founds: {{ totalRecords }}</p>
          <base-button v-if="totalRecords > 0" @click="onClickDownload" :loading="downloading" type="success"
            style="margin-top: 20px;">
            <i class="fa fa-search"></i> Download
          </base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Mixins,
  Vue,
  Watch,
} from 'vue-property-decorator';

import DateRange from "@/components/DateRange.vue";
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";
import ProductBrandLazydropdown from "@/components/lazyDropdown/ProductBrandLazydropdown.vue";
import TerritoryTypeAutocomplete from "@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue";
import TerritoryAutocomplete from "@/components/resources-autocomplete/TerritoryAutocomplete.vue";
import PaginationComponentMixin from "@/mixins/PaginationComponent";
import moment from "moment";
import ProductCategoryLazydropdown from "@/components/lazyDropdown/ProductCategoryLazydropdown.vue";
import BaseProductLazydropdown from "@/components/lazyDropdown/BaseProductLazyDropdown.vue";
import DepartmentCategoryLazyDropdown from "@/components/lazyDropdown/DepartmentCategoryLazyDropdown.vue";
import DepartmentLocationTypeLazyDropdown from "@/components/lazyDropdown/DepartmentLocationTypeLazyDropdown.vue";
import BadgeLazydropdown from "@/components/lazyDropdown/BadgeLazydropdown.vue";
import ChannelLazydropdown from "@/components/lazyDropdown/ChannelLazydropdown.vue";
import DepartmentLazydropdown from "@/components/lazyDropdown/DepartmentLazydropdown.vue";
import { Radio, RadioGroup, Cascader } from 'element-ui'
import TerritoryCascaderDropdown from "@/components/resources-autocomplete/TerritoryCascaderDropdown.vue";


@Component({
  components: {
    DepartmentLazydropdown,
    ChannelLazydropdown,
    TerritoryAutocomplete,
    TerritoryTypeAutocomplete,
    ProductBrandLazydropdown,
    UserLazydropdown,
    DateRange,
    ProductCategoryLazydropdown,
    BaseProductLazydropdown,
    DepartmentCategoryLazyDropdown,
    DepartmentLocationTypeLazyDropdown,
    BadgeLazydropdown,
    TerritoryCascaderDropdown,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    ElCascader: Cascader,
    components: {
      [Cascader.name]: Cascader,
    },


  }
})
export default class Outlet extends Mixins(PaginationComponentMixin, Vue) {
  public loading: boolean = false;
  public downloadloading: boolean = false;
  public maxDate: string = moment().subtract(1, "days").format('YYYY-MM-DD');
  public totalRecords: number = 0;
  public downloadbtn: boolean = false;
  public downloading: boolean = false;
  public query: any = {};
  public fileName = 'outlet-report-' + moment().format('YYYY-MM-DD') + '.xls';
  public searchMsg = false;

  public sortItems(arr: []) {
    return arr.sort((a: any, b: any) => (a.id > b.id ? 1 : -1));
  }

  public onClickGenerate() {
    if (this.query.range === '' || this.query.ut === '') {
      this.$notify({
        type: 'warning',
        message: 'Select the required field',
        title: 'Required!'
      });
    } else {
      this.search();
    }
  }

  async search() {
    try {
      this.loading = true;
      this.downloadbtn = false;
      let {
        data
      } = await this.$http.get(this.$api3(`/search-outlet-report${this.$toQueryString(this.query)}`));
      this.totalRecords = data.totalRecords;
      if (this.totalRecords >= 500000) {
        this.downloadbtn = false;
        this.searchMsg = true;
      } else {
        this.downloadbtn = true;
      }
    } catch (e) {
      let err_msg = [];
      if (e.response.data.errors.range) {
        err_msg.push(e.response.data.errors.range[0]);
      }
      if (e.response.data.errors.territory_id) {
        err_msg.push(e.response.data.errors.territory_id[0]);
      }
      err_msg.forEach(error => {
        this.$notify({
          type: 'warning',
          message: error,
          title: 'Validation error'
        });
      })
      this.loading = false;
    } finally {
      this.loading = false;
    }
  }

  async onClickDownload(type: string) {
    this.downloading = true;
    try {
      let {
        data,
        headers
      } = await this.$http.get(this.$api3(`/export-outlet-report${this.$toQueryString(this.query)}&download`), {
        responseType: 'arraybuffer'
      });
      const blob = await new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const link = document.createElement("a");
      link.href = await URL.createObjectURL(blob);
      link.download = this.$getFileNameFromContentDisposition(headers);
      link.click();
    } catch (e) {
      this.$notify({
        title: 'Something wants wrong!',
        type: 'warning',
        message: 'Unable to download reports.',
      })
    } finally {
      this.downloading = false;
    }
  }
}
</script>

<style>
#customers {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#customers td,
#customers th {
  border: 1px solid #ddd;
  padding: 8px;
  min-width: 100px;
}

#customers tr:nth-child(even) {
  background-color: #f2f2f2;
}

#customers tr:hover {
  background-color: #ddd;
}

#customers th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: center;
  background-color: #04AA6D;
  color: white;
}
</style>