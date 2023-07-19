<template>
<div class="wrapper">
    <side-bar :logo="logoUrl">
        <template slot="links">
            <sidebar-item :link="{
            name: 'Dashboard',
            icon: 'ni ni-planet text-sokrio',
            path: '/',
          }" :style="permissions.find(permission => permission.dashboards == false) ? 'display: none' : ''" :class="['/basic-reporting','/outlet-order','/miscellaneous', '/sales-growth', '/dashboard'].includes(this.$route.path)  ? '' : 'foo'" />
            <!--        <sidebar-item-->
            <!--                :link="{-->
            <!--            name: 'Dashboard',-->
            <!--            icon: 'ni ni-planet text-sokrio',-->
            <!--            path: '/dashboard'-->
            <!--          }"-->
            <!--        />-->
            <sidebar-item :link="{
            name: 'User',
            icon: 'ni ni-single-02 text-sokrio',
            path: '/user',
          }" :style="permissions.find(permission => permission.user == false) ? 'display: none' : ''">
                <!-- <sidebar-item
            :link="{
            name: 'Roles',
            icon: 'ni ni-single-02 text-sokrio',
            path: '/roles'
          }"
          />
          <sidebar-item
            :link="{
            name: 'Staff',
            icon: 'ni ni-single-02 text-sokrio',
            path: '/staff'
          }"
          />-->
            </sidebar-item>
            <sidebar-item :link="{
            name: 'Territory',
            path: '/territory',
            icon: 'fa fa-sitemap text-sokrio',
          }" :style="permissions.find(permission => permission.organization == false) ? 'display: none' : ''"></sidebar-item>
            <sidebar-item :link="{
            name: 'Customer Master',
            path: '/department',
            icon: 'fas fa-store text-sokrio',
          }" :style="permissions.find(permission => permission.organization == false) ? 'display: none' : ''"></sidebar-item>
            <sidebar-item :link="{
            name: 'Product Master',
            icon: 'ni ni-app text-sokrio',
            path: '/inventory',
          }" :style="permissions.find(permission => permission.inventory == false) ? 'display: none' : ''" />
            <sidebar-item :link="{
            name: 'Tracking',
            icon: 'fa fa-binoculars text-sokrio',
            path: '/tracking',
          }" :style="permissions.find(permission => permission.tracking == false) ? 'display: none' : ''"></sidebar-item>
            <sidebar-item :link="{
            name: 'Attendance',
            path: '/attendance',
            icon: 'fas fa-hand-paper text-sokrio',
          }" :style="permissions.find(permission => permission.attendance == false) ? 'display: none' : ''"></sidebar-item>
            <sidebar-item :link="{
            name: 'Inspection',
            path: '/inspection/survey',
            icon: 'fas fa-lightbulb text-sokrio',
          }" :style="permissions.find(permission => permission.inspection == false) ? 'display: none' : ''"></sidebar-item>
            <sidebar-item :link="{
            name: getTaxonomy('order'),
            icon: 'ni ni-book-bookmark text-sokrio',
            path: '/order',
          }" :style="permissions.find(permission => permission.order == false) ? 'display: none' : ''"></sidebar-item>
            <sidebar-item :link="{
            name: 'Payment',
            icon: 'ni ni-credit-card text-sokrio',
            path: '/payment',
          }" :style="permissions.find(permission => permission.payment == false) ? 'display: none' : ''"></sidebar-item>
            <sidebar-item :link="{
            name: 'Stock',
            path: '/stock',
            icon: 'fas fa-cubes text-sokrio',
          }" :style="permissions.find(permission => permission.stock == false) ? 'display: none' : ''">
            </sidebar-item>
            <sidebar-item :link="{
            name: 'Report',
            path: '/report',
            icon: 'fa fa-file text-sokrio',
          }"></sidebar-item>
            <sidebar-item :link="{
          name: 'Custom Report',
          path: '/custom-report',
          icon: 'fa fa-file text-sokrio',
        }"></sidebar-item>
            <!--        TODO: Not being used and Need requirement -->
            <!--        <sidebar-item-->
            <!--          :link="{-->
            <!--            name: 'Billing',-->
            <!--            path: '/billing',-->
            <!--            icon: 'fas fa-wallet text-sokrio',-->
            <!--          }"-->
            <!--          :style="permissions.find(permission => permission.billing == false) ? 'display: none' : ''"-->
            <!--        >-->
            <!--        </sidebar-item>-->
            <sidebar-item v-if="$user.id == 1" :link="{
            name: 'Settings',
            path: '/settings',
            icon: 'fas fa-cog text-sokrio',
          }" :style="permissions.find(permission => permission.setting == false) ? 'display: none' : ''">
            </sidebar-item>
            <sidebar-item :link="{
            name: 'SMS',
            path: '/sms',
            icon: 'fa fa-envelope text-sokrio',
          }" :style="permissions.find(permission => permission.sms == false) ? 'display: none' : ''">
            </sidebar-item>
        </template>
    </side-bar>
    <div class="main-content">
        <dashboard-navbar :type="$route.name === 'alternative' ? 'light' : 'default'"></dashboard-navbar>
        <!-- <router-view name="dashboard"></router-view> -->
        <div @click="$sidebar.displaySidebar(false)">
            <dashboard-content />
        </div>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
    <SetupWizard></SetupWizard>
</div>
</template>

<script lang="ts">
/* eslint-disable no-new */
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
//@ts-ignore
import SetupWizard from '@/views/setup-wizard';
import DashboardNavbar from '@/components/layouts/argon/DashboardNavbar.vue';
import ContentFooter from '@/components/layouts/argon/ContentFooter.vue';
import DashboardContent from '@/components/layouts/argon/Content.vue';
import {
    Component,
    Mixins
} from 'vue-property-decorator';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";

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

@Component({
    components: {
        DashboardNavbar,
        ContentFooter,
        DashboardContent,
        SetupWizard,
    },
})
export default class Dashboard extends Mixins(TaxonomyMixin) {
    get permissions() {
        return this.$store.getters['Auth/menus'];
    }

    get logoUrl() {
        return this.$store.getters['Theme/getLogoUrl'];
    }

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

<style lang="scss" scoped>
.router-link-active {
    background-color: #dae6ea;
    border-radius: 15px;
}

.foo.router-link-active {
    background-color: transparent;
}
</style>
