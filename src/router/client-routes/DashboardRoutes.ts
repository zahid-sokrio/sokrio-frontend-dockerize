import {RouteConfig} from 'vue-router';
// @ts-ignore
import Dashboard from '@/views/dashboard/Dashboard.vue';
// @ts-ignore
import UnderConstruction from '@/views/dashboard/UnderConstuction.vue';
// import TodaysData from '@/views/dashboard/TodaysData.vue';
// @ts-ignore
import Miscellaneous from '@/views/dashboard/Miscellaneous.vue';
// @ts-ignore
import OutletOrder from '@/views/dashboard/OutletOrder.vue';
// @ts-ignore
import SalesGrowth from '@/views/dashboard/salesGrowth/SalesGrowth.vue';
// @ts-ignore
import RevenueDashboard from '@/views/dashboard/RevenueDashboard.vue';
// @ts-ignore
import OutletsVisited from '@/views/dashboard/OutletsVisited.vue';
// @ts-ignore
import InvoiceDashboard from '@/views/dashboard/InvoiceDashboard.vue';
import { Permission } from "@/enums/Permission";
import { PermissionHelper } from "@/classes/PermissionHelper";
// @ts-ignore
import TodaysData from "@/views/dashboard/TodaysData";
// @ts-ignore
import BasicReporting from '@/views/dashboard/BasicReporting/BasicReporting.vue';


// Redirect to user's authorized (has permission) tab
function redirectToUserAuthorizedRoute() {
    return "/" + PermissionHelper([
        Permission.DAILY_DATA_DASHBOARD,
        Permission.MISCELLANEOUS_DASHBOARD,
        Permission.SALES_GROWTH_DASHBOARD,
        Permission.OUTLET_ORDER_DASHBOARD,
        Permission.BASIC_REPORTING_DASHBOARD,
    ], [{permission: Permission.DAILY_DATA_DASHBOARD, name: 'dashboard'},
        {permission: Permission.MISCELLANEOUS_DASHBOARD, name: 'miscellaneous'},
        {permission: Permission.SALES_GROWTH_DASHBOARD, name: 'sales-growth'},
        {permission: Permission.OUTLET_ORDER_DASHBOARD, name: 'outlet-order'},
        {permission: Permission.BASIC_REPORTING_DASHBOARD, name: 'basic-reporting'} 
    ]);
}

const DashboardRoutes: RouteConfig = {
    path: '/',
    name: 'dashboards',
    // @ts-ignore
    redirect: to => {
        return redirectToUserAuthorizedRoute();
    },
    components: {dashboard: Dashboard},
    children: [
        {
            path: 'dashboard',
            name: 'dashboard',
            meta: {
                label: 'Overview',
                icon: 'fas fa-globe-americas',
                permission: Permission.DAILY_DATA_DASHBOARD,
                breadCrumb: 'daily-data'
            },
            component: TodaysData,
        },
        {
            path: '/sales-growth',
            name: 'sales-growth',
            meta: {
                label: 'Sales Growth',
                icon: 'fas fa-chart-bar',
                permission: Permission.SALES_GROWTH_DASHBOARD,
                breadCrumb: 'sales-growth'
            },
            component: SalesGrowth
        },
        {
            path: '/miscellaneous',
            name: 'miscellaneous',
            meta: {
                label: 'Miscellaneous',
                icon: 'fas fa-chart-line',
                permission: Permission.MISCELLANEOUS_DASHBOARD,
                breadCrumb: 'miscellaneous',
            },
            component: Miscellaneous
        },
        {
            path: '/outlet-order',
            name: 'outlet-order',
            meta: {
                label: 'Outlet Order',
                icon: 'fas fa-store',
                permission: Permission.OUTLET_ORDER_DASHBOARD,
                breadCrumb: 'outlet-order',
            },
            component: OutletOrder
        },
        {
            path: '/basic-reporting',
            name: 'basic-reporting',
            meta: {
                label: 'Basic Reporting',
                icon: 'fas fa-file',
                permission: Permission.BASIC_REPORTING_DASHBOARD,
                breadCrumb: 'basic-reporting',
            },
            component: BasicReporting
        }

        // {
        //   path: '/dashboard/revenue',
        //   name: 'revenue',
        //   meta: {
        //     label: 'Revenue',
        //     icon: 'fa fa-cart-arrow-down'
        //   },
        //   component: RevenueDashboard
        // },
        // {
        //   path: '/dashboard/outlets',
        //   name: 'Outlet',
        //   meta: {
        //     label: 'Outlets',
        //     icon: 'fas fa-store'
        //   },
        //   component: OutletsVisited
        // },
        // {
        //   path: '/dashboard/invoice',
        //   name: 'invoice',
        //   meta: {
        //     label: 'Invoice',
        //     icon: 'fas fa-receipt'
        //   },
        //   component: InvoiceDashboard
        // }
    ]
};
export default DashboardRoutes;
