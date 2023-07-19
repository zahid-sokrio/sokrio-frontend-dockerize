import { RouteConfig } from "vue-router";
// @ts-ignore
import SMS from '@/views/sms/SMS.vue';
// @ts-ignore
import Bulk from '@/views/sms/Bulk.vue';
// @ts-ignore
import MessageList from '@/views/sms/MessageList.vue';
import { Permission } from "@/enums/Permission";
import { PermissionHelper } from "@/classes/PermissionHelper";

// Redirect to user's authorized (has permission) tab
function redirectToUserAuthorizedRoute() {
    return '/sms/' + PermissionHelper([
        Permission.BULK_SMS,
        Permission.VIEW_MESSAGE,
    ], [{permission: Permission.BULK_SMS, name: 'bulk'},
        {permission: Permission.VIEW_MESSAGE, name: 'messages'},
    ]);
}

const SMSRoutes: RouteConfig = {
    path: 'sms',
    components: {dashboard: SMS},
    name: 'sms',
    redirect: to => {
        return redirectToUserAuthorizedRoute();
    },
    children: [
        {
            path: '/sms/bulk',
            name: 'bulk',
            component: Bulk,
            meta: {
                icon: 'fa fa-envelope',
                label: 'Bulk',
                permission: Permission.BULK_SMS
            }
        },
        {
            path: '/sms/messages',
            name: 'messages',
            component: MessageList,
            meta: {
                icon: 'fa fa-inbox',
                label: 'Messages',
                permission: Permission.VIEW_MESSAGE
            }
        }
    ]
};
export default SMSRoutes;
