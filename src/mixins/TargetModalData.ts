import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";
import { TargetActiveOn } from "@/enums/TargetActiveOn";

const flatPicker = require("vue-flatpickr-component");
import "flatpickr/dist/flatpickr.css";
import UserAutocomplete from "@/components/lazyDropdown/UserLazydropdown.vue";
import ProductLazydropdown from "@/components/lazyDropdown/ProductLazydropdown.vue";
import RouteWiseTargetLists from "@/intefaces/RouteWiseTargetLists";
import Target from "@/intefaces/Target";
import moment from "moment";

@Component({
    components: {
        flatPicker,
        UserAutocomplete,
        ProductLazydropdown
    }
})
export default class TargetModalData extends Mixins(TaxonomyMixin) {
    @Prop() form!: any;
    @Prop() activeTab!: string;
    @Prop({default: false}) isUpdate!: boolean;
    @Prop({default: false}) isActive!: boolean;
    @Prop() routeWiseTargetLists!: RouteWiseTargetLists[];
    @Prop() currentTraget!: Target;
    private updateFlag = true; /* push new product for update target */
    private isRemoveAssignee = false;

    get targetActiveOn() {
        return TargetActiveOn;
    }

    private sum: number = 0;
    private actionOn = [
        {label: this.getTaxonomy('invoice'), value: this.targetActiveOn.ON_INVOICE},
        {label: this.getTaxonomy('order'), value: this.targetActiveOn.ON_ORDER},
        {label: 'Delivery', value: this.targetActiveOn.ON_DELIVERY}
    ];
    private types = [{label: 'Delivery', value: 'delivery'}, {label: this.getTaxonomy('invoice'), value: 'invoice'},
        {label: 'Product', value: 'product'}, {label: 'Visit', value: 'visit'}];
    public products: any = [
        {
            product: '',
            amount: '',
            newProduct: '',
            targetOn: '',
            selectedUnitName: null,
            selectedUnitValue: null,
            productObject: {
                base_product: {
                    units: '[]'
                }
            }
        }
    ];
    private schemes = ['onetime']; //['onetime', 'daily', 'weekly', 'biweekly', 'monthly']
    private units = ['amount', 'qty', 'visit'];

    @Watch('isActive')
    resetProduct(newVal: boolean) {
        if (!newVal) {
            this.products = [{
                product: '',
                amount: '',
                newProduct: '',
                targetOn: ''
            }]
        }
    }

    @Watch('products', {deep: true})
    setProductAmount(old: any, current: any) {
        if (this.form.type == 'product') {
            this.sum = 0;
            old.forEach((amount: any) => {
                this.sum = Number(this.sum) + Number(amount.amount);
            })
            this.form.amount = this.sum;
        }
    }

    addNewProduct() {
        this.products.push({
            product: '',
            amount: '',
            newProduct: 1,
            targetOn: ''
        })
        this.$emit('products', this.products);
    }

    deleteProductFromArray(index: number) {
        this.products.splice(index, 1);
    }

    deleteProductFromSever(product: any) {
        this.$http
            .delete(this.$api(`/target-products/${product}`))
            .then(response => {
                this.products.splice(this.products.findIndex((Targetproduct: any) => Targetproduct.id == product), 1)
            })
            .catch(error => {
                (this.$refs.formValidator as Vue & {
                    setErrors: (errors: []) => any;
                }).setErrors(error.response.data.errors);
            });
    }

    @Watch('form.type')
    setUnitForVisit(newVal: any) {
        if (newVal == 'visit') {
            this.form.unit = 'visit';
        }
        if (newVal == 'product') {
            this.$emit('products', this.products);
        }
    }

    onRemoved(removed: any) {
        if (this.isUpdate == true) {
            this.isRemoveAssignee = true;
            if (this.isUpdate == true) {
                this.$http
                    .delete(this.$api(`/targets/${this.currentTraget.id}/assignees/${removed}`))
                this.isRemoveAssignee = false;
            }
        }
    }

    @Watch('isUpdate')
    addExistingProductOnUpdate(newVal: any) {
        if (newVal) {
            this.products = [];
            this.$http.get(this.$api(`/targets/${this.currentTraget.id}/target-products`)).then(response => {
                if (response.data.targetProducts != '') {
                    this.updateFlag = false;
                    response.data.targetProducts.forEach((product: any) => {
                        this.products.push({
                            product: product.product.id,
                            amount: product.amount,
                            targetOn: product.target_on,
                            id: product.id,
                            existingProduct: 1
                        })
                    })
                }
            })
        }
    }

    public formReset() {
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
        this.form.amount = '';
        this.form.assignTo = [];
        this.form.scheme = '';
        this.form.start_from = '';
        this.form.status = true;
        this.form.territory_id = '';
        this.$emit('routeWiseTargetLists', []);
        (
            this.$refs.formValidator as Vue & {
                reset: () => any;
            }
        ).reset();
    }

    get getConfig(): any {
        let self = this.form.start_from;
        return {
            allowInput: true,
            disable: [
                function (date: Date) {
                    return moment(self).diff(date) > 0
                }
            ]
        }
    }

    get getConfigStartDate(): any {
        let self = this.isUpdate ? this.form.start_from : moment().subtract(1, 'days');
        return {
            allowInput: true,
            disable: [
                function (date: Date) {
                    return moment(self).diff(date) > 0
                }
            ]
        }
    }
}
