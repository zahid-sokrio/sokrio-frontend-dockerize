<template>
  <div>
    <el-tree
      :data="permission"
      ref="tree"
      @check-change="handleCheckChange"
      :props="defaultProp"
      show-checkbox
      :default-expanded-keys="[1000, 2000]"
      :default-checked-keys="checkedPermission ? checkedPermission : []"
      node-key="id"
      :render-after-expand="false"
    >
    </el-tree>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator';
import { Tree } from 'element-ui';
@Component({
  components: {
    [Tree.name]: Tree
  }
})
export default class PermissionGroup extends Vue {
  @Prop() permission!: any;
  @Prop() index!: number;
  @Prop({ default: [] }) checkedPermission!: any;
  @Prop() isUpdate!: boolean;
  @Prop() currentRole!: any;
  private defaultProp: any = {
    label: 'label'
  };
  // get permissionGroup() {
  //   return this.permission[0]
  // }

  handleCheckChange(checked: any, indeterminate: any) {
    this.$emit('handleCheckChange', { checked, indeterminate });
  }

  @Watch('checkedPermission')
  setByKeys(newVal: number) {
    this.$nextTick(() => {
      //@ts-ignore
      this.$refs.tree.setCheckedKeys(this.checkedPermission);
    });
  }

  mounted() {}
}
</script>
