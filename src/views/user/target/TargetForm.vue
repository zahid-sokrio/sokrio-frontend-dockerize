<template>
  <div>
    <validation-observer ref="formValidator" v-slot="{ handleSubmit }">
      <!--      <form class="needs-validation"-->
      <!--            @submit.prevent="handleSubmit(save)">-->
      <modal :show="isActive" v-if="isActive" size="lg" @close="close" class="modal-dialog-scrollable">
        <template slot="header">
          <h5 class="modal-title">{{ isUpdate ? 'Update' : 'Add New' }} Target</h5>
        </template>
        <div>
          <el-tabs tabNavClasses="nav-fill nav-wrapper" v-model="activeTab">
            <el-tab-pane label="Regular Target" name="regular">
              <regular-target-component
                :form.sync="form"
                :is-update.sync="isUpdate"
                :is-active.sync="isActive"
                :current-traget="currentTraget"
                @products="products = $event"
                :route-column-title="routeColumnTitle"
                :active-tab.sync="activeTab"
              ></regular-target-component>
            </el-tab-pane>

            <el-tab-pane label="Route Wise Target" name="route">
              <route-wise-target-component
                :form.sync="form"
                :is-update.sync="isUpdate"
                :current-traget="currentTraget"
                :route-wise-target-lists.sync="routeWiseTargetLists"
                @products="isUpdate ? (products = $event) : ''"
                :route-column-title="routeColumnTitle"
                :active-tab.sync="activeTab"
              ></route-wise-target-component>
            </el-tab-pane>
          </el-tabs>
        </div>
        <template slot="footer">
          <span v-if="routeWiseTargetLists.length <= 0 && activeTab == 'route' && !isUpdate" style="color: red; font-size: 13px"
            ><i class="fas fa-info-circle"></i> Add target in the below list, only listed target will be saved.</span
          >
          <base-button type="secondary" @click="close">Close</base-button>
          <base-button v-if="activeTab == 'regular'" :disabled="disableSaveBtn" type="success" @click="handleSubmit(save)"> Save </base-button>
          <base-button
            v-if="!isUpdate && activeTab == 'route'"
            type="success"
            :disabled="routeWiseTargetLists.length <= 0 && activeTab == 'route' && !isUpdate ? true : disableSaveBtn"
            @click="save"
          >
            Save
          </base-button>
          <base-button v-if="isUpdate && activeTab == 'route'" type="success" @click="handleSubmit(save)"> Save </base-button>
        </template>
      </modal>
      <!--      </form>-->
    </validation-observer>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator';
import Target from '@/intefaces/Target';
import UserAutocomplete from '@/components/lazyDropdown/UserLazydropdown.vue';
import ProductLazydropdown from '@/components/lazyDropdown/ProductLazydropdown.vue';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import RegularTargetComponent from '@/views/user/target/RegularTargetComponent.vue';
import RouteWiseTargetComponent from '@/views/user/target/RouteWiseTargetComponent.vue';
import RouteWiseTargetLists from '@/intefaces/RouteWiseTargetLists';
import { TabPane, Tabs } from 'element-ui';

@Component({
  components: {
    UserAutocomplete,
    ProductLazydropdown,
    RegularTargetComponent,
    RouteWiseTargetComponent,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane
  },
  name: 'TargetForm'
})
export default class TargetForm extends Mixins(TaxonomyMixin) {
  @Prop() isActive!: boolean;
  @Prop() isUpdate!: boolean;
  @Prop() currentTraget!: Target;
  @Prop() currentLableForInvoice!: string;
  @Prop() passTargetAssignId!: number;
  @Prop() form!: {
    type: string;
    expiresDate: string;
    amount: number;
    unit: string;
    assignTo: any;
    scheme: string;
    start_from: string;
    status: boolean;
    territory_id: number | string;
  };
  @Prop() routeColumnTitle!: string;
  private hasProduct = false;
  private products: any = [];
  private assignees: any = [];
  private disableSaveBtn = false;
  private routeWiseTargetLists: RouteWiseTargetLists[] = [];
  private activeTab: string = 'regular';

  @Watch('isActive')
  updateTab(newVal: boolean) {
    if (this.isUpdate) {
      this.activeTab = this.form.territory_id ? 'route' : 'regular';
    }
  }

  formReset() {
    this.products = [
      {
        product: '',
        amount: '',
        newProduct: '',
        targetOn: ''
      }
    ];
    this.form.type = '';
    this.form.expiresDate = '';
    this.form.unit = '';
    this.form.amount = 0;
    this.form.assignTo = '';
    this.form.scheme = '';
    this.form.start_from = '';
    this.form.status = true;
    this.activeTab = 'regular';
    this.form.territory_id = '';
    this.routeWiseTargetLists = [];
    this.hasProduct = this.disableSaveBtn = false;
    (this.$refs.formValidator as Vue & {
      reset: () => any;
    }).reset();
  }

  saveTargetProduct(products: any, targetId: number) {
    products.forEach((product: any) => {
      this.$http.post(this.$api(`/target-products`), {
        target_id: targetId,
        product_id: product.product,
        amount: product.amount,
        target_on: product.targetOn
      });
    });
  }

  callTargetApi(assignee: number | null = null, form: any, products: any) {
    this.$http
      .post(this.$api('/targets'), {
        type: form.type,
        expires_at: '2020-02-03',
        unit_name: form.unit,
        unit_value: form.amount,
        assigned_to: assignee,
        scheme: form.scheme,
        start_from: '2020-02-02',
        active: form.status,
        territory_id: form.territory_id,
        target_name_id: this.passTargetAssignId
      })
      .then(response => {
        if (!response.data.target) {
          this.notify('warning', 'Already assigned', 'warning');
          this.disableSaveBtn = false;
        } else {
          if (products.length > 0 && products[0].product) {
            this.saveTargetProduct(products, response.data.target.id);
          }
          this.notify('Success', 'Successfully Created', 'success');
          this.$emit('created', response.data.target);
          this.formReset();
        }
      })
      .catch(error => {
        this.disableSaveBtn = false;
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  createTarget() {
    this.disableSaveBtn = true;
    if (this.activeTab == 'regular') {
      this.form.assignTo.forEach((assignee: any) => {
        this.callTargetApi(assignee, this.form, this.products);
      });
    } else {
      this.routeWiseTargetLists.forEach((routeWiseTarget: RouteWiseTargetLists) => {
        this.callTargetApi(null, routeWiseTarget, routeWiseTarget.products);
      });
    }
  }

  updateTarget() {
    this.disableSaveBtn = true;
    this.$http
      .patch(this.$api(`/targets/${this.currentTraget.id}`), {
        type: this.form.type,
        expires_at: this.form.expiresDate,
        unit_name: this.form.unit,
        unit_value: this.form.amount,
        scheme: this.form.scheme,
        assigned_to: this.activeTab == 'regular' ? this.form.assignTo : '',
        start_from: this.form.start_from,
        active: this.form.status,
        territory_id: this.activeTab == 'route' ? this.form.territory_id : ''
      })
      .then(response => {
        this.products.forEach((product: any) => {
          if (product.newProduct) {
            this.$http.post(this.$api(`/target-products`), {
              product_id: product.product,
              amount: product.amount,
              target_id: this.currentTraget.id,
              target_on: product.targetOn
            });
          } else if (product.id) {
            this.$http.patch(this.$api(`/target-products/${product.id}`), {
              product_id: product.product,
              amount: product.amount,
              target_id: this.currentTraget.id,
              target_on: product.targetOn
            });
          }
        });
        this.$http.get(this.$api(`/targets/${response.data.target.id}`)).then(responseTarget => {
          this.$emit('updated', responseTarget.data.target);
        });
        this.notify('Success', 'Successfully Updated', 'success');
        this.formReset();
      })
      .catch(error => {
        (this.$refs.formValidator as Vue & {
          setErrors: (errors: []) => any;
        }).setErrors(error.response.data.errors);
      });
  }

  notify(title: string, message: string, type: 'success' | 'warning' | 'info' | 'error') {
    this.$notify({
      title: title,
      message: message,
      duration: 3000,
      iconClass: 'ni ni-bell-55',
      type: type
    });
  }

  save() {
    this.isUpdate ? this.updateTarget() : this.createTarget();
  }

  close() {
    this.$emit('update:isActive', false);
    this.$emit('assignIdFromTargetAssignReset', (this.passTargetAssignId = 0));
    this.$emit('update:form', {
      type: '',
      expiresDate: '',
      unit: '',
      amount: '',
      assignTo: '',
      scheme: '',
      start_from: '',
      status: true
    });
    this.formReset();
    this.products = [
      {
        product: '',
        amount: '',
        newProduct: '',
        targetOn: ''
      }
    ];
    this.routeWiseTargetLists = [];
    this.activeTab = 'regular';
    this.disableSaveBtn = false;
  }
}
</script>
<style scoped>
.invalid-feedback {
  display: none;
}
</style>
