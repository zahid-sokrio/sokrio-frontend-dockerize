<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <modal :show="isActive" @close="close" class="modal-dialog-scrollable" size="lg">
      <template slot="header">
        <h5 class="modal-title"
            id="exampleModalLabel">View Staff</h5>
      </template>
      <div>
        <el-table
          :data="departmentStaffs"
          class="table-responsive align-items-center"
        >
          <el-table-column label="Name" min-width="150px" sortable>
            <template v-slot="{ row }">
              <b>{{ row.name }}</b>
            </template>
          </el-table-column>
          <el-table-column label="Email" min-width="200px" sortable>
            <template v-slot="{ row }">
              <b>{{ row.email }}</b>
            </template>
          </el-table-column>
          <el-table-column label="Phone" min-width="100px" sortable>
            <template v-slot="{ row }">
              <b>{{ row.phone }}</b>
            </template>
          </el-table-column>
          <el-table-column label="Status" min-width="100px" sortable>
            <template v-slot="{ row }">
              <b>{{ row.active ? 'Active' : 'Inactive' }}</b>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
      </template>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import User from "@/intefaces/User";

@Component({
  name: 'viewDepartmentUser',
  components: {}
})
export default class ViewDepartmentUser extends Vue {
  @Prop() isActive!: boolean;
  @Prop() departmentStaffs!: User;

  close() {
    this.$emit('update:isActive', false);
  }
}
</script>
