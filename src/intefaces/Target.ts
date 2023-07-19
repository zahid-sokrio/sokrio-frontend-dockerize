export default interface Target{
    id: number,
    created_by: number,
    assigned_to: number,
    type: 'order' | 'invoice' | 'visit',
    scheme: 'onetime' | 'daily' | 'weekly' | 'biweekly' | 'monthly',
    unit_name: string,
    unit_value: number,
    expires_at: string,
    achieved: number,
    start_from: string,
    status: boolean,
    created_at: string,
    updated_at: string,
    creator: Array<{
        id: number,
        name: string
    }>,
    assignee: Array<{
        id: number,
        name: string
    }>,
    target_products: Array<string> | null
}
