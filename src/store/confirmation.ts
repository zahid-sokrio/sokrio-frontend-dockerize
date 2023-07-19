import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import ConfirmationOptions from "@/intefaces/ConfirmationOptions";

@Module({namespaced: true})
export default class Confirmation extends VuexModule {

    private _dialog = false;
    private _loading = false;
    private _title = '';
    private _body = '';
    private _confirmBtnText = '';
    private _rejectBtnText = '';
    private _onAccept!: Function;
    private _onReject!: Function;

    get confirmBtnText(): string {
        return this._confirmBtnText;
    }

    get rejectBtnText(): string {
        return this._rejectBtnText;
    }

    get body(): string {
        return this._body;
    }

    get title(): string {
        return this._title;
    }

    get dialog(): boolean {
        return this._dialog;
    }

    get loading(): boolean {
        return this._loading;
    }

    @Mutation
    public showConfirmationAlert({title, body, confirmBtnText, rejectBtnText, onAccept, onReject}: ConfirmationOptions) {
        this._title = title;
        this._body = body || '';
        this._confirmBtnText = confirmBtnText || 'Yes';
        this._rejectBtnText = rejectBtnText || 'Cancel';
        this._dialog = true;
        this._onAccept = onAccept
        this._onReject = onReject || function () {}
    }

    @Mutation
    public beforeAccept() {
        this._loading = true;
    }

    @Mutation
    public afterAccept() {
        this._loading = false;
        this._dialog = false;
    }

    @Action({rawError: true})
    public async accept() {
        this.context.commit('beforeAccept');
        await this._onAccept()
        this.context.commit('afterAccept');
    }

    @Mutation
    public beforeReject() {
        this._loading = true;
    }

    @Mutation
    public afterReject() {
        this._loading = false;
        this._dialog = false;
    }

    @Action({rawError: true})
    public async reject() {
        this.context.commit('beforeReject');
        await this._onReject()
        this.context.commit('afterReject');
    }
}
