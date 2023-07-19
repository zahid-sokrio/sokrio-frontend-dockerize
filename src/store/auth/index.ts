import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import axios from 'axios';
import Vue from 'vue';
import User from '@/intefaces/User';
import Permission from '@/intefaces/Permission';
import Role from '@/intefaces/Role';
import store from '@/store';
import { Permission as PermissionEnums } from '@/enums/Permission';

const userJson = localStorage.getItem('user');
const permissionsJson = localStorage.getItem('permissions');
const rolesJson = localStorage.getItem('roles');

@Module({namespaced: true})
export default class Auth extends VuexModule {
    public mStatus: string = '';
    public mToken: string = localStorage.getItem('token') || '';
    public mUser: User | object = userJson !== null ? JSON.parse(userJson) : {};
    public mPermissions: Permission[] | Array<any> = permissionsJson !== null ? JSON.parse(permissionsJson) : [];
    public mRoles: Role[] | Array<any> = rolesJson !== null ? JSON.parse(rolesJson) : [];
    public domain: string = '';
    public clientInfo: string = ''; // May be we can use this in future for client/company meta data
    public mAllPermissionLists: Permission[] = localStorage.getItem("allPermissions") === null ? [] : JSON.parse(<string>localStorage.getItem("allPermissions"));
    // @ts-ignore
    public currentUser: any = localStorage.getItem("currentUser") === null ? '' : JSON.parse(localStorage.getItem("currentUser"));
    public navbarKey: number = 0;

    get isLoggedIn() {
        return !!this.mToken;
    }

    get isValidClient() {
        return !!this.clientInfo;
    }

    get user() {
        return this.mUser;
    }

    get permissions() {
        return this.mPermissions
    }

    get allPermissionLists() {
        return this.mAllPermissionLists
    }

    get roles() {
        return this.mRoles;
    }

    get token() {
        return this.mToken;
    }

    get authStatus() {
        return this.mStatus;
    }

    get getDomain() {
        return this.domain;
    }

    get getCurrentUser() {
        return this.currentUser;
    }

    get getNavbarKey() {
        return this.navbarKey;
    }

    get menus() {
        return [{
            dashboards: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name === PermissionEnums.DAILY_DATA_DASHBOARD ||
                    result.name === PermissionEnums.MISCELLANEOUS_DASHBOARD ||
                    result.name === PermissionEnums.SALES_GROWTH_DASHBOARD ||
                    result.name === PermissionEnums.OUTLET_ORDER_DASHBOARD ||
                    result.name === PermissionEnums.BASIC_REPORTING_DASHBOARD
            }) : []).length > 0 ? true : false
        }, {
            user: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name == PermissionEnums.VIEW_ROLE ||
                    result.name === PermissionEnums.VIEW_USER ||
                    result.name === PermissionEnums.VIEW_TARGET ||
                    result.name === PermissionEnums.VIEW_TRAVEL_ALLOWANCE
            }) : []).length > 0 ? true : false
        }, {
            organization: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name == PermissionEnums.VIEW_TERRITORY_TYPE ||
                    result.name === PermissionEnums.VIEW_TERRITORY ||
                    result.name === PermissionEnums.VIEW_CHANNEL ||
                    result.name === PermissionEnums.VIEW_DEPARTMENT
            }) : []).length > 0 ? true : false
        }, {
            inventory: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name == PermissionEnums.VIEW_PRODUCT_CATEGORY ||
                    result.name === PermissionEnums.VIEW_PRODUCT_BRAND ||
                    result.name === PermissionEnums.VIEW_PRODUCT ||
                    result.name === PermissionEnums.VIEW_VARIANT_CATEGORY ||
                    result.name === PermissionEnums.VIEW_BATCH ||
                    result.name === PermissionEnums.VIEW_PROMOTION
            }) : []).length > 0 ? true : false
        }, {
            tracking: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name == PermissionEnums.VIEW_VISIT_PLAN ||
                    result.name === PermissionEnums.VIEW_PROPOSED_ROUTE_PLAN ||
                    result.name === PermissionEnums.VIEW_FIELD_FORCE ||
                    result.name === PermissionEnums.VIEW_MAP
            }) : []).length > 0 ? true : false
        }, {
            attendance: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name == PermissionEnums.VIEW_ATTENDANCE ||
                    result.name === PermissionEnums.VIEW_LEAVE
            }) : []).length > 0 ? true : false
        }, {
            inspection: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name == PermissionEnums.VIEW_SURVEY ||
                    result.name == PermissionEnums.VIEW_ASSET ||
                    result.name === PermissionEnums.VIEW_CAMPAIGN ||
                    result.name === PermissionEnums.VIEW_OUTLET_ITEM ||
                    result.name === PermissionEnums.VIEW_AUDIT ||
                    result.name === PermissionEnums.VIEW_QUESTION
            }) : []).length > 0 ? true : false
        }, {
            order: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name == PermissionEnums.VIEW_ORDER ||
                    result.name == PermissionEnums.VIEW_REQUISITION ||
                    result.name === PermissionEnums.VIEW_SALES_RETURN ||
                    result.name === PermissionEnums.VIEW_INVOICE ||
                    result.name === PermissionEnums.VIEW_READY_TO_DISPATCH ||
                    result.name === PermissionEnums.VIEW_READY_TO_DELIVERY ||
                    result.name === PermissionEnums.VIEW_DELIVERY
            }) : []).length > 0 ? true : false
        }, {
            payment: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name == PermissionEnums.VIEW_PAYMENT ||
                    result.name === PermissionEnums.VIEW_ADVANCE_PAYMENT
            }) : []).length > 0 ? true : false
        }, {
            stock: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name == PermissionEnums.VIEW_STOCK
            }) : []).length > 0 ? true : false
        }, {
            report: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name === PermissionEnums.SALES_REPORT ||
                    result.name === PermissionEnums.SALES_ORDER_REPORT ||
                    result.name === PermissionEnums.SR_WISE_SALES_REPORT ||
                    result.name === PermissionEnums.PRODUCT_WISE_SALES_REPORT ||
                    result.name === PermissionEnums.VISIT_TARGET_REPORT ||
                    result.name === PermissionEnums.TRACKING_REPORT ||
                    result.name === PermissionEnums.KPI_REPORT ||
                    result.name === PermissionEnums.PRODUCT_BASED_REPORT ||
                    result.name === PermissionEnums.HR_TRAVEL_ALLOWANCE_REPORT ||
                    result.name === PermissionEnums.HR_CHECKIN_REPORT ||
                    result.name === PermissionEnums.HR_TRACKING_REPORT
            }) : []).length > 0 ? true : false
        }, {
            setting: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name == PermissionEnums.APPROVAL_SETTINGS ||
                    result.name === PermissionEnums.TAXONOMY_SETTINGS ||
                    result.name === PermissionEnums.SMS_SETTINGS ||
                    result.name === PermissionEnums.ATTENDANCE_SETTINGS ||
                    result.name === PermissionEnums.PRODUCT_SETTINGS ||
                    result.name === PermissionEnums.TRACKING_SETTING
            }) : []).length > 0 ? true : false
        }, {
            sms: (this.permissions ? this.permissions.filter(function (result: any) {
                return result.name == PermissionEnums.BULK_SMS || result.name === PermissionEnums.VIEW_MESSAGE
            }) : []).length > 0 ? true : false
        }]
    }

    get permissionGroup() {
        return [[{
            label: 'Web Application',
            id: 1000,
            children: [{
                label: 'Dashboard',
                children: this.allPermissionLists.filter(function (result: any) {
                    return result.name === PermissionEnums.DAILY_DATA_DASHBOARD ||
                        result.name === PermissionEnums.MISCELLANEOUS_DASHBOARD ||
                        result.name === PermissionEnums.SALES_GROWTH_DASHBOARD ||
                        result.name === PermissionEnums.OUTLET_ORDER_DASHBOARD ||
                        result.name === PermissionEnums.BASIC_REPORTING_DASHBOARD
                })
            },
                {
                    label: 'Organization',
                    children: this.allPermissionLists.filter(function (result: any) {
                        return result.name == PermissionEnums.CREATE_TERRITORY_TYPE ||
                            result.name == PermissionEnums.VIEW_TERRITORY_TYPE ||
                            result.name === PermissionEnums.UPDATE_TERRITORY_TYPE ||
                            result.name === PermissionEnums.DELETE_TERRITORY_TYPE ||
                            result.name === PermissionEnums.CREATE_TERRITORY || result.name === PermissionEnums.VIEW_TERRITORY ||
                            result.name === PermissionEnums.UPDATE_TERRITORY || result.name === PermissionEnums.DELETE_TERRITORY ||
                            result.name === PermissionEnums.CREATE_CHANNEL || result.name === PermissionEnums.VIEW_CHANNEL ||
                            result.name === PermissionEnums.UPDATE_CHANNEL || result.name === PermissionEnums.DELETE_CHANNEL ||
                            result.name === PermissionEnums.CREATE_DEPARTMENT || result.name === PermissionEnums.VIEW_DEPARTMENT ||
                            result.name === PermissionEnums.UPDATE_DEPARTMENT || result.name === PermissionEnums.DELETE_DEPARTMENT
                    })
                },
                {
                    label: 'User',
                    children: this.allPermissionLists.filter(function (result: any) {
                        return result.name == PermissionEnums.CREATE_ROLE || result.name == PermissionEnums.VIEW_ROLE ||
                            result.name === PermissionEnums.UPDATE_ROLE || result.name === PermissionEnums.UPDATE_ROLE ||
                            result.name === PermissionEnums.DELETE_ROLE || result.name === PermissionEnums.CREATE_USER ||
                            result.name === PermissionEnums.VIEW_USER || result.name === PermissionEnums.UPDATE_USER ||
                            result.name === PermissionEnums.CREATE_TARGET || result.name === PermissionEnums.VIEW_TARGET ||
                            result.name === PermissionEnums.UPDATE_TARGET || result.name === PermissionEnums.DELETE_TARGET ||
                            result.name === PermissionEnums.CREATE_TRAVEL_ALLOWANCE ||
                            result.name === PermissionEnums.VIEW_TRAVEL_ALLOWANCE ||
                            result.name === PermissionEnums.APPROVE_TRAVEL_ALLOWANCE ||
                            result.name === PermissionEnums.DELETE_TRAVEL_ALLOWANCE
                    })
                },
                {
                    label: 'Payment',
                    children: this.allPermissionLists.filter(function (result: any) {
                        return result.name == PermissionEnums.VIEW_PAYMENT || result.name === PermissionEnums.CREATE_PAYMENT ||
                            result.name === PermissionEnums.APPROVE_PAYMENT ||
                            result.name === PermissionEnums.CREATE_ADVANCE_PAYMENT ||
                            result.name === PermissionEnums.VIEW_ADVANCE_PAYMENT ||
                            result.name === PermissionEnums.UPDATE_ADVANCE_PAYMENT
                    }),
                },
                {
                    label: 'Tracking',
                    children: this.allPermissionLists.filter(function (result: any) {
                        return result.name == PermissionEnums.CREATE_VISIT_PLAN ||
                            result.name == PermissionEnums.VIEW_VISIT_PLAN || result.name == PermissionEnums.UPDATE_VISIT_PLAN ||
                            result.name === PermissionEnums.DELETE_VISIT_PLAN ||
                            result.name === PermissionEnums.VIEW_PROPOSED_ROUTE_PLAN ||
                            result.name === PermissionEnums.APPROVE_PROPOSED_ROUTE_PLAN ||
                            result.name === PermissionEnums.VIEW_FIELD_FORCE || result.name === PermissionEnums.VIEW_MAP
                    }),
                },
                {
                    label: 'Inspection',
                    children: this.allPermissionLists.filter(function (result: any) {
                        return result.name == PermissionEnums.CREATE_SURVEY || result.name == PermissionEnums.VIEW_SURVEY ||
                            result.name == PermissionEnums.UPDATE_SURVEY || result.name === PermissionEnums.ASSIGNED_USER_SURVEY ||
                            result.name === PermissionEnums.REPORT_SURVEY || result.name === PermissionEnums.DELETE_SURVEY ||
                            result.name == PermissionEnums.CREATE_ASSET || result.name == PermissionEnums.VIEW_ASSET ||
                            result.name === PermissionEnums.UPDATE_ASSET || result.name === PermissionEnums.DELETE_ASSET ||
                            result.name === PermissionEnums.CREATE_CAMPAIGN || result.name === PermissionEnums.VIEW_CAMPAIGN ||
                            result.name === PermissionEnums.UPDATE_CAMPAIGN || result.name === PermissionEnums.DELETE_CAMPAIGN ||
                            result.name === PermissionEnums.CREATE_OUTLET_ITEM ||
                            result.name === PermissionEnums.VIEW_OUTLET_ITEM ||
                            result.name === PermissionEnums.UPDATE_OUTLET_ITEM ||
                            result.name === PermissionEnums.DELETE_OUTLET_ITEM ||
                            result.name === PermissionEnums.VIEW_AUDIT || result.name === PermissionEnums.CREATE_QUESTION ||
                            result.name === PermissionEnums.VIEW_QUESTION || result.name === PermissionEnums.UPDATE_QUESTION ||
                            result.name === PermissionEnums.DELETE_QUESTION
                    }),
                },
                {
                    label: 'Order',
                    children: this.allPermissionLists.filter(function (result: any) {
                        return result.name == PermissionEnums.VIEW_ORDER || result.name == PermissionEnums.APPROVE_ORDER ||
                            result.name == PermissionEnums.CREATE_REQUISITION ||
                            result.name === PermissionEnums.UPDATE_REQUISITION ||
                            result.name == PermissionEnums.VIEW_REQUISITION ||
                            result.name == PermissionEnums.APPROVE_REQUISITION ||
                            result.name === PermissionEnums.VIEW_SALES_RETURN || result.name === PermissionEnums.CREATE_INVOICE ||
                            result.name === PermissionEnums.VIEW_INVOICE || result.name === PermissionEnums.UPDATE_INVOICE ||
                            result.name === PermissionEnums.APPROVE_INVOICE ||
                            result.name === PermissionEnums.CREATE_READY_TO_DISPATCH ||
                            result.name === PermissionEnums.VIEW_READY_TO_DISPATCH ||
                            result.name === PermissionEnums.UPDATE_READY_TO_DISPATCH ||
                            result.name === PermissionEnums.APPROVE_READY_TO_DISPATCH ||
                            result.name === PermissionEnums.CREATE_READY_TO_DELIVERY ||
                            result.name === PermissionEnums.VIEW_READY_TO_DELIVERY ||
                            result.name === PermissionEnums.UPDATE_READY_TO_DELIVERY ||
                            result.name === PermissionEnums.APPROVE_READY_TO_DELIVERY ||
                            result.name === PermissionEnums.VIEW_DELIVERY
                    }),
                },
                {
                    label: 'Inventory',
                    children: this.allPermissionLists.filter(function (result: any) {
                        return result.name == PermissionEnums.CREATE_PRODUCT_CATEGORY ||
                            result.name == PermissionEnums.VIEW_PRODUCT_CATEGORY ||
                            result.name == PermissionEnums.UPDATE_PRODUCT_CATEGORY ||
                            result.name === PermissionEnums.DELETE_PRODUCT_CATEGORY ||
                            result.name === PermissionEnums.CREATE_PRODUCT_BRAND ||
                            result.name === PermissionEnums.VIEW_PRODUCT_BRAND ||
                            result.name === PermissionEnums.UPDATE_PRODUCT_BRAND ||
                            result.name === PermissionEnums.DELETE_PRODUCT_BRAND ||
                            result.name === PermissionEnums.CREATE_PRODUCT || result.name === PermissionEnums.VIEW_PRODUCT ||
                            result.name === PermissionEnums.UPDATE_PRODUCT || result.name === PermissionEnums.DELETE_PRODUCT ||
                            result.name === PermissionEnums.CREATE_VARIANT_CATEGORY ||
                            result.name === PermissionEnums.VIEW_VARIANT_CATEGORY ||
                            result.name === PermissionEnums.UPDATE_VARIANT_CATEGORY ||
                            result.name === PermissionEnums.DELETE_VARIANT_CATEGORY ||
                            result.name === PermissionEnums.CREATE_UNIT_CATEGORY ||
                            result.name === PermissionEnums.VIEW_UNIT_CATEGORY ||
                            result.name === PermissionEnums.UPDATE_UNIT_CATEGORY ||
                            result.name === PermissionEnums.DELETE_UNIT_CATEGORY ||
                            result.name === PermissionEnums.CREATE_BATCH || result.name === PermissionEnums.VIEW_BATCH ||
                            result.name === PermissionEnums.UPDATE_BATCH || result.name === PermissionEnums.DELETE_BATCH ||
                            result.name === PermissionEnums.CREATE_PROMOTION || result.name === PermissionEnums.VIEW_PROMOTION ||
                            result.name === PermissionEnums.UPDATE_PROMOTION || result.name === PermissionEnums.DELETE_PROMOTION
                    }),
                },
                {
                    label: 'Stock',
                    children: this.allPermissionLists.filter(function (result: any) {
                        return result.name == PermissionEnums.VIEW_STOCK ||
                            result.name == PermissionEnums.STOCK_DOWNLOAD ||
                            result.name == PermissionEnums.BULK_STOCK
                    }),
                },
                {
                    label: 'Attendance',
                    children: this.allPermissionLists.filter(function (result: any) {
                        return result.name == PermissionEnums.VIEW_ATTENDANCE || result.name === PermissionEnums.CREATE_LEAVE ||
                            result.name === PermissionEnums.VIEW_LEAVE || result.name === PermissionEnums.APPROVE_LEAVE ||
                            result.name === PermissionEnums.DELETE_LEAVE
                    }),
                },
                {
                    label: 'Setting',
                    children: this.allPermissionLists.filter(function (result: any) {
                        return result.name == PermissionEnums.APPROVAL_SETTINGS ||
                            result.name === PermissionEnums.TAXONOMY_SETTINGS ||
                            result.name === PermissionEnums.SMS_SETTINGS ||
                            result.name === PermissionEnums.ATTENDANCE_SETTINGS ||
                            result.name === PermissionEnums.PRODUCT_SETTINGS ||
                            result.name === PermissionEnums.TRACKING_SETTING ||
                            result.name === PermissionEnums.UPDATE_SETTING
                    }),
                },
                {
                    label: 'Report',
                    children: this.allPermissionLists.filter(function (result: any) {
                        return (
                            result.name == PermissionEnums.VIEW_REPORT ||
                            result.name === PermissionEnums.SALES_REPORT ||
                            result.name === PermissionEnums.SALES_ORDER_REPORT ||
                            result.name === PermissionEnums.SR_WISE_SALES_REPORT ||
                            result.name === PermissionEnums.PRODUCT_WISE_SALES_REPORT ||
                            result.name === PermissionEnums.VISIT_TARGET_REPORT ||
                            result.name === PermissionEnums.TRACKING_REPORT ||
                            result.name === PermissionEnums.KPI_REPORT ||
                            result.name === PermissionEnums.PRODUCT_BASED_REPORT ||
                            result.name === PermissionEnums.HR_TRAVEL_ALLOWANCE_REPORT ||
                            result.name === PermissionEnums.HR_CHECKIN_REPORT ||
                            result.name === PermissionEnums.HR_TRACKING_REPORT ||
                            result.name === PermissionEnums.ACTIVE_USER_REPORT ||
                            result.name === PermissionEnums.DAILY_CALL_REPORT ||
                            result.name === PermissionEnums.PERFORMANCE_BOARD_REPORT ||
                            result.name === PermissionEnums.NOT_ORDERED_REPORT ||
                            result.name === PermissionEnums.TARGET_VS_ACHIEVEMENT_REPORT
                        );
                    }),
                },
                {
                    label: 'Sms',
                    children: this.allPermissionLists.filter(function (result: any) {
                        return result.name == PermissionEnums.BULK_SMS || result.name === PermissionEnums.VIEW_MESSAGE
                    }),
                }],
        }],
            [{
                id: 2000,
                label: 'Mobile Application',
                children: this.allPermissionLists.filter(function (result: any) {
                    return result.name == PermissionEnums.PROFILE_INFORMATION_CHANGE_MOBILE ||
                        result.name == PermissionEnums.VIEW_OUTLET_MOBILE ||
                        result.name == PermissionEnums.CHECKIN_MOBILE || result.name == PermissionEnums.MAP_MOBILE ||
                        result.name == PermissionEnums.CREATE_OUTLET_MOBILE ||
                        result.name == PermissionEnums.UPDATE_OUTLET_MOBILE ||
                        result.name == PermissionEnums.ORDER_MOBILE ||
                        result.name == PermissionEnums.CREATE_ORDER_MOBILE ||
                        result.name == PermissionEnums.VIEW_ORDER_MOBILE ||
                        result.name == PermissionEnums.CREATE_SALES_RETURN_MOBILE ||
                        result.name == PermissionEnums.PAYMENT_MOBILE || result.name == PermissionEnums.INVOICE_MOBILE ||
                        result.name == PermissionEnums.DELIVERY_MOBILE ||
                        result.name == PermissionEnums.DELIVERY_LIST_MOBILE ||
                        result.name == PermissionEnums.INSPECTION_MOBILE ||
                        result.name == PermissionEnums.ROUTE_PLAN_MOBILE ||
                        result.name == PermissionEnums.TRAVEL_ALLOWANCE_MOBILE ||
                        result.name == PermissionEnums.CREATE_PROPOSED_ROUTE_PLAN_MOBILE ||
                        result.name == PermissionEnums.UPDATE_PROPOSED_ROUTE_PLAN_MOBILE ||
                        result.name == PermissionEnums.LEAVE_REQUEST_MOBILE ||
                        result.name == PermissionEnums.ORDER_CUSTOM_DISCOUNT_MOBILE
                })
            }]
        ]
    }

    @Mutation
    public authRequest() {
        this.mStatus = 'loading';
    }

    @Mutation
    public authSuccess({
                           token,
                           user,
                           permissions,
                           roles,
                           allPermissionLists,
                       }: { token: string; user: User; permissions: Permission[]; roles: Role[]; allPermissionLists: Permission[] }) {
        this.mStatus = 'success';
        this.mToken = token;
        this.mUser = user;
        this.mPermissions = permissions;
        this.mRoles = roles;
        this.mAllPermissionLists = allPermissionLists;
    }

    @Mutation
    public setUser({user}: { user: User }) {
        this.mUser = user;
    }

    @Mutation
    public authError() {
        this.mStatus = 'error';
    }

    @Mutation
    public clear() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentUser');

        this.mStatus = '';
        this.mToken = '';
        this.mUser = {};
    }

    @Mutation
    public setClientInfo({domain, clientInfo}: { domain: string; clientInfo: string }) {
        this.domain = domain;
        this.clientInfo = 'Org Found!';
    }

    @Mutation
    public setCurrentUser(payload: any) {
        this.currentUser = payload;
        localStorage.setItem('currentUser', JSON.stringify(payload));
    }

    @Mutation
    public setNavbarKey() {
        this.navbarKey = Math.floor(Math.random() * 100);
    }

    @Action({rawError: true})
    public login(payload: any) {
        return new Promise(async (resolve, reject) => {
            axios.defaults.withCredentials = true;
            await axios.get(payload.vm.$api('/sanctum/csrf-cookie', true));
            try {
                const response = await axios.post(payload.vm.$api('/login'), payload.fields);
                const responseME = await axios.get(payload.vm.$api('/me'), payload.fields);
                const settings = await axios.get(payload.vm.$api('/settings'), payload.fields);
                const responseAllPermissions = await axios.get(payload.vm.$api('/permissions'), payload.fields);

                // const permissions: Permission[] = responseME.data.me.permissions;
                const roles: any = responseME.data.me.roles;
                const token: string = response.data.token;
                const user: User = response.data.user;
                const rolePermission: any = [];
                const allPermissionLists = responseAllPermissions.data.permissions;
                if (roles) {
                    roles.forEach((role: any) => {
                        rolePermission.push(role.permissions)
                    })
                }
                const permissions: Permission[] = roles.length > 0 ? responseME.data.me.permissions.concat(roles[0].permissions) : responseME.data.me.permissions;
                await localStorage.setItem('token', token);
                await localStorage.setItem('user', JSON.stringify(user));
                await localStorage.setItem('permissions', JSON.stringify(permissions));
                await localStorage.setItem('roles', JSON.stringify(roles));
                await localStorage.setItem('allPermissions', JSON.stringify(allPermissionLists));
                // payload.vm.constructor.prototype.$user = user;
                await this.context.commit('authSuccess', {token, user, permissions, roles, allPermissionLists});

                await store.dispatch('SetupWizard/checkAccountCompleteness', {vm: payload.vm});

                this.context.commit('setCurrentUser', responseME.data.me);
                await store.dispatch('Settings/updateSettings', settings.data.settings);
                await store.dispatch('Settings/updateCurrency', settings.data.settings.currency);


                resolve(response);
            } catch (err) {
                localStorage.removeItem('token');
                reject(err);
            }
        });
    }

    @Action({rawError: true})
    public async register(payload: any) {
        axios.defaults.withCredentials = true;
        await axios.get(payload.vm.$landLordApi('/sanctum/csrf-cookie', true));
        return axios({
            url: payload.vm.$landLordApi('/register'),
            data: payload.fields,
            method: 'POST'
        }).then(response => {
            const token: string = response.data.token;
            const user: User = response.data.user;
            // localStorage.setItem('token', token);
            // localStorage.setItem('user', JSON.stringify(user));

            // payload.vm.constructor.prototype.$user = user;

            // this.context.commit('authSuccess', { token, user });
            this.context.commit('setClientInfo', {domain: response.data.org.domain, clientInfo: 'true'});
        });
    }

    @Action
    public logout(payload: any) {
        return new Promise((resolve, reject) => {
            axios.delete(payload.vm.$api('/logout')).then(response => {
                this.context.commit('clear');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('permissions');
                localStorage.removeItem('roles');
                localStorage.removeItem('currentStatus');
                localStorage.removeItem('currentStep');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('settings')
                if (this.mToken && this.mUser) {
                    reject();
                }
                resolve(response);
            });
        });
    }

    @Action({rawError: true})
    public async validateClient() {
        let self = this;
        try {
            await Vue.prototype.$http.get(Vue.prototype.$landLordApi('/sanctum/csrf-cookie', true));
            if ( !(localStorage.getItem('orgName')) || (localStorage.getItem('orgLogoUrl') == 'null')) {
                let {data} = await Vue.prototype.$http.post(Vue.prototype.$landLordApi('/validate-org'), {domain: self.getDomain});
                localStorage.setItem('orgLogoUrl', data.org.org_logo_url);
                localStorage.setItem('orgName', self.domain);
            }
            return true;
        } catch (e) {
            localStorage.removeItem('orgLogoUrl');
            localStorage.removeItem('orgName');
            return false;
        }
    }

    @Action
    public async updateCurrentUser(payload: any) {
        await this.context.commit('setCurrentUser', payload);
    }

    @Action
    public updateNavbarKey() {
        this.context.commit('setNavbarKey');
    }
}
