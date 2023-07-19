import { Component, Prop, Vue } from 'vue-property-decorator';
import { AxiosResponse } from 'axios';

// @ts-ignore
@Component
abstract class BaseCUModalComponent extends Vue {
  @Prop({ type: Boolean, default: false })
  public isActive!: boolean;
  @Prop({ type: Boolean, default: false })
  public isUpdate!: boolean;
  public loading: boolean = false;

  @Prop()
  abstract form: any;
  @Prop()
  abstract currentEntity: object;

  abstract get createApi(): string;

  abstract get updateApi(): string;

  abstract async afterCreate(response: AxiosResponse<any>): Promise<void>;

  abstract afterUpdate(response: AxiosResponse<any>): void;

  abstract formReset(): any;
  async beforeCreate(): Promise<void> {}
  beforeClose() {}
  validateBeforeCreate(): boolean {
    return true;
  }
  formData(): any {
    return this.form;
  }

  async createEntity(): Promise<void> {
    if (!this.validateBeforeCreate()) {
      return;
    }
    // await this.beforeCreate();
    this.loading = true;
    try {
      let response = await this.$http.post(this.$landLordApi(this.createApi), this.formData());
      if (response.data.message) {
        this.errorNotification(response);
      } else {
        await this.afterCreate(response);
        this.createNotification();
      }
      this.close();
    } catch (error) {
      (this.$refs.formValidator as Vue & {
        setErrors: (errors: []) => any;
      }).setErrors(error.response.data.errors);
    } finally {
      this.loading = false;
    }
  }

  private updateEntity() {
    this.loading = true;
    this.$http
      .patch(this.$landLordApi(this.updateApi), this.form)
      .then(response => {
        if (response.data.message) {
          this.errorNotification(response);
        } else {
          this.updateNotification();
          this.afterUpdate(response);
        }
        this.close();
      })
      .catch(error => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      })
      .finally(() => (this.loading = false));
  }

  protected errorNotification(response: AxiosResponse<any>): void {
    // @ts-ignore
    this.$notify({
      title: 'Error',
      message: response.data.message,
      duration: 3000,
      iconClass: 'ni ni-bell-55',
      type: 'warning'
    });
  }

  protected updateNotification() {
    this.notification('Updated');
  }
  protected createNotification() {
    this.notification('Created');
  }

  protected notification(type: string): void {
    // @ts-ignore
    this.$notify({
      title: 'Success',
      message: `Successfully ${type}`,
      duration: 3000,
      iconClass: 'ni ni-bell-55',
      type: 'success'
    });
  }

  public save(): void {
    this.isUpdate ? this.updateEntity() : this.createEntity();
  }

  close(): void {
    this.beforeClose();
    this.$parent.$emit('update:isActive', false);
    this.$emit('update:isActive', false);
    this.$emit('update:isUpdate', false);
    this.$emit('update:form', this.formReset());
  }
}

@Component
//@ts-ignore
export default class BaseCUModalComponentMixin extends BaseCUModalComponent {}
