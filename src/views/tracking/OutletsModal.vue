<template>
  <modal :show="showOutletModal" modal-classes="modal-dialog-centered" @close="HideOutletModal">
    <template slot="header">
      <h5 class="modal-title" id="showOutlets">Outlets</h5>
    </template>
    <div>
      <div class="row row-grid justify-content-center">
        <div class="col-lg-10">
          <div class="table-responsive">
            <base-table class="table mt-3" :data="outlets">
              <template slot-scope="{ row }">
                <td class="text-center">
                  <el-tag type="success" class="text-center">{{ row.name }} </el-tag>
                </td>
              </template>
            </base-table>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <base-button type="primary" @click="HideOutletModal()">Close</base-button>
    </template>
  </modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import BaseTable from '@/components/argon-core/BaseTable.vue';
import { Table, TableColumn, Tag } from 'element-ui';

@Component({
  components: { [Table.name]: Table, [TableColumn.name]: TableColumn, BaseTable, [Tag.name]: Tag }
})
export default class OutletsModal extends Vue {
  @Prop()
  outlets!: any;

  @Prop()
  showOutletModal!: any;

  HideOutletModal() {
    this.$emit('update:showOutletModal', false);
  }
}
</script>
