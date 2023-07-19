<template>
  <div>
    <validation-observer ref="formValidator" v-slot="{ handleSubmit }">
      <modal :show="isActive" @close="close" size="lg">
        <template slot="header">
          <h5 class="modal-title" id="exampleModalLabel">Update Batch</h5>
        </template>
        <div class="row">
          <div class="col-md-6">
            <batch-lazydropdown
              placeholder="Select Batch"
              label="Name"
              name="product_batch_id"
              v-model="batchForm.batch_id"
              rules='required'
            ></batch-lazydropdown>
          </div>
          <div class="col-md-6">
            <base-input :rules="{required: true, numeric:true}" label="Qty" name="qty" placeholder="e.g. 100"
                        prepend-icon="fas fa-sort-amount-up" v-model="batchForm.qty"></base-input>
          </div>
          <div class="col-md-6">
            <base-input :rules="{required: true}" type="number" min="0" label="MRP" name="price" placeholder="e.g. 100"
                        prepend-icon="fas fa-money-bill" v-model="batchForm.mrp"></base-input>
          </div>
          <div class="col-md-6">
            <base-input label="Stock Price" type="number" min="0" name="purchase amount"
                        placeholder="e.g. 100" prepend-icon="fas fa-money-bill" v-model="batchForm.purchase_amount">
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input label="MFG Date (Optional)" name="expires_at" prepend-icon="fas fa-calendar">
              <flat-picker slot-scope="{focus, blur}"
                           @on-open="focus"
                           @on-close="blur"
                           :config="{allowInput: true}"
                           class="form-control datepicker"
                           v-model="batchForm.mfg_date"
              >
              </flat-picker>
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input label="Expires Date (Optional)" name="expires_at" prepend-icon="fas fa-calendar">
              <flat-picker slot-scope="{focus, blur}"
                           @on-open="focus"
                           @on-close="blur"
                           :config="getConfig"
                           class="form-control datepicker"
                           v-model="batchForm.exp_date"
              >
              </flat-picker>
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input label="Image (Optional)" name="image">
              <single-image-uploader
                  :img.sync="batchForm.image"
                  image-max-height="100px"
                  uploadText="Select Image"
                  :img-get-url="currentProduct.image_url != null ? currentProduct.image_url : ''"
              ></single-image-uploader>
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input label="Active">
              <base-switch on-text="Yes" off-text="No" v-model="batchForm.active"></base-switch>
            </base-input>
          </div>
        </div>
        <template slot="footer">
          <base-button type="secondary" @click="close">Close</base-button>
          <base-button @click="handleSubmit(updateBatch)" type="success" :disabled="disableButton">Save</base-button>
        </template>
      </modal>
    </validation-observer>
  </div>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import BatchLazydropdown from "@/components/lazyDropdown/BatchLazydropdown.vue";

const flatPicker = require("vue-flatpickr-component");
import "flatpickr/dist/flatpickr.css";
import SingleImageUploader from "@/components/ui/SingleImageUploader.vue";
import swal from "sweetalert2";

@Component({
  components: {
    BatchLazydropdown,
    flatPicker,
    SingleImageUploader
  }
})

export default class UpdateBatch extends Vue {
  @Prop() currentProduct!: any;
  @Prop() isActive!: boolean;
  @Prop({
    default: () => ({
      batch_id: '',
      qty: 0,
      mrp: 0,
      purchase_amount: 0,
      mfg_date: '',
      exp_date: '',
      image: '',
      active: true,
      is_free: false,
    })
  })
  batchForm!: {
    batch_id: string;
    qty: any;
    mrp: any;
    purchase_amount: any;
    mfg_date: string;
    exp_date: string;
    image: any;
    active: any;
    is_free: boolean;
  };
  private loading = true;
  private disableButton = false;

  batchFormReset() {
    this.batchForm.batch_id = '';
    this.batchForm.qty = 0;
    this.batchForm.mrp = 0;
    this.batchForm.mfg_date = '';
    this.batchForm.exp_date = '';
    this.batchForm.image = '';
    this.batchForm.active = true;
    this.batchForm.is_free = false;
    this.batchForm.purchase_amount = 0;
    this.batchForm.is_free = false;
    this.disableButton = false;
  }

  updateBatch() {
    this.disableButton = true;
    var form = new FormData();
    form.append('image', this.batchForm.image);
    form.append('base_product_id', this.currentProduct.base_product_id)
    form.append('batch_id', this.batchForm.batch_id);
    form.append('qty', this.batchForm.qty);
    form.append('mrp', this.batchForm.mrp);
    form.append('mfg_date', this.batchForm.mfg_date);
    form.append('exp_date', this.batchForm.exp_date);
    form.append('purchase_amount', this.batchForm.purchase_amount);
    form.append('active', this.batchForm.active ? 1 : 0 as any);
    form.append('is_free', this.batchForm.is_free ? 1 : 0 as any);
    form.append('_method', 'patch');
    this.$http.post(this.$api(`/products/${this.currentProduct.id}`),
      this.batchForm.image
            ? form
            : {
          batch_id: this.batchForm.batch_id,
          qty: this.batchForm.qty,
          mrp: this.batchForm.mrp,
          mfg_date: this.batchForm.mfg_date,
          exp_date: this.batchForm.exp_date,
          base_product_id: this.currentProduct.base_product_id,
          purchase_amount: this.batchForm.purchase_amount,
          active: this.batchForm.active ? 1 : 0,
          is_free: this.batchForm.is_free ? 1 : 0,
          _method: 'patch'
        }
    ).then(response => {
      this.$notify({
        title: 'Success',
        message: 'Successfully Updated',
        duration: 3000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
      this.$http.get(this.$api(`/base-products/${response.data.product.base_product_id}?with=productBrand,productCategory,products.batch`))
          .then(responseBaseProduct => {
            this.$emit('updateBatch', responseBaseProduct.data.baseProduct);
          })
      this.batchFormReset();
    })
        .catch(error => {
          this.disableButton = false;
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
  }

  close() {
    this.$emit('update:isActive', false);
    this.$emit('update:batchForm', {
      batch_id: '',
      qty: 0,
      mrp: 0,
      mfg_date: '',
      exp_date: '',
      image: '',
      is_free: false,
    })
    this.disableButton = false;
  }

  @Watch('batchForm.active')
  showWarningAlert(newVal: boolean) {
    if (!newVal) {
      swal.fire({
        title: 'Info!',
        text: 'By this action, this product will be count as inactive in this system.',
        icon: 'info',
        confirmButtonText: 'Close'
      });
    }
  }

  get getConfig(): any {
    return {
      allowInput: true,
      minDate: this.batchForm.mfg_date
    }
  }
}
</script>
