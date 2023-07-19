import Vue from 'vue';
// @ts-ignore
import App from './App.vue';
import router from './router';
import store from './store';
import axios, { AxiosResponse } from 'axios';
import '@/filters';
import _ from 'lodash';
import { Col, Loading, Option, Rate, Row, Select, Table, TableColumn } from 'element-ui';
// @ts-ignore
import lang from 'element-ui/lib/locale/lang/en';
// @ts-ignore
import locale from 'element-ui/lib/locale';
import moment from 'moment';
import './registerServiceWorker';
// @ts-ignore
import SidebarPlugin from './components/argon-core/SidebarPlugin';
// @ts-ignore
import NotificationsPlugin from './components/argon-core/NotificationPlugin';

import './plugins/dashboard/globalComponents';
import './plugins/dashboard/globalDirectives';
import '../polyfills';
// require('./assets/css/font-awesome/css/font-awesome.min.css');
import './assets/css/nucleo/css/nucleo.css';
import './assets/sass/argon.scss';
import './assets/css/global-custom.css';
import 'element-ui/lib/theme-chalk/index.css';
import Permission from '@/intefaces/Permission';
import { SetupWizardStatus } from '@/enums/SetupWizardStatus';
import ConfirmationOptions from '@/intefaces/ConfirmationOptions';

// configure language
locale.use(lang);
Vue.use(Select);
Vue.use(Option);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Rate);
Vue.use(Loading);

var countMap: any = new Map();

Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
Vue.prototype.$http = axios;
Vue.prototype.$cdn = process.env.VUE_APP_ASSET_URL;
// Add a response interceptor
axios.interceptors.response.use(
    response => response,
    async function(error) {
        if (error.response.statusText === 'Unauthorized' || error.response.status === 419 || error.response.status === 401) {
            store.commit('Auth/clear');
            await router.push('/login').catch(() => {});
        }
        if (error.response.status === 403) {
            Vue.prototype.$notify({
                title: 'Unauthorized Access!',
                type: 'warning',
                message: 'You do not have enough permissions. Contact Administrator.'
            });
        }
        return Promise.reject(error);
    }
);
const appBaseUrl = (Vue.prototype.$appBaseUrl = process.env.VUE_APP_BASE_URL);
Vue.prototype._ = _;

Vue.prototype.$moment = moment;

Vue.directive('can', function(el: any, binding: any) {
    const permissions = localStorage.getItem('permissions');
    // @ts-ignore
    if (permissions) {
        if (!permissions.includes(binding.value)) {
            el.style.display = 'none';
        }
    }
});

// @ts-ignore
Vue.filter('datetime', function(value: any, format: any = 'lll') {
    return moment(value).format(format);
});

Vue.prototype.$currency = () => store.getters['Settings/getCurrency'];

Vue.filter('fmt', function(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: store.getters['Settings/getCurrency']
    }).format(value);
});

Vue.prototype.$api = function(endpoint: string, withoutSuffix: boolean = false) {
    let apiEndpoint = process.env.VUE_APP_API_ENDPOINT.replace('variable', store.getters['Auth/getDomain']);

    if (withoutSuffix) {
        return apiEndpoint.replace('/api/v1', '') + endpoint;
    }
    return apiEndpoint + endpoint;
};

Vue.prototype.$api2 = function(endpoint: string) {
    let apiEndpoint = process.env.VUE_APP_API_ENDPOINT.replace('variable', store.getters['Auth/getDomain']);
    return apiEndpoint.replace('v1', 'v2') + endpoint;
};
Vue.prototype.$api3 = function(endpoint: string) {
    let apiEndpoint = process.env.VUE_APP_API_ENDPOINT.replace('variable', store.getters['Auth/getDomain']);
    return apiEndpoint.replace('v1', 'v3') + endpoint;
};

Vue.prototype.$landLordApi = function(endpoint: string, withoutSuffix: boolean = false) {
    let apiEndpoint = process.env.VUE_APP_LANDLORD_API_ENDPOINT;
    if (withoutSuffix) {
        return apiEndpoint.replace('/api/v1', '') + endpoint;
    }
    return apiEndpoint + endpoint;
};

Vue.prototype.$blobToImage = function(blob: any) {
    return window.URL.createObjectURL(blob);
};

Vue.prototype.$blob2Url = function(url: any) {
    return new Promise(resolve => {
        if (process.env.NODE_ENV === 'production') {
            resolve(url);
        } else {
            Vue.prototype
                .$http({
                    url: this.$api(url),
                    method: 'GET',
                    responseType: 'blob'
                })
                .then((response: any) => resolve(this.$blobToImage(response.data)));
        }
    });
};

Vue.prototype.$blob2UrlForLandlord = function(url: any) {
    return new Promise(resolve => {
        Vue.prototype
            .$http({
                url: this.$api(url),
                method: 'GET',
                responseType: 'blob'
            })
            .then((response: any) => resolve(this.$blobToImage(response.data)));
    });
};

Vue.prototype.$getFileNameFromContentDisposition = function(headers: any) {
    const regex = /filename=(.+)/g;
    const match: any = regex.exec(headers['content-disposition']);
    return match ? (match[1] as string).replaceAll('"', '') : 'file';
};
const userJson = localStorage.getItem('user');
const adminJson = localStorage.getItem('admin');

Vue.prototype.$user = userJson !== null ? JSON.parse(userJson) : {};
Vue.prototype.$admin = adminJson !== null ? JSON.parse(adminJson) : {};

if (window.location.pathname != '/login' && window.location.pathname != '/register') {
    Vue.prototype.$http.get(Vue.prototype.$api('/me')).then((response: AxiosResponse) => {
        let rolePermissions = '';
        if (response.data.me.roles) {
            response.data.me.roles.forEach((role: any) => {
                rolePermissions = role.permissions;
            });
        }
        localStorage.setItem(
            'permissions',
            JSON.stringify(response.data.me.roles.length > 0 ? response.data.me.permissions.concat(rolePermissions) : response.data.me.permissions)
        );
    });
    Vue.prototype.$http.get(Vue.prototype.$api('/permissions')).then((response: AxiosResponse) => {
        localStorage.setItem('allPermissions', JSON.stringify(response.data.permissions));
    });
    Vue.prototype.$http.get(Vue.prototype.$api('/settings')).then((response: AxiosResponse) => {
        localStorage.setItem('settings', JSON.stringify(response.data.settings));
    });
    Vue.prototype.$http.get(Vue.prototype.$api('/setup-wizard-status')).then((response: AxiosResponse) => {
        localStorage.setItem('currentStatus', response.data.completed ? SetupWizardStatus.Completed : SetupWizardStatus.Incompleted);
    });
}

Vue.prototype.$hasRole = function(role: string): boolean {
    const roles: Permission[] = store.getters['Auth/roles'];
    let returnValue = false;
    roles.forEach(value => {
        if (value.name === role) {
            returnValue = true;
        }
    });
    return returnValue;
};
Vue.prototype.$hasPermission = function(permission: string): boolean {
    const permissions: Permission[] = store.getters['Auth/permissions'];
    let returnValue = false;
    permissions.forEach(value => {
        if (value.name === permission) {
            returnValue = true;
        }
    });
    return returnValue;
};
Vue.use(SidebarPlugin);
Vue.use(NotificationsPlugin);
localStorage.removeItem(window.location.host.split('.')[0]);
router.beforeEach(async (to, from, next) => {
    const permission = localStorage.getItem('permissions');
    if (!to.matched.length) {
        return next('/404');
    }
    if (to.matched.some(record => record.meta.requiresClientCheck)) {
        let validate = await store.dispatch('Auth/validateClient');
        if (!validate) {
            return next('/404');
        }
        next();
    }

    // This logic for admin routes
    if (to.matched.some(record => record.meta.requiresAdminAuth)) {
        if (store.getters['AdminAuth/isLoggedIn']) {
            next();
        } else {
            next('/admin/login');
        }
    } else if (to.path === '/admin/login' && store.getters['AdminAuth/isLoggedIn']) {
        next({ name: 'admin-home' });
    } else {
        next();
    }

    // This logic for client routes
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters['Auth/isLoggedIn']) {
            // @ts-ignore
            if (to.meta.permission && !permission.includes(to.meta.permission)) {
                next('/404');
            }
            next();
        } else {
            next('/login');
        }
    } else if (store.getters['Auth/isLoggedIn'] && to.path === '/login') {
        //@ts-ignore
        let userPermissions = store.getters['Auth/menus'];
        userPermissions.forEach((permission: any) => {
            if (Object.values(permission)[0] === true) {
                next({ name: Object.keys(permission)[0] });
            }
        });
    } else {
        next();
    }
});

Vue.prototype.$conformation = function(options: ConfirmationOptions) {
    store.commit('Confirmation/showConfirmationAlert', options);
};

Vue.prototype.$toQueryString = (obj: any) =>
    '?'.concat(
        Object.keys(obj)
            .map(e => (obj[e] ? `${encodeURIComponent(e)}=${encodeURIComponent(obj[e])}` : null))
            .filter(e => !!e)
            .join('&')
    );

let vm = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
