import Vue from 'vue';
import { RouteConfig } from "vue-router";
// @ts-ignore
import Setting from '@/views/setting/Setting.vue';
// @ts-ignore
import Taxonomy from '@/views/setting/Taxonomy/Taxonomy.vue';
// @ts-ignore
import Miscellaneous from '@/views/setting/Miscellaneous/Miscellaneous.vue';
// @ts-ignore
import SMS from '@/views/setting/SMS/SMS.vue';
// @ts-ignore
import Attendance from '@/views/setting/Attendance/Attendance.vue';
// @ts-ignore
import Product from '@/views/setting/Product/Product.vue';
// @ts-ignore
import Tracking from '@/views/setting/Tracking/Tracking.vue';
// @ts-ignore
import ApiToken from '@/views/setting/apiToken/apiToken.vue';
import { Permission } from "@/enums/Permission";
import { PermissionHelper } from "@/classes/PermissionHelper";
// @ts-ignore
import Company from '@/views/setting/Company/Company.vue';
// @ts-ignore
import VAT from '@/views/setting/Vat/Vat.vue';

// Redirect to user's authorized (has permission) tab
function redirectToUserAuthorizedRoute() {
    return '/settings/' + PermissionHelper([
        Permission.APPROVAL_SETTINGS,
        Permission.TAXONOMY_SETTINGS,
        Permission.VAT_SETTINGS,
        Permission.SMS_SETTINGS,
        Permission.ATTENDANCE_SETTINGS,
        Permission.PRODUCT_SETTINGS,
        Permission.TRACKING_SETTING,
    ], [{permission: Permission.APPROVAL_SETTINGS, name: 'Miscellaneous'},
        {permission: Permission.TAXONOMY_SETTINGS, name: 'Taxonomy'},
        {permission: Permission.VAT_SETTINGS, name: 'VAT'},
        {permission: Permission.SMS_SETTINGS, name: 'SMS'},
        {permission: Permission.ATTENDANCE_SETTINGS, name: 'Attendance'},
        {permission: Permission.PRODUCT_SETTINGS, name: 'Product'},
        {permission: Permission.TRACKING_SETTING, name: 'Tracking'},
    ]);
}

const SettingsRoutes: RouteConfig = {
    path: 'settings',
    components: {dashboard: Setting},
    name: 'settings',
    beforeEnter: (to, from, next) => {
        if (Vue.prototype.$user.id === 1) {
            next();
        } else {
            next('/404');
        }
    },
    redirect: to => {
        return redirectToUserAuthorizedRoute();
    },
    children: [
        {
            path: '/settings/Miscellaneous',
            name: 'Miscellaneous',
            component: Miscellaneous,
            meta: {
                icon: 'fas fa-cog',
                label: 'Miscellaneous',
                permission: Permission.APPROVAL_SETTINGS,
                breadCrumb: 'Miscellaneous'
            }
        },
        {
            path: '/settings/taxonomy',
            name: 'Taxonomy',
            component: Taxonomy,
            meta: {
                icon: 'fa fa-clone',
                label: 'Taxonomy',
                permission: Permission.TAXONOMY_SETTINGS,
                breadCrumb: 'taxonomy',
            }
        },
        {
            path: '/settings/vat',
            name: 'VAT',
            component: VAT,
            meta: {
                icon: 'fa fa-clone',
                label: 'VAT',
                permission: Permission.TAXONOMY_SETTINGS,
                breadCrumb: 'vat',
            }
        },
        {
            path: '/settings/sms',
            name: 'SMS',
            component: SMS,
            meta: {
                icon: 'fa fa-sms',
                label: 'SMS',
                permission: Permission.SMS_SETTINGS,
                breadCrumb: 'sms',
            }
        },
        {
            path: '/settings/attendance',
            name: 'Attendance',
            component: Attendance,
            meta: {
                icon: 'fas fa-hand-paper',
                label: 'Attendance',
                permission: Permission.ATTENDANCE_SETTINGS,
                breadCrumb: 'addtendance',
            }
        },
        {
            path: '/settings/product',
            name: 'Product',
            component: Product,
            meta: {
                icon: 'fas fa-box',
                label: 'Product',
                permission: Permission.PRODUCT_SETTINGS,
                breadCrumb: 'product',
            }
        },
        {
            path: '/settings/tracking',
            name: 'Tracking',
            component: Tracking,
            meta: {
                icon: 'fas fa-walking',
                label: 'Tracking',
                permission: Permission.TRACKING_SETTING,
                breadCrumb: 'tracking',
            }
        },
        {
            path: '/settings/company',
            name: 'Company',
            component: Company,
            meta: {
                icon: 'fa fa-building-o',
                label: 'Company',
                permission: Permission.TRACKING_SETTING,
                breadCrumb: 'company',
            }
        },
        {
            path: '/settings/api-token',
            name: 'API Token',
            component: ApiToken,
            meta: {
                icon: 'fa fa-building-o',
                label: 'API Token',
                permission: Permission.TRACKING_SETTING,
                breadCrumb: 'API Token',
            }
        }
    ]
};
export default SettingsRoutes;
