<template>
  <base-nav container-classes="container" class="navbar-top border-bottom navbar-expand" :class="{
    'navbar-dark': type === 'default' }" :style="{'background-color': themeColor}" :key="Number(themeColor)">
    <search-focus @keyup="focusSearch"></search-focus>
    <!-- Search form -->
    <form class="navbar-search form-inline mr-sm-3"
          :class="{ 'navbar-search-light': type === 'default', 'navbar-search-dark': type === 'light' }">
      <div class="form-group mb-0">
        <div class="input-group input-group-alternative input-group-merge">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="fas fa-search"></i>
            </span>
          </div>
          <input
            class="form-control"
            placeholder='Search (Press "/" to focus)'
            v-model="searchQuery"
            @blur="searchResultsVisible = false"
            @focus="searchResultsVisible = true"
            @keydown.esc="searchResultsVisible = false"
            @keydown.up.prevent="highlightPrevious"
            @keydown.down.prevent="highlightNext"
            @keydown.enter.prevent="gotoLink"
            @input="softReset"
            ref="search"
            type="text"
          />
          <div class="dropdown-list" v-if="searchQuery.length > 0 && searchResultsVisible">
            <div
              class="dropdown-item"
              v-for="(route, index) in filteredSearch"
              :key="index"
              @mousedown.prevent="searchResultsVisible = true"
              @click="gotoRoute(route)"
              :class="{ highlighted: index == highlightedIndex }"
            >
              <div>
                <h3>
                  {{ route.name }}
                  <!-- <span class="text-primary">{{ route.capital }}</span> -->
                </h3>
                <p>{{ route.description }}</p>
              </div>
            </div>
          </div>
          <div class="dropdown-list" v-if="filteredSearch.length === 0">
            <div class="dropdown-item">
              <h4>
                No results for
                <span class="text-primary">{{ searchQuery }}</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
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
        menu-classes="dropdown-menu-lg dropdown-menu-light dropdown-menu-right"
        class="nav-item"
        tag="li"
        title-tag="a"
        title-classes="nav-link"
        icon="ni ni-ungroup"
      >
        <template>
          <div class="row shortcuts px-4">
            <router-link to="/department/departments" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-red">
                <!-- <i class="ni ni-calendar-grid-58"></i> -->
                <i class="ni ni-shop"></i>
              </span>
              <small>Department</small>
            </router-link>
            <router-link to="/inventory/products" class="col-4 shortcut-item">
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
            <router-link to="/territory/territories" class="col-4 shortcut-item">
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
      <base-dropdown menu-on-right class="nav-item" tag="li" title-tag="a" title-classes="nav-link pr-0">
        <a href="#" class="nav-link pr-0" @click.prevent slot="title-container">
          <div class="media align-items-center">
            <span class="avatar avatar-sm rounded-circle">
<!--              <img v-if="$store.getters['Auth/getCurrentUser'].propic_url" alt="Image placeholder" :src="imageSrc" />-->

              <async-image v-slot="slotProps" v-if="$store.getters['Auth/getCurrentUser'].propic_url" :key="navbarKey"
                           :url="$store.getters['Auth/getCurrentUser'].propic_url">
                      <img :src="slotProps.imageSrc" class="rounded-circle"/>
                    </async-image>
              <img v-else alt="avatar" :src="`${$cdn}/img/avatar.png`"/>
            </span>
            <div class="media-body ml-2 d-none d-lg-block">
              <span class="mb-0 text-sm font-weight-bold">{{ $store.getters['Auth/getCurrentUser'].name }}</span>
            </div>
          </div>
        </a>

        <template>
          <div class="dropdown-header noti-title">
            <h6 class="text-overflow m-0">Welcome!</h6>
          </div>
          <router-link to="/profile" class="dropdown-item">
            <i class="ni ni-single-02"></i>
            <span>My profile</span>
          </router-link>
          <!--          <a href="#!" class="dropdown-item">-->
          <!--            <i class="ni ni-settings-gear-65"></i>-->
          <!--            <span>Settings</span>-->
          <!--          </a>-->
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
import SearchFocus from './SearchFocus.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import routeList from '../../../../public/routes.json';

const auth = namespace('Auth');
import OrderAproval from '@/views/setting/Miscellaneous/Miscellaneous.vue';
import AsyncImage from "@/components/AsyncImage.vue";

@Component({
  components: {
    AsyncImage,
    // CollapseTransition,
    BaseNav,
    SearchFocus,
    OrderAproval
    // Modal
  }
})
export default class DashboardNavbar extends Vue {
  private activeNotifications: boolean = false;
  private showMenu: boolean = false;
  private searchModalVisible: boolean = false;
  private searchQuery: string = '';
  private searchResults: any[] = [];
  private routes: any[] = routeList;
  private searchResultsVisible: boolean = false;
  private highlightedIndex: number = 0;

  @Prop({required: false, type: String, default: 'Developer'})
  readonly type!: string;

  @auth.Action
  public logout!: (payload: any) => Promise<any>;

  get routeName() {
    const {name}: any = this.$route;
    return this.capitalizeFirstLetter(name);
  }

  get themeColor() {
    return this.$store.getters['Theme/getThemeColor']
  }

  get navbarKey() {
    return this.$store.getters['Auth/getNavbarKey'];
  }

  // performSearch() {
  //   let matches = this.routes.filter((route) => {
  //     const regex = new RegExp(`^${this.searchQuery}`, 'gi');
  //     return route.name.match(regex) || route.abbr.match(regex);
  //   });
  //   this.searchResults = matches;
  //   return this.routes.filter((route) => {
  //     return route.name.match(this.searchQuery);
  //   });
  //   console.log(this.searchQuery);
  // }

  get filteredSearch() {
    return this.routes.filter(route => {
      return route.name.toLowerCase().startsWith(this.searchQuery.toLowerCase());
      // const regex = new RegExp(`^${this.searchQuery}`, 'gi');
      // return route.name.match(regex) || route.description.match(regex);
    });
  }

  gotoRoute(route: any) {
    if (this.$route.path !== route.path) {
      this.$router.push({path: route.path});
    }
    this.searchQuery = route.name;
    // console.log(this.$route.path);
    // console.log(route.path);
  }

  gotoLink() {
    if (this.filteredSearch[this.highlightedIndex]) {
      // window.location = this.filteredSearch[this.highlightedIndex].path;
      // this.searchQuery = this.filteredSearch[this.highlightedIndex].name;
      if (this.$route.path !== this.filteredSearch[this.highlightedIndex].path) {
        this.$router.push({path: this.filteredSearch[this.highlightedIndex].path});
      }
      this.searchQuery = this.filteredSearch[this.highlightedIndex].name;
    }
  }

  focusSearch(e: any) {
    if (e.key === '/') {
      // this.$refs.search.focus()
      (this.$refs.search as any).focus();
    }
  }

  softReset() {
    this.searchResultsVisible = true;
    this.highlightedIndex = 0;
  }

  highlightPrevious() {
    if (this.highlightedIndex > 0) {
      this.highlightedIndex = this.highlightedIndex - 1;
    }
  }

  highlightNext() {
    if (this.highlightedIndex < this.filteredSearch.length - 1) {
      this.highlightedIndex = this.highlightedIndex + 1;
    }
  }

  // mounted() {
  //   axios.get('./routes.json').then((response) => (this.routes = response.data));
  // }

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
    this.logout({vm: this}).then(response => {
      this.$notify({
        title: 'Success',
        message: 'Logout successful',
        duration: 5000,
        iconClass: 'ni ni-bell-55',
        type: 'success'
      });
      this.$router.push({name: 'login'});
    });
  }
}
</script>

<style scoped>
.dropdown {
  position: relative;
  width: 100%;
  max-width: 400px;
  z-index: 1;
}

.dropdown-input,
.dropdown-selected {
  width: 60%;
  padding: 8px 14px;
  border: 1px solid transparent;
  /* background: #edf2f7; */
  line-height: 1.5em;
  outline: none;
  border-radius: 20px;
}

.dropdown-input:focus,
.dropdown-selected:hover {
  background: #fff;
  border-color: #e2e8f0;
}

.dropdown-input::placeholder {
  opacity: 0.7;
}

.dropdown-selected {
  font-weight: bold;
  cursor: pointer;
}

.dropdown-list {
  position: absolute;
  width: 100%;
  max-height: 512px;
  margin-top: 50px;
  /* margin-top was 4px initially */
  overflow-y: auto;
  background: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  z-index: 2;
}

.dropdown-item {
  display: flex;
  width: 100%;
  padding: 11px 16px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #edf2f7;
  cursor: pointer;
}

.highlighted {
  display: flex;
  width: 100%;
  padding: 11px 16px;
  cursor: pointer;
  background: #edf2f7;
}
</style>
