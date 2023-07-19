<template>
  <modal :show="isActiveView" v-if="isActiveView" @close="close">
    <template slot="header">
      <h5 id="exampleModalLabel" class="modal-title">Target Breakdown</h5>
    </template>
    <div v-if="targetProduct == ''">
      No data Found
    </div>
    <div v-else>
      <el-table :data="targetProduct" class="table-responsive align-items-center table-flush table-striped" header-row-class-name="thead-light">
        <el-table-column label="Product" min-width="310px" prop="label" sortable>
          <template v-slot="{ row }">
            <div v-if="row.product_id">
              <b v-if="row.product.base_product">
                {{ row.product.base_product.name }} - {{ row.product.base_product.sku }}
                <badge type="info">Batch - {{ row.product.batch.name }}</badge>
              </b>
              <b v-else> - </b>
            </div>
            <div v-else>
              {{ row.base_product_name }}
              <badge type="info">SKU - {{ row.sku }}</badge>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Amount" min-width="120px" prop="label" align="center" sortable>
          <template v-slot="{ row }">
            <b>{{ row.amount }} </b>
          </template>
        </el-table-column>
        <el-table-column label="Units" min-width="100px" align="right" prop="label" sortable>
          <template v-slot="{ row }">
            <div v-if="row.product_id">
              <div v-if="JSON.parse(row.product.base_product.units)">
                <badge v-for="(item, index) in JSON.parse(row.product.base_product.units)" :key="index" type="primary">
                  {{ item.name + ' : ' + item.value * row.amount }}
                </badge>
              </div>
            </div>
            <div v-else>
              <badge v-for="(item, index) in JSON.parse(row.units)" :key="index" type="primary">
                {{ item.name + ' : ' + row.amount * item.value }}
              </badge>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <span style="float: left">Total</span>
      <b style="float: right; margin-right: 145px">{{ total }}</b>
    </div>
    <template slot="footer">
      <base-button type="secondary" @click="close">Close</base-button>
    </template>
  </modal>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip } from 'element-ui';

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu
  },
  name: 'TragetViewForm'
})
export default class TragetViewForm extends Vue {
  @Prop() isActiveView!: boolean;
  @Prop() targetProduct!: any;
  private sum = 0;

  get total() {
    this.sum = 0;
    this.targetProduct.forEach((e: any) => {
      this.sum += e.amount;
    });
    return this.sum;
  }

  close() {
    this.$emit('update:isActiveView', false);
  }
}
</script>

<style lang="css">
.modal {
  height: 100vh;
  overflow: scroll !important;
}
@-moz-document url-prefix() {
  .modal {
    overflow: scroll !important;
  }
}
</style>
