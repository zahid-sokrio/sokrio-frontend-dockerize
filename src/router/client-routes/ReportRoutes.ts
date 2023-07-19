import { RouteConfig } from 'vue-router';
// @ts-ignore
import Sales from '@/views/Report/Sales/Sales.vue';
// @ts-ignore
import Product from '@/views/Report/Product/Product.vue';
// @ts-ignore
import Report from '@/views/Report/Report.vue';
// @ts-ignore
import VisitReports from '@/views/Report/Visit/VisitReports.vue';
import { Permission } from '@/enums/Permission';
// @ts-ignore
import KPIReports from '@/views/Report/KPI/KPIReports.vue';
// @ts-ignore
import ProductBasedReport from '@/views/Report/ProductBasedReport/ProductBasedReport.vue';
// @ts-ignore
import HRReport from '@/views/Report/HRReport/index.vue';
// @ts-ignore
import PerformanceReport from '@/views/Report/Performance/index.vue';
// @ts-ignore
import TAReport from '@/views/Report/HRReport/TAReport.vue';
// @ts-ignore
import TrackingReport from '@/views/Report/HRReport/TrackingReport.vue';
// @ts-ignore
import CheckInReport from '@/views/Report/HRReport/CheckInReport.vue';
// @ts-ignore
import DailyKPIReport from '@/views/Report/Performance/DailyKpiReport.vue';
// @ts-ignore
import UserWisePerformanceReport from '@/views/Report/Performance/UserWisePerformanceReport.vue';
// @ts-ignore
import DeptWisePerformanceReport from '@/views/Report/Performance/DeptWisePerformanceReport.vue';
// @ts-ignore
import NoOrderPerformanceReport from '@/views/Report/Performance/NoOrderPerformanceReport.vue';
// @ts-ignore
import DailyCallPerformanceReport from '@/views/Report/Performance/DailyCallPerformanceReport.vue';
// @ts-ignore
import PerformanceBoardReport from '@/views/Report/Performance/PerformanceBoardReport.vue';
// @ts-ignore
import ProductTargetAchievementReport from '@/views/Report/Performance/ProductTargetAchievementReport.vue';
// @ts-ignore
import StockReport from '@/views/Report/Stock/index.vue';
// @ts-ignore
import TheStockReport from '@/views/Report/Stock/StockReport.vue';
// @ts-ignore
import StockSummaryReport from '@/views/Report/Stock/StockSummaryReport.vue';
// @ts-ignore
import AttendanceReport from '@/views/Report/HRReport/AttendanceReport.vue';
// @ts-ignore
import SystemReport from '@/views/Report/System/index.vue';
// @ts-ignore
import ActiveUserReport from '@/views/Report/System/ActiveUserReport.vue';
// @ts-ignore
import NotOrderedOutletListReport from '@/views/Report/Performance/NotOrderedOutletListReport.vue';
// @ts-ignore
import ECO from "@/views/Report/ECO/index.vue";
// @ts-ignore
import OrderSummary from "@/views/Report/OrderSummary/index.vue";
// @ts-ignore
import DeliverySummary from "@/views/Report/DeliverySummary/index.vue";
// @ts-ignore
import CheckinSummary from "@/views/Report/CheckinSummary/index.vue";
// @ts-ignore
import CheckinSummaryDetails from "@/views/Report/CheckinSummary/CheckinSummaryDetails.vue";
// @ts-ignore
import KPIReportByOrder from '@/views/Report/KPI/KPIReportByOrder.vue';
// @ts-ignore
import TargetAchievementReport from "@/views/Report/Performance/TargetAchievementReport.vue";
// @ts-ignore
import Outlet from "@/views/Report/Outlet/index.vue";


// @ts-ignore
const ReportRoutes: RouteConfig = {
    path: 'report',
    name: 'report',
    redirect: '/report/sales',
    components: { dashboard: Report },
    children: [
        {
            path: 'sales',
            name: 'sales-report',
            meta: {
                label: 'Sales',
                icon: 'fas fa-hand-holding-usd',
                breadCrumb: 'sales'
            },
            components: { report: Sales }
        },
        {
            path: 'product',
            name: 'product-report',
            meta: {
                label: 'Product',
                icon: 'fas fa-th',
                breadCrumb: 'product'
            },
            components: { report: Product }
        },
        {
            path: 'visit-target',
            name: 'visit-target',
            meta: {
                label: 'Visit',
                icon: 'fas fa-car-side',
                breadCrumb: 'visit-target'
            },
            components: { report: VisitReports }
        },
        {
            path: 'kpi',
            name: 'kpi',
            meta: {
                label: 'KPI',
                icon: 'fa fa-flag-checkered',
                breadCrumb: 'kpi'
            },
            components: { report: KPIReports },
            children: [
                {
                    path: 'based-on-order',
                    name: 'kpi-report-based-on-order',
                    meta: {
                        label: 'KPI Report Based On Order',
                        icon: 'ni ni-bullet-list-67',
                        breadCrumb: 'product-based-report'
                    },
                    components: { KPIReports: KPIReportByOrder }
                }]
        },
        {
            path: 'product-based-report',
            name: 'product-based-report',
            meta: {
                label: 'Product Based',
                icon: 'fas fa-list',
                breadCrumb: 'product-based-report'
            },
            components: { report: ProductBasedReport }
        },
        {
            path: 'hr-report',
            name: 'hr-report',
            components: { report: HRReport },
            meta: {
                label: 'HR',
                icon: 'fas fa-bus',
                breadCrumb: 'hr-report'
            },
            children: [
                {
                    path: 'ta-report',
                    name: 'ta-report',
                    meta: {
                        label: 'TA Report',
                        icon: 'ni ni-bullet-list-67',
                        breadCrumb: 'product-based-report'
                    },
                    components: { hrReport: TAReport }
                },
                {
                    path: 'tracking-report',
                    name: 'tracking-report',
                    meta: {
                        label: 'Tracking Report',
                        icon: 'ni ni-bullet-list-67',
                        breadCrumb: 'product-based-report'
                    },
                    components: { hrReport: TrackingReport }
                },
                {
                    path: 'checkin-report',
                    name: 'checkin-report',
                    meta: {
                        label: 'Check-In Report',
                        icon: 'ni ni-bullet-list-69',
                        breadCrumb: 'product-based-report'
                    },
                    components: { hrReport: CheckInReport }
                },
                {
                    path: 'attendance-report',
                    name: 'attendance-report',
                    meta: {
                        label: 'Attendance Report',
                        icon: 'ni ni-bullet-list-69',
                        breadCrumb: 'attendance-report'
                    },
                    components: { hrReport: AttendanceReport }
                }
            ]
        },
        {
            path: 'performance-report',
            name: 'performance-report',
            components: { report: PerformanceReport },
            meta: {
                label: 'Performance',
                icon: 'ni ni-paper-diploma',
                breadCrumb: 'performance-report'
            },
            children: [
                {
                    path: 'daily-kpi-report',
                    name: 'daily-kpi-report',
                    meta: {
                        label: 'Daily KPI Report',
                        icon: 'ni ni-bullet-list-67',
                        breadCrumb: 'daily-kpi-report'
                    },
                    components: { performanceReport: DailyKPIReport }
                },
                {
                    path: 'user-wise-product-performance-report',
                    name: 'user-wise-product-performance-report',
                    meta: {
                        label: 'User-Wise Product Performance Report',
                        icon: 'ni ni-bullet-list-67',
                        breadCrumb: 'user-wise-product-performance-report'
                    },
                    components: { performanceReport: UserWisePerformanceReport }
                },
                {
                    path: 'dept-wise-product-performance-report',
                    name: 'dept-wise-product-performance-report',
                    meta: {
                        label: 'Department-Wise Product Performance Report',
                        icon: 'ni ni-bullet-list-67',
                        breadCrumb: 'dept-wise-product-performance-report'
                    },
                    components: { performanceReport: DeptWisePerformanceReport }
                },
                {
                    path: 'no-order-report',
                    name: 'no-order-report',
                    meta: {
                        label: 'No Order Report',
                        icon: 'ni ni-button-power',
                        breadCrumb: 'no-order-report'
                    },
                    components: { performanceReport: NoOrderPerformanceReport }
                },
                {
                    path: 'daily-call-report',
                    name: 'daily-call-report',
                    meta: {
                        label: 'Daily call report',
                        icon: 'ni ni-button-power',
                        breadCrumb: 'daily-call-report'
                    },
                    components: { performanceReport: DailyCallPerformanceReport }
                },
                {
                    path: 'performance-board-report',
                    name: 'performance-board-report',
                    meta: {
                        label: 'Performance Board report',
                        icon: 'ni ni-button-power',
                        breadCrumb: 'performance-board-report'
                    },
                    components: { performanceReport: PerformanceBoardReport }
                },
                {
                    path: 'product-target-achievement-report',
                    name: 'product-target-achievement-report',
                    meta: {
                        label: 'Product Target Achievement Report',
                        icon: 'ni ni-button-power',
                        breadCrumb: 'product-target-achievement-report'
                    },
                    components: { performanceReport: ProductTargetAchievementReport }
                },
                {
                    path: 'not-ordered-outlet-list-report',
                    name: 'not-ordered-outlet-list-report',
                    meta: {
                        label: 'Not Ordered Outlet List Report',
                        icon: 'ni ni-button-power',
                        breadCrumb: 'not-ordered-outlet-list-report'
                    },
                    components: { performanceReport: NotOrderedOutletListReport }
                }
            ]
        },
        {
            path: 'stock-report',
            name: 'stock-report',
            components: { report: StockReport },
            meta: {
                label: 'Stock',
                icon: 'ni ni-basket',
                breadCrumb: 'stock-report'
            },
            children: [
                {
                    path: 'the-stock-report',
                    name: 'the-stock-report',
                    meta: {
                        label: 'Stock report',
                        icon: 'ni ni-button-power',
                        breadCrumb: 'the-stock-report'
                    },
                    components: { StockReport: TheStockReport }
                },
                {
                    path: 'stock-summary-report',
                    name: 'stock-summary-report',
                    meta: {
                        label: 'Stock Summary Report',
                        icon: 'ni ni-button-power',
                        breadCrumb: 'stock-summary-report'
                    },
                    components: { StockReport: StockSummaryReport }
                }
            ]
        },
        {
            path: 'system-report',
            name: 'system-report',
            components: { report: SystemReport },
            meta: {
                label: 'System',
                icon: 'ni ni-chart-pie-35',
                breadCrumb: 'system-report'
            },
            children: [
                {
                    path: 'active-user-report',
                    name: 'active-user-report',
                    meta: {
                        label: 'Active User report',
                        icon: 'ni ni-button-power',
                        breadCrumb: 'active-user-report'
                    },
                    components: { SystemReport: ActiveUserReport }
                }
            ]
        },
        {
            path: 'eco',
            name: 'eco-report',
            meta: {
                label: 'Eco',
                icon: 'ni ni-atom',
                breadCrumb: 'eco'
            },
            components: { report: ECO }
        },
         {
            path: 'order-summary',
            name: 'order-summary',
            meta: {
                label: 'Order Summary',
                icon: 'ni ni-cart',
                breadCrumb: 'order-summary'
            },
            components: { report: OrderSummary }
        },
        {
            path: 'delivery-summary',
            name: 'delivery-summary',
            meta: {
                label: 'Delivery Summary',
                icon: 'ni ni-delivery-fast',
                breadCrumb: 'delivery-summary'
            },
            components: { report: DeliverySummary }
        },
        {
            path: 'checkin-summary',
            name: 'checkin-summary',
            meta: {
                label: 'Checkin Summary',
                icon: 'ni ni-square-pin',
                breadCrumb: 'checkin-summary'
            },
            components: { report: CheckinSummary },
            children: [
                {
                    path: 'details',
                    name: 'checkin-summary-details',
                    components: { CheckinSummary: CheckinSummaryDetails },
                    meta: {
                        label: 'Checkin Summary Details',
                        icon: 'ni ni-square-pin',
                        breadCrumb: 'checkin-summary-details'
                    },
                }
            ]
        },
        {
            path: 'target-achievement',
            name: 'target-achievement-report',
            meta: {
                label: 'Target Achievement',
                icon: 'ni ni-button-power',
                breadCrumb: 'target-achievement'
            },
            components: { report: TargetAchievementReport }
        },
        {
            path: 'outlet-report',
            name: 'outlet-report',
            meta: {
                label: 'Outlet Report',
                icon: 'ni ni-box-2',
                breadCrumb: 'outlet-report'
            },
            components: { report: Outlet }
        },
    ]
};
export default ReportRoutes;
