<template>
  <validation-observer ref="formValidator" v-slot="{ handleSubmit }">
    <form class="needs-validation" @submit.prevent="handleSubmit(save)">
      <div class="row">
        <div class="col-md-6">
          <territory-lazydropdown
            :label="routeColumnTitle"
            class="ml-1"
            :placeholder="routeColumnTitle"
            v-model="form.territory_id"
            :end-point="'territories?has_outlet=1'"
            :add-button="false"
            name="territory"
            :rules="{ required_if: activeTab == 'route' }"
          ></territory-lazydropdown>
        </div>
        <div class="col-md-6">
          <base-input :rules="{ required: true }" label="Target Type" name="target type">
            <el-select v-model="form.type" filterable placeholder="Select Type" style="border: none">
              <el-option v-for="(type, index) in types" :key="index" :label="type.label" :value="type.value"></el-option>
            </el-select>
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input :rules="{ required: true }" label="Scheme" name="scheme">
            <el-select v-model="form.scheme" filterable placeholder="Select Timespan" style="border: none">
              <el-option v-for="(scheme, index) in schemes" :key="index" :label="scheme.toUpperCase()" :value="scheme"></el-option>
            </el-select>
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input
            :disabled="form.type == 'product' ? true : false"
            v-model="form.amount"
            type="number"
            :rules="{ required: true }"
            min="0"
            label="Amount"
            name="amount"
            placeholder="e.g. 1000"
            prepend-icon="ni ni-money-coins"
          >
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input :rules="{ required: true }" label="Unit" name="unit">
            <el-select v-model="form.unit" :disabled="form.type == 'visit' ? true : false" filterable placeholder="Select Type" style="border: none">
              <el-option
                v-for="(unit, index) in units"
                :key="index"
                :disabled="form.type != 'visit' && unit == 'visit' ? true : false"
                :label="unit.toUpperCase()"
                :value="unit"
              ></el-option>
            </el-select>
          </base-input>
          <h4 v-if="form.type == 'product'">Has Specific Products</h4>
        </div>
        <!-- <div class="col-md-6">
          <base-input label="Start From" name="start from" prepend-icon="fas fa-calendar" :rules="{ required: true }">
            <flat-picker
              slot-scope="{ focus, blur }"
              v-model="form.start_from"
              :config="getConfigStartDate"
              class="form-control datepicker"
              @on-open="focus"
              @on-close="blur"
            >
            </flat-picker>
          </base-input>
          <base-button v-if="form.type == 'product'" size="sm" style="float: right" type="success" @click="addNewProduct">
            <span class="btn-inner--icon">
              <i class="fas fa-plus"></i>
            </span>
          </base-button>
        </div> -->

        <div class="col-md-6">
          <input type="hidden" class="form-control datepicker" value="2020-02-02" v-on="(form.start_from = '2020-02-02')" />
        </div>
        <div class="col-md-3">
          <base-input label="Active">
            <base-switch v-model="form.status" class="mr-1 p-1" off-text="No" on-text="Yes"></base-switch>
          </base-input>
        </div>
        <div class="col-md-3" v-if="!isUpdate">
          <base-button type="success" style="float: right;" @click="handleSubmit(addedRouteWiseTargetList)">
            <i class="fa fa-plus"></i>
          </base-button>
        </div>
      </div>
      <div v-if="form.type == 'product'">
        <div v-for="(product, index) in products" :key="index">
          <div class="row">
            <div class="col-md-4">
              <product-lazydropdown
                v-model="product.product"
                :add-button="false"
                :end-point="'/products'"
                item-sub-text="batch.name"
                item-text="base_product.name"
                item-value="id"
                label="Product"
                placeholder="Select Product"
              ></product-lazydropdown>
            </div>
            <div class="col-md-4">
              <base-input
                v-model="product.amount"
                type="number"
                :rules="{ required_if: activeTab == 'route' }"
                min="0"
                label="Amount"
                name="amount"
                placeholder="e.g. 100"
                prepend-icon="ni ni-money-coins"
              ></base-input>
            </div>
            <div class="col-md-3">
              <base-input label="Action On" name="action_on" :rules="{ required_if: activeTab == 'route' }">
                <el-select v-model="product.targetOn" clearable filterable placeholder="Action on">
                  <el-option v-for="(action, index) in actionOn" :key="index" :label="action.label" :value="action.value"></el-option>
                </el-select>
              </base-input>
            </div>
            <div class="col-md-1" v-if="products.length > 1">
              <base-button
                size="sm"
                style="float: left; margin-top: 25px"
                type="danger"
                @click="product.existingProduct == 1 ? deleteProductFromSever(product.id) : deleteProductFromArray(index)"
              >
                <span class="btn-inner--icon">
                  <i class="fas fa-times"></i>
                </span>
              </base-button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <!-- <div class="col-md-6">
        <base-input label="Expires At" name="expires at" prepend-icon="fas fa-calendar" :rules="{required: true}">
          <flat-picker slot-scope="{focus, blur}"
                       v-model="form.expiresDate"
                       :disabled="!form.start_from"
                       :config="getConfig"
                       class="form-control datepicker"
                       @on-open="focus"
                       @on-close="blur">
          </flat-picker>
        </base-input>
      </div> -->
        <div class="col-md-6">
          <input type="hidden" class="form-control datepicker" value="2020-02-03" v-on="(form.expiresDate = '2020-02-03')" />
        </div>
      </div>
      <route-wise-target-list-component
        v-if="!isUpdate"
        :route-wise-target-lists.sync="routeWiseTargetLists"
        @editTarget="editTarget($event)"
        @deleteTarget="deleteTarget($event)"
        :route-column-title="routeColumnTitle"
      ></route-wise-target-list-component>
    </form>
  </validation-observer>
</template>
<script lang="ts">
import TerritoryLazydropdown from '@/components/lazyDropdown/TerritoryLazydropdown.vue';
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator';
import TargetModalData from '@/mixins/TargetModalData';
import RegularTargetComponent from '@/views/user/target/RegularTargetComponent.vue';
import RouteWiseTargetListComponent from '@/views/user/target/RouteWiseTargetListComponent.vue';
import RouteWiseTargetLists from '@/intefaces/RouteWiseTargetLists';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import moment from 'moment';

@Component({
  components: {
    TerritoryLazydropdown,
    RegularTargetComponent,
    RouteWiseTargetListComponent
  }
})
export default class RouteWiseTargetComponent extends Mixins(TargetModalData) {
  @Prop() routeWiseTargetLists!: RouteWiseTargetLists[];
  @Prop() routeColumnTitle!: string;
  private updatedTarget: boolean = false;
  private targetIndex: any = '';

  async addedRouteWiseTargetList() {
    let territoryName: string = '';
    await this.$http.get(this.$api(`/territories/${this.form.territory_id}`)).then(response => {
      territoryName = response.data.territory.name;
    });
    if (this.updatedTarget) {
      this.routeWiseTargetLists.splice(this.targetIndex, 1);
      this.updatedTarget = false;
    }
    this.routeWiseTargetLists.push({
      territory_id: this.form.territory_id,
      type: this.form.type,
      scheme: this.form.scheme,
      amount: this.form.amount,
      start_from: this.form.start_from,
      unit: this.form.unit,
      expiresDate: this.form.expiresDate,
      status: this.form.status,
      products: this.products ? this.products : [],
      assignees: this.form.assignTo,
      territoryName: territoryName
    });
    this.formReset();
  }

  editTarget(event: any) {
    this.form.territory_id = event.row.territory_id;
    this.form.type = event.row.type;
    this.form.expiresDate = event.row.expiresDate;
    this.form.unit = event.row.unit;
    this.form.amount = event.row.amount;
    this.form.scheme = event.row.scheme;
    this.form.start_from = event.row.start_from;
    this.form.status = event.row.status;
    this.form.assignTo = event.row.assignees;
    if (event.row.products.length > 0) {
      this.products = event.row.products;
    }
    this.targetIndex = event.index;
    this.updatedTarget = true;
  }

  deleteTarget(index: number) {
    this.routeWiseTargetLists.splice(index, 1);
  }
}
</script>
