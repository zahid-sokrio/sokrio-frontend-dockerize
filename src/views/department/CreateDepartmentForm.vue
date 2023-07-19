<template>
  <validation-observer v-if="isActive" v-slot="{ handleSubmit }" ref="formValidator">
    <modal size="lg" class="modal-dialog-scrollable" :show="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">
          {{ isUpdate ? 'Update' : 'Add New' }}
          {{ getTaxonomy('department') }}
          <badge v-if="isOutlet || isSelfManaged" type="info">{{ isOutlet ? 'Outlet' : 'Self Managed' }}</badge>
        </h5>
      </template>
      <el-row :gutter="15">
        <el-col :span="12">
          <base-input
            name="Department Name"
            :rules="{ required: true }"
            v-model="form.name"
            prepend-icon="fa fa-building"
            :label="getTaxonomy('department') + ' Name'"
            placeholder="e.g. H&J Gift Shop"
          ></base-input>
        </el-col>
        <el-col :span="12">
          <base-input
            prepend-icon="ni ni-ruler-pencil"
            :rules="{ required: true }"
            name="Code"
            v-model="form.code"
            :label="getTaxonomy('department') + ' Code'"
            placeholder="e.g. h&j_gift_shop-001"
          ></base-input>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <base-input
            label="Owner Name"
            class="mb-3"
            name="owner name"
            :rules="{ required: true }"
            prepend-icon="ni ni-circle-08"
            placeholder="e.g. John Doe"
            v-model="form.owner_name"
          ></base-input>
        </el-col>
        <el-col :span="12">
          <base-input
            label="Owner Phone"
            class="mb-3"
            name="owner phone"
            prepend-icon="fa fa-phone"
            :rules="{ required: true, regex: /^[0-9]+$/ }"
            placeholder="e.g. 0123456789"
            v-model="form.phone_no"
          ></base-input>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <DepartmentTypeAutocomplete
            :rules="{ required: true }"
            name="department_type_id"
            placeholder="Select"
            label="Channel"
            :create-button="true"
            v-model="form.department_type_id"
            end-point="department-types?except_id=1"
            @change="onChangeDepartmentType($event)"
            @hasOutlet="isOutlet = $event"
            @isSelfManaged="isSelfManaged = $event"
          ></DepartmentTypeAutocomplete>
        </el-col>
        <el-col :span="12">
          <BadgeAutocomplete :label="'Badge (Optional)'" v-model="form.badge_id"></BadgeAutocomplete>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <TerritoryAutocomplete
            :create-button="true"
            name="Territory"
            label="Territory"
            :add-button="true"
            :end-point="isOutlet ? 'territories?has_outlet=1' : 'territories?has_outlet=0'"
            placeholder="Search . . . "
            :rules="{ required: true }"
            :value="
              isUpdate && form.territory
                ? form.territory.id == form.territory_id
                  ? `${form.territory.name} | ${form.territory.code}`
                  : form.territory_id
                : form.territory_id
            "
            @input="form.territory_id = $event"
          ></TerritoryAutocomplete>
        </el-col>
        <el-tooltip v-if="!enableSupplierUpdate && isUpdate" :disabled="!!form.territory_id"
                    content="Please select a territory first."
                    placement="top">
          <el-col :span="12">
            <div class="row">
              <div class="col-10">
                <base-input
                  alternative
                  label="Supplier"
                  placeholder="Supplier Name"
                  input-classes="form-control-alternative"
                  v-model="supplierName"
                  :disabled="!enableSupplierUpdate"
                />
              </div>
              <div class="col-2 d-flex justify-content-center">
                <el-button @click="enableSupplierUpdate = true" size="mini" type="text" icon="el-icon-edit-outline"
                           circle></el-button>
              </div>
            </div>
          </el-col>
        </el-tooltip>
        <el-tooltip v-else :disabled="!!form.territory_id" content="Please select a territory first." placement="top">
          <el-col :span="12">
            <DepartmentLazydropdown
              :disabled="!form.territory_id"
              name="Supplier"
              label="Supplier"
              placeholder="Search Supplier. . . "
              :rules="{ required: true }"
              v-model="form.supplier_id"
              :end-point="`departments?has_outlet=0${isUpdate ? '&except_id=' + currentEntity.id : ''}`"
            ></DepartmentLazydropdown>
          </el-col>
        </el-tooltip>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <MemberAutocomplete
            :create-button="false"
            :multiple="true"
            label="Staff"
            placeholder="Search . . . "
            name="staff"
            v-model="form.staffs"
            @remove-tag="onRemoveStaff"
          >
          </MemberAutocomplete>
          <!-- :value="isUpdate && fieldForceId ? fieldForceId == fieldForceId : fieldForceId"
            @input="fieldForceId = $event" -->
        </el-col>
        <el-col :span="12">
          <el-tooltip content="Existing due amount of this department" placement="top">
            <base-input
              name="Outstanding Bal."
              prepend-icon="ni ni-money-coins"
              v-model="form.outstanding_balance"
              :rules="{ regex: /^\d+(\.\d)?\d*$/ }"
              label="Outstanding Balance (Optional)"
              placeholder="e.g. 5000"
            ></base-input>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-tooltip content="Maximum credit amount this department can take" placement="top">
            <base-input
              name="Credit limit"
              prepend-icon="ni ni-money-coins"
              v-model="form.credit_limit"
              :rules="{ regex: /^\d+(\.\d)?\d*$/ }"
              label="Credit Limit (Optional)"
              placeholder="e.g. 5000"
            ></base-input>
          </el-tooltip>
        </el-col>
        <el-col :span="12">
          <base-input
            :rules="{ regex: /^\d+(\.\d)?\d*$/ }"
            label="Latitude (Optional)"
            class="mb-3"
            name="Latitude"
            prepend-icon="fa fa-map"
            placeholder="e.g. 40.785091"
            v-model="form.lat"
          ></base-input>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <base-input
            :rules="{ regex: /^\d+(\.\d)?\d*$/ }"
            label="Longitude (Optional)"
            class="mb-3"
            name="Longitude"
            prepend-icon="fa fa-map"
            placeholder="e.g. -73.968285"
            v-model="form.long"
          ></base-input>
        </el-col>
        <el-col :span="12">
          <base-input label="Visitable">
            <base-switch on-text="Yes" off-text="No" v-model="form.is_visitable"></base-switch>
          </base-input>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="8">
          <base-input label="Date of Birth" clearable prepend-icon="ni ni-calendar-grid-58" name="start_form">
            <flat-picker
              placeholder="Date of Birth"
              slot-scope="{ focus, blur }"
              @on-open="focus"
              @on-close="blur"
              :config="{ allowInput: true }"
              class="form-control datepicker"
              v-model="form.owner_dob"
            >
            </flat-picker>
          </base-input>
        </el-col>
        <el-col :span="8">
          <DepartmentLocationTypeLazyDropdown
            name="Location"
            label="Location (Optional)"
            v-model="form.department_location_type_id"
          ></DepartmentLocationTypeLazyDropdown>
        </el-col>
        <el-col :span="8">
          <div class="row" v-if="classificationName && !enableClassificationUpdate && isUpdate">
            <div class="col-10">
              <base-input
                alternative
                label="Classification (Optional)"
                placeholder="Classification Name"
                input-classes="form-control-alternative"
                v-model="classificationName"
                :disabled="!enableClassificationUpdate"
              />
            </div>
            <div class="col-1 d-flex justify-content-center">
              <el-button @click="enableClassificationUpdate = true" size="mini" type="text" icon="el-icon-edit-outline"
                         circle></el-button>
            </div>
          </div>
          <DepartmentCategoryLazyDropdown
            name="Classification"
            label="Classification (Optional)"
            v-model="form.department_category_id"
            v-else
          ></DepartmentCategoryLazyDropdown>
        </el-col>

      </el-row>
      <div class="row">
        <div class="col-md-6">
          <base-input label="Address (Optional)" class="mb-3" name="address">
            <textarea class="form-control" rows="4" v-model="form.address"
                      placeholder="e.g. Shap-21, 131/1, BCC Road, Dhaka"></textarea>
          </base-input>
        </div>
        <div class="col-md-6">
          <label class="font-weight-600">Image (Optional)</label>
          <single-image-uploader
            uploadText="Photo"
            :img.sync="form.photo"
            image-max-height="100px"
            :img-get-url="isUpdate ? currentEntity.photo_url || '' : ''"
          ></single-image-uploader>
        </div>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close" :disabled="isUpdate && form.staffs == null ? true : false">Close
        </base-button>
        <base-button type="success" :loading="loading" @click="handleSubmit(save)">Save</base-button>
      </template>
    </modal>
  </validation-observer>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Vue, Watch } from 'vue-property-decorator';
import BaseCUModalComponentMixin from '@/mixins/BaseCUModalComponent';
import { AxiosError, AxiosInstance, AxiosResponse, AxiosStatic } from 'axios';
import { Select, Option, Row, Col, Button } from 'element-ui';
import DepartmentTypeAutocomplete from '@/components/resources-autocomplete/DepartmentTypeAutocomplete.vue';
import BadgeAutocomplete from '@/components/resources-autocomplete/BadgeAutocomplete.vue';
import TerritoryAutocomplete from '@/components/resources-autocomplete/TerritoryAutocomplete.vue';
import SingleImageUploader from '@/components/ui/SingleImageUploader.vue';
import Territory from '@/intefaces/Territory';
import MemberAutocomplete from '@/components/resources-autocomplete/MemberAutocomplete.vue';
import RoutePlanAutocomplete from '@/components/resources-autocomplete/RoutePlanAutocomplete.vue';
import LazyDropdown from '@/components/LazyDropdown.vue';
import CreateBadgeForm from '@/views/department/CreateBadgeForm.vue';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import DepartmentCategoryLazyDropdown from "@/components/lazyDropdown/DepartmentCategoryLazyDropdown.vue";
import DepartmentLocationTypeLazyDropdown from "@/components/lazyDropdown/DepartmentLocationTypeLazyDropdown.vue";

const flatPicker = require('vue-flatpickr-component');
@Component({
  components: {
    DepartmentLocationTypeLazyDropdown,
    DepartmentCategoryLazyDropdown,
    DepartmentLazydropdown: () => import('@/components/lazyDropdown/DepartmentLazydropdown.vue'),
    CreateBadgeForm,
    LazyDropdown,
    MemberAutocomplete,
    RoutePlanAutocomplete,
    TerritoryAutocomplete,
    BadgeAutocomplete,
    DepartmentTypeAutocomplete,
    SingleImageUploader,
    [Select.name]: Select,
    [Option.name]: Option,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    flatPicker
  },
})
export default class CreateDepartmentForm extends Mixins(BaseCUModalComponentMixin, TaxonomyMixin) {
  @Prop()
  currentEntity!: any;
  @Prop({
    default: () => ({
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
      badge_id: null,
      supplier_id: null,
      staffs: null,
      route_plan_id: null,
      is_visitable: 1,
      department_category_id: null,
      department_location_type_id: null,
      owner_dob: null
    }),
  })
  form!: {
    address: string;
    created_by: string;
    lat: number | null;
    long: number | null;
    owner_name: string;
    phone_no: string;
    photo: string | Blob;
    photo_url: string;
    name: string;
    code: string;
    department_type_id: number | null;
    territory_id: number | null;
    territory: Territory | null;
    credit_limit: number | null;
    outstanding_balance: number | null;
    badge_id: number | null;
    supplier_id: null;
    staffs: any;
    is_visitable: any;
    department_category_id: null,
    department_location_type_id: null,
    owner_dob: null
  };
  private isOutlet = 0;
  private isSelfManaged = 0;
  private isRemoveStaff: boolean = false;
  private newAddedStaff: string = '';
  private supplierName: string = '';
  private classificationName: string = '';
  private enableSupplierUpdate: boolean = false;
  private enableClassificationUpdate: boolean = false;

  get createApi(): string {
    return '/departments';
  }

  get updateApi(): string {
    return `/departments/${this.currentEntity.id}`;
  }

  @Watch('isUpdate')
  onUpdateCheckOutletTypeDepartment(newVal: boolean) {
    this.isOutlet = 0;
    this.isSelfManaged = 0;
    if (newVal) {
      this.isOutlet = this.currentEntity.department_type.has_outlet;
      this.isSelfManaged = this.currentEntity.department_type.self_managed;
    }
  }

  formData() {
    let extForm = new FormData();
    let visitable: any = this.form.is_visitable ? 1 : 0;
    extForm.set('address', this.form.address);
    extForm.set('created_by', this.form.created_by);
    this.form.lat ? extForm.set('lat', this.form.lat as unknown as string) : '';
    this.form.long ? extForm.set('long', this.form.long as unknown as string) : '';
    extForm.set('owner_name', this.form.owner_name);
    extForm.set('phone_no', this.form.phone_no);
    extForm.set('photo', this.form.photo);
    extForm.set('name', this.form.name);
    extForm.set('code', this.form.code);
    extForm.set('department_type_id', this.form.department_type_id as unknown as string);
    extForm.set('territory_id', this.form.territory_id as unknown as string);
    this.form.credit_limit ? extForm.set('credit_limit', this.form.credit_limit as unknown as string) : '';
    this.form.outstanding_balance ? extForm.set('outstanding_balance', this.form.outstanding_balance as unknown as string) : '';
    this.form.badge_id ? extForm.set('badge_id', this.form.badge_id as unknown as string) : '';
    extForm.set('supplier_id', this.form.supplier_id as unknown as string);
    extForm.set('is_visitable', visitable);
    this.form.department_category_id ? extForm.set('department_category_id', this.form.department_category_id as unknown as string) : '';
    this.form.department_location_type_id ? extForm.set('department_location_type_id',
      this.form.department_location_type_id as unknown as string) : '';
    this.form.owner_dob ? extForm.set('owner_dob', this.form.owner_dob + ' 00:00:00') : '';
    return extForm;
  }

  formReset(): any {
    this.form.address = '';
    this.form.created_by = '';
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
    this.form.supplier_id = null;
    this.isOutlet = 0;
    this.form.staffs = [];
    this.form.department_category_id = null;
    this.form.department_location_type_id = null;
    this.form.owner_dob = null;
    (
      this.$refs.formValidator as Vue & {
        reset: () => any;
      }
    ).reset();
    return this.form;
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    if (this.form.staffs) {
      await this.assignFieldForce(response.data.department.id);
    }
    // this.form.routePlanId ? await this.assignRoutePlan(response.data.department.id) : '';
    let responseDept = await this.$http.get(this.$api(`/departments/${response.data.department.id}`));
    this.$emit('created', responseDept.data.department);
  }

  async afterUpdate(response: AxiosResponse<any>): Promise<void> {
    let responseDept = await this.$http.get(this.$api(`/departments/${response.data.department.id}`));
    this.$emit('updated', responseDept.data.department);
  }

  beforeClose() {
    this.$emit('onCloseSetDepartmentId', null);
  }

  onRemoveStaff(remove: any) {
    if (this.isUpdate) {
      this.isRemoveStaff = true;
      this.$http
        .delete(this.$api(`/users/${this.currentEntity.users ? this.currentEntity.users[0].id : ''}/outlets/${this.currentEntity.id}`))
        .then((response) => {
          this.isRemoveStaff = false;
        });
    }
  }

  @Watch('form.staffs')
  getSelectedStaff(old: any, current: any) {
    if (this.isUpdate && !this.isRemoveStaff && this.currentEntity.users.findIndex((user: any) => user.id == old) == -1) {
      let newStaff = '';
      if (this.form.staffs != '' && current) {
        newStaff = old.filter((item: any) => {
          return current.indexOf(item) === -1;
        });
      }
      if (old.length == 1 && current.length == 0) {
        this.$http.post(this.$api(`/users/${old[0]}/outlets`), {department_id: this.currentEntity.id});
      }
      if ((newStaff != '' && old.includes('0') == false) || old.includes(this.newAddedStaff) == true) {
        this.$http.post(this.$api(`/users/${newStaff != '' ? newStaff[0] : this.newAddedStaff}/outlets`), {department_id: this.currentEntity.id});
        this.newAddedStaff = '';
      }
    }
    if (old.includes(0)) {
      this.form.staffs.splice((staff: any) => staff == 0, 1);
    }
  }

  async assignFieldForce(department_id: number): Promise<void> {
    try {
      this.form.staffs.forEach((staff: number) => {
        this.$http.post(this.$api(`/users/${staff}/outlets`), {department_id});
      });
    } catch (e) {
      // TODO miraj: have to handel the error properly
      (e as AxiosError).request.retry;
    }
  }

  onChangeDepartmentType(event: number) {
    if (this.isSelfManaged) {
      this.form.territory_id = null;
      this.form.supplier_id = null;
    } else if (this.isOutlet) {
      this.form.territory_id = null;
      this.form.supplier_id = null;
      this.form.is_visitable = 1;
    }
    if (this.currentEntity.department_type.has_outlet) {
      if (this.isOutlet != 1) {
        this.$notify({
          type: 'warning',
          message: 'This Channel Must be Outlet',
          title: 'Required!',
        });
      }
    } else if (this.currentEntity.department_type.isSelfManaged) {
       if (this.isSelfManaged != 1) {
        this.$notify({
          type: 'warning',
          message: 'This Channel Must be Self Managed',
          title: 'Required!',
        });
      }
    }
  }

  fetchDepartment() {
    this.loading = true
    this.$http.get(this.$api(`/departments/${this.currentEntity.id}`))
      .then((response: AxiosResponse) => {
        this.supplierName = response.data.department.supplier ? response.data.department.supplier.name : "No Supplier";
        this.classificationName = response.data.department.department_category ?
          response.data.department.department_category.name : null;
      })
      .finally(() => this.loading = false);
  }

  mounted() {
    if (this.isUpdate) {
      this.fetchDepartment();
    }
  }
}
</script>
<style>
</style>
