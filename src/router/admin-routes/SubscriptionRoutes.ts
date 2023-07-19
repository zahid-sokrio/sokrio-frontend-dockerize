// @ts-ignore
import Subscription from '@/views/admin/subscription/Subscription.vue';
// @ts-ignore
import FeatureList from '@/views/admin/subscription/feature/FeatureList.vue';
// @ts-ignore
import PackageList from '@/views/admin/subscription/package/PackageList.vue';
// @ts-ignore
import SubscriberList from '@/views/admin/subscription/subscriber/SubscriberList.vue';
// @ts-ignore
import CouponList from '@/views/admin/subscription/coupon/CouponList.vue';
// @ts-ignore
import InvoiceList from '@/views/admin/subscription/invoice/InvoiceList.vue';
// @ts-ignore
import PaymentList from '@/views/admin/subscription/payment/PaymentList.vue';

import { RouteConfig } from 'vue-router';

const SubscriptionRoutes: RouteConfig = {
  path: 'subscription',
  name: 'subscription',
  redirect: '/subscription/features',
  components: { dashboard: Subscription },
  children: [
    {
      path: 'features',
      name: 'features',
      // @ts-ignore
      label: 'Features',
      icon: 'fas fa-list-ul',
      component: FeatureList
    },
    {
      path: 'packages',
      name: 'packages',
      // @ts-ignore
      label: 'Packages',
      icon: 'fas fa-box-open',
      component: PackageList
    },
    {
      path: 'subscriber',
      name: 'subscriber',
      // @ts-ignore
      label: 'Subscribers',
      icon: 'fas fa-box-open',
      component: SubscriberList
    },
    {
      path: 'coupons',
      name: 'Coupons',
      // @ts-ignore
      label: 'Coupon',
      icon: 'fas fa-receipt',
      component: CouponList
    },
    {
      path: 'invoices',
      name: 'Invoices',
      // @ts-ignore
      label: 'Invoice',
      icon: 'fas fa-file-invoice',
      component: InvoiceList
    },
    {
      path: 'payments',
      name: 'Payment',
      // @ts-ignore
      label: 'Payment',
      icon: 'ni ni-credit-card',
      component: PaymentList
    }
  ]
};

export default SubscriptionRoutes;
