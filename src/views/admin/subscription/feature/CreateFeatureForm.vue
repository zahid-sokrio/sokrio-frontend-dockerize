<template>
    <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <modal :show="isActive" @close="close">
            <template slot="header">
                <h5
                        class="modal-title"
                        id="exampleModalLabel"
                > {{isUpdate ? 'Update' : 'Add New'}} Feature</h5>
            </template>
            <div>
                <base-input name="title" v-model="form.title" label="Title" placeholder="e.g. Employee Tracking"></base-input>
            </div>
            <template slot="footer">
                <base-button type="secondary" @click="close">Close</base-button>
                <base-button type="success" :loading="loading" @click="handleSubmit(save)">Save </base-button>
            </template>
        </modal>
    </validation-observer>
</template>
<script lang="ts">
    import { Vue, Component, Prop, Mixins } from 'vue-property-decorator';
    import BaseCUModalComponent from '@/mixins/BaseCUModalComponent';
    import { AxiosResponse } from 'axios';
    import Feature from "@/intefaces/Feature";

    @Component({
        components: {}
    })
    export default class CreateFeatureForm extends Mixins(BaseCUModalComponent){
        @Prop()
        currentEntity!:Feature;

        @Prop({default: () => ({ title: ''}) })
        form!: {
            title: string;
        }

        formReset(): any {
            this.form.title = ''
            return this.form;
        }

        async afterCreate(response: AxiosResponse<any>): Promise<void> {
            this.$emit('created', response.data.feature);
        }

        afterUpdate(response: AxiosResponse<any>): void {
            this.$emit('updated', response.data.feature)
        }

        landlordCheck(): boolean {
            return true;
        }

        get createApi(): string {
            return '/features';
        }

        get updateApi(): string{
            return `/features/${this.currentEntity.id}`;
        }
    }
</script>
