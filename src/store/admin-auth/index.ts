import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import axios from 'axios';
import Vue from 'vue';
import User from '@/intefaces/User';
const adminJson = localStorage.getItem('admin');

@Module({ namespaced: true })
export default class AdminAuth extends VuexModule {
  public mStatus: string = '';
  public mToken: string = localStorage.getItem('adminToken') || '';
  public mUser: User | object = adminJson !== null ? JSON.parse(adminJson) : {};
  public domain: string = '';

  get isLoggedIn() {
    return !!this.mToken;
  }
  get admin() {
    return this.mUser;
  }

  get adminToken() {
    return this.mToken;
  }
  get authStatus() {
    return this.mStatus;
  }

  @Mutation
  public authRequest() {
    this.mStatus = 'loading';
  }

  @Mutation
  public authSuccess({ adminToken, admin }: { adminToken: string; admin: User }) {
    this.mStatus = 'success';
    this.mToken = adminToken;
    this.mUser = admin;
  }

  @Mutation
  public setUser({ admin }: { admin: User }) {
    this.mUser = admin;
  }

  @Mutation
  public authError() {
    this.mStatus = 'error';
  }

  @Mutation
  public clear() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    this.mStatus = '';
    this.mToken = '';
    this.mUser = {};
  }

  @Action({ rawError: true })
  public login(payload: any) {
    return new Promise(async (resolve, reject) => {
      axios.defaults.withCredentials = true;
      await axios.get(payload.vm.$landLordApi('/sanctum/csrf-cookie', true));
      try {
        const response = await axios.post(payload.vm.$landLordApi('/admin/login'), payload.fields);

        const adminToken: string = 'true';
        const admin: User = response.data.user;

        localStorage.setItem('adminToken', adminToken);
        localStorage.setItem('admin', JSON.stringify(admin));
        payload.vm.constructor.prototype.$admin = admin;
        this.context.commit('authSuccess', { adminToken, admin });

        resolve(response);
      } catch (err) {
        localStorage.removeItem('adminToken');
        reject(err);
      }
    });
  }

  @Action
  public logout(payload: any) {
    return new Promise((resolve, reject) => {
      axios.delete(payload.vm.$landLordApi('/admin/logout')).then(response => {
        this.context.commit('clear');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        if (this.mToken && this.mUser) {
          reject();
        }
        resolve(response);
      });
    });
  }
}
