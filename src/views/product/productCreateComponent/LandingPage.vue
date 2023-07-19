<template>
  <div>
    <div class="row text-center">
      <div class="col-md-12">
        <h2>Start Managing Your Products</h2>
        <p><small>Create and update your products, all in one place.</small></p>
        <base-button class="btn mb-2" type="primary" @click="onClickAddNewProduct()">Add New
          Product
        </base-button>
        <br>
        <span>Or,</span><br>
        <base-button class="btn mt-2" type="primary" @click="onClickAddBatchForExistingProduct()">
          Add Product to a Batch
        </base-button>
      </div>
    </div>
    <hr>
    <div class="row text-center">
      <div class="col-md-12">
        <h2>Add Product Flow</h2>
      </div>
    </div>
    <div class="row mt-4 text-center">
      <div class="col-md-12">
        <img :src="`${$cdn}/img/product-flow.png`">
      </div>
    </div>
    <hr>
    <div class="row text-center">
      <div class="col-md-12">
        <h2>In this section, you can:</h2>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-4"></div>
      <div class="col-md-5">
        <ul class="list-unstyled">
          <li class="ml-5 mb-4">
            <h4><i class="fas fa-check-circle" style="color: green"></i> Create product with their brand, category and variant. </h4>
          </li>
          <li class="ml-5 mb-4">
            <h4><i class="fas fa-check-circle" style="color: green"></i> Keep track on batch wise product. </h4>
          </li>
          <li class="ml-5 mb-4">
            <h4><i class="fas fa-check-circle" style="color: green"></i> Set product batch price for your organization. </h4>
          </li>
          <li class="ml-5">
            <h4><i class="fas fa-check-circle" style="color: green"></i> View product list and their batches. </h4>
          </li>
        </ul>
      </div>
      <div class="col-md-3"></div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator';

@Component({
  components: {}
})
export default class LandingPage extends Vue {
  @Prop() clickAddNewProductBtn!: boolean;
  @Prop() clickAddBatchForExistingProductBtn!: boolean;

  onClickAddNewProduct() {
    this.$emit('update:clickAddNewProductBtn', true);
  }

  onClickAddBatchForExistingProduct() {
    this.$emit('update:clickAddBatchForExistingProductBtn', true);
  }
}
</script>
