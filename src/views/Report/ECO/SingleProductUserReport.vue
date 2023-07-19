<template>
  <tr>
    <td>{{ report.code }}</td>
    <td>{{ report.name }}</td>
    <td>{{ report.total_assigned_outlet }}</td>
    <template v-for="product in productReport">
      <td :key="product.id">
        <base-button   @click.prevent="showOutletDetails(product.outlet_ids)"
                       size="sm">{{ loading ? 'Loading...' : product.outlet_count }}
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
export default class SingleProductUserReport extends Vue {
  @Prop({required: true})
  report!: any

  @Prop({required: true})
  public products!: any

  @Prop({required: true})
  basedOn!: any

  @Prop({required: true})
  range!: any

  public productReport: any = []
  public showOutletModal: boolean = false;
  public rowId:boolean = false;
  public loading: boolean = false

  async mounted() {
    await this.resetProductOutletCount()
    await this.fetchReport()
  }

  @Watch('range')
  @Watch('basedOn')
  @Watch('products')
  async onChangeProducts() {
    await this.resetProductOutletCount()
    await this.fetchReport()
  }
  async fetchReport() {
    if (this.report.departments_id && this.productReport.length) {
      this.loading = true
      try {
        let departments_id = this.report.departments_id.split(',');
        let product_id = this.products.map((item: any) => item['id']);
        let {data} = await this.$http.post(
          this.$api(`/eco-report`),
          {
            "department_id": departments_id,
            "product_id":product_id,
            "range": this.range,
            "based_on":this.basedOn
          }
        )

        await this.productReport.forEach((value: any, index: number) => {
          let outlet_count = 0;
          let outlet_ids = '';
          let result = data.find((value1: any, index1: any) => value1.product_id == value.id);
          if (result) {
            outlet_count = result.outlet_count;
            outlet_ids = result.outlet_ids;
          }
          this.productReport.splice(index, 1, {...value, outlet_count,outlet_ids})
        })
      } finally {
        this.loading = false
      }

    }
  }
  async showOutletDetails(value: any){
    this.$emit('rowId', [this.showOutletModal = true,value]);
  }
  async resetProductOutletCount() {
    this.productReport = _.clone(this.products)
    await this.productReport.forEach((value: any, index: number) => {
      this.productReport.splice(index, 1, {...value, outlet_count: 0})
    })
  }
}
</script>
