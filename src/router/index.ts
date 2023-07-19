import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '@/store';
import { GuestRoutes } from '@/router/guest-routes';
import { ClintRoutes } from '@/router/client-routes';
// @ts-ignore
import NotFound from '@/views/NotFound.vue';

Vue.use(VueRouter);

const ErrorPages: RouteConfig[] = [
  {
    path: '/404',
    name: '404',
    component: NotFound
  }
];

const host = window.location.host;
const parts = host.split('.');

// @ts-ignore
function routes(): RouteConfig[] {
  let routes: RouteConfig[];
  if (parts[0] === 'app' || parts[0] === 'www') {
    routes = GuestRoutes;
  } else {
    routes = ClintRoutes;
    store.commit('Auth/setClientInfo', { domain: parts[0], clientInfo: true });
  }
  return routes.concat(ErrorPages);
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes()
});

export default router;
