<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" @close="close" size="lg">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New' }} Package</h5>
      </template>
      <div class="row">
        <div class="col-md-6">
          <base-input label="Name" name="name" placeholder="e.g. Free" v-model="form.name" prepend-icon="fas fa-box-open"></base-input>
        </div>
        <div class="col-md-6">
          <base-input label="Trial Days" name="trial_days" placeholder="e.g. 1" v-model="form.trialDays" prepend-icon="fas fa-calendar-day">
            <small slot="append" class="font-weight-bold">Day(s)</small>
          </base-input>
        </div>
        <div class="col-md-6">
          <feature-lazydropdown
            label="Feature"
            placeholder="Select Feature"
            v-model="form.features"
            @remove-tag="onRemoveFeature"
            :multiple="true"
          ></feature-lazydropdown>
        </div>
        <div class="col-md-6 mt-4">
          <div class="form-inline" style="float: right">
            <small class="mr-2"><b>Add Scheme</b></small>

            <el-tooltip content="Add More Schemes" placement="top">
              <base-button type="success" icon size="sm" @click="addNewScheme">
                <span class="btn-inner--icon">
                  <i class="fas fa-plus"></i>
                </span>
              </base-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div v-for="(scheme, index) in form.schemes" :key="index">
        <div class="row">
          <div class="col-md-6">
            <base-input label="Scheme" name="cycle" placeholder="e.g. 1" v-model="scheme.cycle" prepend-icon="ni ni-calendar-grid-58">
              <small slot="append" class="font-weight-bold">Month(s)</small>
            </base-input>
          </div>
          <div class="col-md-5">
            <base-input label="Price" name="price" placeholder="e.g. 100" v-model="scheme.price" prepend-icon="ni ni-money-coins"></base-input>
          </div>
          <div class="col-md-1 mt-2">
            <base-button
              type="danger"
              icon
              size="sm"
              class="mt-4"
              @click="scheme.newScheme == 0 ? deleteScheme(index) : deleteSchemeFromServer(scheme.newScheme, index)"
            >
              <span class="btn-inner--icon">
                <i class="fas fa-times"></i>
              </span>
            </base-button>
          </div>
        </div>
      </div>
      <template slot="footer">
        <base-button @click="close" type="secondary">Close</base-button>
        <base-button :disabled="disableBtn" :loading="loading" @click="handleSubmit(save)" type="success">Save</base-button>
      </template>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import FeatureLazydropdown from '@/components/lazyDropdown/FeatureLazydropdown.vue';
@Component({
  components: {
    FeatureLazydropdown,
  },
})
export default class CreatePackageForm extends Vue {
  @Prop() isActive!: boolean;
  @Prop() isUpdate!: boolean;
  @Prop() currentPackage!: any;

  @Prop({
    default: () => ({
      name: '',
      schemes: [
        {
          cycle: 0,
          price: 0,
          newScheme: 0, //newScheme = 0, existing scheme, newScheme = 1, new scheme
        },
      ],
      trialDays: 0,
      features: [],
    }),
  })
  form!: {
    name: string;
    schemes: any;
    trialDays: number;
    price: number;
    features: any;
  };
  private disableBtn = false;
  private loading = false;
  private is_remove_feature = false;
  private newAddedFeature: any = '';
  private update: boolean = false;

  formReset(): any {
    this.form.name = '';
    (this.form.schemes = [
      {
        cycle: 0,
        price: 0,
        newScheme: 0,
      },
    ]),
      (this.form.trialDays = 0);
    this.form.features = [];
    return this.form;
  }

  addNewScheme() {
    this.form.schemes.push({
      cycle: 0,
      price: 0,
      newScheme: 0,
    });
  }
  @Watch('form.features')
  updateFeature(old: any, current: any) {
    if (
      this.isUpdate == true &&
      this.is_remove_feature == false &&
      this.currentPackage.features.findIndex((feature: any) => feature.id == old) == -1
    ) {
      let newFeature = '';
      if (this.form.features != '' && current != '') {
        newFeature = old.filter((item: any) => {
          return current.indexOf(item) === -1;
        });
      }
      if (old.length == 1 && current.length == 0) {
        this.$http.post(this.$landLordApi(`/packages/${this.currentPackage.id}/features`), { feature_id: old[0] });
      }
      if ((newFeature != '' && old.includes('0') == false) || old.includes(this.newAddedFeature) == true) {
        this.$http.post(this.$landLordApi(`/packages/${this.currentPackage.id}/features`), {
          feature_id: newFeature != '' ? newFeature[0] : this.newAddedFeature,
        });
        this.newAddedFeature = '';
      }
    }
  }

  deleteScheme(index: number) {
    this.form.schemes.splice(index, 1);
  }

  deleteSchemeFromServer(scheme: any, index: any) {
    this.$http
      .delete(this.$landLordApi(`/schemes/${scheme}`))
      .then((response) => {
        this.form.schemes.splice(index, 1);
      })
      .catch((error) => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  onRemoveFeature(remove: any) {
    if (this.isUpdate == true) {
      this.is_remove_feature = true;
      this.$http.delete(this.$landLordApi(`/packages/${this.currentPackage.id}/features/${remove}`)).then((response) => {
        this.is_remove_feature = false;
      });
    }
  }

  createPackage() {
    this.disableBtn = true;
    this.loading = true;
    this.$http
      .post(this.$landLordApi('/packages'), {
        name: this.form.name,
        trial_days: this.form.trialDays,
      })
      .then((response) => {
        this.form.features.forEach((feature: any) => {
          this.$http.post(this.$landLordApi(`/packages/${response.data.package.id}/features`), {
            feature_id: feature,
          });
        });
        this.form.schemes.forEach((scheme: any) => {
          this.$http.post(this.$landLordApi('/schemes'), {
            package_id: response.data.package.id,
            cycle: scheme.cycle,
            price: scheme.price,
          });
        });
        this.$http.get(this.$landLordApi(`/packages/${response.data.package.id}`)).then((responsePackage) => {
          this.$emit('created', responsePackage.data.package);
        });
        this.disableBtn = false;
        this.loading = false;
        this.$nextTick(() => {
          (this.$refs.formValidator as HTMLFormElement).reset();
        });
      })
      .catch((error) => {
        this.disableBtn = false;
        this.loading = false;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  updatePackage() {
    this.disableBtn = true;
    this.loading = true;
    this.$http
      .patch(this.$landLordApi(`/packages/${this.currentPackage.id}`), {
        name: this.form.name,
        trial_days: this.form.trialDays,
      })
      .then((response) => {
        this.form.schemes.forEach((scheme: any) => {
          if (scheme.newScheme == 0) {
            this.$http
              .post(this.$landLordApi('/schemes'), {
                package_id: response.data.package.id,
                cycle: scheme.cycle,
                price: scheme.price,
              })
              .then((response) => {});
          } else {
            this.$http
              .patch(this.$landLordApi(`/schemes/${scheme.newScheme}`), {
                package_id: response.data.package.id,
                cycle: scheme.cycle,
                price: scheme.price,
              })
              .then((response) => {});
          }
        });

        this.$http.get(this.$landLordApi(`/packages/${response.data.package.id}`)).then((responsePackage) => {
          this.$emit('updated', responsePackage.data.package);
        });

        // this.updateScheme(response);
        // await this.fetchUpdatedScheme(response);

        this.$notify({
          title: 'Success',
          message: 'Successfully Updated',
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success',
        });
        this.disableBtn = false;
        this.loading = false;
        this.$nextTick(() => {
          (this.$refs.formValidator as HTMLFormElement).reset();
        });
      })
      .catch((error) => {
        this.disableBtn = true;
        this.loading = true;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  updateScheme(response: any) {
    this.form.schemes.forEach((scheme: any) => {
      if (scheme.newScheme == 0) {
        this.$http
          .post(this.$landLordApi('/schemes'), {
            package_id: response.data.package.id,
            cycle: scheme.cycle,
            price: scheme.price,
          })
          .then((response) => {
            this.update = false;
          });
      } else {
        this.$http
          .patch(this.$landLordApi(`/schemes/${scheme.newScheme}`), {
            package_id: response.data.package.id,
            cycle: scheme.cycle,
            price: scheme.price,
          })
          .then((response) => {
            this.update = false;
          });
      }
    });
  }

  async fetchUpdatedScheme(response: any) {
    this.$http.get(this.$landLordApi(`/packages/${response.data.package.id}`)).then((responsePackage) => {
      this.$emit('updated', responsePackage.data.package);
    });
  }

  save() {
    this.isUpdate ? this.updatePackage() : this.createPackage();
  }

  close() {
    this.$emit('update:isActive', false);
    this.$emit('update:form', {
      name: '',
      trialDays: 0,
      features: [],
      schemes: [
        {
          cycle: 0,
          price: 0,
        },
      ],
    });
    this.disableBtn = false;
    this.loading = false;
  }
}
</script>
