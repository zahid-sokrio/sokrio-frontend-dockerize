import Order from "@/intefaces/Order";
import OrderProduct from "@/intefaces/OrderProduct";

export default interface OrderRevision {
    id: number,
    order_id: number,
    is_requisition: number,
    amount: number,
    discount: number | null,
    promotion_discount: number | null,
    lat: string | null,
    long: string | null,
    buyer_id: number,
    seller_id: number,
    comment: string | null,
    expected_delivery_date: string,
    created_by: number,
    ordered_products: OrderProduct[] | null,
    returned_products: Array<string> | null,
    created_at: string,
    updated_at: string
}
