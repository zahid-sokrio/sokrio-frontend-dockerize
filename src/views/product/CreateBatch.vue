<template>
    <validation-observer ref="formValidator" v-slot="{handleSubmit}">
        <modal :show="isActive" @close="close" size="sm">
                <template slot="header">
                    <h5 class="modal-title"
                        id="exampleModalLabel"> Add Batch</h5>
                </template>
                <div>
                    <base-input label="Name" name="name" type="text" v-model="form.name"></base-input>
                </div>
                <template slot="footer">
                    <base-button type="secondary" @click="close">Close</base-button>
                    <base-button @click="handleSubmit(save)" :loading="loading" :disabled="disableButton">Save</base-button>
                </template>
            </modal>
    </validation-observer>
</template>
<script lang="ts">
    import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator';
    import Batch from "../../intefaces/Batch";
    import {Dropdown, DropdownItem, DropdownMenu} from "element-ui";
    import BaseCUModalComponent from "../../mixins/BaseCUModalComponent";
    import Productable from "@/intefaces/Productable";
    import {AxiosResponse} from "axios";

    @Component({
        [Dropdown.name]: Dropdown,
        [DropdownItem.name]: DropdownItem,
        [DropdownMenu.name]: DropdownMenu,
        components: {}
    })

    export default class createBatch extends Vue{
        @Prop({
            default: () => ({
                name: '',
            })
        })
        form!: {
            name: string;
        };
        @Prop() isActive!: boolean;

        @Prop({ required: false, default: null }) currentEntity!: Productable;
        private disableButton = false;
        private loading = false;

        formReset(): any {
            this.form.name = ''
        }

        save(){
            this.loading = true;
            this.disableButton = true;
             this.$http.post(this.$api('/batches'), this.form)
                .then(response => {
                    this.$emit('created', response.data.batch);
                    this.$notify({
                        title: 'Success',
                        message: 'Successfully Created',
                        duration: 3000,
                        iconClass: 'ni ni-bell-55',
                        type: 'success'
                    });
                    this.formReset();
                    this.loading = false;
                    this.disableButton = false;
                })
                 .catch(error => {
                     this.loading = false;
                     this.disableButton = false;
                     (this.$refs.formValidator as Vue & {
                         setErrors: (errors: []) => any;
                     }).setErrors(error.response.data.errors);
                 });
        }

        close(){
            this.$parent.$emit('update:isActive', false);
            this.$emit('update:isActive', false);
            this.$emit('update:form', {name: ''});
        }
    }
</script>
