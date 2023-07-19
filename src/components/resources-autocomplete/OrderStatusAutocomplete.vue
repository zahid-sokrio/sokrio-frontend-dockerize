<template>
  <base-input :name="name" :label="label">
    <el-select :value="value" @input="$emit('input', $event)" clearable :placeholder="placeholder">
      <el-option v-for="entity in statuses" :key="entity.value" :label="entity.title" :value="entity.value"></el-option>
    </el-select>
  </base-input>
</template>

<script lang="ts">
  import {Prop, Vue} from 'vue-property-decorator';
  import Component from 'vue-class-component';
  import statuses from "@/data/OrderStatus";

  @Component({})
  export default class OrderStatusAutocomplete extends Vue {
    @Prop({default: ''})
    value!: null | string;
    @Prop({default: 'status'})
    name!: null | string;
    @Prop({default: 'Select a status'})
    placeholder!: string;
    @Prop({default: null})
    label!: string | null;
    statuses = statuses;
  }
</script>

<style scoped></style>
