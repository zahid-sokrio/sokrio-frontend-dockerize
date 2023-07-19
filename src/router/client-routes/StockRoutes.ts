// @ts-ignore
import Route from '@/intefaces/Route';
// @ts-ignore
import Stock from '@/views/stock/Stock.vue';
// @ts-ignore
import DepartmentStockList from '@/views/stock/departmentStock/DepartmentStockList.vue';

import {RouteConfig} from "vue-router";
import { Permission } from "@/enums/Permission";

const StockRoutes: RouteConfig = {
    path: 'stock',
    name: 'stock',
    redirect: '/stock/department-stock',
    components: { dashboard: Stock },
    children: [
        {
            path: 'department-stock',
            name: 'department-stock',
            meta : {
                label: 'Department Stock',
                icon: 'fas fa-boxes',
                permission: Permission.VIEW_STOCK,
                breadCrumb: 'department-stock'
            },
            component: DepartmentStockList,
        }
    ]
};

export default StockRoutes;
