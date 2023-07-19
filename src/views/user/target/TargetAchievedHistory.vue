<template>
  <modal :show="isActive" modal-classes="modal-dialog-centered" class="modal-dialog-scrollable" @close="close()" ref="myModal">
    <template slot="header">
      <h5
        id="exampleModalLabel"
        class="modal-title"
      > Achievement History </h5>
    </template>
    <el-popover
      v-if="currentTarget.type == 'product'"
      placement="bottom-end"
      trigger="click"
      width="400">
      <div class="card">
        <div class="card-header">
          <h5 class="h3 mb-0">Products</h5>
        </div>
        <div class="card-body">
          <ul class="list-group list-group-flush list my--4">
            <li v-for="product in targetProducts" :key="product.id" class="list-group-item px-0">
              <div class="row align-items-center">
                <div class="col-auto">
                  <a class="avatar rounded-circle" href="#">
                    <async-image v-if="product.product.image_url" v-slot="slotProps"
                                 :url="product.product.image_url">
                      <img :src="slotProps.imageSrc"/>
                    </async-image>
                    <i v-else class="ni ni-image"></i>
                  </a>
                </div>
                <div class="col ml--2">
                  <h4 v-if="product.product" class="mb-0">{{ product.product.base_product.name }}
                    ({{ product.product.base_product.sku }})</h4>
                  <small>Amount :{{ product.amount }} | Achieved :{{ product.achieved }}</small>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <base-button slot="reference" outline size="sm" style="float: right"
                   type="info">
        Achieved Product Breakdown
      </base-button>
    </el-popover>
    <div class="table-responsive">
      <div class="text-center mt-3" v-if="targetAchievements.length <= 0">
        <span>No Achievement Found.</span>
      </div>
      <el-timeline v-else>
        <span class="hidden" id="firstItemTrigger" ref="firstItemTrigger"></span>
        <el-timeline-item :timestamp="targetAchieved.created_at | datetime('lll')"
                          :color="index==0? '#8ce5b5' : '#a9b4c1'"
                          placement="top"
                          v-for="(targetAchieved,index) in targetAchievements"
                          :key="index">
          <b class="text-sm text-primary">Achieved : {{ targetAchieved.achieved }} | Achieved By:
            {{ targetAchieved.user ? targetAchieved.user.name : '-' }}</b><br>
        </el-timeline-item>
        <span id="lastItemTrigger" ref="lastItemTrigger"></span>
      </el-timeline>
    </div>
    <template slot="footer">
      <base-button type="primary" @click="close()">Close</base-button>
    </template>
  </modal>
</template>
<script lang="ts">
import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator';
import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Timeline, TimelineItem, Tooltip} from "element-ui";
import Target from "@/intefaces/Target";
import PaginationComponentMixin from "@/mixins/PaginationComponent";
import TargetAchievement from "@/intefaces/TargetAchievement";

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Timeline.name]: Timeline,
    [TimelineItem.name]: TimelineItem,
  },
  name: 'TargetAchievedHistory'
})
export default class TargetAchievedHistory extends Vue {
  @Prop()
  public isActive!: boolean;
  @Prop()
  public currentTarget!: Target;
  private targetAchievements: TargetAchievement[] = [];
  private root_scrollbar__wrap!: Element & ElementCSSInlineStyle;
  private firstItemTrigger!: Element & ElementCSSInlineStyle;
  private lastItemTrigger!: Element & ElementCSSInlineStyle;
  private observing = false;
  private observer!: IntersectionObserver;
  private targetProducts: any = [];
  private pagination: any = {
    currentPage: 1,
    per_page: 0,
    next_page_url: null,
    last_page: null,
  };

  @Watch('targetAchievements')
  onChangeEntity(value: any[]) {
    this.$emit('targetAchievements', value);
    this.$nextTick(() => {
      if(value.length > 0) {
        if (this.pagination.next_page_url && !this.observing) {
          this.initInterceptionObserver();
        }
      }
    })
  }

  initInterceptionObserver() {
    let firstItemTrigger = this.$refs.firstItemTrigger as Element;
    let lastItemTrigger = this.$refs.lastItemTrigger as Element;
    this.observer.observe(firstItemTrigger);
    this.observer.observe(lastItemTrigger);
    this.observing = true;
  }

  mounted() {
    this.root_scrollbar__wrap = this.$el.querySelector('.el-scrollbar__wrap') as Element & ElementCSSInlineStyle;
    this.firstItemTrigger = this.$el.querySelector('#firstItemTrigger') as Element & ElementCSSInlineStyle;
    this.lastItemTrigger = this.$el.querySelector('#lastItemTrigger') as Element & ElementCSSInlineStyle;
    this.observer = new IntersectionObserver(this.intersectionHandler, { root: this.root_scrollbar__wrap });
  }

  async intersectionHandler(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    for await (const entry of entries) {
      if (entry.target.id == 'lastItemTrigger' && entry.isIntersecting && this.pagination.next_page_url) {
        this.handleLoadMore();
      }
    }
  }

    handleLoadMore() {
    if(this.pagination.last_page > this.pagination.currentPage) {
      this.pagination.currentPage += 1;
    }
  }

  @Watch('pagination.currentPage')
  async fetchTarget() {
    this.$http.get(this.$api(`/targets/${this.currentTarget.id}/achievements?with=achievedBy&page=${this.pagination.currentPage}`)).then(response => {
      this.pagination.last_page = response.data.last_page;
      this.pagination.next_page_url = response.data.next_page_url;
      if (this.pagination.currentPage == 1) {
        this.targetAchievements = response.data.targetAchievements;
      } else {
        response.data.targetAchievements.forEach((item: any) => {
          this.targetAchievements.push(item);
        })
      }
    });
  }

  @Watch('currentTarget', {immediate: true, deep: true})
  fetchTargetProduct(newVal: any) {
    if(newVal.type == "product") {
      this.$http.get(this.$api(`/targets/${this.currentTarget.id}/target-products`)).then(response => {
        this.targetProducts = response.data.targetProducts;
      })
    }
  }

  close() {
    this.$emit('update:isActive', false);
  }

  created() {
    this.fetchTarget();
  }
}
</script>
<style>
#firstItemTrigger {
  max-height: 1px;
  min-height: 1px;
  position: relative;
  top: 50px;
  visibility: hidden;
}

#lastItemTrigger {
  max-height: 1px;
  min-height: 1px;
  position: relative;
  top: -50px;
  visibility: hidden;
}
</style>
