<template>
  <validation-observer v-if="isActive" v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" @close="close" class="modal-dialog-scrollable">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">Add new Travel Allowance</h5>
      </template>
      <div>
        <div class="row">
          <div class="col-12">
            <base-input name="reason" :rules="{required:true}" v-model="form.reason" label="Reason"
                        placeholder="e.g. Office tour, Site visit etc."></base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <base-input
              label="Travel Date"
              placeholder="yyyy-mm-dd"
              name="travel date"
              input-classes="form-control-alternative"
              v-model="form.travel_date"
              min="2021"
              :rules="{required:true}"
            >
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{allowInput: true}"
                class="form-control datepicker"
                :placeholder="form.travel_date ||'Select travel Date.'"
                v-model="form.travel_date"
                minDate='today'
              >
              </flat-picker>
            </base-input>
          </div>
          <div class="col-6">
            <transport-lazydropdown
              label="Mode of Transport"
              name="transport id"
              v-model="form.transport_id"
              :rules="{required:true}"
              placeholder="Select Transport Type"
            ></transport-lazydropdown>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <base-input name="start location" :rules="{required:true}" v-model="form.start_location"
                        label="Start Location"
                        placeholder="e.g. Mohammadpur"></base-input>
          </div>
          <div class="col-6">
            <base-input name="end location" :rules="{required:true}" v-model="form.end_location" label="End Location"
                        placeholder="e.g. Gulshan"></base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <base-input label="Start Time" name="start time" prepend-icon="fas fa-clock" :rules="{required:true}">
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true, enableTime: true, noCalendar: true, dateFormat: 'H:i:ss' }"
                class="form-control datepicker"
                v-model="form.start_time"
              >
              </flat-picker>
            </base-input>
          </div>
          <div class="col-6">
            <base-input label="End Time" name="end time" prepend-icon="fas fa-clock" :rules="{required:true}">
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true, enableTime: true, noCalendar: true, dateFormat: 'H:i:ss' }"
                class="form-control datepicker"
                v-model="form.end_time"
              >
              </flat-picker>
            </base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <base-input name="comment" v-model="form.comment" label="Comments (Optional)"
                        placeholder="e.g Need to meet manager"></base-input>
          </div>


          <div class="col-6">
            <base-input type="number" min="0" name="expense" v-model="form.expense" label="Expense"
                        placeholder="e.g 100 BDT" :rules="{required:true}"></base-input>
          </div>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="col-md-12">
            <label class="font-weight-500">Image (Optional)</label>
            <div class="modal-dialog-scrollable">
              <el-upload class="avatar-uploader"
                         ref="upload"
                         action="#"
                         multiple
                         :limit="5"
                         :file-list="fileList"
                         :on-change="handleChange"
                         :on-remove="handleChange"
                         :auto-upload="false"
                         list-type="picture-card"
                         show-file-list>
                <el-button size="small" slot="trigger" type="secondary">Select
                  files
                </el-button>
              </el-upload>
            </div>
          </div>
        </div>

      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button :disabled="disableBtn" type="success" :loading="loading" @click="handleSubmit(createTA)">Save
        </base-button>
      </template>
    </modal>
  </validation-observer>
</template>

<script lang="ts">
import {Vue, Component, Prop, Mixins} from 'vue-property-decorator';
import BaseCUModalComponent from '@/mixins/BaseCUModalComponent';
import {AxiosResponse} from 'axios';
import Badge from '@/intefaces/Badge.js';
import SingleImageUploader from "@/components/ui/SingleImageUploader.vue";

const flatPicker = require('vue-flatpickr-component');
import 'flatpickr/dist/flatpickr.css';
import {Upload, Button, Tooltip} from 'element-ui';
import TransportLazydropdown from "@/components/lazyDropdown/TransportLazydropdown.vue";
import UploadImagesModal from "@/views/user/ta/UploadImagesModal.vue";
import moment from 'moment';
import CreateTransportForm from "@/views/user/transport/CreateTransportForm.vue";


@Component({
  components: {
    UploadImagesModal,
    flatPicker,
    SingleImageUploader,
    ElUpload: Upload,
    [Button.name]: Button,
    TransportLazydropdown,
    CreateTransportForm
  }
})
export default class CreateTAForm extends Vue {
  @Prop()
  isActive!: boolean;

  form = {
    travel_date: '',
    reason: '',
    transport_id: '',
    expense: '',
    start_location: '',
    end_location: '',
    start_time: '',
    end_time: '',
    comment: '',
    photos: []
  };

  public fileList = [];
  private disableBtn: boolean = false;
  private loading: boolean = false;

  formReset(): any {
    this.form.reason = '';
    this.form.travel_date = '';
    this.form.transport_id = '';
    this.form.start_location = '';
    this.form.end_location = '';
    this.form.start_time = '';
    this.form.end_time = '';
    this.form.comment = '';
    this.form.photos = [];

    return this.form;
  }

  inputObject() {
    let inputs = new FormData();

    inputs.append('travel_date', this.form.travel_date);
    inputs.append('reason', this.form.reason);
    inputs.append('transport_id', this.form.transport_id);
    inputs.append('start_location', this.form.start_location);
    inputs.append('expense', this.form.expense);
    inputs.append('end_location', this.form.end_location);
    inputs.append('start_time', this.form.start_time);
    inputs.append('end_time', this.form.end_time);
    inputs.append('comment', this.form.comment);
    this.form.photos.forEach((value: any, index: number) => inputs.append(`photos[${index}]`, value));

    return inputs;
  }

  createTA() {
    this.disableBtn = true;
    this.$http.post(this.$api("/travel-allowances"), this.inputObject(), {
      headers: {'Content-Type': 'multipart/form-data'}
    })
      .then(response => {
        this.$notify({
          title: 'Success',
          message: 'Successfully Created',
          duration: 5000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.afterCreate();
        this.close();
        this.formReset();
      })
      .catch(error => {
        this.disableBtn = false;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
        this.$notify({
          title: 'Error',
          message: error.response.data.errors,
          duration: 5000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
      });
  }

  async afterCreate() {
    this.$emit('created');
  }

  handleChange(File: any, fileList: any) {
    this.form.photos = fileList.map((x: any) => x.raw);
  }

  close() {
    this.$emit('update:isActive', false);
  }

}
</script>
<style lang="scss">
/* use transition in all non hover el (if a el inside hover use transition there also) otherwise ease in out wont work */
#multiple-image-uploader {
  position: relative;
  height: 70%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  transition: all .4s ease-in-out;

  &:hover {
    border: 1px dashed #5e72e4;
    border-radius: 6px;;
    box-shadow: 0 3px 9px rgba(50, 50, 9, 0), 3px 4px 8px rgba(94, 114, 228, 0.1);
    color: #5e72e4 !important;
    cursor: pointer;

    &.has-error {
      border: 1px dashed #5e72e4;
      border-radius: 6px;
      transition: all .4s ease-in-out;

      .upload-text {
        color: #5e72e4;
        transition: all .4s ease-in-out;
      }
    }

    .clear-image {
      display: flex;
      position: absolute;
      top: 0;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 6px;
      width: 100%;
      color: white;
      background-color: rgba(0, 0, 0, .6);
      opacity: 0;
      transition: all .4s ease-in-out;

      &:hover {
        opacity: .75;
      }
    }
  }

  &.has-error {
    border: 1px dashed #fb6340;
    border-radius: 6px;
    transition: all .4s ease-in-out;

    .upload-text {
      color: #fb6340;
      transition: all .4s ease-in-out;
    }
  }

  .clear-image {
    display: none;
  }

  .avatar-uploader {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-weight: bold;
    font-size: 1rem;

    i {
      font-weight: bold;
    }

    .el-upload--text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;

      .avatar-uploader-text-area {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

    }
  }
}
</style>
