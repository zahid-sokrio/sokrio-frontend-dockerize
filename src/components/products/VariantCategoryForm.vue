<template>
    <validation-observer v-slot="{handleSubmit}" ref="formValidator">
        <modal :show="isActive" @close="close">
            <template slot="header">
                <h5 class="modal-title"> {{isUpdate ? 'Update' : 'Add New'}} Variants</h5>
            </template>
            <div>
                <base-input
                        name="name"
                        label="Name"
                        v-model="form.name"
                        placeholder="e.g Color"
                        prepend-icon="fas fa-list-alt"
                ></base-input>
            </div>
            <template slot="footer">
                <base-button type="secondary" @click="close"> Close </base-button>
                <base-button type="success" @click="handleSubmit(save)" :loading="loading">Save</base-button>
            </template>
        </modal>
    </validation-observer>

</template>
<script lang="ts">
    import {Component, Mixins, Prop, Vue} from 'vue-property-decorator';
    import Variant from "@/intefaces/VariantCategory";
    import BaseCUModalComponentMixin from "@/mixins/BaseCUModalComponent";
    import {AxiosResponse} from "axios";

    @Component({
        name: 'VariantCategoryForm'
    })

    export default class VariantCategoryForm extends Mixins(BaseCUModalComponentMixin){
        @Prop({
            default: () => ({
                name: ''
            })
        })
        form !: {name: string}
        @Prop() currentEntity! : Variant;

        formReset(): any {
            this.form.name = '';
            return this.form;
        }

        get createApi(): string
        {
            return '/variant-categories'
        }

        async afterCreate(response: AxiosResponse<any>): Promise<void> {
            this.$emit('created', response.data.variantCategory);
        }

        get updateApi(): string {
            return `/variant-categories/${this.currentEntity.id}`
        }

        afterUpdate(response: AxiosResponse<any>): void {
            this.$emit('updated', response.data.variantCategory);
        }
    }
</script>
