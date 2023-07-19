import { OrderStatus } from "@/enums/OrderStatus";

export default interface Statuses {
    id: number;
    order_id: number | null;
    remarks: string;
    status: OrderStatus.STATUS_PENDING | OrderStatus.STATUS_ACCEPTED | OrderStatus.STATUS_REJECTED;
    created_by?: number | null;
    created_at: string;
    updated_at: string;
    creator?: Array<string> | null;
}
