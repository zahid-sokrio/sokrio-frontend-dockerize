<template>
  <div class="row pl-3">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-3">
              <DateRange v-model="filters.range" label-prop="Date Range"></DateRange>
            </div>
            <div class="col-3">
              <TerritoryAutocomplete
                :disabled="!filters.range"
                v-model="filters.territory_id"
                label="Territory">
              </TerritoryAutocomplete>
            </div>
            <div class="col-3">
              <UserLazydropdown
                :end-point="`users${filters.territory_id ? '?t=' + filters.territory_id : ''}`"
                :disabled="!filters.range"
                v-model="filters.user_id"
                label="User">
              </UserLazydropdown>
            </div>
            <div class="col-3 text-right pt-4">
              <base-button :disabled="!filters.range" :loading="downloading"
                           type="primary"
                           @click.prevent="onClickDownload">
                <i class="fa fa-download"></i>
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { QueryBuilder } from "@/classes/QueryBuilder";
import moment from "moment";
import DepartmentLazydropdown from '@/components/lazyDropdown/DepartmentLazydropdown.vue';
import printJS from "print-js";
import DateRange from "@/components/DateRange.vue";
import { Permission as PermissionEnum } from "@/enums/Permission";
import { Tag } from 'element-ui';
import TerritoryAutocomplete from "@/components/resources-autocomplete/TerritoryAutocomplete.vue";
import UserLazydropdown from "@/components/lazyDropdown/UserLazydropdown.vue";

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    UserLazydropdown,
    TerritoryAutocomplete,
    DepartmentLazydropdown,
    flatPicker,
    DateRange,
    [Tag.name]: Tag,
  }
})
export default class NoOrderPerformanceReport extends Vue {
  public downloading: boolean = false;
  public loading: boolean = false;
  public printing: boolean = false;
  private showModal: boolean = false;
  public created_by: number | null = null;
  public queryBuilder: QueryBuilder = new QueryBuilder();
  public rangeSelectConfig = {
    allowInput: true,
    disable: [
      function (range: Date) {
        return moment().diff(range) < 0;
      }
    ]
  }
  public filters: any = {
    range: '',
    territory_id: null,
    user_id: null
  }

  todaysDate() {
    var currentDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return currentDate;
  }

  async onClickDownload() {
    this.downloading = true;
    try {
      let {
        data,
        headers
      } = await this.$http.get(this.$api('/no-order-report?download&' + this.queryBuilder.getFilters()),
        {
          responseType:
            'arraybuffer'
        });
      const blob = await new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const link = document.createElement("a");
      link.href = await URL.createObjectURL(blob);
      link.download = this.$getFileNameFromContentDisposition(headers);
      link.click();
    } catch (e) {
      this.$notify({title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.',})
    } finally {
      this.downloading = false;
    }
  }

  @Watch('filters.range')
  onChangeRange(value: number) {
    this.queryBuilder.addListener('range', value);
  }

  @Watch('filters.territory_id')
  onChangeTerritory(value: number) {
    this.queryBuilder.addListener('territory_id', value);
  }

  @Watch('filters.user_id')
  onChangeUser(value: number) {
    this.queryBuilder.addListener('user_id', value);
  }

  close() {
    this.showModal = false;
  }

  get permissionEnum() {
    return PermissionEnum;
  }
}
</script>
