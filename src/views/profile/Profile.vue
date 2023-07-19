<template>
  <section>
    <base-header type="info">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">Profile</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-bread-crumb></route-bread-crumb>
          </nav>
        </div>
        <div class="col-lg-6 col-5 text-right">
          <slot name="action"></slot>
        </div>
      </div>
      <div class="col">
        <ul class="nav nav-tabs" id="profile-tab" role="tablist">
          <!-- <template v-for="(route, index) in ProfileRoutes.children">
            <li v-bind:key="route.path" class="nav-item p-1" @click="setCurrentTab(index)">
              <router-link :to="route.path">
                <span class="nav-link tab-link" :class="{ active: activeTab == index }" data-toggle="tab" role="tab" aria-controls="profile">
                  <i :class="route.icon" />
                  {{ route.label }}
                </span>
              </router-link>
            </li>
          </template> -->
        </ul>
      </div>
    </base-header>
    <div class="tab-content">
      <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
        <router-view />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
//@ts-ignore
import { Vue, Component } from 'vue-property-decorator';
import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb.vue';

import Route from '@/intefaces/Route';
import ProfileRoutes from '@/router/client-routes/ProfileRoutes';
@Component({
  components: { RouteBreadCrumb }
})
class Profile extends Vue {
  activeTab: number | null = 0;
  showModal: boolean = false;
  routes: Route = ProfileRoutes;
  formErrors: any = {};
  formInputs: any = {};

  get ProfileRoutes() {
    return ProfileRoutes;
  }

  created(): void {
    this.routes.children.forEach((route, index) => {
      if (this.$route.name === route.name) {
        this.activeTab = index;
      }
    });
  }

  setCurrentTab(tab = null) {
    if (tab === null) {
      this.activeTab = 0;
    } else {
      this.activeTab = tab;
    }
  }

  closeAndResetForm() {
    this.showModal = false;
    this.formInputs = {};
    this.formErrors = {};
  }
}

export default Profile;
</script>

<style scoped>
.nav-tabs {
  border-bottom: none;
}
</style>
