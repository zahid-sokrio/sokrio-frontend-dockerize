import OrderRevision from "@/intefaces/OrderRevision";
import Department from "@/intefaces/Department";

export default interface Order {
    id: number | null;
    amount: number | null;
    discount: number | null;
    promotion_discount: number | null;
    lat: number | null;
    long: number | null;
    buyer_id: number | null;
    seller_id: number | null;
    buyer: any;
    requested_to: number | null;
    comment: number | null;
    expected_delivery_date: string;
    created_by: number | null;
    creator?: { "id": number, "name": string } | null;
    latest_revision: OrderRevision;
    badge_percentage: number;
    statuses?: any;
    status: string;
    products: any;
    sales_return?: any;
    seller: Department;
    is_requisition: boolean;
    buyer_name: string;
    buyer_territory_name: string;
    creator_name: string;
}
