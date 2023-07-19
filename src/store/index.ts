import Vue from "vue";
import Vuex from "vuex";
import Auth from "@/store/auth";
import SetupWizard from "@/store/setup-wizard";
import AdminAuth from "@/store/admin-auth";
import Settings from "@/store/settings";
import Theme from "@/store/theme";
import Confirmation from "@/store/confirmation";


Vue.use(Vuex);

const store = new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        Auth,
        SetupWizard,
        AdminAuth,
        Settings,
        Theme,
        Confirmation
    }
});

export default store;
