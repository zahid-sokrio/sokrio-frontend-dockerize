<template>
    <modal @focus="btnDisabled" :show="showBulkUsersModal" @close="close">
      <template slot="header">
        <h5 class="modal-title"> Add Bulk Users</h5>
      </template>
      <!-- File browser -->
      <div class="card">
        <!-- Card header -->
        <div class="card-header">
          <h3 class="mb-0">Select a CSV file:</h3>
        </div>
        <!-- Card body -->
        <div class="card-body">
          <form>
            <file-input @change="filesChange"></file-input>
          </form>
        </div>
      </div>
      <ul>
        <li class="text-danger" v-for="(errorBag, index) in errors" :key="index">
          <h5 class="text-danger" v-for="(error, index) in errorBag" :key="index"> {{ error }} </h5>
        </li>
      </ul>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button :loading="btnDisabled" :disabled="btnDisabled" type="success" @click.prevent="_import">Import
        </base-button>
      </template>
    </modal>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import FileInput from '@/components/argon-core/Inputs/FileInput.vue'
import {AxiosError, AxiosResponse} from "axios";

@Component({
  name: 'CreateBulkUsers',
  components: {
    FileInput
  }
})
export default class CreateBulkUsers extends Vue {
  private btnDisabled: boolean = false;
  private csvFile: Blob|string = '';
  private errors: Array<string> = [];

  @Prop() showBulkUsersModal!: boolean;

  close() {
    this.errors = [];
    this.$emit('update:showBulkUsersModal', false);
  }

  _import() {
    this.btnDisabled = true;
    let form = new FormData();
    form.append('users', this.csvFile);
    this.$http.post(this.$api('/import-users'), form)
      .then((response: AxiosResponse) => {
        this.$notify({
          title: 'Success',
          message: response.data.message,
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.btnDisabled = false;
        this.errors = [];
        this.$emit('update:showBulkUsersModal', false);
        //@ts-ignore
        this.$parent.fetchUser();
      }).catch((err: AxiosError) => {
        this.errors = err.response?.data.errors;
        this.btnDisabled = false;
    });
  }

  filesChange(files: FileList) {
    this.csvFile = files[0];
  }
}
</script>

<style scoped>

</style>
