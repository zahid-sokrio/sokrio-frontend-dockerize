export default interface InvoiceRevision {
    id: number,
    invoice_id: number,
    amount: number,
    discount: number | null,
    promotion_discount: number | null,
    buyer_id: number,
    seller_id: number,
    comment: string | null,
    expected_delivery_date: string,
    created_by: number,
    invoiced_products: Array<string> | null,
    returned_products: Array<string> | null,
    ordered_by: number,
    badge_percentage: number,
    created_at: string,
    updated_at: string
}
