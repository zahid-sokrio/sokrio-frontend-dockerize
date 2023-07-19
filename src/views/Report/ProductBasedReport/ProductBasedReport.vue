<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-8">
          <div class="form-inline">
            <h3 class="mb-0">Product Based</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="row pl-3">
        <ProductSummaryReport></ProductSummaryReport>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ProductSummaryReport from "@/views/Report/ProductBasedReport/ProductSummaryReport.vue";

@Component({
  components: {ProductSummaryReport}
})
export default class ProductBasedReport extends Vue {

}
</script>
