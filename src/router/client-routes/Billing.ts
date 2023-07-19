import { RouteConfig } from 'vue-router';
// @ts-ignore
import Billing from "@/views/billing/index.vue";
// @ts-ignore
import ClientSubscription from "@/views/billing/Subscription.vue";
// @ts-ignore
import ClientInvoice from "@/views/billing/Invoice.vue";
import { Permission } from "@/enums/Permission";

const billingRoutes: RouteConfig = {
  path: 'billing',
  name: 'billing',
  redirect: '/billing/subscription',
  components: { dashboard: Billing },
  children: [
    {
      path: 'subscription',
      name: 'subscription',
      meta:{
        label:'Subscription',
        icon:'fa fa-bookmark',
      },
      component: ClientSubscription
    },
    {
      path: 'invoice',
      name: 'invoice',
      meta:{
        label:'Invoice',
        icon:'fa fa-file',
      },
      component: ClientInvoice
    }
  ]
};

export default billingRoutes;
