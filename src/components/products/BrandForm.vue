<template>
  <validation-observer v-slot="{handleSubmit}" ref="formValidator">
    <modal :show="isActive" v-if="isActive" @close="close">
      <template slot="header">
        <h5
          class="modal-title"
          id="exampleModalLabel"
        >{{isUpdate ? 'Update' : 'Add New'}} Brand</h5>
      </template>
      <div>
        <base-input name="name" v-model="form.name" label="Name" placeholder="e.g. Unilever" prepend-icon="ni ni-box-2"></base-input>
        <product-brand-parent-lazydropdown placeholder="Select Parent" label="Select Parent (Optional)" v-model="form.parent_id"></product-brand-parent-lazydropdown>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" @click="handleSubmit(save)" :loading="loading">Save</base-button>
      </template>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
  import {Component, Mixins, Prop, Vue} from 'vue-property-decorator';
import Productable from '../../intefaces/Productable';
  import BaseCUModalComponentMixin from "@/mixins/BaseCUModalComponent";
  import { AxiosResponse } from 'axios';
  import ProductBrandParentLazydropdown from "@/components/lazyDropdown/ProductBrandParentLazydropdown.vue";

@Component({
  name: 'BrandForm',
  components: ({
    ProductBrandParentLazydropdown
  })
})
export default class BrandForm extends Mixins(BaseCUModalComponentMixin) {
  @Prop({
    default: () => ({
      name: '',
      parent_id: ''
    })
  })
  form!: {
    name: string;
    parent_id: string;
  };
  @Prop({ required: false }) isUpdate!: boolean;
  @Prop({ required: false, default: null }) currentEntity!: Productable;

  formReset(): any {
    this.form.name = '';
    this.form.parent_id = '';
    return this.form;
  }

  get createApi(): string
  {
    return '/product-brands'
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.productBrand);
  }

  get updateApi(): string {
    return `/product-brands/${this.currentEntity.id}`
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.productBrand);
  }
}
</script>
