import Product from "@/intefaces/Product";

export default interface OrderProduct {
    id: number,
    order_id: number,
    product_id: number,
    qty: number,
    free_with: number | null,
    promotion_discount: number | null,
    promotion: any | null,
    price: number,
    created_at: string,
    updated_at: string,
    product: Product,
    custom_discount: number,
    is_free: boolean,
}
