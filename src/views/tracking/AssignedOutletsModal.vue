<template>
  <div>
    <modal :show="showOutlets" modal-classes="modal-dialog-centered" class="modal-dialog-scrollable" size="lg" @close="close">
      <template slot="header">
        <h5 class="modal-title">TODAY'S OUTLETS</h5>
      </template>
      <div>
        <!-- table start -->
        <div class="row row-grid justify-content-center">
          <div class="col-lg-12">
            <div class="table-responsive">
              <el-tabs v-model="activeName">
                <el-tab-pane label="Today's Assigned Outlets" name="insideRoute">
                  <el-table
                    class="table-responsive align-items-center table-flush table-striped"
                    header-row-class-name="thead-light" :data="assignedOutlets">

                      <el-table-column label="Outlet Name" min-width="100px" prop="name" sortable>
                        <template v-slot="{ row }">
                          <b>{{ row.name }}</b>
                        </template>
                      </el-table-column>
                      <el-table-column label="Address" min-width="150px" prop="name" sortable>
                        <template v-slot="{ row }">
                          <b>{{ row.address }}</b>
                        </template>
                      </el-table-column>
                      <el-table-column label="Check-In Time" min-width="100px" prop="name" sortable>
                        <template v-slot="{ row }">
                          <b v-if="row.check_in_time">{{ row.check_in_time | datetime('lll') }}</b>
                          <b v-else>-</b>
                        </template>
                      </el-table-column>
                      <el-table-column label="Selfie" min-width="80px" prop="name" sortable>
                        <template v-slot="{ row }">
                          <base-button
                            v-if="row.selfie_url"
                            size="sm"
                            type="primary"
                            @click="selfieURL = row.selfie_url, showSelfie = true"
                          >View Selfie
                          </base-button
                          >
                          <span v-else> - </span>
                        </template>
                      </el-table-column>

                  </el-table>
                </el-tab-pane>

                <el-tab-pane label="Check-Ins Outside Visit Plan" name="outsideRoute">
                  <el-table
                            class="table-responsive align-items-center table-flush table-striped"
                            header-row-class-name="thead-light" :data="outsideOutlets">

                      <el-table-column label="Outlet Name" min-width="100px" prop="name" sortable>
                        <template v-slot="{ row }">
                          <b>{{ row.department.name }}</b>
                        </template>
                      </el-table-column>
                      <el-table-column label="Address" min-width="150px" prop="name" sortable>
                        <template v-slot="{ row }">
                          <b>{{ row.department.address }}</b>
                        </template>
                      </el-table-column>
                      <el-table-column label="Check-In Time" min-width="100px" prop="name" sortable>
                        <template v-slot="{ row }">
                          <b v-if="row.created_at">{{ row.created_at | datetime('lll') }}</b>
                          <b v-else>-</b>
                        </template>
                      </el-table-column>
                      <el-table-column label="Selfie" min-width="80px" prop="name" sortable>
                        <template v-slot="{ row }">
                          <base-button
                            v-if="row.selfie_url"
                            size="sm"
                            type="primary"
                            @click="selfieURL = row.selfie_url, showSelfie = true"
                          >View Selfie
                          </base-button
                          >
                          <span v-else> - </span>
                        </template>
                      </el-table-column>

                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <template slot="footer">
        <base-button type="primary" @click="close()">Close</base-button>
      </template>

    </modal>
    <modal :show="showSelfie" modal-classes="modal-dialog-centered" v-if="showSelfie" @close="showSelfie = false">
      <template slot="header">
        <h5 class="modal-title">Selfie</h5>
      </template>
      <div>
        <div class="row row-grid justify-content-center">
          <div class="col-lg-12">
            <div class="text-center">
              <async-image v-slot="slotProps"
                           :url="selfieURL">
                <img :src="slotProps.imageSrc" align="center" width="400px"/>
              </async-image>
            </div>
          </div>
        </div>
      </div>

      <template slot="footer">
        <base-button type="primary" @click="showSelfie = false">Close</base-button>
      </template>
    </modal>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tabs, TabPane} from 'element-ui';
import AsyncImage from "@/components/AsyncImage.vue";

@Component({
  components: {
    AsyncImage,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
  }
})
export default class AssignedOutletsModal extends Vue {
  private assignedOutlets: any = [];
  private outsideOutlets: any = [];
  private activeName: string = 'insideRoute';
  @Prop({type: Boolean, default: false})
  public showOutlets!: boolean;
  public showSelfie: boolean = false;
  private selfieURL: string = '';

  @Prop()
  currentUserId!: number;

  close() {
    this.$emit('update:showOutlets', false);
  }

  @Watch('activeName')
  async onChangeActiveName() {
    let {data} = await this.$http.get(this.$api(`/users/${this.currentUserId}/todays-unplanned-check-ins`));
    this.outsideOutlets = data.unplannedCheckIns;
  }

  async mounted() {
    let {data} = await this.$http.get(this.$api(`/users/${this.currentUserId}/todays-outlets`));
    this.assignedOutlets = data.todaysOutlets;
  }
}
</script>
