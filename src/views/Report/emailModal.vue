<template>
  <modal :show="isEmailReport" @close="close">
    <template slot="header">
      <h5
        class="modal-title"
        id="exampleModalLabel"
      > {{currentReport.name}}</h5>
    </template>
    <div class="card">
      <div class="card-body">
        <base-input label="Date (Optional)">
          <flat-picker :config="{allowInput: true, mode: 'range',}"
                       @on-close="blur"
                       @on-open="focus"
                       class="form-control datepicker"
                       slot-scope="{focus, blur}"
                       v-model="form.range">
          </flat-picker>
        </base-input>
        <base-input label="Recipient (Optional)" v-model="form.recipient"></base-input>
      </div>
    </div>
    <template slot="footer">
      <base-button @click="close" type="secondary">Close</base-button>
      <base-button :disabled="disableBtn" :loading="loading" @click.prevent="sendReport" type="success">Email Me Now
      </base-button>
    </template>
  </modal>
</template>
<script lang="ts">
  import {Component, Prop, Vue, Watch} from "vue-property-decorator";
  import swal from "sweetalert2";
  import "flatpickr/dist/flatpickr.css";

  const flatPicker = require("vue-flatpickr-component");
  @Component({
    components: {
      flatPicker
    }
  })
  export default class emailModal extends Vue {
    @Prop() isEmailReport!: boolean;
    @Prop() currentReport!: any;
    private form: any = {
      range: '',
      recipient: '',
      type: ''
    };
    private loading = false;
    private disableBtn: any = false;
    private range: any = '';

    @Watch('isEmailReport')
    typeAssign(newVal: any) {
      this.form.type = this.currentReport.type;
    }

    @Watch('form', {immediate: true, deep: true})
    async onChangeFilter(newVal: any) {
      this.range = this.form.range ? this.form.range.replace("to", ',').replace(/\s/g, '') : '';
    }
        sendReport(){
            this.loading = true;
            this.disableBtn = true;
            this.$http.get(this.$api(`/sales-report?type=${this.form.type}${this.range ? '&range=' + this.range : ''}${this.form.recipient ? '&recipient=' + this.form.recipient : ' '}`))
            .then(response => {
                swal.fire(
                    "Report Sent",
                    "You will receive the report within a few minutes.",
                    "success"
                );
            })
                .catch(error => {
                    swal.fire(
                        "Error",
                        "Something went wrong.",
                        "error"
                    );
                }).finally(() => {
                    this.form = {
                      range: '',
                      recipient: '',
                      type: ''
                    };
                    this.range = '';
                    this.$emit('update:isEmailReport', false);
                    this.disableBtn = false;
                    this.loading = false;
                });
        }

    close() {
      this.$emit('update:isEmailReport', false);
      this.form = {
        range: '',
        recipient: '',
        type: ''
      }
      this.range = '';
    }
  }
</script>
