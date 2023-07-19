import { Component, Prop, Vue } from 'vue-property-decorator';
import { AxiosResponse } from 'axios';

// @ts-ignore
@Component
abstract class RequisitionModalComponent extends Vue {
  @Prop() product!: any;
  @Prop() salesReturns!: any;
  @Prop() form!: any;
  @Prop() updateAmountCount!: boolean;
  @Prop() buyerDepartment!: any;
  public productPriceTooltip = '';
  public amount = 0;
  public totalSalesReturn: any = 0;
  public salesReturnPrice: any = [];
  public productPromotionalPrice: any = [];
  public netTotalAmount: number = 0;

  public async getPrice(selectedProduct: any, row: any) {
    row.price = 0;
    row.qty = 0;
    row.amount = 0;
    this.totalAmount();
    this.productPriceTooltip = '';

    var buyerDepartment: any = [];

    await this.$http.get(this.$api(`/departments/${this.form.departmentId}`)).then(resposneDepartment => {
      buyerDepartment = resposneDepartment.data.department;
    });

    this.$http.get(this.$api(`/products/${selectedProduct}`)).then(responseProductPrice => {
      responseProductPrice.data.product.prices.forEach((price: any) => {
        if (price.priceable_type == 'depttype' && buyerDepartment && price.priceable_id == buyerDepartment.department_type_id) {
          row.price = price.price;
        }
      });
    });
  }

  totalAmount() {
    this.amount = 0;
    if (this.updateAmountCount) {
      this.product.forEach((product: any, index: any) => {
        this.productPromotionalPrice[index] = this.amount + (product.qty * product.price - product.promotion_discount);
      });
      this.productPromotionalPrice.forEach((product: any) => {
        this.amount = this.amount + product;
      });
      this.getSalesReturnPrice();
      this.$emit('update:updateAmountCount', false);
    } else {
      this.productPromotionalPrice.forEach((product: any) => {
        this.amount = this.amount + product;
      });
    }
    if (this.form.badgeDiscount) {
      this.netTotalAmount = this.amount - (this.form.badgeDiscount * this.amount) / 100;
    }
  }

  getSalesReturnPrice() {
    this.totalSalesReturn = 0;
    if (this.updateAmountCount) {
      this.salesReturns.forEach((salesReturn: any, index: any) => {
        this.salesReturnPrice[index] = this.totalSalesReturn + salesReturn.qty * salesReturn.price;
      });
      this.salesReturnPrice.forEach((salesReturn: any) => {
        this.totalSalesReturn = this.totalSalesReturn + salesReturn;
      });
    } else {
      this.salesReturnPrice.forEach((salesReturn: any) => {
        this.totalSalesReturn = this.totalSalesReturn + salesReturn;
      });
    }
  }
}

@Component
//@ts-ignore
export default class RequisitionModalComponentMixin extends RequisitionModalComponent {}
