import Department from '@/intefaces/Department';
import OrderRevision from "@/intefaces/OrderRevision";
import UserForm from "@/intefaces/UserForm";

export interface Invoice {
    id: number;
    order?: any;
    invoiceable_type?: 'order' | 'requisition';
    invoiceable_id: number;
    buyer_id: number;
    created_by_user?: any;
    seller_id: number;
    amount: number;
    discount: number | null;
    promotional_discount: number | null;
    code: number;
    delivered: number | null;
    latest_status: string;
    status: string;
    remainder: number | null;
    payable: number | null;
    buyer?: Department;
    seller?: Department;
    product?: Array<{
        id: number;
        qty: number;
        price: number;
        product: null;
    }>;
    payments?: [];
    order_id: number;
    latest_revision?: OrderRevision;
    sales_return?: any;
    buyer_meta?: Department;
    seller_meta?: Department;
    creator_meta?: UserForm;
    buyer_name?: string;
    seller_name?: string;
    creator_name?: string;
}

export class InvoiceDTO implements Invoice {
    amount: number;
    buyer_id: number;
    code: number;
    created_by_user?: any;
    delivered: number | null;
    discount: number | null;
    id: number;
    invoiceable_id: number;
    invoice_date?: string;
    payable: number | null;
    promotional_discount: number | null;
    remainder: number | null;
    seller_id: number;
    status: string;
    latest_status: string;
    buyer: Department;
    lastPaymentTimeStamp?: String;
    buyer_meta?: Department;
    seller_meta?: Department;
    creator_meta?: UserForm;
    buyer_name?: string;
    seller_name?: string;
    creator_name?: string;

    constructor(amount: number, buyer_id: number, buyer: Department, code: number, delivered: number | null,
                discount: number | null, id: number, invoiceable_id: number, payable: number | null,
                promotional_discount: number | null, remainder: number | null, seller_id: number, invoice_date: string,
                status: string, latest_status: string, lastPaymentTimeStamp: String, created_by_user: any, order_id: number,
                latest_revision: OrderRevision, sales_return: any, buyer_meta?: Department, seller_meta?: Department,
                creator_meta?: UserForm, buyer_name?: string, seller_name?: string, creator_name?: string) {
        this.amount = amount;
        this.buyer_id = buyer_id;
        this.buyer = buyer;
        this.code = code;
        this.delivered = delivered;
        this.discount = discount;
        this.id = id;
        this.invoiceable_id = invoiceable_id;
        this.payable = payable;
        this.promotional_discount = promotional_discount;
        this.remainder = remainder;
        this.seller_id = seller_id;
        this.invoice_date = invoice_date;
        this.status = status;
        this.latest_status = latest_status;
        this.lastPaymentTimeStamp = lastPaymentTimeStamp;
        this.created_by_user = created_by_user;
        this.order_id = order_id;
        this.latest_revision = latest_revision;
        this.sales_return = sales_return;
        this.buyer_meta = buyer_meta;
        this.seller_meta = seller_meta;
        this.creator_meta = creator_meta;
        this.buyer_name = buyer_name;
        this.seller_name = seller_name;
        this.creator_name = creator_name;
    }

    order_id: number;
    latest_revision?: OrderRevision;
    sales_return?: any;
}

