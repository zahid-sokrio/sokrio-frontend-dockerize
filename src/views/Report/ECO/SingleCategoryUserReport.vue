<template>
  <tr>
    <td>{{ user.code }}</td>
    <td>{{ user.name }}</td>
    <td>{{ user.total_assigned_outlet }}</td>
    <template v-for="category in categoryReport">
      <td :key="category.id">
        <base-button   @click.prevent="showOutletDetails(category.outlet_ids)"
                       size="sm">{{ loading ? 'Loading...' : category.outlet_count }}
        </base-button>
        </td>
    </template>
  </tr>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import _ from "lodash"

@Component({
  components: {}
})
export default class SingleCategoryUserReport extends Vue {
  @Prop({required: true})
  user!: any

  @Prop({required: true})
  public categories!: any

  @Prop({required: true})
  basedOn!: any

  @Prop({required: true})
  range!: any

  public categoryReport: any = []
  public showOutletModal: boolean = false;
  public rowId:boolean = false;
  public loading: boolean = false

  async mounted() {
    await this.resetBrandOutletCount()
    await this.fetchReport()
  }

  @Watch('range')
  @Watch('basedOn')
  @Watch('categories')
  async onChangeBrands() {
    await this.resetBrandOutletCount()
    await this.fetchReport()
  }

  async fetchReport() {
    if (this.user.departments_id && this.categoryReport.length) {
      this.loading = true
      try {
        let departments_id = this.user.departments_id.split(',');
        let category_id = this.categories.map((item: any) => item['id']);
        let {data} = await this.$http.post(
          this.$api(`/eco-report`),
          {
            "department_id": departments_id,
            "category_id": category_id,
            "range": this.range,
            "based_on":this.basedOn
          }
        )

        await this.categoryReport.forEach((value: any, index: number) => {
          let outlet_count = 0;
          let outlet_ids = '';
          let result = data.find((value1: any, index1: any) => value1.product_category_id == value.id);
          if (result) {
            outlet_count = result.outlet_count;
            outlet_ids = result.outlet_ids;
          }
          this.categoryReport.splice(index, 1, {...value, outlet_count,outlet_ids})
        })
      } finally {
        this.loading = false
      }

    }
  }
  async showOutletDetails(value: any){
    this.$emit('rowId', [this.showOutletModal = true,value]);
  }
  async resetBrandOutletCount() {
    this.categoryReport = _.clone(this.categories)
    await this.categoryReport.forEach((value: any, index: number) => {
      this.categoryReport.splice(index, 1, {...value, outlet_count: 0})
    })
  }
}
</script>
