<template>
  <validation-observer v-slot="{handleSubmit}" ref="formValidator">
    <modal :show="isActive" v-if="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New' }} Category</h5>
      </template>
      <div>
        <base-input
          name="name"
          v-model="form.name"
          label="Name"
          placeholder="e.g. Soap"
          prepend-icon="ni ni-bullet-list-67"
        >
        </base-input>
        <product-category-parent-lazydropdown placeholder="Select Parent" label="Select Parent (Optional)"
                                              v-model="form.parent_id"></product-category-parent-lazydropdown>
        <div class="col-md-6">
          <base-input label="Active">
            <base-switch on-text="Yes" off-text="No" v-model="form.active"></base-switch>
          </base-input>
        </div>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" @click="handleSubmit(save)" :loading="loading">Save</base-button>
      </template>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Mixins, Prop, Vue, Watch} from "vue-property-decorator";
import Productable from "../../intefaces/Productable";
import BaseCUModalComponentMixin from "@/mixins/BaseCUModalComponent";
import {AxiosResponse} from "axios";
import ProductCategoryParentLazydropdown from "@/components/lazyDropdown/ProductCategoryParentLazydropdown.vue";
import swal from "sweetalert2";

@Component({
  name: 'CategoryForm',
  components: {
    ProductCategoryParentLazydropdown
  }
})
export default class CategoryForm extends Mixins(BaseCUModalComponentMixin) {
  @Prop() currentEntity!: Productable;
  @Prop({
    default: () => ({
      name: '',
      parent_id: '',
      active: true,
    })
  })
  form!: {
    name: string;
    parent_id: string;
    active: boolean;
  }
  private isFirstTimeOpenModal = false;

  @Watch('isUpdate')
  openUpdateModal(newVal: boolean) {
    if (newVal && !this.form.active) {
      this.isFirstTimeOpenModal = true;
    }
  }

  @Watch('form.active')
  showAlert(newVal: boolean) {
    if (this.isUpdate && !this.isFirstTimeOpenModal) {
      swal.fire({
        title: 'Info!',
        text: newVal ? 'By this action, all inactive product under this cateogry will be active.' :
          'By this action, all product under this category will be inactive.',
        icon: 'info',
        confirmButtonText: 'Close'
      });
    }
    this.isFirstTimeOpenModal = false;
  }

  formReset(): any {
    this.form.name = '';
    this.form.parent_id = '';
    this.form.active = true;
    return this.form;
  }

  get createApi(): string {
    return '/product-categories'
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.productCategory);
  }

  get updateApi(): string {
    return `/product-categories/${this.currentEntity.id}`
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.productCategory);
  }
}
</script>
