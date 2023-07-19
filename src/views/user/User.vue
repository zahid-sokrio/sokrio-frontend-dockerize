<template>
  <section>
    <base-header type="info">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">User</h6>
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
          <template v-for="(route, index) in UserRoutes.children">
            <li
              class="nav-item"
              v-bind:key="route.path"
              v-can="route.meta.permission"
            >
              <router-link :to="route.path">
                <span
                  :class="{ active: activeTab == index }"
                  @click="setCurrentTab(index)"
                  aria-controls="profile"
                  class="nav-link tab-link"
                  data-toggle="tab"
                  role="tab"
                >
                  <i :class="route.meta.icon"/> {{ route.meta.label }}
                </span>
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </base-header>
    <div class="tab-content">
      <div aria-labelledby="home-tab" class="tab-pane fade show active" id="home" role="tabpanel">
        <router-view/>
      </div>
    </div>
    <!--        </card>-->
  </section>
</template>
<script lang="ts">
  //@ts-ignore
  import {Component, Vue} from 'vue-property-decorator';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb.vue';
  import {RouteConfig} from "vue-router";
  import UserRoutes from "@/router/client-routes/UserRoutes";

  @Component({
    components: {RouteBreadCrumb}
  })
  class User extends Vue {
    activeTab: number | null = 0;
    showModal: boolean = false;
    routes: RouteConfig = UserRoutes;
    formErrors: any = {};
    formInputs: any = {};

    get UserRoutes() {
      return UserRoutes;
    }

    created(): void {
      if (this.routes.children === undefined) return;
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

  export default User;
</script>
