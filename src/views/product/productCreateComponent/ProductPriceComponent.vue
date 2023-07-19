<template>
  <div>
    <div class="row mb-1">
      <div class="col-md-12">
        <h3>Product Batch Price (Optional)</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <base-input label="Price For" name="price for">
          <el-select v-model="singlePrice.priceable_type"
                     filterable
                     placeholder="Select Price For"
          >
            <el-option v-for="(type,index) in priceType"
                       :key="index"
                       :label="type === 'dept' ? getTaxonomy('department') : 'Channel'"
                       :value="type"
            >
            </el-option>
          </el-select>
        </base-input>
      </div>
      <div class="col-md-6" v-if="singlePrice.priceable_type != ''">
        <department-lazydropdown v-if="singlePrice.priceable_type == 'dept'"
                                 v-model="singlePrice.priceable_id"
                                 :label="getTaxonomy('department')"
                                 :placeholder="'Select '+ getTaxonomy('department') "
                                 name="department" @newCreatedEntity="newCreatedDepartment($event)"
        ></department-lazydropdown>
        <channel-lazydropdown v-if="singlePrice.priceable_type == 'depttype'"
                              v-model="singlePrice.priceable_id" label="Channel"
                              name="channel" placeholder="Select Channel" @newCreatedEntity="newCreatedChannel($event)"
        ></channel-lazydropdown>
      </div>
      <div class="col-md-6">
        <base-input v-model="singlePrice.price" label="Price" name="price" placeholder="Product Price"
                    type="number" min="0"></base-input>
        <small class="text-muted"> This price will be assigned when placing an {{ getTaxonomy('order') }}/{{
            getTaxonomy('requisition')
          }} from
          <b v-if="singlePrice.priceable_id && departments && departmentTypes">
            {{
              singlePrice.priceable_type == 'dept' ?
                departments.find(department => department.id == singlePrice.priceable_id).name
                : departmentTypes.find(type => type.id == singlePrice.priceable_id).name
            }} </b>
          <b v-else> ?
          </b>
          with the product.
        </small>
      </div>
      <div v-if="singlePrice.priceable_type == ''" class="col-md-6"></div>
      <div class="col-md-6 text-right">
        <el-tooltip :content="disabled ?
        'Fill up necessary field to enable this button, then click this button to add product batch price in the list, ' +
        'only listed price will be assigned for this product.' :
        'Click this button, to add product batch price in the below list, only listed price will be assigned for this product.'"
                    placement="top">
          <div style="display: inline-block;">
            <base-button type="success" @click="saveProductBatchPrice()" :disabled="disabled">
            <span class="btn-inner--icon">
              <i class="fas fa-check-circle"></i>
            </span>
            </base-button>
          </div>
        </el-tooltip>
        <br>
        <!--        <span v-if="!disabled" style="color: palevioletred">-->
        <!--              <i class="fas fa-info-circle"></i> <small>Click this button, to add product batch price in the below-->
        <!--          list, only listed price will be assigned for this product.</small>-->
        <!--            </span>-->
      </div>
    </div>
    <div class="col-md-12" style="overflow-y: scroll; height: 60%">
      <h4 class="text-center">Product Batch Price List</h4>
      <ul class="list-group list-group-flush list my--1">
        <li class="list-group-item px-0">
          <div class="row align-items-center">
            <div class="col-md-4">
              <b>Name</b>
            </div>
            <div class="col-md-4">
              <b>Type </b>
            </div>
            <div class="col-md-3">
              <b>Price </b>
            </div>
            <div class="col-md-1">

            </div>
          </div>
        </li>
        <div v-if="productPrices.length <= 0" class="text-center">
          <h4 style="margin-top: 10px"> No product price selected</h4>
        </div>
        <li v-for="(price,index) in productPrices" :key="index" class="list-group-item px-0">
          <div class="row align-items-center">
            <div v-if="productPrices" class="col-md-4">
              <span>
                <span
                  v-if="price.priceable_type == 'depttype' ">
                  {{ departmentTypes.find(type => type.id == price.priceable_id).name }}
                </span>
                <span v-else>{{ departments.find(type => type.id == price.priceable_id).name }}</span>
              </span>
            </div>
            <div class="col-md-4">
              <span>{{ price.priceable_type == 'dept' ? getTaxonomy('department') : 'Channel' }}</span>
            </div>
            <div class="col-md-3">
              <span>{{ price.price }}</span>
            </div>
            <div class="col-md-1">
              <el-tooltip content="Delete" placement="top">
                <base-button size="sm" type="danger"
                             @click="deletePrice(index)"><i class="fas fa-times"/></base-button>
              </el-tooltip>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import DepartmentLazydropdown from "@/components/lazyDropdown/DepartmentLazydropdown.vue";
import ChannelLazydropdown from "@/components/lazyDropdown/ChannelLazydropdown.vue";
import Department from "@/intefaces/Department";
import DepartmentType from "@/intefaces/DepartmentType";
import {Tooltip} from "element-ui";

@Component({
  components: {
    DepartmentLazydropdown,
    ChannelLazydropdown,
    [Tooltip.name]: Tooltip,
  }
})
export default class ProductPriceComponent extends Mixins(TaxonomyMixin) {
  @Prop() productPrices!: any;
  private priceType = ['dept', 'depttype'];
  private disabled = true;
  private singlePrice = {
    priceable_id: '',
    price: '',
    priceable_type: '',
    id: ''
  };
  private departmentTypes: any[] = [];
  private departments: any[] = [];

  @Watch('singlePrice', {deep: true})
  enableAddButton() {
    if (this.singlePrice.priceable_id && this.singlePrice.price && this.singlePrice.priceable_type) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }

  saveProductBatchPrice() {
    this.productPrices.push({...this.singlePrice});
    this.singlePriceReset();
  }

  singlePriceReset() {
    this.singlePrice.priceable_id = '';
    this.singlePrice.price = '';
    this.singlePrice.priceable_type = '';
    this.singlePrice.id = '';
    this.disabled = true;
  }

  deletePrice(index: number) {
    this.productPrices.splice(index, 1)
  }

  newCreatedDepartment(event: Department) {
    this.departments.unshift(event);
  }

  newCreatedChannel(event: DepartmentType) {
    this.departmentTypes.unshift(event);
  }

  fetchDepartmentTypes() {
    this.$http.get(this.$api('/department-types')).then(response => {
      this.departmentTypes = response.data.departmentTypes;
    })
  }

  fetchDepartment() {
    this.$http.get(this.$api('/departments')).then(response => {
      this.departments = response.data.departments;
    })
  }

  created() {
    this.fetchDepartment();
    this.fetchDepartmentTypes();
  }
}
</script>
