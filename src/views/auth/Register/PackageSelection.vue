<template>
  <div v-loading="schemes.length == 0" style="min-height: 400px">
    <el-tabs v-model="currentTab" :stretch="true" @tab-click="(selectedSchemeId = 0), (requireUserQuota = false), (userQuota = null)">
      <template v-for="(scheme, i) in schemaByCycle">
        <el-tab-pane v-bind:key="scheme.title">
          <span slot="label">
            <base-button :type="currentTab == i ? 'success' : 'info'" class="btn-block">{{ scheme.title }}</base-button>
          </span>
          <div class="container mt-2">
            <div class="row justify-content-center">
              <div class="col-md-3" v-for="pk in scheme.packages" v-bind:key="pk.id" @click="onSelectPackage(pk)">
                <stats-card :class="['package-card', pk.schema_id == selectedSchemeId ? 'selected-package' : '']">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0 text-right">
                        <div
                          :class="[
                            'icon icon-sm icon-shape bg-green text-white rounded-circle shadow',
                            pk.schema_id == selectedSchemeId ? 'visible' : 'invisible'
                          ]"
                        >
                          <i class="ni ni-check-bold"></i>
                        </div>
                      </h5>
                      <h1 class="text-primary display-2  text-center">${{ pk.price }}</h1>
                      <!--                <span class="h2 font-weight-bold mb-0">350,897</span>-->
                      <h1 class="display-5 text-center">
                        {{ pk.name }}
                      </h1>
                      <br />
                    </div>
                  </div>
                </stats-card>
              </div>
            </div>
          </div>
          <!--              {{scheme.title}}-->
        </el-tab-pane>
      </template>
    </el-tabs>
    <slot name="footer" v-if="schemes.length > 0" v-bind:requireUserQuota="requireUserQuota" v-bind:selectedSchemeId="selectedSchemeId">
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <div class="container" >
          <div class="row justify-content-end">
            <div class="col-3" v-if="requireUserQuota">
              <base-input name="user quota" placeholder="User Quota" :rules="{ required: true, numeric: true }" v-model="userQuota"></base-input>
            </div>
            <div class="col-3">
              <base-input name="coupon code" placeholder="Coupon. e.g. CV2019" v-model="coupon"></base-input>
            </div>
            <div class="col-auto">
              <base-button :disabled="!selectedSchemeId" @click="handleSubmit(onNext)" type="primary">Next</base-button>
            </div>
          </div>
        </div>
      </validation-observer>
    </slot>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Radio, TabPane, Tabs, ButtonGroup, Button } from 'element-ui';

const auth = namespace('Auth');
@Component({
  components: {
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [ButtonGroup.name]: ButtonGroup,
    [Button.name]: Button
  }
})
export default class PackageSelection extends Vue {
  private schemes: any[] = [];
  private currentTab: string = '';
  private selectedSchemeId: number = 0;
  private requireUserQuota: boolean = false;
  private showUserQuotaDialog: boolean = false;
  private userQuota = null;
  private coupon: string|null = null;
  @Prop()
  selectedPackage!: any;

  async mounted() {
    let self = this;
    let { data } = await this.$http.get(this.$landLordApi('/schemes'),{withCredentials:false});
    data.schemes.forEach(function(value: any, index: number, array: any) {
      switch (value['cycle']) {
        case 1:
          self.extractPackage('Monthly', value);
          break;
        case 3:
          self.extractPackage('Quarterly', value);
          break;
        case 6:
          self.extractPackage('Half Yearly', value);
          break;
        case 12:
          self.extractPackage('Yearly', value);
          break;
        default:
          self.extractPackage(`${value['cycle']} Months`, value);
          break;
      }
    });
  }

  get schemaByCycle(): any {
    return this.schemes.sort((a, b) => a.cycle - b.cycle);
  }

  extractPackage(title: string, schema: any) {
    let index = this.schemes.findIndex(value => value.title == title);
    if (index >= 0) {
      schema.package['price'] = schema.price;
      schema.package['schema_id'] = schema.id;
      schema.package['cycle'] = schema.cycle;
      this.schemes[index].packages.push(schema.package);
    } else {
      schema.package['price'] = schema.price;
      schema.package['schema_id'] = schema.id;
      schema.package['cycle'] = schema.cycle;
      this.schemes.push({ title: title, cycle: schema.cycle, packages: [schema.package] });
    }
  }

  onNext() {
    this.showUserQuotaDialog = false;
    this.selectedPackage.user_quota = this.userQuota;
    this.selectedPackage.scheme_id = this.selectedSchemeId;
    this.selectedPackage.coupon_code = this.coupon;

    this.$emit('next');
  }
  onSelectPackage(pk: any) {
    this.selectedSchemeId = pk.schema_id;
    this.requireUserQuota = pk.cycle !== 1;
  }

}
</script>
<style>
.package-card {
  border: 1px solid white !important;
}
.selected-package {
  border-color: #2dce89 !important;
}
.package-card:hover {
  cursor: pointer;
  border-color: #5e72e4 !important;
}
</style>
