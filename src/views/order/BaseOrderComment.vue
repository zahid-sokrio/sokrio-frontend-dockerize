<template>
  <div>
    <el-popover
      class="mr-3"
      placement="top"
      trigger="hover"
      width="200">
      <ul class="list-group list-group-flush" data-toggle="checklist">
        <li class="list-group-item px-0">
          <div class="checklist-item checklist-item-success">
            <div class="checklist-success">
              <h5 class="checklist-title mb-0">{{ commentFromSr ? commentFromSr : 'No comment available' }}</h5>
              <small>- {{ commentor }} </small>
            </div>
          </div>
        </li>
      </ul>
      <el-button slot="reference" plain round size="small" type="info">Comments from SR</el-button>
    </el-popover>
    <el-popover
      placement="top"
      trigger="hover"
      width="300">
      <ul class="list-group list-group-flush" data-toggle="checklist">
        <li class="list-group-item px-0" v-for="(remark, index) in remarks" :key="remark.id">
          <el-tooltip :disabled="index !== 0" content="Current Status" placement="left">
            <div class="checklist-item"
                 :class="`${index == 0 ? 'checklist-item-info' : 'checklist-item-warning'}`">
              <div class="checklist-info">
                <h5 class="checklist-title mb-0">
                  {{ _.startCase(remark.status) }}</h5>
                <small>{{ remark.remarks ? remark.remarks : '-' }}</small>
                <br/>
                <small>{{ remark.created_at | datetime('ll') }} |
                  {{ remark.creator ? remark.creator.name : '-' }} </small>
              </div>
              <div>
                <i v-if="index == 0" class="ni ni-check-bold text-info"></i>
              </div>
            </div>
          </el-tooltip>
        </li>
      </ul>
      <el-button slot="reference" plain round size="small" type="info">Remarks</el-button>
    </el-popover>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Statuses from "@/intefaces/Statuses";
import { Button, Popover, Table, TableColumn, Tooltip } from "element-ui";

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Popover.name]: Popover,
    [Button.name]: Button,
  }
})
export default class BaseOrderComment extends Vue {
  @Prop() commentFromSr!: string;
  @Prop() remarks!: Statuses;
  @Prop() commentor!: string;
}

</script>
