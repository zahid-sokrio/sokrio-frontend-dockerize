<template>
  <section>
    <base-header class="pb-6" type="info">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">{{ title }}</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-bread-crumb></route-bread-crumb>
          </nav>
        </div>
        <div class="col-lg-6 col-5 text-right">
          <slot name="action"></slot>
        </div>
      </div>
      <slot name="header"></slot>
    </base-header>
    <div class="container-fluid mt--6">
      <slot></slot>
    </div>
  </section>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb.vue';
@Component({
  components: {
    RouteBreadCrumb
  }
})
export default class Box extends Vue {
  @Prop({ required: false, type: String, default: 'Title' })
  readonly title!: string;
  @Prop({ required: false, type: Boolean, default: false })
  readonly noAction!: boolean;
}
</script>
