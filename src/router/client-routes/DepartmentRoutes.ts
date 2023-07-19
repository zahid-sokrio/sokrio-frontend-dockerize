// @ts-ignore
import DepartmentList from '@/views/department/DepartmentList.vue';
// @ts-ignore
import ChannelList from '@/views/department/ChannelList.vue';
// @ts-ignore
import Department from '@/views/department/Department.vue';
// @ts-ignore
import BadgeList from '@/views/department/BadgeList.vue';
// @ts-ignore
import CategoryList from '@/views/department/CategoryList.vue';
// @ts-ignore
import LocationTypeList from '@/views/department/LocationTypeList.vue';
import { Permission } from "@/enums/Permission";
import { RouteConfig } from "vue-router";
import store from "@/store";
import TaxonomyJson from '@/assets/json/Taxonomy.json';
import Taxonomy from "@/intefaces/Taxonomy";
import { PermissionHelper } from "@/classes/PermissionHelper";

function getTaxonomy (label: any) {
    let currentLabel: any = '';
    let taxonomy = store.getters['Settings/getTaxonomyStore'];
    let taxonomyArray: Taxonomy[] = [];
    if(taxonomy) {
        taxonomyArray = typeof taxonomy == 'string' ? JSON.parse(taxonomy) : taxonomy;
    } else {
        taxonomyArray = TaxonomyJson;
    }
    taxonomyArray.forEach((taxonomy: any) => {
        if (Object.keys(taxonomy)[0] == label) {
            currentLabel = Object.values(taxonomy)[0]
        }
    });
    return currentLabel;
}
// Redirect to user's authorized (has permission) tab
function redirectToUserAuthorizedRoute() {
    return '/department/' + PermissionHelper([
        Permission.VIEW_CHANNEL,
        Permission.VIEW_DEPARTMENT

    ], [{permission: Permission.VIEW_CHANNEL, name: 'channel'},
        {permission: Permission.VIEW_DEPARTMENT, name: 'departments'}

    ]);
}

const departmentRoutes: RouteConfig = {
    path: 'department',
    name: 'customer master',
    // @ts-ignore
    redirect: to => {
        return redirectToUserAuthorizedRoute();
    },
    components: {dashboard: Department},
    children: [
        {
            path: 'channel',
            name: 'channel',
            meta: {
                label: 'Channel',
                icon: 'fa fa-list',
                permission: Permission.VIEW_CHANNEL,
                breadCrumb: 'channel',
            },
            component: ChannelList
        },
        {
            path: 'departments',
            name: 'departments',
            meta: {
                label: getTaxonomy('department'),
                icon: 'fas fa-store',
                permission: Permission.VIEW_DEPARTMENT,
                breadCrumb: getTaxonomy('department')
            },
            component: DepartmentList,
        },
        {
            path: 'badges',
            name: 'badges',
            meta: {
                label: 'Badge',
                icon: 'fa fa-trophy',
                permission: Permission.VIEW_DEPARTMENT,
                breadCrumb: 'badges',
            },
            component: BadgeList
        },
        {
            path: 'category',
            name: 'category',
            meta: {
                label: 'Category',
                icon: 'fa fa-list-alt',
                permission: Permission.VIEW_DEPARTMENT,
                breadCrumb: 'category',
            },
            component: CategoryList
        },
        {
            path: 'location-type',
            name: 'location-type',
            meta: {
                label: 'Location Type',
                icon: 'fas fa-map-marked-alt',
                permission: Permission.VIEW_DEPARTMENT,
                breadCrumb: 'location-type',
            },
            component: LocationTypeList
        }
    ]
};


export default departmentRoutes;
