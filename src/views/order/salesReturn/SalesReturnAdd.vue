<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" size="lg" @close="close">
      <template slot="header">
        <h5 id="exampleModalLabel" class="modal-title">Sales Return</h5>
      </template>
      <div class="row">
        <div class="col-md-12">
          <div class="col-md-12">
            <h4 class="heading-margin text-align">{{ getTaxonomy('salesReturn') }}</h4><br>
          </div>
          <!--            </div>-->
          <div class="pl-2 pr-2 text-center">
            <ul class="list-group list-group-flush list my--1">
              <li class="list-group-item px-0">
                <div class="row align-items-center">
                  <div class="col-md-2">
                    <small>Product Name</small>
                  </div>
                  <div class="col-md-2">
                    <small>Qty </small>
                  </div>
                  <div class="col-md-2">
                    <small>Price</small>
                  </div>
                  <div class="col-md-2">
                    <small>Amount</small>
                  </div>
                  <div class="col-md-2">
                    <small>Reason </small>
                  </div>
                  <div class="col-md-2">
                  </div>
                </div>
              </li>
              <li v-for="(salesReturn,index) in salesReturns" :key="index" class="list-group-item px-0">
                <div class="row">
                  <div v-if="index == salesReturns.length - 1" class="col-md-2">
                    <product-lazydropdown v-if="form.type == 'product'" v-model="salesReturn.product_id"
                                          :end-point="`/products`" item-sub-text="batch.name"
                                          item-text="base_product.name" item-value="id" placeholder="Select Product"
                                          @change="getPrice($event, salesReturn)"></product-lazydropdown>
                  </div>
                  <div v-else class="col-md-2">
                    <b v-if="fullProductList">{{
                        fullProductList.find(product => product.id ==
                          salesReturn.product_id).base_product.name
                      }}</b>
                    <el-tag class="ml-2" type="danger"><span v-text="'Returned'"></span></el-tag>
                  </div>
                  <div class="col-md-2">
                    <base-input v-model="salesReturn.qty" name="qty" :rules="{ required: true }" type="number" min="0"
                                @change="getSalesReturnPrice(salesReturn, index)"></base-input>
                  </div>
                  <div class="col-md-2">
                    <base-input v-model="salesReturn.return_rate" name="price" :rules="{ required: true }" type="number"
                                min="0"
                                @change="getSalesReturnPrice(salesReturn, index)"></base-input>
                  </div>
                  <div class="col-md-2">
                    {{ amount[index] }}
                  </div>
                  <div class="col-md-2">
                    <base-input alternative name="reason" :rules="{ required: true }">
                      <el-select
                        v-model="salesReturn.reason"
                        filterable
                        placeholder="Select Reason"
                        style="border: none">
                        <el-option
                          v-for="(reason,index) in reasons"
                          :key="index"
                          :label="reason.toUpperCase()"
                          :value="reason"
                        ></el-option>
                      </el-select>
                    </base-input>
                  </div>
                  <div class="col-md-2">
                    <el-tooltip v-if="salesReturns.length - 1 == index" content="Add Requisition" placement="top">
                      <i class="fas fa-plus-circle mr-1" style="font-size:30px; color: #1aae6f"
                         @click="addNewSalesReturn"></i>
                    </el-tooltip>
                    <el-tooltip v-if="salesReturns.length != 1" content="Delete Sales Return" placement="top">
                      <i class="fas fa-times-circle" style="font-size:30px; color: red"
                         @click="deleteSalesReturn(salesReturn, index)"></i>
                    </el-tooltip>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <template slot="footer">
             <span v-if="entityAmount < totalSalesReturn" style="color: red; font-size: 13px"><i
               class="fas fa-info-circle"></i>
                   <small>Sales Return should be less than total amount.</small>
                </span>
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button :disabled="((entityAmount >= totalSalesReturn) && salesReturns[0].qty > 0)? false : true"
                     type="success"
                     @click="handleSubmit(save)">Save
        </base-button>
      </template>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import ProductLazydropdown from "@/components/lazyDropdown/ProductLazydropdown.vue";
import {Tag} from "element-ui";
import TaxonomyMixin from "@/mixins/TaxonomyComponent";

@Component({
  components: {
    ProductLazydropdown,
    [Tag.name]: Tag
  }
})

export default class SalesReturnAdd extends Mixins(TaxonomyMixin) {
  @Prop() isActive!: boolean;
  @Prop() salesReturns!: any;
  @Prop() fullProductList!: any;
  @Prop() updateAmountCount!: boolean;
  @Prop() form!: any;
  @Prop() entityAmount!: number;
  @Prop() calculateSalesReturn!: any;
  public salesReturnPrice: any = [];
  private buyerDepartment: any = [];
  private reasons: any = ['damaged', 'outdated', 'others'];
  private totalSalesReturn = 0;
  private saleReturnValidationTooltip = '';
  private amount: any = []

  addNewSalesReturn() {
    this.salesReturns.push({
      product_id: '',
      qty: '',
      amount: 0,
      paid: 0,
      reason: '',
      price: 0
    })
  }

  public async getPrice(selectedProduct: any, row: any) {
    row.price = 0;
    row.qty = 0;
    row.amount = 0;
    await this.$http.get(this.$api(`/departments/${this.form.departmentId}`)).then(resposneDepartment => {
      this.buyerDepartment = resposneDepartment.data.department;
    })

    this.$http.get(this.$api(`/products/${selectedProduct}`)).then(responseProductPrice => {
      responseProductPrice.data.product.prices.forEach((price: any) => {
        if (price.priceable_type == "depttype" && this.buyerDepartment && price.priceable_id == this.buyerDepartment.department_type_id) {
          row.return_rate = price.price;
        }
      })
    })
  }

  getSalesReturnPrice(salesReturn: any, index: number) {
    this.amount[index] = salesReturn.qty * salesReturn.return_rate;
    this.salesReturnPrice[index] = salesReturn.qty * salesReturn.return_rate;
    this.totalSalesReturn = 0;
    this.salesReturns[index].amount = this.amount[index];
    if (this.updateAmountCount) {
      this.salesReturns.forEach((salesReturn: any, index: any) => {
        this.salesReturnPrice[index] = this.totalSalesReturn + salesReturn.qty * salesReturn.return_rate;
      })
      this.salesReturnPrice.forEach((salesReturn: any) => {
        this.totalSalesReturn = this.totalSalesReturn + salesReturn;
      })
    } else {
      this.salesReturnPrice.forEach((salesReturn: any) => {
        this.totalSalesReturn = this.totalSalesReturn + salesReturn;
      })
    }
  }

  save() {
    this.$emit('update:isActive', false);
    this.$emit('update:salesReturns', this.salesReturns);
    this.$emit('update:calculateSalesReturn', this.totalSalesReturn);
  }

  deleteSalesReturn(salesReturn: any, index: number) {
    this.salesReturns.splice(index, 1);
    this.salesReturnPrice.splice(index, 1);
    this.getSalesReturnPrice(salesReturn, index);
  }

  close() {
    this.amount = [];
    this.$emit('update:isActive', false);
    this.$emit('updateSalesReturn', null);
  }
}
</script>
