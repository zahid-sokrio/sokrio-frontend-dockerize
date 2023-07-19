<template>
    <validation-observer v-slot="{handleSubmit}" ref="formValidator">
        <modal :show="isActive" @close="close">
            <template slot="header">
                <h5 class="modal-title"> {{isUpdate ? 'Update' : 'Add New'}} Units</h5>
            </template>
            <div>
                <base-input
                        name="name"
                        label="Name"
                        v-model="form.name"
                        placeholder="e.g Carton"
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
    import Unit from "@/intefaces/Unit";
    import BaseCUModalComponentMixin from "@/mixins/BaseCUModalComponent";
    import {AxiosResponse} from "axios";

    @Component({
        name: 'UnitForm'
    })

    export default class UnitForm extends Mixins(BaseCUModalComponentMixin){
        @Prop({
            default: () => ({
                name: ''
            })
        })
        form !: {name: string}
        @Prop() currentEntity! : Unit;

        formReset(): any {
            this.form.name = '';
            return this.form;
        }

        get createApi(): string
        {
            return '/units'
        }

        async afterCreate(response: AxiosResponse<any>): Promise<void> {
            this.$emit('created', response.data.unit);
        }

        get updateApi(): string {
            return `/units/${this.currentEntity.id}`
        }

        afterUpdate(response: AxiosResponse<any>): void {
            this.$emit('updated', response.data.unit);
        }
    }
</script>
