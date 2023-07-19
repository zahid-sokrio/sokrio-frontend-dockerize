import { Permission as PermissionEnums } from "@/enums/Permission";
import Permission from "@/intefaces/Permission";

const permission: any = localStorage.getItem('permissions');
const allPermissionLists: Permission[] = JSON.parse(permission)

let permissions = [
    [{
        name: 'dashboard',
        children: allPermissionLists.filter(function (result: any) {
            return result.name === PermissionEnums.DAILY_DATA_DASHBOARD ||
                result.name === PermissionEnums.MISCELLANEOUS_DASHBOARD ||
                result.name === PermissionEnums.SALES_GROWTH_DASHBOARD ||
                result.name === PermissionEnums.OUTLET_ORDER_DASHBOARD ||
                result.name === PermissionEnums.BASIC_REPORTING_DASHBOARD 
        })
    }],
    [{
        name: 'organization',
        children: allPermissionLists.filter(function (result: any) {
            return result.name == PermissionEnums.CREATE_TERRITORY_TYPE ||
                result.name == PermissionEnums.VIEW_TERRITORY_TYPE ||
                result.name === PermissionEnums.UPDATE_TERRITORY_TYPE ||
                result.name === PermissionEnums.DELETE_TERRITORY_TYPE ||
                result.name === PermissionEnums.CREATE_TERRITORY || result.name === PermissionEnums.VIEW_TERRITORY ||
                result.name === PermissionEnums.UPDATE_TERRITORY || result.name === PermissionEnums.DELETE_TERRITORY ||
                result.name === PermissionEnums.CREATE_CHANNEL || result.name === PermissionEnums.VIEW_CHANNEL ||
                result.name === PermissionEnums.UPDATE_CHANNEL || result.name === PermissionEnums.DELETE_CHANNEL ||
                result.name === PermissionEnums.CREATE_DEPARTMENT || result.name === PermissionEnums.VIEW_DEPARTMENT ||
                result.name === PermissionEnums.UPDATE_DEPARTMENT || result.name === PermissionEnums.DELETE_DEPARTMENT
        })
    }],
    [{
        name: 'user',
        children: allPermissionLists.filter(function (result: any) {
            return result.name == PermissionEnums.CREATE_ROLE || result.name == PermissionEnums.VIEW_ROLE ||
                result.name === PermissionEnums.UPDATE_ROLE || result.name === PermissionEnums.UPDATE_ROLE ||
                result.name === PermissionEnums.DELETE_ROLE || result.name === PermissionEnums.CREATE_USER ||
                result.name === PermissionEnums.VIEW_USER || result.name === PermissionEnums.UPDATE_USER ||
                result.name === PermissionEnums.CREATE_TARGET || result.name === PermissionEnums.VIEW_TARGET ||
                result.name === PermissionEnums.UPDATE_TARGET || result.name === PermissionEnums.DELETE_TARGET ||
                result.name === PermissionEnums.CREATE_TRAVEL_ALLOWANCE ||
                result.name === PermissionEnums.VIEW_TRAVEL_ALLOWANCE ||
                result.name === PermissionEnums.APPROVE_TRAVEL_ALLOWANCE ||
                result.name === PermissionEnums.DELETE_TRAVEL_ALLOWANCE
        })
    }],
    [{
        name: 'payment',
        children: allPermissionLists.filter(function (result: any) {
            return result.name == PermissionEnums.VIEW_PAYMENT || result.name === PermissionEnums.CREATE_PAYMENT ||
                result.name === PermissionEnums.APPROVE_PAYMENT ||
                result.name === PermissionEnums.CREATE_ADVANCE_PAYMENT ||
                result.name === PermissionEnums.VIEW_ADVANCE_PAYMENT ||
                result.name === PermissionEnums.UPDATE_ADVANCE_PAYMENT
        }),
    }],
    [{
        name: 'tracking',
        children:  allPermissionLists.filter(function (result: any) {
            return result.name == PermissionEnums.CREATE_VISIT_PLAN ||
                result.name == PermissionEnums.VIEW_VISIT_PLAN || result.name == PermissionEnums.UPDATE_VISIT_PLAN ||
                result.name === PermissionEnums.DELETE_VISIT_PLAN ||
                result.name === PermissionEnums.VIEW_PROPOSED_ROUTE_PLAN ||
                result.name === PermissionEnums.APPROVE_PROPOSED_ROUTE_PLAN ||
                result.name === PermissionEnums.VIEW_FIELD_FORCE || result.name === PermissionEnums.VIEW_MAP
        }),
    }],
    [{
        name: 'inspection',
        children: allPermissionLists.filter(function (result: any) {
            return result.name == PermissionEnums.CREATE_SURVEY || result.name == PermissionEnums.VIEW_SURVEY ||
                result.name == PermissionEnums.UPDATE_SURVEY || result.name === PermissionEnums.ASSIGNED_USER_SURVEY ||
                result.name === PermissionEnums.REPORT_SURVEY || result.name === PermissionEnums.DELETE_SURVEY ||
                result.name == PermissionEnums.CREATE_ASSET || result.name == PermissionEnums.VIEW_ASSET ||
                result.name === PermissionEnums.UPDATE_ASSET || result.name === PermissionEnums.DELETE_ASSET ||
                result.name === PermissionEnums.CREATE_CAMPAIGN || result.name === PermissionEnums.VIEW_CAMPAIGN ||
                result.name === PermissionEnums.UPDATE_CAMPAIGN || result.name === PermissionEnums.DELETE_CAMPAIGN ||
                result.name === PermissionEnums.CREATE_OUTLET_ITEM ||
                result.name === PermissionEnums.VIEW_OUTLET_ITEM ||
                result.name === PermissionEnums.UPDATE_OUTLET_ITEM ||
                result.name === PermissionEnums.DELETE_OUTLET_ITEM ||
                result.name === PermissionEnums.VIEW_AUDIT || result.name === PermissionEnums.CREATE_QUESTION ||
                result.name === PermissionEnums.VIEW_QUESTION || result.name === PermissionEnums.UPDATE_QUESTION ||
                result.name === PermissionEnums.DELETE_QUESTION
        }),
    }],
    [{
        name: 'order',
        children: allPermissionLists.filter(function (result: any) {
            return result.name == PermissionEnums.VIEW_ORDER || result.name == PermissionEnums.APPROVE_ORDER ||
                result.name == PermissionEnums.CREATE_REQUISITION ||
                result.name === PermissionEnums.UPDATE_REQUISITION ||
                result.name == PermissionEnums.VIEW_REQUISITION ||
                result.name == PermissionEnums.APPROVE_REQUISITION ||
                result.name === PermissionEnums.VIEW_SALES_RETURN || result.name === PermissionEnums.CREATE_INVOICE ||
                result.name === PermissionEnums.VIEW_INVOICE || result.name === PermissionEnums.UPDATE_INVOICE ||
                result.name === PermissionEnums.APPROVE_INVOICE ||
                result.name === PermissionEnums.CREATE_READY_TO_DISPATCH ||
                result.name === PermissionEnums.VIEW_READY_TO_DISPATCH ||
                result.name === PermissionEnums.UPDATE_READY_TO_DISPATCH ||
                result.name === PermissionEnums.APPROVE_READY_TO_DISPATCH ||
                result.name === PermissionEnums.CREATE_READY_TO_DELIVERY ||
                result.name === PermissionEnums.VIEW_READY_TO_DELIVERY ||
                result.name === PermissionEnums.UPDATE_READY_TO_DELIVERY ||
                result.name === PermissionEnums.APPROVE_READY_TO_DELIVERY ||
                result.name === PermissionEnums.VIEW_DELIVERY
        }),
    }],
    [{
        name: 'inventory',
        children: allPermissionLists.filter(function (result: any) {
            return result.name == PermissionEnums.CREATE_PRODUCT_CATEGORY ||
                result.name == PermissionEnums.VIEW_PRODUCT_CATEGORY ||
                result.name == PermissionEnums.UPDATE_PRODUCT_CATEGORY ||
                result.name === PermissionEnums.DELETE_PRODUCT_CATEGORY ||
                result.name === PermissionEnums.CREATE_PRODUCT_BRAND ||
                result.name === PermissionEnums.VIEW_PRODUCT_BRAND ||
                result.name === PermissionEnums.UPDATE_PRODUCT_BRAND ||
                result.name === PermissionEnums.DELETE_PRODUCT_BRAND ||
                result.name === PermissionEnums.CREATE_PRODUCT || result.name === PermissionEnums.VIEW_PRODUCT ||
                result.name === PermissionEnums.UPDATE_PRODUCT || result.name === PermissionEnums.DELETE_PRODUCT ||
                result.name === PermissionEnums.CREATE_VARIANT_CATEGORY ||
                result.name === PermissionEnums.VIEW_VARIANT_CATEGORY ||
                result.name === PermissionEnums.UPDATE_VARIANT_CATEGORY ||
                result.name === PermissionEnums.DELETE_VARIANT_CATEGORY ||
                result.name === PermissionEnums.CREATE_UNIT_CATEGORY ||
                result.name === PermissionEnums.VIEW_UNIT_CATEGORY ||
                result.name === PermissionEnums.UPDATE_UNIT_CATEGORY ||
                result.name === PermissionEnums.DELETE_UNIT_CATEGORY ||
                result.name === PermissionEnums.CREATE_BATCH || result.name === PermissionEnums.VIEW_BATCH ||
                result.name === PermissionEnums.UPDATE_BATCH || result.name === PermissionEnums.DELETE_BATCH ||
                result.name === PermissionEnums.CREATE_PROMOTION || result.name === PermissionEnums.VIEW_PROMOTION ||
                result.name === PermissionEnums.UPDATE_PROMOTION || result.name === PermissionEnums.DELETE_PROMOTION
        }),
    }],
    [{
        name: 'stock',
        children: allPermissionLists.filter(function (result: any) {
            return result.name == PermissionEnums.VIEW_STOCK
        }),
    }],
    [{
        name: 'attendance',
        children: allPermissionLists.filter(function (result: any) {
            return result.name == PermissionEnums.VIEW_ATTENDANCE || result.name === PermissionEnums.CREATE_LEAVE ||
                result.name === PermissionEnums.VIEW_LEAVE || result.name === PermissionEnums.APPROVE_LEAVE ||
                result.name === PermissionEnums.DELETE_LEAVE
        }),
    }],
    [{
        name: 'setting',
        children: allPermissionLists.filter(function (result: any) {
            return result.name == PermissionEnums.APPROVAL_SETTINGS || result.name === PermissionEnums.TAXONOMY_SETTINGS ||
                result.name === PermissionEnums.SMS_SETTINGS
        }),
    }],
    [{
        name: 'report',
        children:  allPermissionLists.filter(function (result: any) {
            return result.name == PermissionEnums.VIEW_REPORT || result.name === PermissionEnums.SALES_REPORT ||
                result.name === PermissionEnums.SALES_ORDER_REPORT ||
                result.name === PermissionEnums.SR_WISE_SALES_REPORT ||
                result.name === PermissionEnums.PRODUCT_WISE_SALES_REPORT ||
                result.name === PermissionEnums.VISIT_TARGET_REPORT ||
                result.name === PermissionEnums.TRACKING_REPORT || result.name === PermissionEnums.KPI_REPORT
        }),
    }],
    [{
        name: 'sms',
        children: allPermissionLists.filter(function (result: any) {
            return result.name == PermissionEnums.BULK_SMS
        }),
    }],
]

export default permissions;
