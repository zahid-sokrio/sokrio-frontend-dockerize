import { RouteConfig } from 'vue-router';
// @ts-ignore
import Report from '@/views/customReport/Report.vue';
// @ts-ignore
import CustomReport from "@/views/customReport/index.vue";
// @ts-ignore
import Order from "@/views/customReport/Order/Order.vue";
// @ts-ignore
import Delivery from "@/views/customReport/Delivery/Delivery.vue";
// @ts-ignore
import DownloadReprot from "@/views/customReport/downloadReport.vue";


// @ts-ignore
const CustomReportRoutes: RouteConfig = {
    path: 'custom-report',
    name: 'custom-report',
    redirect: '/custom-report',
    components: { dashboard: Report },
    children: [
        {
            path: '',
            name: 'Custom-Report',
            meta: {
                label: 'Custom Report',
                icon: 'ni ni-active-40',
                breadCrumb: 'custom-report'
            },
            components: { report: CustomReport },
        },
        {
            path: 'order',
            name: 'custom-report-order',
            meta: {
                label: 'Custom Order Report',
                icon: 'ni ni-cart',
                breadCrumb: 'order'
            },
            components: { report: Order },
            children: [
                {
                    path: 'download-report/:reportId',
                    name: 'download-report-order',
                    meta: {
                        label: 'Custom Report Order Download',
                        icon: 'ni ni-button-power',
                        breadCrumb: 'download-report'
                    },
                    components: { report: DownloadReprot }
                }
            ]
        },
        {
            path: 'delivery',
            name: 'custom-report-delivery',
            meta: {
                label: 'Custom Delivery Report',
                icon: 'ni ni-delivery-fast',
                breadCrumb: 'delivery'
            },
            components: { report: Delivery },
            children: [
                {
                    path: 'delivery-report/:reportId',
                    name: 'download-report-delivery',
                    meta: {
                        label: 'Custom Report Delivery Download',
                        icon: 'ni ni-button-power',
                        breadCrumb: 'download-report-delivery'
                    },
                    components: { report: DownloadReprot }
                }
            ]
        }
    ]
};
export default CustomReportRoutes;
