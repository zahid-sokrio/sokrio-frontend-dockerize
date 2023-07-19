<template>
  <tr>
    <td>{{ user.code }}</td>
    <td>{{ user.name }}</td>
    <td>{{ user.total_assigned_outlet }}</td>
    <template v-for="brand in brandReport">
      <td :key="brand.id">
        <base-button   @click.prevent="showOutletDetails(brand.outlet_ids)"
                       size="sm">{{ loading ? 'Loading...' : brand.outlet_count }}
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
export default class SingleBrandUserReport extends Vue {
  @Prop({required: true})
  user!: any

  @Prop({required: true})
  public brands!: any

  @Prop({required: true})
  basedOn!: any

  @Prop({required: true})
  range!: any

  public brandReport: any = []

  public loading: boolean = false
  public showOutletModal: boolean = false;
  public rowId:boolean = false;
  async mounted() {
    await this.resetBrandOutletCount()
    await this.fetchReport()
  }

  @Watch('range')
  @Watch('basedOn')
  @Watch('brands')
  async onChangeBrands() {
    await this.resetBrandOutletCount()
    await this.fetchReport()
  }

  async fetchReport() {
    if (this.user.departments_id && this.brandReport.length) {
      this.loading = true
      try {
        let departments_id = this.user.departments_id.split(',');
        let brand_id = this.brands.map((item: any) => item['id']);
        let {data} = await this.$http.post(
          this.$api(`/eco-report`),
          {
            "department_id": departments_id,
            "brand_id": brand_id,
            "range": this.range,
            "based_on":this.basedOn
          }
        )

        await this.brandReport.forEach((value: any, index: number) => {
          let outlet_count = 0;
          let outlet_ids = '';
          let result = data.find((value1: any, index1: any) => value1.product_brand_id == value.id);
          if (result) {
            outlet_count = result.outlet_count;
            outlet_ids = result.outlet_ids;
          }
          this.brandReport.splice(index, 1, {...value, outlet_count, outlet_ids})
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
    this.brandReport = _.clone(this.brands)
    await this.brandReport.forEach((value: any, index: number) => {
      this.brandReport.splice(index, 1, {...value, outlet_count: 0})
    })
  }
}
</script>
