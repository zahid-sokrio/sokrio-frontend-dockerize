<template>
  <LazyDropdown
    :end-point="`/invoices?buyer_id=${buyer_id}&status=${status}`"
    resource-key="invoices"
    searchable-key="code"
    item-text="code"
    text-value="id"
    :multiple="multiple"
    :collapse-tags="true"
    :disabled="disabled"
    :value="value"
    @input="$emit('input', $event)"
    :placeholder="'Invoice'"
    @entities="entities = $event"
  >
    <template v-slot:dropDownItem="{ item }">
      <span>{{ item.remainder > 0 ?  item.remainder : 0 }} Tk | #{{ item.code }}</span>
    </template>
  </LazyDropdown>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import LazyDropdown from '@/components/LazyDropdown.vue';
import DropdownField from '@/mixins/DropdownField';
import {Invoice} from '@/intefaces/Invoice';

@Component({
  components: {
    LazyDropdown
  }
})
export default class InvoiceAutocomplete extends Mixins(DropdownField) {
  @Prop()
  public buyer_id!: number;
  @Prop()
  public status!: string;
  public entities: Invoice[] = [];
  public multiple!: boolean;

  @Watch('value')
  onChangeValue(value: any) {
      let totalInvoiceAmount = 0;
      this.entities.map((entity: any) => {
        if (value == entity.id) {
          totalInvoiceAmount += entity.remainder;
        }
      });
      this.$emit('totalAmount', totalInvoiceAmount == 0 ? null : totalInvoiceAmount);
  }
}
</script>
