import PromotionFormable from "@/intefaces/PromotionFormable";

export class PromotionFormRequest {
    private formData = new FormData();
    private fieldMap: any = {
        image: 'banner',
        title: 'title',
        type: 'promotion_on',
        date: 'expires_at',
        offerType: 'offer_type',
        offerValue: 'offer_value',
        startDate: 'start_from',
        promotionValue: 'promotion_value',
        promotionableId: 'promotionable_id',
        promotionType: 'promotion_type',
        offerProduct: 'offer_product_id',
    }
    // additionalFields are typically extra fields
    // such as {_method: 'PATCH'} etc.
    constructor(private form: PromotionFormable, additionalFields: any = {}) {
        for (let prop in additionalFields) {
            this.formData.append(prop, additionalFields[prop]);
        }
    }

    public except(keys: Array<string>) {
        for (let prop in this.fieldMap) {
            let value = this.fieldMap[prop];
            if (!keys.includes(value)) {
                this.formData.append(value, this.form[prop as keyof PromotionFormable]);
            }
        }
        return this.formData;
    }

    public only(keys: Array<string>) {
        for (let prop in this.fieldMap) {
            let value = this.fieldMap[prop];
            if (keys.includes(value)) {
                this.formData.append(value, this.form[prop as keyof PromotionFormable]);
            }
        }
        return this.formData;
    }
}
