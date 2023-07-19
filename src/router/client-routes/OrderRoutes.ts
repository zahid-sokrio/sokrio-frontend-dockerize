import { RouteConfig } from 'vue-router';
// @ts-ignore
import Order from '@/views/order/Order.vue';
// @ts-ignore
import SalesReturn from '@/views/order/salesReturn/SalesReturnList.vue';
// @ts-ignore
import OrderList from '@/views/order/OrderList.vue';
// @ts-ignore
import InvoiceList from "@/views/order/invoice/InvoiceList.vue";
//@ts-ignore
import DispatchedInvoiceList from '@/views/order/readyToDispatch/DispatchedInvoiceList.vue'
//@ts-ignore
import ReadyForDeliverInvoiceList from "@/views/order/readyForDelivery/ReadyForDeliverInvoiceList.vue";
//@ts-ignore
import RequisitionList from "@/views/order/requisition/RequistionList.vue";
//@ts-ignore
import DeliveryList from "@/views/order/delivery/DeliveryList.vue";
import { Permission } from "@/enums/Permission";
import store from "@/store";
import Taxonomy from "@/intefaces/Taxonomy";
import TaxonomyJson from "@/assets/json/Taxonomy.json";
import { PermissionHelper } from "@/classes/PermissionHelper";

function getTaxonomy(label: any) {
    let currentLabel: any = '';
    let taxonomy = store.getters['Settings/getTaxonomyStore'];
    let taxonomyArray: Taxonomy[] = [];
    if (taxonomy) {
        taxonomyArray = typeof taxonomy == 'string' ? JSON.parse(taxonomy) : taxonomy;
    } else {
        taxonomyArray = TaxonomyJson;
    }
    taxonomyArray.forEach((taxonomy: any) => {
        if (Object.keys(taxonomy)[0] == label) {
            currentLabel = Object.values(taxonomy)[0]
        }
    });
    return currentLabel;
}

// Redirect to user's authorized (has permission) tab
function redirectToUserAuthorizedRoute() {
    return '/order/' + PermissionHelper([
        Permission.VIEW_ORDER,
        Permission.VIEW_REQUISITION,
        Permission.VIEW_SALES_RETURN,
        Permission.VIEW_INVOICE,
        Permission.VIEW_READY_TO_DISPATCH,
        Permission.VIEW_READY_TO_DELIVERY,
        Permission.VIEW_DELIVERY
    ], [{permission: Permission.VIEW_ORDER, name: 'orders'},
        {permission: Permission.VIEW_REQUISITION, name: 'requisitions'},
        {permission: Permission.VIEW_SALES_RETURN, name: 'sales-return'},
        {permission: Permission.VIEW_INVOICE, name: 'invoices'},
        {permission: Permission.VIEW_READY_TO_DISPATCH, name: 'ready-to-dispatch'},
        {permission: Permission.VIEW_READY_TO_DELIVERY, name: 'ready-to-delivery'},
        {permission: Permission.VIEW_DELIVERY, name: 'deliveries'},
    ]);
}

const OrderRoutes: RouteConfig = {
    path: 'order',
    components: {dashboard: Order},
    name: 'order',
    redirect: to => {
        return redirectToUserAuthorizedRoute();
    },
    children: [
        {
            path: '/order/orders',
            name: 'orders',
            meta: {
                // getLabel: function (x: any){ console.log(x) },
                label: getTaxonomy('order'),
                icon: 'fa fa-cart-arrow-down',
                permission: Permission.VIEW_ORDER,
                breadCrumb: 'orders',
            },
            component: OrderList
        },
        {
            path: '/order/requisitions',
            name: 'requisitions',
            meta: {
                label: getTaxonomy('requisition'),
                icon: 'fa fa-shopping-cart',
                permission: Permission.VIEW_REQUISITION,
                breadCrumb: getTaxonomy('requisition'),
            },
            component: RequisitionList
        },
        {
            path: '/order/sales-return',
            name: 'sales-return',
            meta: {
                label: getTaxonomy('salesReturn'),
                icon: 'fas fa-undo-alt',
                permission: Permission.VIEW_SALES_RETURN,
                breadCrumb: getTaxonomy('salesReturn'),
            },
            component: SalesReturn
        },
        {
            path: '/order/invoices',
            name: 'invoices',
            meta: {
                label: getTaxonomy('invoice'),
                icon: 'fas fa-file-invoice',
                permission: Permission.VIEW_INVOICE,
                breadCrumb: getTaxonomy('invoice'),
            },
            component: InvoiceList
        },
        {
            path: '/order/ready-to-dispatch',
            name: 'ready-to-dispatch',
            meta: {
                label: 'Ready To Dispatch',
                icon: 'fas fa-file-invoice',
                permission: Permission.VIEW_READY_TO_DISPATCH,
                breadCrumb: 'ready-to-dispatch',
            },
            component: DispatchedInvoiceList
        },
        {
            path: '/order/ready-to-delivery',
            name: 'ready-to-delivery',
            meta: {
                label: 'Ready For Delivery',
                icon: 'fas fa-file-invoice',
                permission: Permission.VIEW_READY_TO_DELIVERY,
                breadCrumb: 'ready-to-delivery',
            },
            component: ReadyForDeliverInvoiceList
        },
        {
            path: '/order/deliveries',
            name: 'deliveries',
            meta: {
                label: 'Delivery',
                icon: 'fas fa-truck',
                permission: Permission.VIEW_DELIVERY,
                breadCrumb: 'deliveries'
            },
            component: DeliveryList
        }
    ]
};
export default OrderRoutes;
