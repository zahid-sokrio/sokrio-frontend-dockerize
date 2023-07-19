<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <modal :show="isActive" @close="close" size="lg" class="modal-dialog-scrollable">
      <template slot="header">
        <h5 class="modal-title"
            id="exampleModalLabel">View Outlets</h5>
      </template>
      <div>
        <el-table
          v-loading="loading"
          :data="routePlanOutlets"
          class="table-responsive align-items-center"
        >
          <el-table-column label="Outlet" min-width="200px" prop="name" sortable>
            <template v-slot="{row}">
              <div class="media align-items-center">
                <a href="#" class="avatar rounded-circle mr-3">
                  <async-image v-if="row.photo_url" v-slot="slotProps"
                               :url="row.photo_url">
                    <img :src="slotProps.imageSrc"/>
                  </async-image>
                  <i v-else class="ni ni-image"></i>
                </a>
                <div class="media-body">
                  <span class="font-weight-600 name mb-0 text-sm">{{ row.name }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Code" min-width="100px" prop="code" sortable></el-table-column>
          <el-table-column label="Address" min-width="120px" prop="address" sortable></el-table-column>
          <el-table-column label="Owner Name" min-width="120px" prop="owner_name" sortable></el-table-column>
          <el-table-column label="Phone No." min-width="120px" prop="phone_no" sortable></el-table-column>
        </el-table>
        <base-pagination
          v-if="routePlanOutlets.length > 0"
          class="mt-3"
          align="center"
          :perPage="pagination.entityPerPage"
          :total="pagination.totalEntity"
          v-model="pagination.currentPage"
          :disabled="loading"
        ></base-pagination>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
      </template>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator';
import {Dropdown, DropdownItem, DropdownMenu, Upload} from 'element-ui';
import Department from "@/intefaces/Department";
import PaginationComponentMixin from "@/mixins/PaginationComponent";
import AsyncImage from "@/components/AsyncImage.vue";
import RoutePlan from '@/intefaces/RoutePlan';
import { QueryBuilder } from '@/classes/QueryBuilder';

@Component({
  components: {
    AsyncImage,
  }
})
export default class ViewOutletForRoutePlan extends Mixins(PaginationComponentMixin) {
  @Prop() isActive!: boolean;
  @Prop() currentEntity!: RoutePlan;
  private routePlanOutlets: Department[] = [];
  private queryBuilder: QueryBuilder = new QueryBuilder();

  @Watch('pagination.currentPage')
  fetchRoutePlans() {
    this.$http.get(this.$api(`/route-plans/${this.currentEntity.id}/outlets?page=${this.pagination.currentPage}`)).then(response => {
      this.routePlanOutlets = response.data.outlets;
      this.setPagination(response.data);
      this.loading = false;
    })
  }

  created() {
    this.fetchRoutePlans();
  }

  close() {
    this.$emit('update:isActive', false);
  }
}
</script>
