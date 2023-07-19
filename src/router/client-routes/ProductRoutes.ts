import { RouteConfig } from 'vue-router';
// @ts-ignore
import Product from '@/views/product/Product.vue';
// @ts-ignore
import ProductCategoryList from "@/views/product/ProductCategoryList.vue";
// @ts-ignore
import ProductList from "@/views/product/ProductList.vue";
// @ts-ignore
import ProductBrandList from "@/views/product/ProductBrandList.vue";
// @ts-ignore
import VariantCategoryList from "@/views/product/VariantCategoryList.vue";
// @ts-ignore
import UnitCategoryList from "@/views/product/UnitCategoryList.vue";
// @ts-ignore
import Promotion from "@/views/product/Promotion.vue";
// @ts-ignore
import AddProductBatch from "@/views/product/AddProductBatch.vue"
// @ts-ignore
import BatchList from "@/views/product/BatchList.vue";
// @ts-ignore
import ProductPage from "@/views/product/ProductPage.vue";
import { Permission } from "@/enums/Permission";
import { PermissionHelper } from "@/classes/PermissionHelper";
import AddProduct from "@/views/product/CreateProduct.vue";

// Redirect to user's authorized (has permission) tab
function redirectToUserAuthorizedRoute() {
    return '/inventory/' + PermissionHelper([
        Permission.VIEW_PRODUCT_CATEGORY,
        Permission.VIEW_PRODUCT,
        Permission.VIEW_PRODUCT_BRAND,
        Permission.VIEW_VARIANT_CATEGORY,
        Permission.VIEW_UNIT_CATEGORY,
        Permission.VIEW_BATCH,
        Permission.VIEW_PROMOTION,
    ], [{permission: Permission.VIEW_PRODUCT_CATEGORY, name: 'category'},
        {permission: Permission.VIEW_PRODUCT, name: 'product'},
        {permission: Permission.VIEW_PRODUCT_BRAND, name: 'brand'},
        {permission: Permission.VIEW_VARIANT_CATEGORY, name: 'variant'},
        {permission: Permission.VIEW_UNIT_CATEGORY, name: 'unit'},
        {permission: Permission.VIEW_BATCH, name: 'batch'},
        {permission: Permission.VIEW_PROMOTION, name: 'promotion'}
    ]);
}

const ProductRoutes: RouteConfig = {
    path: 'inventory',
    name: 'product master',
    redirect: to => {
        return redirectToUserAuthorizedRoute();
    },
    components: {dashboard: Product},
    children: [
        {
            path: '/inventory/category',
            name: 'category',
            meta: {
                label: 'Category',
                icon: 'fa fa-list-alt',
                permission: Permission.VIEW_PRODUCT_CATEGORY,
                breadCrumb: 'category',
            },
            component: ProductCategoryList
        },
        {
            path: '/inventory/products',
            component: ProductPage,
            name: 'products',
            children: [
                {
                    path: '',
                    name: 'product',
                    components: {productPage: ProductList}
                },
                {
                    path: 'create',
                    name: 'create',
                    components: {productPage: AddProduct}
        }
      ],
      meta: {
        label: 'Product',
        icon: 'fa fa-shopping-basket',
        permission: Permission.VIEW_PRODUCT,
        breadCrumb: 'product',
      }
    },
        {
            path: '/inventory/brand',
            name: 'brand',
            meta: {
                label: 'Brand',
                icon: 'fab fa-first-order-alt',
                permission: Permission.VIEW_PRODUCT_BRAND,
                breadCrumb: 'brand'
            },
            component: ProductBrandList
        },
        {
            path: '/inventory/variant',
            name: 'variant',
            meta: {
                label: 'Variant',
                icon: 'fas fa-list-alt',
                permission: Permission.VIEW_VARIANT_CATEGORY,
                breadCrumb: 'variant'
            },
            component: VariantCategoryList
        },
        {
            path: '/inventory/unit',
            name: 'unit',
            meta: {
                label: 'Unit',
                icon: 'fas fa-ruler-vertical',
                permission: Permission.VIEW_UNIT_CATEGORY,
                breadCrumb: 'unit'
            },
            component: UnitCategoryList
        },
        {
            path: '/inventory/batch',
            name: 'batch',
            meta: {
                label: 'Batch',
                icon: 'fa fa-tasks',
                permission: Permission.VIEW_BATCH,
                breadCrumb: 'batch',
            },
            component: BatchList
        },
        {
            path: '/inventory/promotion',
            name: 'promotion',
            meta: {
                label: 'Promotion',
                icon: 'fa fa-bullhorn',
                permission: Permission.VIEW_PROMOTION,
                breadCrumb: 'promotion',
            },
            component: Promotion
        }
  ]
};
export default ProductRoutes;
