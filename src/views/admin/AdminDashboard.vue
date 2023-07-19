<template>
  <div class="wrapper">
    <side-bar :logo="`${$cdn}/img/logo.png`">
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Home',
            icon: 'ni ni-planet text-primary',
            path: '/',
          }"
        />

        <sidebar-item
          :link="{
            name: 'Subscription',
            path: '/admin/subscription/features',
            icon: 'ni ni-bullet-list-67 text-primary',
          }"
        >
        </sidebar-item>
      </template>
    </side-bar>
    <div class="main-content">
      <admin-dashboard-navbar :type="$route.name === 'alternative' ? 'light' : 'default'"></admin-dashboard-navbar>
      <!-- <router-view name="dashboard"></router-view> -->
      <div @click="$sidebar.displaySidebar(false)">
        <dashboard-content />
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable no-new */
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

function hasElement(className: string) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className: string) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import AdminDashboardNavbar from '@/views/admin/AdminDashboardNavbar.vue';
import ContentFooter from '@/components/layouts/argon/ContentFooter.vue';
import DashboardContent from '@/components/layouts/argon/Content.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    AdminDashboardNavbar,
    ContentFooter,
    DashboardContent,
  },
})
export default class AdminDashboard extends Vue {
  initScrollbar() {
    let isWindows = navigator.platform.startsWith('Win');
    if (isWindows) {
      initScrollbar('scrollbar-inner');
    }
  }

  mounted() {
    this.initScrollbar();
  }
}
</script>
<style lang="scss"></style>
