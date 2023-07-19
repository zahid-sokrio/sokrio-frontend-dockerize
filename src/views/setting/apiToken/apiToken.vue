<template>
<div class="card">
    <div class="card-header border-0">
        <div class="row">
            <div class="col-6">
                <div class="form-inline">
                    <h3 class="mb-0">API Token</h3>
                    <el-tooltip class="ml-3" content="Manged API Token" placement="right">
                        <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
                    </el-tooltip>
                </div>
            </div>
        </div>
    </div>
    <div class="card-body">
        <div class="px-3 py-3"></div>
        <div class="list-group list-group-flush">
            <div class="list-group-item">
                <div class="row">
                    <div class="col-6">
                        <div class="mt-5">
                            <base-button @click="generateNew" type="success" class="mx-4">Generate New</base-button>
                            <el-tag v-if="token != null" type="success" v-clipboard:copy="token" v-clipboard:success="onCopy">{{ token }}</el-tag> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue,
    Watch
} from 'vue-property-decorator';
import VueClipboard from 'vue-clipboard2';
import {
    Tag
} from 'element-ui';
Vue.use(VueClipboard);
@Component({
    components: {
        'el-tag': Tag
    }
})
export default class apiToken extends Vue {
    public token: any = null;
    private isNew: boolean = false;

    mounted() {
        this.fetchToken();
    }

    fetchToken() {
        this.$http.get(this.$api3(`/api-token?isnew=${this.isNew}`)).then(response => {
            this.token = response.data.bearerToken;
            if (this.isNew == true) {
                this.$notify({
                    message: 'API token successfully regenerated!',
                    title: 'Success',
                    type: 'success'
                });
            }
        });
    }

    async generateNew() {
        this.isNew = true;
        this.fetchToken();
    }
 
    onCopy() {
        this.$notify({
            message: 'Copied',
            title: 'Success',
            type: 'success'
        }); 
    }
}
</script>
<style scoped>
.el-tag{
    cursor: pointer;
}
</style>
