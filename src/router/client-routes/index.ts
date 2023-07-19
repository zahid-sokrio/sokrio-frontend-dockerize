import { RouteConfig } from 'vue-router';
// @ts-ignore
import Dashboard from '@/views/Dashboard.vue';
// @ts-ignore
import Home from '@/views/Home.vue';
// @ts-ignore
import Login from '@/views/auth/Login.vue';
import UserRoutes from '@/router/client-routes/UserRoutes';
import ProductRoutes from '@/router/client-routes/ProductRoutes';
import TrackingRoutes from '@/router/client-routes/TrackingRoutes';
import TerritoryRoutes from '@/router/client-routes/TerritoryRoutes';
import DepartmentRoutes from '@/router/client-routes/DepartmentRoutes';
import ProfileRoutes from '@/router/client-routes/ProfileRoutes';
import AttendanceRoutes from '@/router/client-routes/AttendanceRoutes';
import InspectionRoutes from '@/router/client-routes/InspectionRoutes';
import SMSRoutes from '@/router/client-routes/SMSRoutes';
// @ts-ignore
import PaymentList from '@/views/payment/InvoiceList.vue';
import StockRoutes from '@/router/client-routes/StockRoutes';
import OrderRoutes from '@/router/client-routes/OrderRoutes';
import DashboardRoutes from "@/router/client-routes/DashboardRoutes";
import BillingRoutes from "@/router/client-routes/Billing";
import ReportRoutes from "@/router/client-routes/ReportRoutes";
import CustomReportRoutes from "@/router/client-routes/CustomReportRoutes";
import { Permission } from "@/enums/Permission";
import SettingsRoutes from "@/router/client-routes/SettingsRoutes";
import PaymentRoutes from "@/router/client-routes/PaymentRoutes";

export const ClintRoutes: RouteConfig[] = [
  {
    path: '/',
    component: Dashboard,
    meta: { requiresAuth: true, requiresClientCheck: true },
    children: [
      // {
      //   path: '',
      //   name: 'home',
      //   components: { dashboard: Home }
      // },
      // {
      //   path: '/payments',
      //   name: 'payment',
      //   components: { dashboard: PaymentList },
      //     //@ts-ignore
      //   permission: Permission.VIEW_PAYMENT
      // },
        PaymentRoutes,
      UserRoutes,
      ProductRoutes,
      TrackingRoutes,
      TerritoryRoutes,
      DepartmentRoutes,
      AttendanceRoutes,
      InspectionRoutes,
      OrderRoutes,
      DashboardRoutes,
      ProfileRoutes,
      StockRoutes,
      ReportRoutes,
      CustomReportRoutes,
      // BillingRoutes, //TODO: Not being used and need requirement from business team
      SettingsRoutes,
      SMSRoutes
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: { requiresClientCheck: true },
    component: Login
  }
];
