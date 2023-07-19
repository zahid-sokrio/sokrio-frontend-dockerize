import Department from "@/intefaces/Department";

export default interface DepartmentProduct{
    id: number;
    buyer_id: number;
    seller_id: number;
    product_id: number;
    qty: number;
    price: number;
    created_at: string;
    updated_at: string;
    buyer: Department | null;
    seller: Department | null;
    product: Array<string> | null;
}
