<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <modal :show="showModal">
      <div>
        <product-lazydropdown
          label="Select Existing Product"
          placeholder="Select Base Product"
          name="product"
          v-model="baseProductId"
          :end-point="'base-products'"
          :addButton="false"
          rules="required"
        ></product-lazydropdown>
      </div>
      <template slot="footer">
        <base-button type="primary" @click="backBtn()">Back</base-button>
        <base-button type="success" @click="setModalStatus()">Select</base-button>
      </template>
    </modal>
    <div v-if="!showModal" class="col-md-12" style="margin-bottom: 10px">
      <el-button
        circle
        icon="fa fa-arrow-left"
        @click="backBtn()">
      </el-button>
    </div>
    <div v-if="!showModal" class="col-md-12" style="margin-bottom: 10px">
      <h3 v-if="baseProductId">Base Product: {{
          baseProducts.find(baseProduct => baseProduct.id == baseProductId).name
        }}</h3>
      <div class="row">
        <div class="col-md-6">
          <div class="border shadow p-3">
            <product-batch-component
              :batch-form="batchForm"
            ></product-batch-component>
          </div>
        </div>
        <div class="col-md-6">
          <div class="border shadow p-3">
            <div style="min-height: 330px">
              <product-price-component
                :product-prices="productPrices"
              ></product-price-component>
            </div>
          </div>
        </div>
        <div class="col-md-6 mt-3">
          <div class="border shadow p-3">
            <product-variant-component
              :product-variants="productVariants"
            ></product-variant-component>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!showModal" class="col-md-12" style="margin-top: 10px;">
      <div class="text-right">
        <base-button type="success" @click="handleSubmit(save)" :loading="loading"> Save</base-button>
      </div>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import ProductBatchComponent from "@/views/product/productCreateComponent/ProductBatchComponent.vue";
import ProductPriceComponent from "@/views/product/productCreateComponent/ProductPriceComponent.vue";
import ProductVariantComponent from "@/views/product/productCreateComponent/ProductVariantComponent.vue";
import ProductLazydropdown from "@/components/lazyDropdown/ProductLazydropdown.vue";
import BaseProduct from "@/intefaces/BaseProduct";
import {Button} from "element-ui";

@Component({
  components: {
    [Button.name]: Button,
    ProductBatchComponent,
    ProductPriceComponent,
    ProductVariantComponent,
    ProductLazydropdown,
  }
})
export default class AddBatchForExistingProductForm extends Vue {
  @Prop() clickAddBatchForExistingProductBtn!: boolean;
  private baseProductId = '';
  private showModal: boolean = true;
  private baseProducts: BaseProduct[] = [];
  private loading: boolean = false;
  private batchForm: any = {
    batch_id: '',
    qty: '',
    mrp: '',
    purchase_amount: '',
    mfg_date: '',
    exp_date: '',
    image: '',
    active: true,
  }
  private productPrices: any[] = [];
  private productVariants: any[] = [];

  dataReset() {
    this.batchForm.batch_id = '';
    this.batchForm.qty = '';
    this.batchForm.mrp = '';
    this.batchForm.purchase_amount = '';
    this.batchForm.mfg_date = '';
    this.batchForm.exp_date = '';
    this.batchForm.image = '';
    this.productPrices = [];
    this.productVariants = [];
  }

  setModalStatus() {
    if (this.baseProductId) {
      this.showModal = false;
    }
  }

  fetchBaseProduct() {
    this.$http.get(this.$api('/base-products')).then(response => {
      this.baseProducts = response.data.products;
    })
  }

  backBtn() {
    this.$emit('update:clickAddBatchForExistingProductBtn', false);
    this.dataReset();
    this.baseProductId = '';
  }

  save() {
    this.loading = true;
    this.batchForm.base_product_id = this.baseProductId;
    var form = new FormData();
    form.append('image', this.batchForm.image);
    form.append('mrp', this.batchForm.mrp);
    form.append('qty', this.batchForm.qty);
    form.append('batch_id', this.batchForm.batch_id);
    form.append('base_product_id', this.baseProductId);
    form.append('purchase_amount', this.batchForm.purchase_amount);
    form.append('mfg_date', this.batchForm.mfg_date);
    form.append('exp_date', this.batchForm.exp_date);
    this.$http.post(this.$api('/products'), this.batchForm.image != '' ? form : this.batchForm)
      .then(response => {
        this.loading = false;
        this.saveProductPrice(response.data.product.id);
        this.saveProductVariant(response.data.product.id);
        this.notification('Success', 'Successfully Added', 'success');
        this.$nextTick(() => {
          (this.$refs.formValidator as HTMLFormElement).reset();
        })
      }).catch(error => {
      this.loading = false;
    });
  }

  async saveProductVariant(productBatchId: string | number) {
    var baseProduct: any = []
    await this.$http.get(this.$api(`/base-products/${this.baseProductId}`)).then(response => {
      baseProduct = response.data.baseProduct;
    }).catch(error => {
      this.notification('Warning', 'Due to some error product variant is not assigned.', 'warning');
      (this.$refs.formValidator as Vue & {
        setErrors: (errors: []) => any;
      }).setErrors(error.response.data.errors);
    });
    if (this.productVariants.length <= 0) {
      this.$http.post(this.$api('/product-variants'), {
        product_id: productBatchId,
        product_brand_id: baseProduct.product_brand_id
      }).then(response => {
        this.dataReset();
      })
    } else {
      this.productVariants.forEach((variant: any) => {
        this.$http.post(this.$api('/product-variants'), {
          product_id: productBatchId,
          variant_category_id: variant.variant,
          value: variant.value,
          product_brand_id: baseProduct.product_brand_id
        }).catch(error => {
          this.notification('Warning', 'Due to some error product variant is not assigned.', 'warning');
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
      })
      this.dataReset();
    }
  }

  saveProductPrice(productBatchId: string | number) {
    this.productPrices.forEach((price: any) => {
      this.$http.post(this.$api('/product-prices'), {
        product_id: productBatchId,
        priceable_id: price.priceable_id,
        priceable_type: price.priceable_type,
        price: price.price
      }).catch(error => {
        this.notification('Warning', 'Due to some error product batch price is not assigned.', 'warning');
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
  created() {
    this.fetchBaseProduct();
  }
}
</script>
