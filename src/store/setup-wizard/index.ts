import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { SetupWizardSteps } from '@/enums/SetupWizardSteps';
import { SetupWizardStatus } from '@/enums/SetupWizardStatus';

@Module({namespaced: true})
export default class SetupWizard extends VuexModule {
    public currentStatus: string = localStorage.getItem('currentStatus') || SetupWizardStatus.Incompleted;
    public currentStep: string = localStorage.getItem('currentStep') || SetupWizardSteps.TerritoryStructure.toString();

    get getCurrentStatus() {
        return this.currentStatus;
    }

    get isCompleted() {
        return this.currentStatus === SetupWizardStatus.Completed;
    }

    get getCurrentStep() {
        return this.currentStep;
    }

    @Mutation
    public setStep(payload: string) {
        this.currentStep = payload;
    }

    @Mutation
    public wizardStatus({status, step}: { status: SetupWizardStatus; step: SetupWizardSteps }) {
        localStorage.setItem('currentStatus', status);
        localStorage.setItem('currentStep', step.toString());
        this.currentStatus = status;
        this.currentStep = step.toString();
    }

    @Mutation
    public nextStep() {
        let currentStepIntValue = Number(this.currentStep);
        if (currentStepIntValue < Object.keys(SetupWizardSteps).length / 2 - 1) {
            currentStepIntValue++;
            this.currentStep = currentStepIntValue.toString();
            localStorage.setItem('currentStep', this.currentStep);
        } else {
            localStorage.setItem('currentStatus', SetupWizardStatus.Completed);
            localStorage.setItem('currentStep', SetupWizardSteps.Welcome.toString());
            this.currentStatus = SetupWizardStatus.Completed;
            this.currentStep = SetupWizardSteps.Welcome.toString();
            location.reload();
        }
    }

    @Mutation
    public errorStep() {
        localStorage.setItem('currentStatus', SetupWizardStatus.Incompleted);
        localStorage.setItem('currentStep', SetupWizardSteps.Welcome.toString());
        this.currentStatus = SetupWizardStatus.Incompleted;
        this.currentStep = SetupWizardSteps.Welcome.toString();
    }

    @Mutation
    public previousStep() {
        let currentStepIntValue = Number(this.currentStep);
        if (currentStepIntValue <= Object.keys(SetupWizardSteps).length / 2 - 1)
            currentStepIntValue--;
        this.currentStep = currentStepIntValue.toString();
        localStorage.setItem('currentStep', this.currentStep);
    }

    @Action({rawError: true})
    public async checkAccountCompleteness(payload: any) {
        let res1 = await payload.vm.$http.get(payload.vm.$api('/setup-wizard-status'));
        if (!res1.data.completed) {
            this.context.commit('wizardStatus', {
                status: SetupWizardStatus.Incompleted,
                step: SetupWizardSteps.Welcome
            });
            return;
        }

        this.context.commit('wizardStatus', {
            status: SetupWizardStatus.Completed,
            step: SetupWizardSteps.RoleStructure
        });
    }

    @Action
    public updateCurrentStep(payload: string) {
        this.context.commit('setStep', payload);
        localStorage.setItem('currentStep', payload);
    }
}
