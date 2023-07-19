<template>
  <modal :show="showBulkDepartmentsModal" @close="close">
    <template slot="header">
      <h5 class="modal-title">Add Bulk Departments</h5>
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
        <h5 class="text-danger" v-for="(error, index) in errorBag" :key="index">{{ error }}</h5>
      </li>
    </ul>
    <template slot="footer">
      <section v-if="$user.id == 1"><input type="checkbox" v-model="update" /> Update?</section>
      <base-button type="secondary" @click="close">Close</base-button>
      <base-button :loading="btnDisabled" :disabled="btnDisabled" type="success" @click.prevent="_import">Import</base-button>
    </template>
  </modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import FileInput from '@/components/argon-core/Inputs/FileInput.vue';
import { AxiosError, AxiosResponse } from 'axios';

@Component({
  name: 'CreateBulkDepartments',
  components: {
    FileInput,
  },
})
export default class CreateBulkDepartments extends Vue {
  private btnDisabled: boolean = false;
  private update: boolean = false;
  private csvFile: Blob | string = '';
  private errors: Array<string> = [];

  @Prop() showBulkDepartmentsModal!: boolean;

  close() {
    this.errors = [];
    this.$emit('update:showBulkDepartmentsModal', false);
  }

  _import() {
    this.btnDisabled = true;
    let form = new FormData();
    form.append('departments', this.csvFile);
    if (this.update) {
      form.append('_method', 'patch');
    }
    this.$http
      .post(this.$api('/import-departments'), form)
      .then((response: AxiosResponse) => {
        this.$notify({
          title: 'Success',
          message: response.data.message,
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success',
        });
        this.btnDisabled = false;
        this.errors = [];
        this.$emit('update:showBulkDepartmentsModal', false);
        //@ts-ignore
        this.$parent.fetchDepartments();
      })
      .catch((err: AxiosError) => {
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
