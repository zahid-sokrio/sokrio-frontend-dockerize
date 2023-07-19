<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <base-input :rules="{ required: true }" label="Central Warehouse Address" class="mb-3" name="address">
          <textarea class="form-control" rows="4" v-model="form.address" placeholder="e.g. Shap-21, 131/1, BCC Road, Dhaka"></textarea>
        </base-input>
      </div>
    </div>
  </validation-observer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import CreateDepartmentForm from '@/views/department/CreateDepartmentForm.vue';
import Department from '@/intefaces/Department';
import store from '@/store';
import User from '@/intefaces/User';
@Component({
  components: { CreateDepartmentForm }
})
export default class SetupWarehouse extends Vue {
  private showDeleteModal: boolean = false;
  private isUpdate: boolean = false;
  private isActive: boolean = false;
  private form: any = {
    supplier: null,
    supplier_id: null,
    address: '',
    created_by: null,
    lat: null,
    long: null,
    owner_name: '',
    phone_no: '',
    photo: '',
    photo_url: '',
    name: '',
    code: '',
    department_type_id: null,
    territory_id: null,
    territory: null,
    credit_limit: 0,
    outstanding_balance: 0,
    badge_id: null
  };

  // Lifecycle hooks +++
  async mounted() {
    let domain = await this.$store.getters['Auth/getDomain'];
    let user: User = await this.$store.getters['Auth/user'];
    this.form.name = domain.charAt(0).toUpperCase() + domain.slice(1) + ' central warehouse';
    this.form.code = `${domain}-warehouse-1`;
    this.form.badge_id = null;
    this.form.owner_name = user.name;
    this.form.phone_no = user.phone || null;
    this.form.department_type_id = 1;
    this.form.territory_id = 1;
    this.$emit('department', this.form);
  }
  // Lifecycle hooks ---

  // Watcher +++
  @Watch('form', { deep: true })
  onChangeDepartment() {
    this.$emit('department', this.form);
  }
  // Watcher ---

  close() {
    this.isActive = false;
    this.isUpdate = false;
    this.formReset();
  }
  formReset(): any {
    this.form.address = '';
    this.form.created_by = null;
    this.form.lat = null;
    this.form.long = null;
    this.form.owner_name = '';
    this.form.phone_no = '';
    this.form.photo = '';
    this.form.photo_url = '';
    this.form.name = '';
    this.form.code = '';
    this.form.department_type_id = null;
    this.form.territory_id = null;
    this.form.territory = null;
    this.form.credit_limit = null;
    this.form.outstanding_balance = null;
    this.form.badge_id = null;
    return this.form;
  }
}
</script>

<style scoped></style>
