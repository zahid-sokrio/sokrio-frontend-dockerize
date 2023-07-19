// @ts-ignore
import Route from '@/intefaces/Route';
// @ts-ignore
import Tracking from '@/views/tracking/Tracking.vue';
// @ts-ignore
import RouteList from '@/views/tracking/RouteList.vue';

// @ts-ignore
import ProposedRoutePlan from '@/views/tracking/ProposedRoutePlan.vue';
// @ts-ignore
import FieldForceList from '@/views/tracking/FieldForceList.vue';
// @ts-ignore
import MapView from '@/views/tracking/MapView.vue';

import { RouteConfig } from 'vue-router';
import { Permission } from "@/enums/Permission";
import { PermissionHelper } from "@/classes/PermissionHelper";

// Redirect to user's authorized (has permission) tab
function redirectToUserAuthorizedRoute() {
    return '/tracking/' + PermissionHelper([
        Permission.VIEW_VISIT_PLAN,
        Permission.VIEW_PROPOSED_ROUTE_PLAN,
        Permission.VIEW_FIELD_FORCE,
        Permission.VIEW_MAP
    ], [{permission: Permission.VIEW_VISIT_PLAN, name: 'visit-plans'},
        {permission: Permission.VIEW_PROPOSED_ROUTE_PLAN, name: 'proposed-visit-plans'},
        {permission: Permission.VIEW_FIELD_FORCE, name: 'field-forces'},
        {permission: Permission.VIEW_MAP, name: 'map-view'},
    ]);
}

const TrackingRoutes: RouteConfig = {
    path: 'tracking',
    name: 'tracking',
    redirect: to => {
        return redirectToUserAuthorizedRoute();
    },
    components: {dashboard: Tracking},
    children: [
        {
            path: 'visit-plans',
            name: 'visit-plans',
            meta: {
                label: 'Visit Plans',
                icon: 'fas fa-road',
                permission: Permission.VIEW_VISIT_PLAN,
                breadCrumb: 'visit-plans'
      },
      component: RouteList,
    },
      {
          path: 'proposed-visit-plans',
          name: 'proposed-visit-plans',
          meta: {
              label: 'Proposed Visit Plans',
              icon: 'fas fa-route',
              permission: Permission.VIEW_PROPOSED_ROUTE_PLAN,
              breadCrumb: 'proposed-visit-plans'
          },
          component: ProposedRoutePlan,
      },
    {
      path: 'field-forces',
      name: 'field-forces',
      meta: {
          label: 'Field Forces',
          icon: 'fa fa-user-tie',
          permission: Permission.VIEW_FIELD_FORCE,
          breadCrumb: 'field-forces',
      },
      component: FieldForceList,
    },
    {
      path: 'map-view',
      name: 'map-view',
      meta: {
          label: 'Map View',
          icon: 'fa fa-map-marker-alt',
          permission: Permission.VIEW_MAP,
          breadCrumb: 'map-view'
      },
      component: MapView,
    }
  ]
};
export default TrackingRoutes;
