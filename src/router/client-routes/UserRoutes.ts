import { RouteConfig } from 'vue-router';
// @ts-ignore
import User from '@/views/user/User.vue';
// @ts-ignore
import UserList from '@/views/user/user/UserList.vue';
// @ts-ignore
import RoleList from '@/views/user/role/RoleList.vue';
// @ts-ignore
import CreateRole from '@/views/user/role/CreateRole.vue';
// @ts-ignore
import TargetList from '@/views/user/target/TargetList.vue';
// @ts-ignore
import AnnouncementList from '@/views/user/announcement/AnnouncementList.vue';
// @ts-ignore
import TAlist from '@/views/user/ta/TAlist.vue';
// @ts-ignore
import TransportList from '@/views/user/transport/TransportList.vue';
import { Permission } from '@/enums/Permission';
import { PermissionHelper } from '@/classes/PermissionHelper';
// import BaseProductTargetListVue from '@/views/user/target/BaseProductTargetList.vue';
import TargetInfoList from '@/views/user/target/TargetInfoList.vue';
import AnonymousAchievement from '@/views/user/target/AnonymousAchievement.vue';
import UserAppInfoVue from '@/views/user/user/UserAppInfo.vue';

// Redirect to user's authorized (has permission) tab
function redirectToUserAuthorizedRoute() {
    return (
        '/user/' +
        PermissionHelper(
            [Permission.VIEW_ROLE, Permission.VIEW_USER, Permission.VIEW_TARGET, Permission.VIEW_TRAVEL_ALLOWANCE],
            [
                { permission: Permission.VIEW_ROLE, name: 'roles' },
                { permission: Permission.VIEW_USER, name: 'users' },
                { permission: Permission.VIEW_TARGET, name: 'targets' },
                { permission: Permission.VIEW_TRAVEL_ALLOWANCE, name: 'travel-allowance' }
            ]
        )
    );
}

const UserRoutes: RouteConfig = {
    path: 'user',
    components: { dashboard: User },
    name: 'user',
    redirect: to => {
        return redirectToUserAuthorizedRoute();
    },
    children: [
        {
            path: 'roles',
            name: 'roles',
            component: RoleList,
            meta: {
                label: 'Role',
                icon: 'fas fa-tasks',
                permission: Permission.VIEW_ROLE,
                breadCrumb: 'roles'
            }
        },
        {
            path: 'users',
            name: 'users',
            component: UserList,
            meta: {
                label: 'User',
                icon: 'fas fa-user-circle',
                permission: Permission.VIEW_USER,
                breadCrumb: 'users'
            }
        },
        {
            path: 'targets',
            name: 'targets',
            component: TargetList,
            meta: {
                label: 'Manual Target',
                icon: 'fas fa-bullseye',
                permission: Permission.VIEW_TARGET,
                breadCrumb: 'targets'
            }
        },
        {
            path: 'base-targets',
            name: 'Base Targets',
            component: TargetInfoList,
            meta: {
                label: 'Bulk Target',
                icon: 'fas fa-bullseye',
                permission: Permission.VIEW_TARGET,
                breadCrumb: 'base-targets'
            }
        },
        // {
        //     path: 'base-product-targets',
        //     name: 'base product targets',
        //     component: BaseProductTargetListVue,
        //     meta: {
        //         label: 'Bulk Target',
        //         icon: 'fas fa-bullseye',
        //         permission: Permission.VIEW_TARGET,
        //         breadCrumb: 'base-product-targets'
        //     }
        // },
        // {
        //     path: 'anonymous-target-achievements',
        //     name: 'Anonymous Achievements',
        //     component: AnonymousAchievement,
        //     meta: {
        //         label: 'Anonymous Achievements',
        //         icon: 'fas fa-bullseye',
        //         permission: Permission.VIEW_TARGET,
        //         breadCrumb: 'base-product-targets'
        //     }
        // },
        {
            path: 'travel-allowance',
            name: 'travel-allowance',
            component: TAlist,
            meta: {
                label: 'Travel Allowance',
                icon: 'fas fa-money-bill',
                permission: Permission.VIEW_TRAVEL_ALLOWANCE,
                breadCrumb: 'travel-allowance'
            }
        },
        {
            path: 'transports',
            name: 'transports',
            component: TransportList,
            meta: {
                label: 'Transport',
                icon: 'fas fa-car',
                permission: Permission.VIEW_TRAVEL_ALLOWANCE,
                breadCrumb: 'transports'
            }
        },
        {
            path: 'announcements',
            name: 'announcements',
            component: AnnouncementList,
            meta: {
                label: 'Announcement',
                icon: 'fas fa-bullhorn',
                permission: Permission.CREATE_USER,
                breadCrumb: 'announcements'
            }
        },
        {
            path: 'users-app-info',
            name: 'Users App Info',
            component: UserAppInfoVue,
            meta: {
                label: 'User App Info',
                icon: 'fas fa-mobile',
                permission: Permission.VIEW_USER,
                breadCrumb: 'users-app-info'
            }
        }
    ]
};
export default UserRoutes;
