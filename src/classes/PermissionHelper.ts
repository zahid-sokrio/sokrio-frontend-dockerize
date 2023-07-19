import { Permission } from "@/enums/Permission";
import store from "@/store";

export function PermissionHelper(checkPermission: any, routePermissions: any) {
    let userPermission = store.getters['Auth/permissions'];
    let userPermissionArray: any[] = [];
    if (userPermission) {
        userPermissionArray = typeof userPermission == 'string' ? JSON.parse(userPermission) : userPermission;
    }
    let currentTab: any[] = [];
    userPermissionArray.filter(function (result: any) {
        if (checkPermission.includes(result.name)) {
            // @ts-ignore
            currentTab.push(routePermissions.find((permission: any) => permission.permission == result.name).name)
        }
    });
    return currentTab[0];
}
