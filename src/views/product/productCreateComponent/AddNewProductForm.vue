<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <div class="col-md-12" style="margin-bottom: 10px">
      <el-button
        circle
        icon="fa fa-arrow-left"
        @click="backBtn()">
      </el-button>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="border shadow p-3">
          <div style="height: 380px">
            <base-product-component
              :product-form="productForm"
            ></base-product-component>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="border shadow p-3">
          <div style="height: 380px">
            <product-batch-component
              :batch-form="batchForm"
            ></product-batch-component>
          </div>
        </div>
      </div>
      <div class="col-md-6 mt-3">
        <div class="border shadow p-3">
          <product-price-component
            :product-prices="productPrices"
          ></product-price-component>
        </div>
      </div>
      <div class="col-md-6 mt-3">
        <div class="border shadow p-3">
          <div style="min-height: 220px">
            <product-variant-component
              :product-variants="productVariants"
            ></product-variant-component>
          </div>
        </div>
      </div>
      <div class="col-md-6 mt-3">
        <div class="border shadow p-3">
          <div style="min-height: 220px">
            <product-unit-component
              :product-units="productForm.units"
            ></product-unit-component>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12" style="margin-top: 10px;">
      <div class="text-right">
        <base-button type="success" @click="handleSubmit(save)" :loading="loading"> Save</base-button>
      </div>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import BaseProductComponent from "@/views/product/productCreateComponent/BaseProductComponent.vue";
import ProductBatchComponent from "@/views/product/productCreateComponent/ProductBatchComponent.vue";
import ProductPriceComponent from "@/views/product/productCreateComponent/ProductPriceComponent.vue";
import ProductVariantComponent from "@/views/product/productCreateComponent/ProductVariantComponent.vue";
import {Button} from "element-ui";
import ProductUnitComponent from "@/views/product/productCreateComponent/ProductUnitComponent.vue";

@Component({
  components: {
    ProductUnitComponent,
    [Button.name]: Button,
    ProductBatchComponent,
    BaseProductComponent,
    ProductPriceComponent,
    ProductVariantComponent,
  }
})
export default class AddNewProductForm extends Vue {
  @Prop() clickAddNewProductBtn!: boolean;
  private loading = false
  private productForm = {
    name: '',
    sku: '',
    product_brand_id: '',
    product_category_id: '',
    description: '',
    usp: '',
    units: []
  }
  private batchForm: any = {
    batch_id: '',
    qty: '',
    mrp: '',
    purchase_amount: '',
    mfg_date: '',
    exp_date: '',
    image: '',
    active: true,
    is_free: false,
  }
  private productPrices: any[] = [];
  private productVariants: any[] = [];

  dataReset() {
    this.productForm.name = '';
    this.productForm.sku = '';
    this.productForm.product_brand_id = '';
    this.productForm.product_category_id = '';
    this.productForm.description = '';
    this.productForm.usp = '';
    this.productForm.units = [];
    this.batchForm.batch_id = '';
    this.batchForm.qty = '';
    this.batchForm.mrp = '';
    this.batchForm.purchase_amount = '';
    this.batchForm.mfg_date = '';
    this.batchForm.exp_date = '';
    this.batchForm.image = '';
    this.batchForm.is_free = false;
    this.productPrices = [];
    this.productVariants = [];
  }

  backBtn() {
    this.$emit('update:clickAddNewProductBtn', false);
    this.dataReset();
  }

  save() {
    this.loading = true;
    this.$http.post(this.$api('/base-products'), this.productForm).then(async response => {
      this.batchForm.base_product_id = response.data.baseProduct.id;
      var form = new FormData();
      form.append('image', this.batchForm.image);
      form.append('mrp', this.batchForm.mrp);
      form.append('qty', this.batchForm.qty);
      form.append('batch_id', this.batchForm.batch_id);
      form.append('purchase_amount', this.batchForm.purchase_amount);
      form.append('base_product_id', response.data.baseProduct.id);
      form.append('mfg_date', this.batchForm.mfg_date);
      form.append('exp_date', this.batchForm.exp_date);
      form.append('is_free', this.batchForm.is_free);
      await this.$http.post(this.$api('/products'), this.batchForm.image != '' ? form : this.batchForm)
        .then(responseProductBatch => {
          this.loading = false;
          this.saveProductPrice(responseProductBatch.data.product.id);
          this.saveProductVariant(responseProductBatch.data.product.id, response.data.baseProduct.product_brand_id);
          this.notification('Success', 'Successfully Added', 'success');
          this.dataReset();
          this.$nextTick(() => {
            (this.$refs.formValidator as HTMLFormElement).reset();
          })
        }).catch(error => {
          this.loading = false;
        });
    }).catch(error => {
      this.loading = false;
      (this.$refs.formValidator as Vue & {
        setErrors: (errors: []) => any;
      }).setErrors(error.response.data.errors);
    });
  }

  saveProductVariant(productBatchId: number, productBrandId: number) {
    if (!this.productVariants.length) {
      this.$http.post(this.$api('/product-variants'), {
        product_id: productBatchId,
        product_brand_id: productBrandId
      })
    } else {
      this.productVariants.forEach((variant: any) => {
        this.$http.post(this.$api('/product-variants'), {
          product_id: productBatchId,
          variant_category_id: variant.variant,
          value: variant.value,
          product_brand_id: productBatchId
        }).catch(error => {
          this.notification('Warning', 'Due to some error product variant is not assigned.', 'warning');
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
      })
    }
  }

  saveProductPrice(productBatchId: number) {
    this.productPrices.forEach((price: any) => {
      this.$http.post(this.$api('/product-prices'), {
        product_id: productBatchId,
        priceable_id: price.priceable_id,
        priceable_type: price.priceable_type,
        price: price.price
      }).catch(error => {
        this.notification('Warning', 'Product batch price is not assigned.', 'warning');
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
    });
  }

  notification(title: string, message: string, type: "success" | "warning" | "info" | "error" | undefined) {
    this.$notify({
      title: title,
      message: message,
      duration: 5000,
      iconClass: 'ni ni-bell-55',
      type: type
    });
  }
}
</script>
