<template>
    <div>
        <validation-observer ref="formValidator" v-slot="{ handleSubmit }">
            <modal :show="showModal" v-if="showModal" size="lg" @close="close" class="modal-dialog-scrollable">
                <template slot="header">
                    <h5 class="modal-title">Add Target</h5>
                    <div class="col-sm-4 offset-3">
                        <base-button :loading="downloading" class="btn-sm" type="primary" @click.prevent="onClickDownload">
                            <i class="fa fa-download"></i> Download Bulk Format
                        </base-button>
                    </div>
                </template>
                <div class="row">
                    <div class="col-md-4">
                        <base-input :rules="{ required: true }" label="Month" name="month">
                            <el-date-picker v-model="form.month" type="month" placeholder="Pick a month" clearable
                                format="MMMM, yyyy" value-format="yyyy-MM-dd"></el-date-picker>
                        </base-input>
                    </div>
                    <div class="col-md-4">
                        <base-input :rules="{ required: true }" label="Select Value Type" name="Select Value Type">
                            <el-select v-model="form.value_type" filterable placeholder="Select type" style="border: none">
                                <el-option v-for="(type, index) in types" :key="index" :label="type.name"
                                    :value="type.value"></el-option>
                            </el-select>
                        </base-input>
                    </div>
                    <div class="col-md-4">
                        <base-input label="Select a CSV file:" name="Select a CSV file:">
                            <file-input @change="filesChange" accept=".csv"></file-input>
                        </base-input>
                    </div>
                </div>
                <template slot="footer">
                    <base-button type="primary" :loading="disableUpdateBtn"
                        @click="handleSubmit(update)">Update</base-button>
                    <base-button type="secondary" @click="close">Close</base-button>
                    <base-button type="success" :loading="disableSaveBtn" @click="handleSubmit(save)">Upload</base-button>
                </template>
            </modal>
        </validation-observer>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
    Vue,
    Watch
} from 'vue-property-decorator';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
// @ts-ignore
import FileInput from '@/components/argon-core/Inputs/FileInput.vue';
import {
    DatePicker
} from 'element-ui';

Vue.use(DatePicker);

@Component({
    components: {
        FileInput
    },
    name: 'TargetInfo'
})

export default class TargetInfo extends Mixins(TaxonomyMixin) {
    @Prop() showModal!: boolean;
    @Prop() types!: Object;
    public downloading: boolean = false;
    public disableSaveBtn = false;
    public disableUpdateBtn = false;
    private csvFile: Blob | string = '';
    public form: any = {};
    created() {
        this.showModal = false;
    }
    sortItems(arr: []) {
        return arr.sort((a: any, b: any) => (a.id > b.id ? 1 : -1));
    }
    filesChange(files: FileList) {
        this.csvFile = files[0];
    }
    close() {
        this.form = {};
        this.$emit('update:showModal', false);
    }
    async onClickDownload() {
        this.downloading = true;
        try {
            let {
                data,
                headers
            } = await this.$http.get(this.$api3('/target-bulk-export'), {
                responseType: 'arraybuffer'
            });
            const blob = await new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const link = document.createElement('a');
            link.href = await URL.createObjectURL(blob);
            link.download = this.$getFileNameFromContentDisposition(headers);
            link.click();
        } catch (e) {
            this.$notify({
                title: 'Something wants wrong!',
                type: 'warning',
                message: 'Unable to download reports.'
            });
        } finally {
            this.downloading = false;
        }
    }
    save() {
        this.disableUpdateBtn ? '' : this.disableSaveBtn = true;
        let form = new FormData();
        form.append('file', this.csvFile);
        form.append('month', this.form.month);
        form.append('value_type', this.form.value_type);
        this.$http
            .post(this.$api3(`/targets`), form)
            .then(response => {
                this.$notify({
                    title: 'Success',
                    message: 'Successfully Uploaded',
                    duration: 3000,
                    iconClass: 'ni ni-bell-55',
                    type: 'success'
                });
                this.form = {};
                this.$emit('update:showModal', false);
                this.$emit('targetFetch', true);
            })
            .catch(error => {
                (this.$refs.formValidator as Vue & {
                    setErrors: (errors: []) => any;
                }).setErrors(error.response.data.errors);
                const formError = error.response.data.errors;
                if (Array.isArray(formError)) {
                    formError.slice(0, 10).forEach((element: any) => {
                        this.$notify({
                            title: 'Something wants wrong!',
                            type: 'warning',
                            message: element[0],
                            duration: 3000,
                            iconClass: 'ni ni-bell-55',
                        });
                    });
                }
            });
        this.disableSaveBtn = false;
    }
    update() {
        this.disableUpdateBtn = true;
        this.save();
        this.disableUpdateBtn = false;
    }
}
</script>

<style scoped>
.invalid-feedback {
    display: none;
}

.alignContent {
    display: flex;
    justify-content: space-around;
    align-items: center;
}</style>