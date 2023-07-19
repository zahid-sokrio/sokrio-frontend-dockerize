<template>
  <div
    class="sidenav navbar navbar-vertical fixed-left navbar-expand-xs navbar-light bg-white"
    @mouseenter="$sidebar.onMouseEnter()"
    @mouseleave="$sidebar.onMouseLeave()"
    :data="backgroundColor"
  >
    <div class="scrollbar-inner" ref="sidebarScrollArea">
      <div class="sidenav-header d-flex align-items-center">
        <a @click.prevent="redirect('Company')" class="navbar-brand" v-if="
        ['No Logo', 'null', null].includes(logo)">
          <img class="navbar-brand-img" style="cursor: pointer"
               :src="getDefaultLogo"/>
        </a>
        <a class="navbar-brand" @click.prevent="redirect('Dashboard')" v-else>
          <async-image-for-land-lord :key="logoUrlChangeCount" v-slot="slotProps"
                                     :url="logo">
            <img class="navbar-brand-img" style="cursor: pointer" :src="slotProps.imageSrc" alt="Logo"/>
          </async-image-for-land-lord>
        </a>


        <div class="ml-auto">
          <!-- Sidenav toggler -->
          <div
            class="sidenav-toggler d-none d-xl-block"
            :class="{'active': !$sidebar.isMinimized }"
            @click="minimizeSidebar"
          >
            <div class="sidenav-toggler-inner">
              <i class="sidenav-toggler-line"></i>
              <i class="sidenav-toggler-line"></i>
              <i class="sidenav-toggler-line"></i>
            </div>
          </div>
        </div>
      </div>
      <slot></slot>
      <div class="navbar-inner">
        <ul class="navbar-nav">
          <slot name="links">
            <sidebar-item
              v-for="(link, index) in sidebarLinks"
              :key="link.name + index"
              :link="link"
            >
              <sidebar-item
                v-for="(subLink, index) in link.children"
                :key="subLink.name + index"
                :link="subLink"
              ></sidebar-item>

            </sidebar-item>
          </slot>
        </ul>
        <slot name="links-after"></slot>
      </div>
    </div>
    <a class="sokrio-logo sokrio-logo-bottom ml-4" @click="redirect('Sokrio')">
      <img :src="`${$cdn}/img/logo.png`" class="navbar-brand-img ml-1" alt="Sidebar logo"/>
    </a>
  </div>
</template>
<script>
import AsyncImageForLandLord from "../../AsyncImageForLandLord";

export default {
  name: "sidebar",
  components: {AsyncImageForLandLord},
  props: {
    title: {
      type: String,
      default: "Sokrio",
      description: "Sidebar title"
    },
    shortTitle: {
      type: String,
      default: "ST",
      description: "Sidebar short title"
    },
    logo: {
      type: String,
      default:
        "https://demos.creative-tim.com/nuxt-argon-dashboard-pro/img/brand/green.png",
      description: "Sidebar app logo"
    },
    backgroundColor: {
      type: String,
      default: "vue",
      validator: value => {
        let acceptedValues = [
          "",
          "vue",
          "blue",
          "green",
          "orange",
          "red",
          "primary"
        ];
        return acceptedValues.indexOf(value) !== -1;
      },
      description:
        "Sidebar background color (vue|blue|green|orange|red|primary)"
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
      description:
        "List of sidebar links as an array if you don't want to use components for these."
    },
    autoClose: {
      type: Boolean,
      default: true,
      description:
        "Whether sidebar should autoclose on mobile when clicking an item"
    }
  },
  provide() {
    return {
      autoClose: this.autoClose
    };
  },
  methods: {
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    },
    redirect(routeName) {
      const permissionmenu = this.$store.getters['Auth/menus']
      permissionmenu.forEach(menu => {
        if (Object.values(menu)[0] === true && !this.is_validateRoute) {
          this.is_validateRoute = true;
          if (routeName == 'Company') {
            this.$router.push({name: 'Company'});
          } else if (routeName == 'Sokrio') {
            window.location.replace('https://sokrio.com');
          } else {
            this.$router.push({name: Object.keys(menu)[0]});
          }
        }
      })
    },

  },
  computed: {
    logoUrlChangeCount() {
      return this.$store.getters['Theme/logoUrlChangeCount'];
    },
    getDefaultLogo() {
      return `${this.$cdn}/img/uploadLogo.png`
    }
  },
  mounted() {
    this.$sidebar.isMinimized = this.$sidebar.breakpoint < window.innerWidth;
    this.minimizeSidebar();
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  }
};
</script>
<style scoped>
@media screen and (max-height: 600px) {
  .sokrio-logo-bottom {
    visibility: hidden;
  }

  .sokrio-logo {
    display: inline-block;
    padding-top: 0.03875rem;
    padding-bottom: 0.03875rem;
    margin-right: 1rem;
    font-size: 1.1125rem;
    line-height: inherit;
    white-space: nowrap;
  }
}
</style>
