<template>
  <span>
    <base-input :name="name" :label="label">
      <el-select
        :automatic-dropdown="true"
        :multiple="multiple"
        :value="value"
        :collapse-tags="multiple"
        @input="$emit('input', $event)"
        :placeholder="placeholder"
        remote
        clearable
        reserve-keyword
        filterable
        :remote-method="fetchEntries"
        :loading="loading"
      >
        <el-option v-for="entity in entities" :key="entity.id" :label="`${entity.name} | ${entity.code}`" :value="entity.id"></el-option>
        <el-option v-if="addButton" :value="0" label="Create new"><b> Create New </b> </el-option>
      </el-select>
    </base-input>
    <!--    <AddProduct></AddProduct>-->
    <!--    <CreateProductForm v-if="addButton" @created="afterCreated($event)" :is-active.sync="createEntity"></CreateProductForm>-->
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Select, Option } from 'element-ui';
import Product from '@/intefaces/Productable';
import AddProduct from '@/views/product/AddProduct.vue';

@Component({
  components: {
    AddProduct,
    [Select.name]: Select,
    [Option.name]: Option
  }
})
export default class ProductAutocomplete extends Vue {
  @Prop()
  value!: number | null;
  @Prop({ default: false })
  multiple!: boolean;
  @Prop({ default: false })
  addButton!: boolean;
  @Prop({ default: 'Select Product' })
  placeholder!: string;
  @Prop({ default: null })
  label!: string | null;
  @Prop({ default: 'territory' })
  name!: string;

  private createEntity: boolean = false;
  private entities: Product[] = [];
  private loading: boolean = false;

  async fetchEntries(query: string) {
    if (query == '') return;
    this.loading = true;
    const { data } = await this.$http.get(this.$api(`/departments?q=${query}`));
    this.loading = false;
    this.entities = data.territories;
  }

  afterCreated(value: Product) {
    this.createEntity = false;
    this.entities.unshift(value);
    this.$emit('input', value.id);
  }
  @Watch('value')
  onChangeValue(value: any) {
    if (value === 0) {
      this.createEntity = true;
      this.$nextTick(() => {
        this.$emit('input', null);
      });
    }
  }
}
</script>
