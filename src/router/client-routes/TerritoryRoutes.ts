// @ts-ignore
import Territory from '@/views/territory/Territory.vue';
// @ts-ignore
import TerritoryList from '@/views/territory/TerritoryList.vue';
// @ts-ignore
import TerritoryTypeList from '@/views/territory/TerritoryTypeList.vue';
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
    return '/territory/' + PermissionHelper([
        Permission.VIEW_TERRITORY_TYPE,
        Permission.VIEW_TERRITORY,
        Permission.VIEW_DEPARTMENT,
        Permission.VIEW_CHANNEL
    ], [{permission: Permission.VIEW_TERRITORY_TYPE, name: 'territory-types'},
        {permission: Permission.VIEW_TERRITORY, name: 'territories'},
        {permission: Permission.VIEW_DEPARTMENT, name: 'departments'},
        {permission: Permission.VIEW_CHANNEL, name: 'channel'}
    ]);
}

const territoryRoutes: RouteConfig = {
    path: 'territory',
    name: 'territory',
    // @ts-ignore
    redirect: to => {
        return redirectToUserAuthorizedRoute();
    },
    components: {dashboard: Territory},
    children: [
        {
            path: 'territory-types',
            name: 'territory-types',
            meta: {
                label: 'Territory Type',
                icon: 'fa fa-map-signs',
                permission: Permission.VIEW_TERRITORY_TYPE,
                breadCrumb: 'territory-types'
            },
            component: TerritoryTypeList
        },
        {
            path: 'territories',
            name: 'territories',
            component: TerritoryList,
            meta: {
                label: 'Territory',
                icon: 'fa fa-map',
                permission: Permission.VIEW_TERRITORY,
                breadCrumb: 'territories'
            }
        }
    ]
};


export default territoryRoutes;
