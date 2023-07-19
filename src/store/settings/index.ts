import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import Vue from 'vue';
import store from '@/store';
import TaxonomyJson from '@/assets/json/Taxonomy.json'

@Module({namespaced: true})
export default class Settings extends VuexModule {
    private currency: string = localStorage.settings ? JSON.parse(localStorage.settings).currency : 'BDT';
    private taxonomy: string = localStorage.settings ? JSON.parse(localStorage.settings).taxonomy : TaxonomyJson;
    private settings: any = {};

    get getCurrency() {
        return this.currency;
    }

    get getSettings() {
        return this.settings;
    }

    get getTaxonomyStore() {
        return this.taxonomy
    }

    @Mutation
    public setCurrency(payload: string) {
        this.currency = payload;
    }

    @Mutation
    public setSettings(payload: any) {
        this.settings = payload;
    }

    @Mutation
    public setTaxonomy(payload: any) {
        this.taxonomy = payload;
    }

    @Action
    public updateCurrency(payload: string) {
        this.context.commit('setCurrency', payload);
    }

    @Action
    public updateSettings(payload: any) {
        this.context.commit('setSettings', payload);
        localStorage.setItem('settings', JSON.stringify(payload));
    }

    @Action
    public updateTaxonomy(payload: string) {
        this.context.commit('setTaxonomy', payload);
    }
}
