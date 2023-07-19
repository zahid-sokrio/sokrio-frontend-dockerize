<template>
    <validation-observer v-slot="{handleSubmit}" ref="formValidator">
        <modal :show="isUpdate" @close="close">
            <template slot="header">
                <h5
                        class="modal-title"
                        id="exampleModalLabel"
                >Update Outlet Item</h5>
            </template>
            <div>
                <h3 class="mb-3" v-if="currentAuditableOutlet.auditable_type == 'product'">{{currentAuditableOutlet.auditable.name}} Displays at {{currentAuditableOutlet.outlet.name}}</h3>
                <h3 class="mb-3" v-if="currentAuditableOutlet.auditable_type == 'asset' || currentAuditableOutlet.auditable_type == 'campaign'">{{currentAuditableOutlet.outlet.name}} contains {{currentAuditableOutlet.auditable.name}}</h3>

                <base-input type="number" v-model="formUpdate.qty" prepend-icon="fas fa-sort-amount-up" label="Qty" name="qty"></base-input>
                <base-input label="Provided On" prepend-icon="ni ni-calendar-grid-58" name="provided_at">
                    <flat-picker slot-scope="{focus, blur}"
                                 @on-open="focus"
                                 @on-close="blur"
                                 :config="{allowInput: true}"
                                 class="form-control datepicker"
                                 v-model="formUpdate.prodivedAt">
                    </flat-picker>
                </base-input>
                <base-input label="Expires On" prepend-icon="ni ni-calendar-grid-58" name="expires_at">
                    <flat-picker slot-scope="{focus, blur}"
                                 @on-open="focus"
                                 @on-close="blur"
                                 :config="{allowInput: true}"
                                 class="form-control datepicker"
                                 v-model="formUpdate.expiresAt">
                    </flat-picker>
                </base-input>
            </div>
            <template slot="footer">
                <base-button type="secondary" @click="close">Close</base-button>
                <base-button type="success" @click="handleSubmit(updateAssignAsset)" :disabled="disableBtn">Save</base-button>
            </template>
        </modal>
    </validation-observer>
</template>
<script lang="ts">
    import { Component, Prop, Vue} from 'vue-property-decorator';
    import AssignAsset from "@/intefaces/AssignAsset";
    const flatPicker =require("vue-flatpickr-component");
    import "flatpickr/dist/flatpickr.css";

    @Component({
        name: 'AuditableOutletUpdateForm.vue',
        components: {
            flatPicker,
        }
    })
    export default class AuditableOutletUpdateForm extends Vue{
        @Prop() isUpdate!: boolean;
        @Prop() currentAuditableOutlet!: any;
        @Prop() formUpdate!: {
            auditable: number | null,
            prodivedAt: string,
            expiresAt: string,
            qty: number | null
        }
        @Prop() outlets!: any;
        private disableBtn = false;

        updateAssignAsset(){
            this.disableBtn = true;
            this.$http.patch(this.$api(`/outlet-auditables/${this.currentAuditableOutlet.id}`), {
                auditable_id: this.currentAuditableOutlet.auditable_id,
                department_id: this.currentAuditableOutlet.department_id,
                provided_at: this.formUpdate.prodivedAt,
                expires_at: this.formUpdate.expiresAt,
                auditable_type: this.currentAuditableOutlet.auditable_type,
                qty: this.formUpdate.qty
            })
            .then(response => {
                this.disableBtn = false;
                this.$notify({
                    title: 'Success',
                    message: 'Successfully Updated',
                    duration: 3000,
                    iconClass: 'ni ni-bell-55',
                    type: 'success'
                });
                this.$emit('updated', response.data.outletAuditable);
                this.formUpdate.prodivedAt = '';
                this.formUpdate.expiresAt = '';
            })
            .catch(error => {
                this.disableBtn = false;
                (this.$refs.formValidator as Vue & {
                    setErrors: (errors: []) => any;
                }).setErrors(error.response.data.errors);
            });
        }

        close(){
            this.$emit('update:isUpdate', false);
        }
    }
</script>
