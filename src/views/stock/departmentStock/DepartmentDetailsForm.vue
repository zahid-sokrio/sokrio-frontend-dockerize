<template>
  <modal :show="isActive" @close="close">
    <template slot="header">
      <h5
        class="modal-title"
        id="exampleModalLabel"
      > Department Details </h5>
    </template>
    <div class="card">
      <div class="card-body">
        <ul class="list-group list-group-flush list my--4">
          <li class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-auto">
                <a href="#" class="avatar rounded-circle">
                  <i v-if="currentDepartmentProduct == null" class="fas fa-warehouse"></i>
                  <i v-else class="ni ni-building"></i>
                </a>
              </div>
              <div class="col ml--2" v-if="currentDepartmentProduct.department">
                <h4 class="mb-0">{{ currentDepartmentProduct.department.name }}
                  <badge rounded type="info" size="md">
                    {{ currentDepartmentProduct.department.code }}
                  </badge>
                </h4>
                <small> <b>Address :</b> {{ currentDepartmentProduct.department.address }}</small><br>
                <small> <b>Owener Name :</b> {{ currentDepartmentProduct.department.owner_name }}</small><br>
                <small> <b>Phone No. :</b>{{ currentDepartmentProduct.department.phone_no }}</small>
              </div>
              <div class="col ml--2" v-if="currentDepartmentProduct == null">
                <h4>Warehouse</h4>
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
export default class DepartmentDetailsForm extends Vue {
  @Prop() currentDepartmentProduct!: DepartmentProduct;
  @Prop() isActive!: boolean;
  @Prop() isBuyer!: boolean;

  close() {
    this.$emit('update:isActive', false);
  }
}

</script>
