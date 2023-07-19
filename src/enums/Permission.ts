export enum Permission {
    DAILY_DATA_DASHBOARD = 'dailyDataDashboard',
    MISCELLANEOUS_DASHBOARD = 'miscellaneousDashboard',
    SALES_GROWTH_DASHBOARD = 'salesGrowthDashboard',
    OUTLET_ORDER_DASHBOARD = 'outletOrderDashboard',
    BASIC_REPORTING_DASHBOARD = 'basicReportingDashboard',
    CREATE_ROLE = 'createRole',
    VIEW_ROLE = 'viewRole',
    UPDATE_ROLE = 'updateRole',
    DELETE_ROLE = 'deleteRole',
    CREATE_USER = 'createUser',
    VIEW_USER = 'viewUser',
    UPDATE_USER = 'updateUser',
    CREATE_TARGET = 'createTarget',
    VIEW_TARGET = 'viewTarget',
    UPDATE_TARGET = 'updateTarget',
    DELETE_TARGET = 'deleteTarget',
    CREATE_TRAVEL_ALLOWANCE = 'createTravelAllowance',
    VIEW_TRAVEL_ALLOWANCE = 'viewTravelAllowance',
    APPROVE_TRAVEL_ALLOWANCE = 'approveTravelAllowance',
    DELETE_TRAVEL_ALLOWANCE = 'deleteTravelAllowance',
    CREATE_TERRITORY_TYPE = 'createTerritoryType',
    VIEW_TERRITORY_TYPE = 'viewTerritoryType',
    UPDATE_TERRITORY_TYPE = 'updateTerritoryType',
    DELETE_TERRITORY_TYPE = 'deleteTerritoryType',
    CREATE_TERRITORY = 'createTerritory',
    VIEW_TERRITORY = 'viewTerritory',
    UPDATE_TERRITORY = 'updateTerritory',
    DELETE_TERRITORY = 'deleteTerritory',
    CREATE_CHANNEL = 'createChannel',
    VIEW_CHANNEL = 'viewChannel',
    UPDATE_CHANNEL = 'updateChannel',
    DELETE_CHANNEL = 'deleteChannel',
    CREATE_DEPARTMENT = 'createDepartment',
    VIEW_DEPARTMENT = 'viewDepartment',
    UPDATE_DEPARTMENT = 'updateDepartment',
    DELETE_DEPARTMENT = 'deleteDepartment',
    CREATE_PRODUCT_CATEGORY = 'createProductCategory',
    VIEW_PRODUCT_CATEGORY = 'viewProductCategory',
    UPDATE_PRODUCT_CATEGORY = 'updateProductCategory',
    DELETE_PRODUCT_CATEGORY = 'deleteProductCategory',
    CREATE_PRODUCT_BRAND = 'createProductBrand',
    VIEW_PRODUCT_BRAND = 'viewProductBrand',
    UPDATE_PRODUCT_BRAND = 'updateProductBrand',
    DELETE_PRODUCT_BRAND = 'deleteProductBrand',
    CREATE_PRODUCT = 'createProduct',
    VIEW_PRODUCT = 'viewProduct',
    UPDATE_PRODUCT = 'updateProduct',
    DELETE_PRODUCT = 'deleteProduct',
    CREATE_VARIANT_CATEGORY = 'createVariantCategory',
    VIEW_VARIANT_CATEGORY = 'viewVariantCategory',
    UPDATE_VARIANT_CATEGORY = 'updateVariantCategory',
    DELETE_VARIANT_CATEGORY = 'deleteVariantCategory',
    CREATE_UNIT_CATEGORY = 'createUnitCategory',
    VIEW_UNIT_CATEGORY = 'viewUnitCategory',
    UPDATE_UNIT_CATEGORY = 'updateUnitCategory',
    DELETE_UNIT_CATEGORY = 'deleteUnitCategory',
    CREATE_BATCH = 'createBatch',
    VIEW_BATCH = 'viewBatch',
    UPDATE_BATCH = 'updateBatch',
    DELETE_BATCH = 'deleteBatch',
    CREATE_PROMOTION = 'createPromotion',
    VIEW_PROMOTION = 'viewPromotion',
    UPDATE_PROMOTION = 'updatePromotion',
    DELETE_PROMOTION = 'deletePromotion',
    CREATE_VISIT_PLAN = 'createVisitPlan',
    VIEW_VISIT_PLAN = 'viewVisitPlan',
    UPDATE_VISIT_PLAN = 'updateVisitPlan',
    DELETE_VISIT_PLAN = 'deleteVisitPlan',
    VIEW_PROPOSED_ROUTE_PLAN = 'viewProposedRoutePlan',
    APPROVE_PROPOSED_ROUTE_PLAN = 'approveProposedRoutePlan',
    DELETE_PROPOSED_ROUTE_PLAN = 'deleteProposedRoutePlan',
    VIEW_FIELD_FORCE = 'viewFieldForce',
    VIEW_MAP = 'viewMap',
    VIEW_ATTENDANCE = 'viewAttendance',
    CREATE_LEAVE = 'createLeave',
    VIEW_LEAVE = 'viewLeave',
    APPROVE_LEAVE = 'approveLeave',
    DELETE_LEAVE = 'deleteLeave',
    CREATE_SURVEY = 'createSurvey',
    VIEW_SURVEY = 'viewSurvey',
    UPDATE_SURVEY = 'updateSurvey',
    ASSIGNED_USER_SURVEY = 'assignedUserSurvey',
    REPORT_SURVEY = 'reportSurvey',
    DELETE_SURVEY = 'deleteSurvey',
    CREATE_ASSET = 'createAsset',
    VIEW_ASSET = 'viewAsset',
    UPDATE_ASSET = 'updateAsset',
    DELETE_ASSET = 'deleteAsset',
    CREATE_CAMPAIGN = 'createCampaign',
    VIEW_CAMPAIGN = 'viewCampaign',
    UPDATE_CAMPAIGN = 'updateCampaign',
    DELETE_CAMPAIGN = 'deleteCampaign',
    CREATE_OUTLET_ITEM = 'createOutletItem',
    VIEW_OUTLET_ITEM = 'viewOutletItem',
    UPDATE_OUTLET_ITEM = 'updateOutletItem',
    DELETE_OUTLET_ITEM = 'deleteOutletItem',
    VIEW_AUDIT = 'viewAudit',
    CREATE_QUESTION = 'createQuestion',
    VIEW_QUESTION = 'viewQuestion',
    UPDATE_QUESTION = 'updateQuestion',
    DELETE_QUESTION = 'deleteQuestion',
    VIEW_ORDER = 'viewOrder',
    APPROVE_ORDER = 'approveOrder',
    CREATE_REQUISITION = 'createRequisition',
    VIEW_REQUISITION = 'viewRequisition',
    UPDATE_REQUISITION = 'updateRequisition',
    APPROVE_REQUISITION = 'approveRequisition',
    VIEW_SALES_RETURN = 'viewSalesReturn',
    CREATE_INVOICE = 'createInvoice',
    VIEW_INVOICE = 'viewInvoice',
    UPDATE_INVOICE = 'updateInvoice',
    APPROVE_INVOICE = 'approveInvoice',
    CREATE_READY_TO_DISPATCH = 'createReadyToDispatch',
    VIEW_READY_TO_DISPATCH = 'viewReadyToDispatch',
    UPDATE_READY_TO_DISPATCH = 'updateReadyToDispatch',
    APPROVE_READY_TO_DISPATCH = 'approveReadyToDispatch',
    CREATE_READY_TO_DELIVERY = 'createReadyToDelivery',
    VIEW_READY_TO_DELIVERY = 'viewReadyToDelivery',
    UPDATE_READY_TO_DELIVERY = 'updateReadyToDelivery',
    APPROVE_READY_TO_DELIVERY = 'approveReadyToDelivery',
    VIEW_DELIVERY = 'viewDelivery',
    CREATE_PAYMENT = 'createPayment',
    VIEW_PAYMENT = 'viewPayment',
    APPROVE_PAYMENT = 'approvePayment',
    CREATE_ADVANCE_PAYMENT = 'createAdvancePayment',
    VIEW_ADVANCE_PAYMENT = 'viewAdvancePayment',
    UPDATE_ADVANCE_PAYMENT = 'updateAdvancePayment',
    VIEW_STOCK = 'viewStock',
    SALES_REPORT = 'salesReport',
    SALES_ORDER_REPORT = 'salesOrderReport',
    SR_WISE_SALES_REPORT = 'srWiseSalesReport',
    PRODUCT_WISE_SALES_REPORT = 'productWiseSalesReport',
    VISIT_TARGET_REPORT = 'visitTargetReport',
    TRACKING_REPORT = 'trackingReport',
    KPI_REPORT = 'kpiReport',
    HR_TRAVEL_ALLOWANCE_REPORT = 'hrTravelAllowanceReport',
    HR_TRACKING_REPORT = 'hrTrackingReport',
    HR_CHECKIN_REPORT = 'hrCheckinReport',
    PRODUCT_BASED_REPORT = 'productBasedReport',
    APPROVAL_SETTINGS = 'approvalSettings',
    TAXONOMY_SETTINGS = 'taxonomySettings',
    VAT_SETTINGS = 'vatSettings',
    SMS_SETTINGS = 'smsSettings',
    ATTENDANCE_SETTINGS = 'attendanceSettings',
    PRODUCT_SETTINGS = 'productSettings',
    TRACKING_SETTING = 'trackingSettings',
    UPDATE_SETTING = 'updateSetting',
    BULK_SMS = 'bulkSms',
    VIEW_MESSAGE = 'viewMessage',
    VIEW_REPORT = 'viewReport',
    MANAGE_ORDER = 'manageOrder',
    UPLOAD_TRACKING = 'uploadTracking',
    PROFILE_INFORMATION_CHANGE_MOBILE = 'profileInformationChangeMobile',
    VIEW_OUTLET_MOBILE = 'viewOutletMobile',
    CHECKIN_MOBILE = 'checkinMobile',
    MAP_MOBILE = 'mapMobile',
    CREATE_OUTLET_MOBILE = 'createOutletMobile',
    UPDATE_OUTLET_MOBILE = 'updateOutletMobile',
    ORDER_MOBILE = 'orderMobile',
    CREATE_ORDER_MOBILE = 'createOrderMobile',
    VIEW_ORDER_MOBILE = 'viewOrderMobile',
    CREATE_SALES_RETURN_MOBILE = 'createSalesReturnMobile',
    PAYMENT_MOBILE = 'paymentMobile',
    INVOICE_MOBILE = 'invoiceMobile',
    DELIVERY_MOBILE = 'deliveryMobile',
    DELIVERY_LIST_MOBILE = 'deliveryListMobile',
    INSPECTION_MOBILE = 'inspectionMobile',
    ROUTE_PLAN_MOBILE = 'routePlanMobile',
    TRAVEL_ALLOWANCE_MOBILE = 'travelAllowanceMobile',
    CREATE_PROPOSED_ROUTE_PLAN_MOBILE = 'createProposedRoutePlanMobile',
    UPDATE_PROPOSED_ROUTE_PLAN_MOBILE = 'updateProposedRoutePlanMobile',
    LEAVE_REQUEST_MOBILE = 'leaveRequestMobile',
    ORDER_CUSTOM_DISCOUNT_MOBILE = 'orderCustomDiscountMobile',
    ACTIVE_USER_REPORT = 'activeUserReport',
    DAILY_CALL_REPORT = 'dailyCallReport',
    PERFORMANCE_BOARD_REPORT = 'performanceBoardReport',
    NOT_ORDERED_REPORT = 'notOrderedReport',
    STOCK_DOWNLOAD = 'stockDownload',
    BULK_STOCK = 'bulkStock',
    TARGET_VS_ACHIEVEMENT_REPORT = 'targetVsAchievementReport'
}