<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <form class="needs-validation" @submit.prevent="handleSubmit(save)">
      <modal :show="isActive" @close="close" size="sm">
        <template slot="header">
          <h5 class="modal-title"
              id="exampleModalLabel">{{ isUpdateSingleProductPrice ? 'Update' : 'Add' }} Product Price</h5>
        </template>
        <div>
          <base-input label="Price For" name="price for" rules="required">
            <el-select filterable
                       placeholder="Select Price Type"
                       v-model="singlePrice.priceable_type"
            >
              <el-option :key="index"
                         :label="type === 'dept' ? getTaxonomy('department') : 'Channel'"
                         :value="type"
                         v-for="(type,index) in priceType"
              >
              </el-option>
            </el-select>
          </base-input>
          <div v-if="singlePrice.priceable_type != ''">
            <department-lazydropdown v-if="singlePrice.priceable_type == 'dept'"
                                     :label="getTaxonomy('department')" name="department"
                                     placeholder="Select Department" v-model="singlePrice.priceable_id"
                                     :rules="singlePrice.priceable_type == 'dept' ? 'required' : ''"
            ></department-lazydropdown>
            <channel-lazydropdown v-if="singlePrice.priceable_type == 'depttype'" label="Channel"
                                  name="channel" placeholder="Select Channel" v-model="singlePrice.priceable_id"
                                  :rules="singlePrice.priceable_type === 'depttype' ? 'required' : ''"
            ></channel-lazydropdown>
          </div>
          <base-input label="Price" name="price" type="number" min="0" v-model="singlePrice.price"
                      placeholder="Product Price" :rules="{required: true}"></base-input>
          <small class="text-muted"> This is the base price for every
            <b v-if="singlePrice.priceable_id && departments && departmentTypes">
              <span v-if="singlePrice.priceable_type == 'dept'">
              {{
                  departments.find(department => department.id == singlePrice.priceable_id) ?
                    departments.find(department => department.id == singlePrice.priceable_id).name
                    : 'Invalid'
                }}
              </span>
              <span v-else>
                {{
                  departmentTypes.find(type => type.id == singlePrice.priceable_id) ?
                    departmentTypes.find(type => type.id == singlePrice.priceable_id).name : 'Invalid'
                }}
              </span>
            </b>
            <b v-else> ?
            </b>
            <span v-if="singlePrice.priceable_type == ''">
            <b>?</b>
          </span>
            <span v-else>
          {{ singlePrice.priceable_type == 'dept' ? 'department' : 'channel' }}
          </span>. This price will be assumed during {{ getTaxonomy('order') }}.
          </small>
        </div>
        <template slot="footer">
          <base-button type="secondary" @click="close">Close</base-button>
          <base-button @click="handleSubmit(save)">Save</base-button>
        </template>
      </modal>
    </form>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator';
import {Dropdown, DropdownItem, DropdownMenu, Upload} from 'element-ui';
import DepartmentType from "../../../intefaces/DepartmentType";
import ChannelLazydropdown from "@/components/lazyDropdown/ChannelLazydropdown.vue";
import DepartmentLazydropdown from "@/components/lazyDropdown/DepartmentLazydropdown.vue";
import TaxonomyMixin from "@/mixins/TaxonomyComponent";

@Component({
  [Dropdown.name]: Dropdown,
  [DropdownItem.name]: DropdownItem,
  [DropdownMenu.name]: DropdownMenu,
  components: {
    ChannelLazydropdown,
    DepartmentLazydropdown
  }
})
export default class CreateProductPrice extends Mixins(TaxonomyMixin) {
  @Prop() isActive!: boolean;
  @Prop() isUpdate!: boolean;
  @Prop() departmentTypes!: DepartmentType;
  @Prop() currentProductId!: any;
  @Prop() productPrice!: any;
  @Prop() isUpdateSingleProductPrice!: any;
  @Prop() departments!: any;
  @Prop() singlePrice!: any;
  @Prop() currentProductPrice!: any;
  private priceType = ['dept', 'depttype'];

  createProductPrice() {
    this.$http
      .post(this.$api('/product-prices'), {
        product_id: this.currentProductId,
        priceable_id: this.singlePrice.priceable_id,
        priceable_type: this.singlePrice.priceable_type,
        price: this.singlePrice.price
      })
      .then(response => {
        this.$emit('update:singlePrice', {priceable_id: '', price: '', priceable_type: ''})
        this.$emit('addPrice', response.data.productPrice);
        this.notification('Success', 'Successfully Added', 'success');
        this.$emit('update:isActive', false);
      })
      .catch(error => {
        this.notification('Warning', error.response.data.errors, 'warning');
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  updateProductPrice() {
    this.$http.patch(this.$api(`/product-prices/${this.currentProductPrice.id}`), {
      product_id: this.currentProductId,
      priceable_id: this.singlePrice.priceable_id,
      priceable_type: this.singlePrice.priceable_type,
      price: this.singlePrice.price
    })
      .then(response => {
        this.$emit('update:singlePrice', {priceable_id: '', price: '', priceable_type: ''})
        this.$emit('updatePrice', response.data.productPrice);
        this.$emit('update:isUpdateSingleProductPrice', false);
        this.$emit('update:isActive', false);
        this.notification('Success', 'Successfully Updated', 'success');
      })
      .catch(error => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  save() {
    this.isUpdateSingleProductPrice ? this.updateProductPrice() : this.createProductPrice();
  }

  notification(title: string, message: string, type: "success" | "warning" | "info" | "error" | undefined) {
    this.$notify({
      title: title,
      message: message,
      duration: 3000,
      iconClass: 'ni ni-bell-55',
      type: type
    });
  }

  close() {
    this.$emit('update:isActive', false);
    this.$emit('update:isUpdateSingleProductPrice', false);
    this.$emit('update:singlePrice', {priceable_id: '', price: '', priceable_type: ''})
  }

}
</script>
