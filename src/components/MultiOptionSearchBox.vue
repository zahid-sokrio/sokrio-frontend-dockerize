<template>
  <el-autocomplete
    :class="[{ 'border-danger': error }, 'w-100']"
    v-model="input"
    ref="multiSearchBox"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder"
    @select="handleSelect"
    @clear="onClear"
    value-key="title"
    popper-class="mt-1"
    clearable
    :prefix-icon="prepend_icon ? prepend_icon : ''"
  >
    <template v-if="prepend_text" slot="prepend">
      {{ prepend_text }}
    </template>
  </el-autocomplete>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { Autocomplete } from 'element-ui';

@Component({
  components: {
    [Autocomplete.name]: Autocomplete
  }
})
export default class MultiOptionSearchBox extends Vue {
  private input = '';
  private error: boolean = false;
  private selectedTypeTitle: string | null = null;
  private selectedTypeValue: string | null = null;
  @Prop({ default: null })
  prepend_text!: string | null;
  @Prop({ default: 'Please Input' })
  placeholder!: string;
  @Prop({ default: null })
  prepend_icon!: string | null;
  @Prop({ required: true, default: [] })
  types!: { value: string; title: string }[];

  $refs!: {
    multiSearchBox: HTMLFormElement
  }

  @Watch('input')
  onChangeInput(value: string) {
    this.error = false;
    if (!this.selectedTypeTitle || !this.isTypeExist()) {
      this.error = true;
      return;
    }
    let input = value.split(this.selectedTypeTitle)[1];
    if (input == '') return;
    this.$emit('onChangeType', this.selectedTypeValue);
    this.$emit('input', input);
  }
  @Watch('selectedTypeValue')
  onSelectedTypeValue(value: string) {
    // this.$emit('onChangeType', value);
  }

  querySearch(queryString: any, cb: any) {
    if (this.input && this.isTypeExist()) {
      cb([]);
      return;
    }
    cb(this.types);
  }

  handleSelect(value: any) {
    this.selectedTypeTitle = value.title + ': ';
    this.selectedTypeValue = value.value;
    this.input = value.title + ': ';
    this.$refs.multiSearchBox.focus();
  }
  onClear() {
    this.$emit('input', null);
    this.$emit('onChangeType', null);
  }
  isTypeExist(): boolean {
    let self = this;
    if (!this.selectedTypeTitle) return false;
    return this.input.match(this.selectedTypeTitle) != null;
  }
}
</script>
<style>
.error-search .el-autocomplete-suggestion__wrap {
}
.border-danger .el-input__inner:focus {
  border-color: red !important;
}
</style>
