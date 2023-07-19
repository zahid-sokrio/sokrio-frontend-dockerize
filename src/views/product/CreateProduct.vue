<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <form class="needs-validation" @submit.prevent="handleSubmit(save)">
      <div class="card">
        <div class="card-body border-0">
          <div class="col-md-12" v-if="!clickAddNewProductBtn && !clickAddBatchForExistingProductBtn">
            <el-button
              circle
              icon="fa fa-arrow-left"
              @click="$router.back()">
            </el-button>
          </div>
          <landing-page
            v-if="!clickAddNewProductBtn && !clickAddBatchForExistingProductBtn"
            :click-add-new-product-btn.sync="clickAddNewProductBtn"
            :click-add-batch-for-existing-product-btn.sync="clickAddBatchForExistingProductBtn"
          ></landing-page>
          <add-new-product-form
            v-if="clickAddNewProductBtn"
            :click-add-new-product-btn.sync="clickAddNewProductBtn"
          ></add-new-product-form>
          <add-batch-for-existing-product-form
            v-if="clickAddBatchForExistingProductBtn"
            :click-add-batch-for-existing-product-btn.sync="clickAddBatchForExistingProductBtn"
          ></add-batch-for-existing-product-form>
        </div>
      </div>
    </form>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Mixins, Vue, Watch} from 'vue-property-decorator';
import LandingPage from '@/views/product/productCreateComponent/LandingPage.vue';
import AddNewProductForm from '@/views/product/productCreateComponent/AddNewProductForm.vue';
import AddBatchForExistingProductForm from '@/views/product/productCreateComponent/AddBatchForExistingProductForm.vue';
import {Button} from "element-ui";
@Component({
  components: {
    [Button.name]: Button,
    LandingPage,
    AddNewProductForm,
    AddBatchForExistingProductForm,
  }
})
export default class CreateProduct extends Vue {
  private clickAddNewProductBtn: boolean = false;
  private clickAddBatchForExistingProductBtn: boolean = false;
}
</script>
