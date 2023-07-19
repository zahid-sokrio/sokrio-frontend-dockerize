<template>
    <div v-if="visible" style="display: flex; justify-content: flex-end">
      <base-button v-if="rejected" type="danger" size="sm" icon @click="confirmationForStatusChange = true,
        status='rejected'" v-can="statusPermission">
          <span class="btn-inner--icon">
            <i class="fas fa-ban"></i>
          </span>
        <span class="btn-inner--text">Reject</span>
      </base-button>
      <base-button v-if="makeInvoice" :type="autoApprove ? 'success' : 'default'" size="sm" icon @click="confirmationForStatusChange = (autoApprove ? true : false),
      status='accepted'" v-can="statusPermission">
          <span class="btn-inner--icon">
            <i class="fas fa-check"></i>
          </span>
        <span class="btn-inner--text">Make Invoice</span>
      </base-button>
      <base-button v-if="cancel" type="danger" size="sm" icon @click="confirmationForStatusChange = true,
      status='cancelled'" v-can="statusPermission">
          <span class="btn-inner--icon">
            <i class="fas fa-minus-circle"></i>
          </span>
        <span class="btn-inner--text">Cancel</span>
      </base-button>
      <base-button v-if="readyToDispatch" type="success" size="sm" icon @click="confirmationForStatusChange = true,
      status='readyToDispatch'" v-can="statusPermission">
          <span class="btn-inner--icon">
            <i class="fas fa-people-carry"></i>
          </span>
        <span class="btn-inner--text">Ready To Dispatch</span>
      </base-button>
      <base-button v-if="readyToDelivery" type="success" size="sm" icon @click="status='ontheway', confirmationForStatusChange = true"
                   v-can="statusPermission">
          <span class="btn-inner--icon">
            <i class="fas fa-route"></i>
          </span>
        <span class="btn-inner--text">On The Way</span>
      </base-button>
      <base-button v-if="deliveryReject" type="danger" size="sm" icon @click="confirmationForStatusChange = true,
      status='deliveryRejected'" v-can="statusPermission">
          <span class="btn-inner--icon">
            <i class="fas fa-minus-circle"></i>
          </span>
        <span class="btn-inner--text">Delivery Reject</span>
      </base-button>
      <base-button v-if="rollBackToInvoice" type="info" size="sm" icon @click="status='accepted',
      confirmationForStatusChange = true, rollBackFlag = true" v-can="statusPermission">
          <span class="btn-inner--icon">
            <i class="fas fa-edit"></i>
          </span>
        <span class="btn-inner--text">Edit</span>
      </base-button>
      <base-button v-if="edit && status != 'edit'" type="info" size="sm" icon @click="status='edit', changeStatus()">
          <span class="btn-inner--icon">
            <i class="fas fa-edit"></i>
          </span>
        <span class="btn-inner--text">Edit</span>
      </base-button>
      <base-button v-if="status == 'edit'" type="primary" size="sm" icon :disabled="disabledSaveBtn" @click="editOrder()">
          <span class="btn-inner--icon">
            <i class="fas fa-save"></i>
          </span>
        <span class="btn-inner--text">Save</span>
      </base-button>
      <base-button v-if="status == 'edit'" type="info" @click="status = '', $emit('editOrder', false)" class="m-1">Back</base-button>
      <!--      </div>-->
      <modal :show.sync="confirmationForStatusChange">
        <template slot="header">
          <h5 class="modal-title" id="exampleModalLabel">{{
              rollBackFlag ?
                'For edit this invoice, roll back to accepted status' :
                'Are you sure, you want to continue this action ?'
            }} </h5>
        </template>
        <div>
          <base-input label="Remarks (Optional)">
            <textarea class="form-control" rows="3" v-model="remark"></textarea>
          </base-input>
        </div>
        <template slot="footer">
          <base-button type="secondary" @click="confirmationForStatusChange = false, formReset()">Close</base-button>
          <base-button type="primary" @click="confirmationForStatusChange= false, changeStatus()">Confirm</base-button>
        </template>
      </modal>
    </div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {Dialog} from "element-ui";

@Component({
  components: {
    [Dialog.name]: Dialog,
  }
})

export default class OrderStatusButton extends Vue {
  @Prop({default: false}) rejected!: boolean;
  @Prop() makeInvoice!: boolean;
  @Prop() edit!: boolean;
  @Prop() visible!: boolean;
  @Prop() cancel!: boolean;
  @Prop() readyToDispatch!: boolean;
  @Prop() readyToDelivery!: boolean;
  @Prop() rollBackToInvoice!: boolean;
  @Prop() deliveryReject!: boolean;
  @Prop() deliveryBtn!: boolean;
  @Prop() entityId!: number;
  @Prop() disabledSaveBtn!: boolean;
  @Prop() entity!: string;
  @Prop() editPermission!: string;
  @Prop() statusPermission!: string;
  private rollBackFlag: boolean = false;
  private confirmationForStatusChange: boolean = false;
  private status: string = '';
  private remark: string = '';
  public autoApprove: boolean = JSON.parse(localStorage.settings).order_approval;

  formReset() {
    this.status = '';
    this.remark = '';
    this.rollBackFlag = false;
  }

  changeStatus() {
    if (this.status == 'edit') {
      this.$emit('editOrder', true);
    } else {
      this.$http.post(this.$api(`/${this.entity}/${this.entityId}/statuses`), {'status': this.status, 'remarks': this.remark})
        .then(response => {
          this.$notify({
            title: 'Success',
            message: 'Successfully Changed',
            duration: 5000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
          this.$emit('updateStatus', response.data);
          location.reload();
        });
      this.formReset();
    }
  }

  editOrder() {
    this.$emit('triggerSaveBtn');
    this.status = '';
  }
}
</script>
