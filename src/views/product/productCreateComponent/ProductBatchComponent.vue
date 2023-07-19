<template>
  <div>
    <div class="row mb-1">
      <div class="col-md-12">
        <h3>Product Batch</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <batch-lazydropdown
          placeholder="Select Batch"
          label="Name"
          name="product batch name"
          v-model="batchForm.batch_id"
          rules="required"
        ></batch-lazydropdown>
        <div class="form-inline">
          <base-checkbox class="mb-3" v-model="batchForm.is_free">Free Product</base-checkbox>
          <el-tooltip class="ml-3"
                      content="This product will be count as free product in this system,
                      this action cannot be updated later."
                      placement="top">
            <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="col-md-6">
        <base-input label="Qty" name="qty" type="number" min="1" placeholder="e.g. 100"
                    prepend-icon="fas fa-sort-amount-up" v-model="batchForm.qty"
                    :rules="{required: true, numeric:true}">
        </base-input>
      </div>
      <div class="col-md-6">
        <base-input label="MRP" name="mrp" type="number"  placeholder="e.g. 100" min="1"
                    prepend-icon="fas fa-money-bill" v-model="batchForm.mrp" :rules="{required: true}">
        </base-input>
      </div>
      <div class="col-md-6">
        <base-input label="Stock Price (Optional)" name="stock amount" type="number" placeholder="e.g. 100"
                    prepend-icon="fas fa-money-bill" v-model="batchForm.purchase_amount"
                    min="0">
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
      <div class="col-md-6 mt-2 mb-3">
        <base-input label="Image (Optional)" name="image">
          <single-image-uploader
            :img.sync="batchForm.image"
            image-max-height="100px"
            uploadText="Select Image"
          ></single-image-uploader>
        </base-input>
      </div>
      <div class="col-md-6">
        <base-input label="Active">
          <base-switch on-text="Yes" off-text="No" v-model="batchForm.active"></base-switch>
        </base-input>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import BatchLazydropdown from "@/components/lazyDropdown/BatchLazydropdown.vue";

const flatPicker = require("vue-flatpickr-component");
import "flatpickr/dist/flatpickr.css";
import SingleImageUploader from "@/components/ui/SingleImageUploader.vue";
import swal from "sweetalert2";
import moment from "moment";

@Component({
  components: {
    BatchLazydropdown,
    flatPicker,
    SingleImageUploader
  }
})

export default class ProductBatchComponent extends Vue {
  @Prop() batchForm!: any;

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
