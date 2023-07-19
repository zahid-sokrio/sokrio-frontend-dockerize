<template>
  <el-col>
    <el-row v-if="labelProp" class="mb-2 ml-1">
      <span class="text-sm" style="color: #536080; font-size: 0.77875rem; font-weight: 600;">
       {{ labelProp ? labelProp : '' }}
      </span>

    </el-row>
    <el-row>
      <el-col :span="11" style="padding: 0 2px">
        <base-input clearable>
          <flat-picker
            ref="startDate"
            :config="{ allowInput: true }"
            class="form-control datepicker"
            :disabled="disabled"
            @click="endDate = ''"
            placeholder="Start Date" v-model="startDate">
          </flat-picker>
        </base-input>
      </el-col>
      <el-col v-if="enable" :span="11" style="padding: 0 2px">
        <base-input>
          <flat-picker
            :disabled="!startDate"
            ref="endDate"
            :config="getConfig"
            class="form-control datepicker"
            placeholder="End Date"
            v-model="endDate"
          ></flat-picker>
        </base-input>
      </el-col>
      <el-col v-show="value" :span="1" style="padding: 5px 0px 0px 0px;">
        <el-tooltip class="item" effect="dark" content="Top Center prompts info" placement="top">
          <el-button @click="onClickClear" size="mini" type="text" icon="el-icon-close" circle></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
  </el-col>
</template>
<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {Button} from "element-ui";
import moment from "moment";

const flatPicker = require('vue-flatpickr-component');

@Component({
  components: {
    ElButton: Button,
    flatPicker
  }
})
export default class DateRange extends Vue {
  @Prop()
  value!: string;
  @Prop()
  labelProp!: string;
  @Prop()
  disabled!: boolean;
  @Prop()
  maxDate!: string;

  public startDate: string = '';
  public endDate: string = '';
  public enable = true;
  public disableAutoFocus = false;

  updateDateRange() {
    if (this.startDate && this.endDate) {
      this.$emit('input', this.startDate + ',' + this.endDate);
    }
  }

  mounted() {
    if (this.value) {
      this.disableAutoFocus = true;
      let dateRange = this.value.split(',');
      this.startDate = dateRange[0];
      this.endDate = dateRange[1];
      this.$nextTick(function () {
        this.disableAutoFocus = false;
      })
    }
  }

  @Watch('startDate')
  async onChangeStartDate(value: string) {
    if (!this.disableAutoFocus) {
      this.endDate = '';
      this.updateDateRange();
      await this.$nextTick(() => this.enable = false);
      await this.$nextTick(() => this.enable = true);
      await this.$nextTick(() => (this.$refs.endDate as Vue & { $el: { focus: Function } }).$el.focus());
    }
  }

  @Watch('endDate')
  onChangeEndDate(value: string) {
    this.updateDateRange();
  }

  @Watch('value')
  onChangeValue(value: string) {
    if (!value) {
      this.startDate = this.endDate = '';
    }
  }

  onClickClear() {
    this.startDate = '';
    this.endDate = '';
    this.$emit('input', '');
  }

  get getConfig(): any {
    let self = this;
    return {
      allowInput: true,
      disable: [
        function (date: Date) {
          return moment(self.startDate).diff(date) > 0
        }
      ],
      maxDate: this.maxDate
    }
  }
}
</script>
