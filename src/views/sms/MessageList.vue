<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Messages</h3>
            <el-tooltip class="ml-3" content="Statistics of sent messages" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                 @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Filters" placement="top">
            <base-button
              icon
              size="sm"
              type="primary"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)"
            >
              <span class="btn-inner--text">Filters</span>
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
            </base-button>
          </el-tooltip>
        </div>
        <filter-drawer-component v-if="isFilterModelActive" :visible.sync="isFilterModelActive" direction="rtl"
                                 title="Messages Filter"
                                 @closeBtn="closeBtn" @resetBtn="onClickClear">
          <el-row>
            <el-col :span="11" style="padding: 0 2px">
              <base-input clearable>
                <flat-picker
                  ref="startDate"
                  :config="{ allowInput: true }"
                  class="form-control datepicker"
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
            <el-col v-show="startDate || endDate" :span="1" style="padding: 5px 0px 0px 0px;">
              <el-tooltip class="item" effect="dark" content="Top Center prompts info" placement="top">
                <el-button @click="onClickClear" size="mini" type="text" icon="el-icon-close" circle></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </filter-drawer-component>
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="messages"
    >
      <el-table-column label="SMS Body" min-width="250px" prop="body" sortable>
        <template v-slot="{ row }">
          <el-popover
            placement="bottom-start"
            width="300"
            trigger="hover"
          >
            <span class="text-center text-md">{{ row.body }}</span>
            <el-button type="info" size="small" round plain slot="reference">Show SMS</el-button>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column label="To" min-width="250px" prop="to" sortable>
        <template v-slot="{ row }">
          <b>{{ row.to }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Count" min-width="250px" prop="count" sortable>
        <template v-slot="{ row }">
          <b>{{ row.count }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Date" min-width="210px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="messages.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"
              :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Mixins, Watch} from 'vue-property-decorator';
import {Button, Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag, Popover, Row, Col} from
    'element-ui';
import Message from '@/intefaces/Messages';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import GIFModal from '@/components/tour/GIFModal.vue';
import FilterDrawerComponent from "@/components/FilterDrawerComponent.vue";
import {QueryBuilder} from "@/classes/QueryBuilder";
import moment from "moment";

const flatPicker = require("vue-flatpickr-component");

@Component({
  components: {
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag,
    [Button.name]: Button,
    [Popover.name]: Popover,
    [Row.name]: Row,
    [Col.name]: Col,
    FilterDrawerComponent,
    flatPicker
  }
})
export default class MessageList extends Mixins(PaginationComponentMixin) {
  private messages: Message[] = [];
  private showGIF: boolean = false;
  private queryBuilder: QueryBuilder = new QueryBuilder();
  private isFilterModelActive: boolean = false;
  private startDate: string = '';
  private endDate: string = '';
  public enable = true;
  protected form = {
    name: '',
  };
  private demoTourEntity: string = 'message';
  private GIFs: Array<any> = [
    {
      label: 'Create a message',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update a message',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete a message',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of message';

  get dateRange() {
    if (this.startDate && this.endDate) {
      return this.startDate + ',' + this.endDate;
    } else {
      return '';
    }
  }

  get getConfig(): any {
    let self = this;
    return {
      allowInput: true,
      disable: [
        function (date: Date) {
          return moment(self.startDate).diff(date) > 0
        }
      ]
    }
  }

  @Watch('startDate')
  async onChangeStartDate(value: string) {
    this.endDate = '';
    this.$nextTick(() => this.enable = false);
    this.$nextTick(() => this.enable = true);
    this.$nextTick(() => (this.$refs.endDate as Vue & { $el: { focus: Function; }; }).$el.focus());
  }

  onClickClear() {
    this.startDate = '';
    this.endDate = '';
    this.queryBuilder.addListener('range', '');
  }

  @Watch('dateRange')
  onChangeDateRange(value: string) {
    if (this.startDate && this.endDate) {
      this.queryBuilder.addListener('range', value);
    }
  }

  created() {
    this.fetchEntity();
  }

  @Watch('queryBuilder.watch')
  @Watch('pagination.currentPage')
  fetchEntity(): void {
    this.loading = true;
    this.$http.get(this.$api(`/messages?page=${this.pagination.currentPage}&${this.queryBuilder.getFilters()}`)).then(response => {
      this.messages = response.data.messages;
      this.setPagination(response.data);
      this.loading = false;
    });
  }

  closeBtn() {
    this.isFilterModelActive = false;
    this.onClickClear();
  }

  handleClose(done: any) {
    done();
  }

}
</script>
