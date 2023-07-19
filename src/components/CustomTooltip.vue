<template>
  <div>
    <el-popover placement="bottom" :title="title" width="200" trigger="click">
      <div v-if="entities.length > 0">
        <el-tag type="success" class="mr-1" v-for="(entity, index) in entities" :key="index">
          <b>{{ entity }}</b>
        </el-tag>
      </div>
      <small v-else > No data found. </small>
      <base-button type="primary" icon size="sm" slot="reference" @click="onClick">
        <slot>
          {{ buttonText }}
        </slot>
      </base-button>
    </el-popover>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import {Tag} from "element-ui";

  @Component({
    components: {
      [Tag.name]: Tag,
    }
  })

  export default class CustomTooltip extends Vue{
    @Prop({default: null}) entities!: string;
    @Prop() title!: string;
    @Prop() buttonText!: string;

    onClick() {
      this.$emit('onClick');
    }
  }
</script>
