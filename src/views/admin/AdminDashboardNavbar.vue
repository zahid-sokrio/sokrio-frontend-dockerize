<template>
  <base-nav container-classes="container-fluid" class="navbar-top border-bottom navbar-expand" :class="{ 'bg-info navbar-dark': type === 'default' }">
    <!-- Search form -->
    <form
      class="navbar-search form-inline mr-sm-3"
      :class="{ 'navbar-search-light': type === 'default', 'navbar-search-dark': type === 'light' }"
      id="navbar-search-main"
    >
      <div class="form-group mb-0">
        <div class="input-group input-group-alternative input-group-merge">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="fas fa-search"></i>
            </span>
          </div>
          <input class="form-control" placeholder="Search" type="text" />
        </div>
      </div>
      <button type="button" class="close" data-action="search-close" data-target="#navbar-search-main" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </form>
    <!-- Navbar links -->
    <ul class="navbar-nav align-items-center ml-md-auto">
      <li class="nav-item d-xl-none">
        <!-- Sidenav toggler -->
        <div
          class="pr-3 sidenav-toggler"
          :class="{ active: $sidebar.showSidebar, 'sidenav-toggler-dark': type === 'default', 'sidenav-toggler-light': type === 'light' }"
          @click="toggleSidebar"
        >
          <div class="sidenav-toggler-inner">
            <i class="sidenav-toggler-line"></i>
            <i class="sidenav-toggler-line"></i>
            <i class="sidenav-toggler-line"></i>
          </div>
        </div>
      </li>
      <li class="nav-item d-sm-none">
        <a class="nav-link" href="#" data-action="search-show" data-target="#navbar-search-main">
          <i class="ni ni-zoom-split-in"></i>
        </a>
      </li>
      <base-dropdown
        class="nav-item"
        tag="li"
        title-classes="nav-link"
        title-tag="a"
        icon="ni ni-bell-55"
        menu-classes="dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden"
      >
        <template>
          <!-- Dropdown header -->
          <div class="px-3 py-3">
            <h6 class="text-sm text-muted m-0">
              You have
              <strong class="text-primary">13</strong> notifications.
            </h6>
          </div>
          <!-- List group -->
          <div class="list-group list-group-flush">
            <a href="#!" class="list-group-item list-group-item-action">
              <div class="row align-items-center">
                <div class="col-auto">
                  <!-- Avatar -->
                  <img
                    alt="Image placeholder"
                    :src="`${$cdn}/img/avatar.png`"
                    class="avatar rounded-circle"
                  />
                </div>
                <div class="col ml--2">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 class="mb-0 text-sm">John Snow</h4>
                    </div>
                    <div class="text-right text-muted">
                      <small>2 hrs ago</small>
                    </div>
                  </div>
                  <p class="text-sm mb-0">Let's meet at Starbucks at 11:30. Wdyt?</p>
                </div>
              </div>
            </a>
            <a href="#!" class="list-group-item list-group-item-action">
              <div class="row align-items-center">
                <div class="col-auto">
                  <!-- Avatar -->
                  <img
                    alt="Image placeholder"
                    :src="`${$cdn}/img/avatar.png`"
                    class="avatar rounded-circle"
                  />
                </div>
                <div class="col ml--2">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 class="mb-0 text-sm">John Snow</h4>
                    </div>
                    <div class="text-right text-muted">
                      <small>3 hrs ago</small>
                    </div>
                  </div>
                  <p class="text-sm mb-0">A new issue has been reported for Argon.</p>
                </div>
              </div>
            </a>
            <a href="#!" class="list-group-item list-group-item-action">
              <div class="row align-items-center">
                <div class="col-auto">
                  <!-- Avatar -->
                  <img
                    alt="Image placeholder"
                    :src="`${$cdn}/img/avatar.png`"
                    class="avatar rounded-circle"
                  />
                </div>
                <div class="col ml--2">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 class="mb-0 text-sm">John Snow</h4>
                    </div>
                    <div class="text-right text-muted">
                      <small>5 hrs ago</small>
                    </div>
                  </div>
                  <p class="text-sm mb-0">Your posts have been liked a lot.</p>
                </div>
              </div>
            </a>
            <a href="#!" class="list-group-item list-group-item-action">
              <div class="row align-items-center">
                <div class="col-auto">
                  <!-- Avatar -->
                  <img
                    alt="Image placeholder"
                    :src="`${$cdn}/img/avatar.png`"
                    class="avatar rounded-circle"
                  />
                </div>
                <div class="col ml--2">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 class="mb-0 text-sm">John Snow</h4>
                    </div>
                    <div class="text-right text-muted">
                      <small>2 hrs ago</small>
                    </div>
                  </div>
                  <p class="text-sm mb-0">Let's meet at Starbucks at 11:30. Wdyt?</p>
                </div>
              </div>
            </a>
            <a href="#!" class="list-group-item list-group-item-action">
              <div class="row align-items-center">
                <div class="col-auto">
                  <!-- Avatar -->
                  <img
                    alt="Image placeholder"
                    :src="`${$cdn}/img/avatar.png`"
                    class="avatar rounded-circle"
                  />
                </div>
                <div class="col ml--2">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 class="mb-0 text-sm">John Snow</h4>
                    </div>
                    <div class="text-right text-muted">
                      <small>3 hrs ago</small>
                    </div>
                  </div>
                  <p class="text-sm mb-0">A new issue has been reported for Argon.</p>
                </div>
              </div>
            </a>
          </div>
          <!-- View all -->
          <a href="#!" class="dropdown-item text-center text-primary font-weight-bold py-3">View all</a>
        </template>
      </base-dropdown>
      <base-dropdown
        menu-classes="dropdown-menu-lg dropdown-menu-dark bg-default dropdown-menu-right"
        class="nav-item"
        tag="li"
        title-tag="a"
        title-classes="nav-link"
        icon="ni ni-ungroup"
      >
        <template>
          <div class="row shortcuts px-4">
            <router-link to="/organization/departments" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-red">
                <!-- <i class="ni ni-calendar-grid-58"></i> -->
                <i class="ni ni-shop"></i>
              </span>
              <small>Department</small>
            </router-link>
            <router-link to="/product/products" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-orange">
                <!-- <i class="ni ni-email-83"></i> -->
                <i class="ni ni-basket"></i>
              </span>
              <small>Products</small>
            </router-link>
            <router-link to="/order/requisitions" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-info">
                <!-- <i class="ni ni-credit-card"></i> -->
                <i class="fa fa-shopping-cart"></i>
              </span>
              <small>Requisitions</small>
            </router-link>
            <router-link to="/tracking/territories" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-green">
                <!-- <i class="ni ni-books"></i> -->
                <i class="fa fa-map"></i>
              </span>
              <small>Territory</small>
            </router-link>
            <router-link to="/order/invoices" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-purple">
                <!-- <i class="ni ni-pin-3"></i> -->
                <i class="fas fa-file-invoice"></i>
              </span>
              <small>Invoices</small>
            </router-link>
            <router-link to="/user/targets" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-black">
                <!-- <i class="ni ni-basket"></i> -->
                <i class="fas fa-bullseye"></i>
              </span>
              <small>Targets</small>
            </router-link>
          </div>
        </template>
      </base-dropdown>
    </ul>
    <ul class="navbar-nav align-items-center ml-auto ml-md-0">
      <base-dropdown
        menu-on-right
        class="nav-item"
        tag="li"
        title-tag="a"
        title-classes="nav-link pr-0"
      >
        <a href="#" class="nav-link pr-0" @click.prevent slot="title-container">
          <div class="media align-items-center">
            <span class="avatar avatar-sm rounded-circle">
              <img alt="Image placeholder" :src="`${$cdn}/img/avatar.png`" />
            </span>
            <div class="media-body ml-2 d-none d-lg-block">
              <span class="mb-0 text-sm font-weight-bold">{{ $store.getters['AdminAuth/admin'].name }}</span>
            </div>
          </div>
        </a>

        <template>
          <div class="dropdown-header noti-title">
            <h6 class="text-overflow m-0">Welcome!</h6>
          </div>
          <a href="#!" class="dropdown-item">
            <i class="ni ni-single-02"></i>
            <span>My profile</span>
          </a>
          <a href="#!" class="dropdown-item">
            <i class="ni ni-settings-gear-65"></i>
            <span>Settings</span>
          </a>
          <a href="#!" class="dropdown-item">
            <i class="ni ni-calendar-grid-58"></i>
            <span>Activity</span>
          </a>
          <a href="#!" class="dropdown-item">
            <i class="ni ni-support-16"></i>
            <span>Support</span>
          </a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" @click.prevent="signOut">
            <i class="ni ni-user-run"></i>
            <span>Logout</span>
          </a>
        </template>
      </base-dropdown>
    </ul>
  </base-nav>
</template>
<script lang="ts">
// @ts-ignore
import { CollapseTransition } from 'vue2-transitions';
import BaseNav from '@/components/argon-core/Navbar/BaseNav.vue';
import Modal from '@/components/argon-core/Modal.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const auth = namespace('AdminAuth');

@Component({
  components: {
    // CollapseTransition,
    BaseNav
    // Modal
  }
})
export default class AdminDashboardNavbar extends Vue {
  private activeNotifications: boolean = false;
  private showMenu: boolean = false;
  private searchModalVisible: boolean = false;
  private searchQuery: string = '';

  @Prop({ required: false, type: String, default: 'Developer' })
  readonly type!: string;

  @auth.Action
  public logout!: (payload: any) => Promise<any>;

  get routeName() {
    const { name }: any = this.$route;
    return this.capitalizeFirstLetter(name);
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  toggleNotificationDropDown() {
    this.activeNotifications = !this.activeNotifications;
  }
  closeDropDown() {
    this.activeNotifications = false;
  }

  toggleSidebar() {
    this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
  }

  hideSidebar() {
    this.$sidebar.displaySidebar(false);
  }

  signOut() {
    this.logout({ vm: this }).then(response => {
      this.$notify({
        title: 'Success',
        message: 'Logout successful',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
      this.$router.push({ name: 'admin-login' });
    });
  }
}
</script>
