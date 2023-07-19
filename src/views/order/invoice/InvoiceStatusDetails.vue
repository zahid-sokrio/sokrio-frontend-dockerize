<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal v-if="isActive" :show="isActive" @close="close" class="modal-dialog-scrollable">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">Update Status</h5>
      </template>
      <div class="row justify-content-md-center">
        <div class="col col-10">
          <InvoiceOrderStatusAutocomplete :rules="{ required: true }" name="status"
                                   v-model="form.status"></InvoiceOrderStatusAutocomplete>
          <base-input name="remarks">
            <textarea rows="3" v-model="form.remarks" placeholder="Say something..!" class="form-control"></textarea>
          </base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" @click="handleSubmit(save)">Update</base-button>
      </template>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
import {Vue, Component, Prop, Mixins, Watch} from 'vue-property-decorator';
import InvoiceOrderStatusAutocomplete from "@/components/resources-autocomplete/InvoiceOrderStatusAutocomplete.vue";
import {
  Tooltip,
  Timeline,
  TimelineItem,
  Card
} from 'element-ui';
import Order from "@/intefaces/Order";
@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Timeline.name]: Timeline,
    [TimelineItem.name]: TimelineItem,
    [Card.name]: Card,
    InvoiceOrderStatusAutocomplete,
  }
})

export default class InvoiceStatusDetails extends Vue {
  @Prop({type: Boolean, default: false})
    isActive!: Boolean;

  @Prop() currentInvoice!: any;

  @Prop({
    type: Object,
    default: function () {
      return {remarks: '', status: ''};
    }
  })
  form!: {
    remarks: string;
    status: string;
  };

  save() {
    this.$http.post(this.$api(`/invoices/${this.currentInvoice.id}/statuses`), this.form).then(response => {
      this.$emit('updatedStatus', response.data.invoice);
      this.$emit('update:isActive', false);
    })
  }

  close(): void {
    this.$emit('update:isActive', false);
  }
}
</script>
