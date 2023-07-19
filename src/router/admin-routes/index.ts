// @ts-ignore
// import AdminDashboard from '@/views/admin/AdminDashboard.vue';
// // @ts-ignore
// import AdminLogin from '@/views/admin/auth/AdminLogin.vue';
// // @ts-ignore
// import AdminHome from '@/views/admin/AdminHome.vue';
// import SubscriptionRoutes from '@/router/admin-routes/SubscriptionRoutes';
import { RouteConfig } from 'vue-router';
// @ts-ignore
import AdminDashboard from '@/views/admin/AdminDashboard.vue';
// @ts-ignore
import AdminLogin from '@/views/admin/auth/AdminLogin.vue';
// @ts-ignore
import AdminHome from '@/views/admin/AdminHome.vue';
// @ts-ignore
import SubscriptionRoutes from '@/router/admin-routes/SubscriptionRoutes';

export const AdminRoutes: RouteConfig[] = [
  {
    path: '/admin',
    meta: { requiresAdminAuth: true },
    component: AdminDashboard,
    children: [
      {
        path: '',
        name: 'admin-home',
        components: { dashboard: AdminHome }
      },
      SubscriptionRoutes
    ]
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLogin
  }
];
