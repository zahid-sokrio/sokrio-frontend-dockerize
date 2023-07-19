import Order from "@/intefaces/Order";
import Product from "@/intefaces/Product";

export default interface Delivery {
    id: number;
    amount: number;
    discount: number | null;
    promotion_discount: number | null;
    lat: number | null;
    long: number | null;
    buyer_id : number;
    seller_id : number;
    comment: string | null;
    created_by: number;
    created_at : string;
    updated_at: string;
    order: Order;
    product: Product;
}
