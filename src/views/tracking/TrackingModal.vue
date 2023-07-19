<template>
  <modal :show="showTracking" modal-classes="modal-dialog-centered" @close="close()" class="modal-dialog-scrollable">
    <template slot="header">
      <h5 class="modal-title">Tracking History</h5>
    </template>
    <div>
      <div class="row row-grid justify-content-center">
        <div class="col-lg-10">
          <div class="table-responsive">
            <el-timeline>
              <el-timeline-item :timestamp="tracking.created_at | datetime('lll')"
                                :color="index==0? '#8ce5b5' : '#a9b4c1'"
                                placement="top"
                                v-for="(tracking,index) in allTrackings"
                                :key="index">
                <b class="text-sm text-primary">{{ tracking.address ? tracking.address : ' - ' }}</b><br>
                <p class="text-sm mt-3" style="color: #0b90a8"><i class="fa fa-battery-full"></i>
                  <span> {{ tracking.battery_percent ? tracking.battery_percent + "%" : ' - ' }} </span></p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <base-button type="primary" @click="close()">Close</base-button>
    </template>
  </modal>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {
  Tooltip,
  Timeline,
  TimelineItem,
  Card
} from 'element-ui';

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Timeline.name]: Timeline,
    [TimelineItem.name]: TimelineItem,
    [Card.name]: Card
  }
})
export default class TrackingModal extends Vue {
  private allTrackings: any = [];

  @Prop()
  currentUserId!: number;

  @Prop({type: Boolean, default: false})
  public showTracking!: boolean;

  close() {
    this.$emit('update:showTracking', false);
  }

  async mounted() {
    let {data} = await this.$http.get(this.$api(`/users/${this.currentUserId}/trackings?page=1`));
    this.allTrackings = data.trackings.slice(0, 10);
  }

}
</script>
<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
.el-timeline-item__timestamp.is-top {
  color: #c50e83;
}
</style>
