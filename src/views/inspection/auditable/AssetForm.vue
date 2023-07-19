<template>
    <validation-observer v-slot="{handleSubmit}" ref="formValidator">
        <modal :show="isActive" v-if="isActive" @close="close">
            <template slot="header">
                <h5
                        class="modal-title"
                        id="exampleModalLabel"
                >{{isUpdate ? 'Update' : 'Add New'}} Asset</h5>
            </template>
            <div class="col-md-12">
                <base-input prepend-icon="ni ni-box-2" v-model="form.name" label="Name" name="name" placeholder="e.g. Fridge"></base-input>
                <base-input prepend-icon="fas fa-sort-amount-up" type="number" v-model="form.qty" label="Quantity" name="qty"></base-input>
            </div>
            <template slot="footer">
                <base-button type="secondary" @click="close">Close</base-button>
                <base-button type="success" @click="handleSubmit(save)" :loading="loading">Save</base-button>
            </template>
        </modal>
    </validation-observer>
</template>
<script lang="ts">
    import {Component, Mixins, Prop, Vue} from 'vue-property-decorator';
    import Asset from "@/intefaces/Asset";
    import BaseCUModalComponentMixin from "@/mixins/BaseCUModalComponent";
    import {AxiosResponse} from "axios";

    @Component({
        name: 'AssetForm'
    })
    export default class AssetForm extends Mixins(BaseCUModalComponentMixin){
        @Prop() currentEntity!: Asset;
        @Prop({
            default: () => ({
                name: '',
                qty: 0
            })
        })
        form!: {
            name: string,
            qty: number
        }

        formReset(): any {
            this.form.name = '';
            this.form.qty = 0;
            return this.form;
        }

        get createApi(): string
        {
            return '/assets'
        }

        async afterCreate(response: AxiosResponse<any>): Promise<void> {
            this.$emit('created', response.data.asset);
        }

        get updateApi(): string {
            return `/assets/${this.currentEntity.id}`
        }

        afterUpdate(response: AxiosResponse<any>): void {
            this.$emit('updated', response.data.asset);
        }
    }
</script>
