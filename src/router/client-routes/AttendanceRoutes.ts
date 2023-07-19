import { RouteConfig } from 'vue-router';
// @ts-ignore
import Attendance from '@/views/attendance/Attendance.vue';
// @ts-ignore
import LeaveManagement from '@/views/attendance/LeaveList.vue';
// @ts-ignore
import AttendanceList from '@/views/attendance/AttendanceList.vue';
// @ts-ignore
import FieldForceCheckIns from '@/views/attendance/FieldForceCheckIns.vue';
// @ts-ignore
import AttendancePage from '@/views/attendance/AttendancePage.vue';
import { Permission } from "@/enums/Permission";
import { PermissionHelper } from "@/classes/PermissionHelper";

// Redirect to user's authorized (has permission) tab
function redirectToUserAuthorizedRoute() {
    return '/attendance/' + PermissionHelper([
        Permission.VIEW_ATTENDANCE,
        Permission.VIEW_LEAVE,
    ], [{permission: Permission.VIEW_ATTENDANCE, name: 'attendances'},
        {permission: Permission.VIEW_LEAVE, name: 'leave'},
    ]);
}

const AttendanceRoutes: RouteConfig = {
    path: 'attendance',
    name: 'attendance',
    redirect: to => {
        return redirectToUserAuthorizedRoute();
    },
    components: {dashboard: Attendance},
    children: [
        {
            path: 'attendances',
            component: AttendancePage,
            children: [
                {
                    path: '',
                    name: 'attendances',
                    components: {attendancePage: AttendanceList}
                },
                {
                    path: '/attendance/details',
                    name: 'details',
                    components: {attendancePage: FieldForceCheckIns},
                    props: {attendancePage: true}
                }
            ],
            meta: {
                label: 'Attendance',
                icon: 'fa fa-calendar',
                permission: Permission.VIEW_ATTENDANCE,
                breadCrumb: 'attendances',
            }
        },
        {
            path: '/attendance/leave',
            name: 'leave',
            meta: {
                label: 'Leave',
                icon: 'fas fa-sign-out-alt',
                permission: Permission.VIEW_LEAVE,
                breadCrumb: 'leave'
            },
            component: LeaveManagement
        }
    ]
};
export default AttendanceRoutes;
