import { RouteConfig } from 'vue-router';
import Register from '@/views/auth/Register/index.vue';
import Welcome from '@/views/Welcome.vue';
import Home from '@/views/Home.vue';
import {AdminRoutes} from "@/router/admin-routes";

export const GuestRoutes: RouteConfig[] = [
  {
    path: '/',
    component: Welcome,
    children: [
      {
        path: '',
        name: 'Home',
        component: Welcome
      }
    ]
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  ...AdminRoutes
];
