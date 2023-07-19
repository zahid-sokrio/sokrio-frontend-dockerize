export default interface DailyReport {
    invoiceCreated: number
    invoiceDelivered: number
    invoiceAmount: number
    invoiceOrderRatio: number
    linePerCall: number
    revenueTarget: number
    visitTarget: number
    achievedRevenueTarget: number
    achievedVisitTarget: number
    deliveryLeadTime: number
    outletsCreated: number
    outletsVisited: number
    ordersCancelled: number
    avgInvoice: number
    orderCancelledAmount: number
}
