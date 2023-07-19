import { RouteConfig } from "vue-router";
import Payment from "@/views/payment/Payment.vue";
import { Permission } from "@/enums/Permission";
import PaymentList from "@/views/payment/InvoiceList.vue";
import AdvancePaymentList from "@/views/payment/AdvancePaymentList.vue";
import InvoiceList from "@/views/payment/InvoiceList.vue";
import InvoicePayments from "@/views/payment/InvoicePayments.vue";
import InvoicePage from "@/views/payment/InvoicePage.vue";
import { PermissionHelper } from "@/classes/PermissionHelper";

// Redirect to user's authorized (has permission) tab
function redirectToUserAuthorizedRoute() {
    return '/payment/' + PermissionHelper([
        Permission.VIEW_PAYMENT,
        Permission.VIEW_ADVANCE_PAYMENT,
    ], [{permission: Permission.VIEW_PAYMENT, name: 'payments'},
        {permission: Permission.VIEW_ADVANCE_PAYMENT, name: 'advance-payments'},
    ]);
}

const PaymentRoutes: RouteConfig = {
    path: 'payment',
    components: {dashboard: Payment},
    name: 'payment',
    redirect: to => {
        return redirectToUserAuthorizedRoute();
    },
    children: [
        {
            path: '/payment/payments',
            name: 'payments',
            meta: {
                label: 'Payment',
                icon: 'fa fa-money-check-alt',
                permission: Permission.VIEW_PAYMENT,
                breadCrumb: 'payment'
            },
            component: InvoicePage,
            children: [
                {
                    path: '',
                    name: 'invoices',
                    components:{invoicePage: InvoiceList},

                },
                {
                    path: 'invoice-id/payments',
                    name: 'invoice-payments',
                    components:{invoicePage: InvoicePayments},
                    props: {invoicePage: true}

                }
            ]
        },
        {
            path: '/payment/advance-payments',
            name: 'advance-payments',
            meta: {
                label: 'Advance Payment',
                icon: 'fa fa-money-bill-wave',
                permission: Permission.VIEW_ADVANCE_PAYMENT,
                breadCrumb: 'advance-payment'
            },
            component: AdvancePaymentList
        },

    ]
};
export default PaymentRoutes;
