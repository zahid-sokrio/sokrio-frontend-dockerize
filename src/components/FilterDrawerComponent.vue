<template>
  <el-drawer :title="title" :visible="visible" :direction="direction" :before-close="handleClose">
    <div class="col-md-12">
      <slot></slot>
    </div>
    <div class="col-md-12 text-left">
      <base-button type="primary" icon @click="closeBtn">
        <span class="btn-inner--text">Done</span>
      </base-button>
      <base-button type="primary" icon @click="resetBtn">
        <span class="btn-inner--text">Reset</span>
      </base-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
  import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
  import {Drawer} from "element-ui";

  @Component({
    components: {
      [Drawer.name]: Drawer,
    }
  })
  export default class FilterDrawerComponent extends Vue{
    @Prop({default: 'title'})
    title!: string;
    @Prop({default: false})
    visible!: boolean
    @Prop({default: 'rtl'})
    direction!: string

    closeBtn() {
      this.$emit('update:visible', false);
      this.$emit('closeBtn');
    }

    handleClose() {
      this.$emit('update:visible', false);
      this.$emit('handleClose');
    }

    resetBtn() {
      this.$emit('resetBtn')
    }

  }
</script>
