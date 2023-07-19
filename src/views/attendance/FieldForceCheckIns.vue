<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <ul class="list-group list-group-flush list my--3">
            <li class="list-group-item px-0">
              <div class="row align-items-center">
                <div class="col-auto">
                  <el-button @click="$router.back()" icon="fa fa-arrow-left" circle> </el-button>
                </div>
                <div class="col ml--2">
                  <small>List of CheckIns by Field Forces</small>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="users"
    >
      <el-table-column align="center" label="Name" min-width="210px" sortable prop="name">
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="First Check-In" min-width="170px" sortable prop="for">
        <template v-slot="{ row }">
          <b>{{ row.firstCheckIn | datetime('lll') }}</b>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Last Check-In" min-width="170px" sortable prop="type">
        <template v-slot="{ row }">
          <b>{{ row.lastCheckIn | datetime('lll') }}</b>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="users.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Button } from 'element-ui';
import PaginationComponentMixin from '@/mixins/PaginationComponent';

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [Button.name]: Button,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu
  }
})
export default class FieldForceCheckIns extends Mixins(PaginationComponentMixin) {
  @Prop()
  public currentEntity!: any;
  private users: any[] = [];

  created() {
    this.fetchEntity();
  }

  @Watch('pagination.currentPage')
  async fetchEntity() {
    this.loading = true;
    if (!this.currentEntity) return;
    this.$http.get(this.$api(`/checked-in-users?created_at=${this.currentEntity}&page=${this.pagination.currentPage}`)).then(response => {
      this.users = response.data.users;
      this.setPagination(response.data);
      this.loading = false;
    });
  }
}
</script>
