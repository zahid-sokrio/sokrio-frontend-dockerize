<template>
  <modal :show="isActive" @close="close">
    <template slot="header">
      <h5
        class="modal-title"
        id="exampleModalLabel"
      > Product Details</h5>
    </template>
    <div class="card">
      <div class="card-body">
        <ul class="list-group list-group-flush list my--4">
          <li class="list-group-item px-0" v-if="currentDepartmentProduct.product">
            <div class="row align-items-center">
              <div class="col-auto">
                <a href="#" class="avatar rounded-circle">
                  <img v-if="currentDepartmentProduct.product.image_url" :src="currentDepartmentProduct.product.image_url"/>
                  <i v-else class="ni ni-image"></i>
                </a>
              </div>
              <div class="col ml--2" v-if="currentDepartmentProduct.product.base_product">
                <h4 class="mb-0">{{ currentDepartmentProduct.product.full_name }}
                  <badge rounded type="info" size="md">
                    {{ currentDepartmentProduct.product.base_product.sku }}
                  </badge>
                </h4>
                <small> <b>Description :</b> {{
                    currentDepartmentProduct.product.base_product ?
                      currentDepartmentProduct.product.base_product.description : ''
                  }}</small><br>
                <small> <b>USP :</b> {{
                    currentDepartmentProduct.product.base_product ?
                      currentDepartmentProduct.product.base_product.usp : ''
                  }}</small>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <template slot="footer">
      <base-button @click="close" type="secondary">Close</base-button>
    </template>
  </modal>
</template>
<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Tooltip
} from "element-ui";
import DepartmentProduct from "@/intefaces/DepartmentProduct";
import ProductImage from "@/components/products/ProductImage.vue";

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    ProductImage
  }
})
export default class ProductDetailsForm extends Vue {
  @Prop() currentDepartmentProduct!: DepartmentProduct;
  @Prop() isActive!: boolean;

  close() {
    this.$emit('update:isActive', false);
  }
}

</script>
