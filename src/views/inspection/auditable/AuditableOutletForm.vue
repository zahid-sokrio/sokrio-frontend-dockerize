<template>
  <validation-observer ref="formValidator" v-slot="{ handleSubmit }">
    <modal :show="isActiveAssignAsset" v-if="isActiveAssignAsset" size="lg" @close="close">
      <template slot="header">
        <h5
          id="exampleModalLabel"
          class="modal-title"
        >Assign Outlet Item</h5>
      </template>
      <div class="row">
        <div class="col-md-6">
          <base-input label="Type" name="Type" rules="required">
            <el-select v-model="form.type"
                       filterable
                       placeholder="Select Type"
                       @change="resetAduitableErrorMsg"
            >
              <el-option v-for="(type,index) in types"
                         :key="index"
                         :label="type.label"
                         :value="type.name">
              </el-option>
            </el-select>
          </base-input>
        </div>
        <div class="col-md-6">
          <asset-autocomplete v-if="form.type == 'asset'" v-model="form.auditable"></asset-autocomplete>
          <campaign-autocomplete v-if="form.type == 'merchandise'" v-model="form.auditable"></campaign-autocomplete>
          <product-lazydropdown v-if="form.type == 'product'" v-model="form.auditable" :add-button="false" :end-point="'/products'"
                                item-sub-text="batch.name" item-text="base_product.name" item-value="id" label="Product"
                                placeholder="Select Product"></product-lazydropdown>
        </div>
        <div class="col-md-12">
          <outlet-lazydropdown v-model="form.outlets" :label="getTaxonomy('department') + ' (Outlet)' " :placeholder="'Select'+  getTaxonomy('department')"></outlet-lazydropdown>
        </div>
      </div>
      <div v-for="(selectedOutlet, index) in form.outlets" :key="index">
        <div class="row">
          <div class="col-md-4">
            <div class="form-inline outlet">
              <b> Outlet : </b> {{ selectedOutlet != '0' ? outlets.find((outlet) => outlet.id == selectedOutlet).name : '' }}
            </div>
          </div>
          <div class="col-md-4">
            <base-input :name="'provided on ' + [selectedOutlet != '0' ? outlets.find((outlet) => outlet.id == selectedOutlet).name : '']" label="Provided On"
                        prepend-icon="ni ni-calendar-grid-58"
                        rules="required">
              <flat-picker slot-scope="{focus, blur}"
                           v-model="form.providedAt[index]"
                           :config="{allowInput: true}"
                           class="form-control datepicker"
                           @on-open="focus"
                           @on-close="blur">
              </flat-picker>
            </base-input>
          </div>
          <div class="col-md-4">
            <base-input :name="'expires on ' + [selectedOutlet != '0' ? outlets.find((outlet) => outlet.id == selectedOutlet).name : '']" label="Expires On"
                        prepend-icon="ni ni-calendar-grid-58"
                        rules="required">
              <flat-picker slot-scope="{focus, blur}"
                           v-model="form.expiresAt[index]"
                           :config="{allowInput: true}"
                           class="form-control datepicker"
                           @on-open="focus"
                           @on-close="blur">
              </flat-picker>
            </base-input>
          </div>
          <div class="col-md-4"></div>
          <div class="col-md-4">
            <base-input v-model="form.qty[index]" :name="'qty for ' + [selectedOutlet != '0' ? outlets.find((outlet) => outlet.id == selectedOutlet).name : '']" label="Qty" prepend-icon="fas fa-sort-amount-up"
                        rules="required"
                        type="number"></base-input>
          </div>
        </div>
      </div>
      <template slot="footer">
        <div style="float: left">
                    <span v-if="form.type == 'product'" class="information"><i class="fas fa-info-circle"></i>
                        {{ selectedAsset != '' ? auditable.find((asset) => asset.id == selectedAsset).base_product.name : '?' }}
                        displays at {{ form.outlets == '' ? '?' : '' }}
                        <span v-for="(selectedOutlet,index) in form.outlets"
                              :key="selectedOutlet">{{ outlets.find((outlet) => outlet.id == selectedOutlet).name }} {{ form.outlets.length == index + 1 ? '.' : ', ' }}</span>
                    </span>
          <span v-else
                :class="selectedAsset != '' && auditable.find((asset) => asset.id == selectedAsset).qty - count <= 0 ? 'informationAlert' : 'information'"><i
            class="fas fa-info-circle"></i>
                        {{ selectedAsset != '' && auditable.find((asset) => asset.id == selectedAsset).qty - count > 0 ? auditable.find((asset) => asset.id == selectedAsset).qty - count : 0 }}
                        {{ selectedAsset != '' ? auditable.find((asset) => asset.id == selectedAsset).name : '?' }}
                        left
                        <span v-if="selectedAsset != '' && auditable.find((asset) => asset.id == selectedAsset).qty - count <= 0">
                            , you have insufficient asset.
                        </span>
                    </span>
        </div>
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button :disabled="disableBtn" type="success" @click="handleSubmit(assignAsset)">Save</base-button>
      </template>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator';
import Asset from "@/intefaces/Asset";
import AssetForm from "@/views/inspection/auditable/AssetForm.vue";
import CreateDepartmentForm from "@/views/department/CreateDepartmentForm.vue";
import "flatpickr/dist/flatpickr.css";
import Department from "@/intefaces/Department";
import CampaignForm from "@/views/inspection/campaign/CampaignForm.vue";
import AddProduct from "@/views/product/AddProduct.vue";
import Productable from "@/intefaces/Productable";
import VariantCategory from "@/intefaces/VariantCategory";
import AssetAutocomplete from "@/components/lazyDropdown/AssignAutocomplete.vue";
import CampaignAutocomplete from "@/components/lazyDropdown/CampaignAutocomplete.vue";
import OutletLazydropdown from "@/components/lazyDropdown/OutletLazydropdown.vue";
import ProductLazydropdown from "@/components/lazyDropdown/ProductLazydropdown.vue";
import TaxonomyMixin from "@/mixins/TaxonomyComponent";

const flatPicker = require("vue-flatpickr-component");

@Component({
  name: 'AuditableOutletForm.vue',
  components: {
    flatPicker,
    AssetForm,
    CreateDepartmentForm,
    CampaignForm,
    AddProduct,
    AssetAutocomplete,
    CampaignAutocomplete,
    OutletLazydropdown,
    ProductLazydropdown
  }
})
export default class AuditableOutletForm extends Mixins(TaxonomyMixin) {
  @Prop() isActiveAssignAsset!: boolean;
  @Prop() outlets!: any;
  @Prop() form!: {
    outlets: any,
    auditable: string | number,
    providedAt: any,
    expiresAt: any,
    type: string | null,
    qty: any;
  }
  private auditable: any[] = [];
  private selectedAsset = '';
  private isRemove = false;
  private auditableCount = 0;
  private count = 0;
  private disableBtn = false;
  private loading = false;
  private productBrands: Productable[] = [];
  private productCategories: Productable[] = [];
  private variantCategories: VariantCategory[] = [];
  private departmentTypes: any = [];
  private types = [
    {name: 'asset', label: 'Assets'},
    {name: 'merchandise', label: 'Marchandise'},
    {name: 'product', label: 'Product'}
  ];
  private auditableForm: { name: string; qty: number } = {
    name: '',
    qty: 0
  };
  private productForm: { name: string; isStockable: any; productBrandId: any; productCategoryId: any; description: string; usp: string; image: any; sku: string } = {
    name: '',
    isStockable: true,
    productBrandId: '',
    productCategoryId: '',
    description: '',
    usp: '',
    image: '',
    sku: '',
  };
  private variant: any = {
    variantValues: [],
    variantCategories: [],
    prices: [],
    departmentTypes: [],
    departmentId: []
  };
  private isActive: boolean = false;
  private isUpdate: boolean = false;

  private formDepartment: any = {
    address: '',
    created_by: '',
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
  }
  private isActiveDepartment: boolean = false;

  createDepartment(department: Department) {
    this.isActiveDepartment = false;
    this.form.outlets.push(department.id);
    this.form.outlets.splice(this.form.outlets.indexOf('0'), 1);
    this.outlets.unshift(department);
  }

  createAuditable(asset: Asset) {
    this.isActive = false;
    this.auditable.unshift(asset);
    this.form.auditable = asset.id;
  }

  setAduitableId() {
    if (this.form.auditable == 0) {
      this.form.auditable = '';
    }
  }

  setDepartmentId() {
    if (this.form.outlets.includes('0')) {
      this.form.outlets.splice(this.form.outlets.indexOf('0'), 1);
    }
  }

  @Watch('form.type')
  getAduitableValue(newVal: any) {
    this.form.auditable = '';
    this.selectedAsset = '';
    if (newVal == 'asset') {
      this.$http.get(this.$api('/assets')).then(response => {
        this.auditable = response.data.assets;
      })
    } else if (newVal == 'merchandise') {
      this.$http.get(this.$api('/campaign-items')).then(response => {
        this.auditable = response.data.campaignItems;
      })
    } else if (newVal == 'product') {
      this.$http.get(this.$api('/products')).then(response => {
        this.auditable = response.data.products;
      })
    }
  }

  @Watch('form.auditable')
  getSelectedAsset(newVal: any) {
    if (newVal != null && newVal != 0) {
      this.selectedAsset = newVal;
      if (this.form.auditable != '' && this.form.type != 'product' && this.count > this.auditable.find((asset) => asset.id == this.selectedAsset).qty) {
        this.form.outlets = [];
      }
    }
  }

  @Watch('form.outlets')
  countTotalOutletAdd(old: any, current: any) {
    if (old.includes('0')) {
      this.isActiveDepartment = true;
    }
    if (this.isRemove == false) {
      var assetQty = this.form.auditable != '' && this.form.type != 'product' ? this.auditable.find((asset) => asset.id == this.selectedAsset).qty : 0;
      var value = '';
      if (assetQty == 0 && this.form.type != 'product') {
        value = old.filter((item: any) => {
          return current.indexOf(item) === -1
        })
        this.onRemove(value[0]);
      }
    }
  }

  @Watch('form.qty')
  getQty(newVal: any) {
    this.count = 0;
    if (this.form.qty != '' && this.form.qty != 0) {
      this.form.qty.forEach((qty: any) => {
        this.count = this.count + parseInt(qty);
      })
      let count = this.auditable.find((asset) => asset.id == this.selectedAsset).qty - this.count;
      if (this.selectedAsset != '' && count < 0 && this.form.type != 'product') {
        this.disableBtn = true;
      } else {
        this.disableBtn = false;
      }
    }
  }


  onRemove(remove: any) {
    this.isRemove = true;
    let index = this.form.outlets.findIndex((outlet: any) => outlet == remove);
    if (index !== -1) {
      this.form.outlets.splice(index, 1);
      this.isRemove = false;
    }
    this.isRemove = false;
  }

  assignAsset() {
    this.disableBtn = true;
    this.form.outlets.forEach((outlet: any, index: any) => {
      this.loading = true;
      this.$http.post(this.$api('/outlet-auditables'),
        {
          auditable_id: this.form.auditable,
          auditable_type: this.form.type == 'merchandise' ? 'campaign' : this.form.type,
          department_id: outlet,
          provided_at: this.form.providedAt[index],
          expires_at: this.form.expiresAt[index],
          qty: this.form.qty[index]
        }
      ).then(response => {
        this.$emit('created', response.data.outletAuditable);
        this.$notify({
          title: 'Success',
          message: 'Successfully Created',
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        if (this.form.type == 'asset') {
          this.$http.get(this.$api(`/assets/${this.form.auditable}`)).then(responseAsset => {
            this.auditable.splice(this.auditable.findIndex((asset) => asset.id == responseAsset.data.asset.id), 1, responseAsset.data.asset);
          })
        } else if (this.form.type == 'campaign') {
          this.$http.get(this.$api(`/campaign-items/${this.form.auditable}`)).then(responseCampaign => {
            this.auditable.splice(this.auditable.findIndex((campaign) => campaign.id == responseCampaign.data.campaign.id), 1, responseCampaign.data.campaign);
          })
        }
        this.form.outlets = [];
        this.form.auditable = '';
        this.form.providedAt = [];
        this.form.expiresAt = [];
        this.form.type = 'asset';
      })
        .catch(error => {
          this.disableBtn = false;
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
    })
    this.disableBtn = false;
  }

  resetAduitableErrorMsg() {
    this.$nextTick(() => {
      (this.$refs.formValidator as HTMLFormElement).reset();
    })
  }

  fetchAsset() {
    this.$http.get(this.$api('/assets')).then(response => {
      this.auditable = response.data.assets;
    })
  }

  fetchProductBrand() {
    this.$http.get(this.$api('/product-brands')).then(response => {
      this.productBrands = response.data.productBrands;
    });
  }

  fetchProductCategory() {
    this.$http.get(this.$api('/product-categories')).then(response => {
      this.productCategories = response.data.productCategories;
    });
  }

  fetchVariantCategories() {
    this.$http.get(this.$api("/variant-categories")).then(response => {
      this.variantCategories = response.data.variantCategories;
    })
  }

  fetchDepartmentType() {
    this.$http.get(this.$api("/department-types")).then(response => {
      this.departmentTypes = response.data.departmentTypes;
    })
  }

  created() {
    this.fetchAsset();
    this.fetchProductBrand();
    this.fetchProductCategory();
    this.fetchVariantCategories();
    this.fetchDepartmentType();
  }

  close() {
    this.$emit('update:isActiveAssignAsset', false);
    this.$emit('update:form', {outlets: [], auditable: '', providedAt: [], expiresAt: [], type: 'asset', qty: []})
    this.selectedAsset = '';
    this.count = 0;
    this.$nextTick(() => {
      (this.$refs.formValidator as HTMLFormElement).reset();
    })
  }
}
</script>
<style>
.outlet {
  font-size: 18px;
}

.information {
  font-size: 14px;
  color: blue
}

.informationAlert {
  font-size: 16px;
  color: red
}
</style>
