import Productable from "@/intefaces/Productable";
import VariantCategory from "@/intefaces/VariantCategory";
import BaseProduct from "@/intefaces/BaseProduct";

export default interface Product {
    id: number;
    name: string;
    sku: string;
    product_brand_id: number;
    product_category_id: number;
    is_active: boolean;
    is_free: any;
    full_name: string;
    usp: string | null;
    description: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    image_url: string;
    product_brand?: Productable;
    product_category?: Productable;
    variants?: VariantCategory | null;
    base_product?: BaseProduct;
    prices?: {
        "id": number,
        "product_id": number,
        "department_type_id": number,
        "price": number,
        "created_at": string,
        "updated_at": string,
        "name": string
    } | null
}
