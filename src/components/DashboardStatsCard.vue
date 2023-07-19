<template>
  <card class="card-stats" :show-footer-line="true" @click="clickEvent">
    <div class="row">

      <div class="col">
        <slot>
          <h5 class="card-title text-uppercase text-muted mb-0" v-if="title">
            <slot name="title">
              {{ title }}
            </slot>
          </h5>
          <slot name="subTitle" v-if="notLoading">
                        <span class="h2 font-weight-bold mb-0">
                            {{ subTitle }}
                        </span>
          </slot>
          <slot name="subTitle" v-else>
                        <span class="h2 font-weight-bold mb-0">
                            <i class="el-icon-loading"></i>
                        </span>
            <span text-muted text-lg> Loading ...</span>
          </slot>
        </slot>
      </div>

      <div class="col-auto" v-if="$slots.icon || icon">
        <slot name="icon">
          <div class="icon icon-shape text-white rounded-circle shadow"
               :class="[`bg-${type}`, iconClasses]">
            <i :class="icon"></i>
          </div>
        </slot>
      </div>
    </div>

    <p class="mt-3 mb-0 text-sm">
      <slot name="footer">

      </slot>
    </p>
  </card>
</template>
<script lang="ts">
import Card from '@/components/argon-core/Cards/Card.vue'
import { Component, Prop, Vue } from "vue-property-decorator";
import RouteBreadCrumb from "./argon-core/Breadcrumb/RouteBreadcrumb.vue";

@Component({
  name: 'dashboard-stats-card',
  components: {
    Card
  }
})

export default class DashboardStatsCard extends Vue {
  @Prop({default: 'primary'}) type!: {
    type: string,
  }
  @Prop() icon!: string;
  @Prop() title!: string;
  @Prop({default: 0}) subTitle!: number;
  @Prop() iconClasses!: string;
  @Prop() notLoading!: boolean;

  clickEvent(event: any) {
    this.$parent.$emit('click', event);
    this.$emit('click', event);
  }
}
</script>
<style></style>
