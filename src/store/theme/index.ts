import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

@Module({namespaced: true})
export default class Theme extends VuexModule {

    private logoUrl: string = localStorage.getItem("settings") && JSON.parse(<string>localStorage.getItem("settings")).company ? JSON.parse(JSON.parse(<string>localStorage.getItem("settings")).company).logo : 'No Logo';
    private themeColor: string = localStorage.getItem("settings") && JSON.parse(<string>localStorage.getItem("settings")).company ? JSON.parse(JSON.parse(<string>localStorage.getItem("settings")).company).theme_color : '#2183a7';
    private logoChangeCount : number = 0;
    get getThemeColor() {
        return this.themeColor;
    }

    get getLogoUrl() {
        return this.logoUrl;
    }

    get orgLogo() {
        return localStorage.getItem('orgLogoUrl');
    }

    get orgName() {
        return localStorage.getItem('orgName');
    }

    get logoUrlChangeCount() {
        return this.logoChangeCount;
    }


    @Mutation
    public setThemeColor(payload: any) {
        this.themeColor = payload;
    }

    @Mutation
    public setLogoUrl(payload: any) {
        this.logoUrl = payload;
        this.logoChangeCount++;
    }


    @Action
    public updateThemeColor(payload: string) {
        this.context.commit('setThemeColor', payload);
    }

    @Action
    public updateLogoUrl(payload: string) {
        this.context.commit('setLogoUrl', payload);
    }
}
