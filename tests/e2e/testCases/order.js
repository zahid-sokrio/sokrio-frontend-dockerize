import {
    checkButtonWithTypeAndText,
    checkElementWithClassAndText,
    checkExtensionInURL,
    checkButtonWithClassAndIndex,
    checkButtonWithClassTextAndIndex,
    checkInputFieldwithIndex,
    checkButtonWithClassAndText,
    checkButtonWithClassIndexAndText,
} from "../baseTests/validate";
import {
    clickButtonWithClassAndIndex,
    clickButtonWithClassTextAndIndex,
    clickButtonWithTypeAndText,
    clickButtonWithClassAndTextBeforeText,
    waitForMillisecond,
    clickButtonWithClassTextAndIndexWithoutdot,
    enterTextInSelectedField,
    clearTextInInputFieldWithTypeAndIndex,
    selectFromScrollbar,
    enterTextInInputFieldWithTypeAndIndex,
    clickInputField,
} from "../baseTests/action";
import {
    commonVars,
    order,
} from "../fixtures/constants";

/*
Test Case ID  : TC-11
Test Case Name: Order
*/

export function orderTest() {
    checkExtensionInURL(commonVars.dashboardExtension);
    clickButtonWithClassTextAndIndex(commonVars.sideNavClass, commonVars.orderText);
    checkElementWithClassAndText(commonVars.tabClass, commonVars.orderText, 0);
    checkElementWithClassAndText(commonVars.tabClass, order.requisitionText, 1);
    checkElementWithClassAndText(commonVars.tabClass, order.salesReturnText, 2);
    checkElementWithClassAndText(commonVars.tabClass, commonVars.invoiceText, 3);
    checkElementWithClassAndText(commonVars.tabClass, order.readyToDispatchText, 4);
    checkElementWithClassAndText(commonVars.tabClass, order.readyForDeliveryText, 5);
    checkElementWithClassAndText(commonVars.tabClass, order.deliveryText, 6);
    checkButtonWithClassAndIndex(commonVars.infoIconClass);
    checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
    checkButtonWithTypeAndText(commonVars.buttonType, commonVars.filterButtonText);
    checkButtonWithClassAndIndex(order.orderTableClass, 0);
    checkElementWithClassAndText(commonVars.tableHeadContentNameClass, order.orderNoText, 0);
    checkElementWithClassAndText(commonVars.tableHeadContentDescriptionClass, commonVars.createdByText, 1);
    checkElementWithClassAndText(commonVars.tableHeadContentHasOutletClass, order.deliveryDateText, 2);
    checkElementWithClassAndText(commonVars.tableHeadContentCreatedAtClass, commonVars.departmentText, 3);
    checkElementWithClassAndText(commonVars.tableHeadContentUpdateIconClass, commonVars.tableHeadContentAmountText, 4);
    checkElementWithClassAndText(order.tableHeadContentStatusClass, commonVars.statusText, 5);
    checkElementWithClassAndText(order.tableHeadContentDetailsClass, order.detailsText, 6);
    waitForMillisecond(2000);
    clickButtonWithClassTextAndIndex(commonVars.tableRowClass, order.detailsText, 0);
    checkButtonWithTypeAndText(commonVars.buttonType, order.viewRevisionsText);
    checkButtonWithTypeAndText(commonVars.buttonType, order.historyText);
    checkButtonWithClassTextAndIndex(commonVars.closeButtonClass, commonVars.closeButtonText, 1);
    clickButtonWithClassTextAndIndex(commonVars.popUpBodyClass, order.viewRevisionsText, 0);
    checkButtonWithClassIndexAndText(commonVars.tableHeadUserClass, 1, order.slText);
    checkButtonWithClassIndexAndText(commonVars.tableHeadUserClass, 1, commonVars.tableHeadContentAmountText);
    checkButtonWithClassIndexAndText(commonVars.tableHeadUserClass, 1, order.discountText);
    checkButtonWithClassIndexAndText(commonVars.tableHeadUserClass, 1, order.deliveryDateText);
    checkButtonWithClassIndexAndText(commonVars.tableHeadUserClass, 1, order.commentText);
    checkButtonWithClassIndexAndText(commonVars.tableHeadUserClass, 1, commonVars.tableHeadContentCreatedAtText);
    checkButtonWithClassTextAndIndex(commonVars.closeButtonClass, commonVars.closeButtonText, 1);
    clickButtonWithClassTextAndIndex(order.tableClass, order.detailsText, 0);
    checkElementWithClassAndText(order.popUpCardClass, order.requestedProductsText);
    clickButtonWithClassTextAndIndexWithoutdot(order.closeButtonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassTextAndIndexWithoutdot(order.orderCloseButtonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
    checkInputFieldwithIndex(order.orderStartDateField, 1);
    checkInputFieldwithIndex(order.orderEndDateField, 3);
    checkInputFieldwithIndex(order.orderIdField, 2);
    checkInputFieldwithIndex(order.orderByField, 4);
    checkInputFieldwithIndex(order.orderBuyerDepartmentField, 5);
    checkInputFieldwithIndex(order.orderBuyerTerritoryField, 6);
    checkInputFieldwithIndex(order.orderStatusOptionField, 7);
    checkInputFieldwithIndex(order.orderAmountRangeMinField, 8);
    checkInputFieldwithIndex(order.orderAmountRangeMaxField, 9);
    checkButtonWithClassTextAndIndex(commonVars.resetButtonClass, commonVars.resetButtonText, 2);
    checkButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
    enterTextInSelectedField(order.orderIdClass, 3, order.orderIdNumber);
    clickButtonWithClassAndIndex(commonVars.cornerCloseButtonClass, 0);
    checkElementWithClassAndText(commonVars.tableRowClass, order.orderIdNumber);
    //Requisition
    waitForMillisecond(1000);
    clickButtonWithClassTextAndIndex(commonVars.tabClass, order.requisitionText, 0);
    checkButtonWithClassAndIndex(commonVars.infoIconClass);
    checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
    checkButtonWithTypeAndText(commonVars.buttonType, commonVars.filterButtonText);
    waitForMillisecond(15000);
    checkButtonWithClassAndIndex(order.orderTableClass, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.requisitionNoText, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.creatorText, 1);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.deliveryDateText, 2);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.departmentText, 3);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentAmountText, 4);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.statusText, 5);
    waitForMillisecond(10000);
    clickButtonWithClassTextAndIndex(commonVars.tableRowClass, order.detailsText, 0);
    checkButtonWithClassAndText(commonVars.buttonClass, order.viewRevisionsText);
    checkButtonWithTypeAndText(commonVars.buttonType, order.historyText);
    checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
    clickButtonWithClassTextAndIndex(commonVars.popUpBodyClass, order.viewRevisionsText, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.slText, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.amountText, 1);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.discountText, 2);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.deliveryDateText, 3)
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.commentText, 4);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentCreatedAtText, 5);
    checkButtonWithClassAndText(commonVars.buttonClass, order.detailsButtonText, 0);
    checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassTextAndIndexWithoutdot(order.requisitionCloseButtonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassTextAndIndexWithoutdot(order.requisitionDetailsClosebuttonClass, commonVars.closeButtonText, 0);
    waitForMillisecond(2000);
    clickButtonWithClassTextAndIndex(commonVars.tableRowClass, order.editText, 0);
    checkButtonWithClassAndIndex(order.orderIdClass, 0);
    checkButtonWithClassAndText(order.productClass, order.productNameText, 0);
    checkButtonWithClassAndText(order.productClass, order.qtyText, 0);
    checkButtonWithClassAndText(order.productClass, order.priceText, 0);
    checkButtonWithClassAndText(order.productClass, order.amountText, 0);
    checkButtonWithClassAndText(order.productClass, order.freeProductText, 0);
    checkButtonWithClassAndIndex(order.addRequistionButtonClass, 0);
    checkButtonWithClassAndText(commonVars.buttonClass, commonVars.saveButtonText, 0);
    checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassAndIndex(order.dropdownClass, 1);
    clickButtonWithClassTextAndIndex(order.selectDropDownClass, order.brandText, 0);
    clickButtonWithClassAndIndex(order.orderIdClass, 1);
    clickButtonWithClassAndIndex(order.nextMonth, 0);
    clickButtonWithClassAndIndex(order.dateClass, 10);
    clickButtonWithClassTextAndIndex(commonVars.doneButtonClass, order.returnProductText, 0);
    checkButtonWithClassAndText(order.productClass, order.productNameText, 0);
    checkButtonWithClassAndText(order.productClass, order.qtyText, 1);
    checkButtonWithClassAndText(order.productClass, order.priceText, 1);
    checkButtonWithClassAndText(order.productClass, order.amountText, 1);
    checkButtonWithClassAndText(order.productClass, order.reasonText, 1);
    checkButtonWithClassAndIndex(order.addRequistionButtonClass, 0);
    clearTextInInputFieldWithTypeAndIndex(commonVars.numberType, 1);
    enterTextInInputFieldWithTypeAndIndex(commonVars.numberType, order.amount, 1)
    clearTextInInputFieldWithTypeAndIndex(commonVars.numberType, 2);
    enterTextInSelectedField(order.orderIdClass, 5, order.price);
    clickButtonWithClassAndIndex(order.dropdownClass, 3);
    clickButtonWithClassTextAndIndex(order.reasonDrpdownClass, order.damagedText, 0);
    clickButtonWithClassTextAndIndexWithoutdot(order.salesReturnSaveButtonClass, commonVars.saveButtonText, 0)
    waitForMillisecond(2000);
    clickButtonWithClassTextAndIndexWithoutdot(order.salesReturnSaveButtonClass, commonVars.saveButtonText, 0)
    waitForMillisecond(2000);
    checkElementWithClassAndText(order.successClass, order.successText);
    clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
    checkButtonWithClassAndIndex(order.requisitionFilterClass, 0);
    checkButtonWithClassAndIndex(order.requisitionFilterClass, 1);
    checkButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
    checkButtonWithTypeAndText(commonVars.buttonType, commonVars.resetButtonText);
    clickButtonWithClassAndIndex(order.requisitionFilterClass, 0);
    checkButtonWithClassAndText(order.scrollbarClass, order.outgoingRequisitionText);
    checkButtonWithClassAndText(order.scrollbarClass, order.incomingRequisitionText);
    clickButtonWithClassTextAndIndex(order.filterDrpDownClass, order.outGoingRequisitionText, 0);
    waitForMillisecond(2000),
    clickButtonWithClassAndIndex(commonVars.cornerCloseButtonClass, 0);
    clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.addButtontext);
    checkElementWithClassAndText(commonVars.addNewRequisitionClass, order.buyerDepartmentText, 0);
    checkElementWithClassAndText(commonVars.addNewRequisitionClass, order.productTypeText, 1);
    checkElementWithClassAndText(commonVars.addNewRequisitionClass, order.expecteddeliveryDateText, 2);
    checkButtonWithTypeAndText(commonVars.buttonType, order.returnProductText, 35);
    checkButtonWithClassTextAndIndex(commonVars.closeButtonClass, commonVars.closeButtonText, 1);
    checkButtonWithClassTextAndIndex(commonVars.saveButtonClass, commonVars.saveButtonText, 2);
    clickButtonWithClassAndIndex(order.buyerDepartmentClass, 1);
    clickButtonWithClassTextAndIndex(order.selectDropDownClass, order.buyerDepartment);
    clickButtonWithClassAndIndex(order.orderIdClass, 1);
    clickButtonWithClassAndIndex(order.nextMonth, 0);
    clickButtonWithClassAndIndex(order.dateClass, 10);
    clickInputField(commonVars.selectProductField, 0);
    selectFromScrollbar(commonVars.scrollbarViewClass);
    clearTextInInputFieldWithTypeAndIndex(commonVars.numberType, 0);
    enterTextInSelectedField(order.orderIdClass, 2, order.amount);
    waitForMillisecond(2000);
    clickButtonWithTypeAndText(commonVars.buttonType, order.returnProductText, 0);
    clickInputField(commonVars.selectProductField, 1);
    selectFromScrollbar(commonVars.scrollbarViewClass);
    clearTextInInputFieldWithTypeAndIndex(commonVars.numberType, 1);
    enterTextInInputFieldWithTypeAndIndex(commonVars.numberType, order.anotherAmount, 1)
    clearTextInInputFieldWithTypeAndIndex(commonVars.numberType, 2);
    enterTextInInputFieldWithTypeAndIndex(commonVars.numberType, order.newPrice, 2)
    clickInputField(order.selectReasonText, 0);
    selectFromScrollbar(commonVars.scrollbarViewClass);
    clickButtonWithClassTextAndIndex(commonVars.saveButtonClass, commonVars.saveButtonText);
    waitForMillisecond(2000),
    clickButtonWithClassTextAndIndexWithoutdot(order.nSaveButtonClass, commonVars.saveButtonText, 0);
    waitForMillisecond(2000);
    checkElementWithClassAndText(order.successClass, order.successText);
    //Sales Return
    clickButtonWithClassTextAndIndex(commonVars.tabClass, order.salesReturnText, 0);
    checkButtonWithClassAndIndex(commonVars.infoIconClass);
    checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
    checkButtonWithClassAndIndex(commonVars.tableHeadUserClass, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.viewText, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.returnByText, 1);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.outletText, 2)
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentCreatedAtText, 3);
    waitForMillisecond(9000);
    checkButtonWithClassTextAndIndex(commonVars.tableRowClass, order.viewRequisitionText, 0);
    clickButtonWithClassTextAndIndex(commonVars.tableRowClass, order.viewRequisitionText, 0);
    checkElementWithClassAndText(order.buyerSellerClass, order.outletText, 0);
    checkElementWithClassAndText(order.buyerSellerClass, order.expectedDeliveryDateText, 0);
    checkElementWithClassAndText(order.buyerSellerClass, commonVars.tableHeadContentCreatedAtText, 0);
    checkElementWithClassAndText(order.buyerSellerClass, commonVars.tableHeadContentAmountText, 0);
    checkElementWithClassAndText(order.buyerSellerClass, order.discountText, 0);
    checkElementWithClassAndText(order.buyerSellerClass, order.promotionalDiscountText, 0);
    clickButtonWithClassTextAndIndex(commonVars.closeButtonClass, commonVars.closeButtonText);
    //Invoice
    clickButtonWithClassTextAndIndex(commonVars.tabClass, commonVars.invoiceText, 0);
    checkButtonWithClassAndIndex(commonVars.infoIconClass);
    checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
    checkButtonWithClassAndIndex(commonVars.tableHeadUserClass, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.invoiceNoText, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.outletText, 1);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.totalText, 2)
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.dueText, 3);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.paidText, 4);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.statusText, 5);
    waitForMillisecond(12000);
    clickButtonWithClassAndIndex(order.invoiceDetailsclass, 0);
    checkElementWithClassAndText(order.buyerSellerClass, order.buyerText, 0);
    checkElementWithClassAndText(order.buyerSellerClass, order.sellerText, 0);
    checkElementWithClassAndText(order.invoiceProductsDetailsClass, order.productNameText, 0);
    checkElementWithClassAndText(order.invoiceProductsDetailsClass, order.productBatchText, 0);
    checkElementWithClassAndText(order.invoiceProductsDetailsClass, order.qtyText, 0);
    checkElementWithClassAndText(order.invoiceProductsDetailsClass, order.priceText, 0);
    checkElementWithClassAndText(order.invoiceProductsDetailsClass, order.PDiscount, 0);
    checkElementWithClassAndText(order.invoiceProductsDetailsClass, order.amountText, 0);
    checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassTextAndIndex(commonVars.closeButtonClass, commonVars.closeButtonText);
    clickButtonWithClassAndIndex(order.invoiceRevisionListClass, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.slText, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.amountText, 1);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.discountText, 2)
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.commentText, 3);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentCreatedAtText, 4);
    checkButtonWithClassAndText(commonVars.buttonClass, order.detailsButtonText, 0);
    checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassTextAndIndexWithoutdot(order.invoiceDetailsCloseButtonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassTextAndIndexWithoutdot(order.invoiceDetailsAnotherCloseButtonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
    checkInputFieldwithIndex(order.invoiceTypeField, 0);
    checkInputFieldwithIndex(order.invoiceStatusField, 1);
    checkInputFieldwithIndex(order.deliveryStatusField, 2);
    checkInputFieldwithIndex(order.createdByField, 3);
    checkInputFieldwithIndex(order.buyerDepartmentField, 4);
    checkInputFieldwithIndex(order.sellerDepartmentField, 5);
    checkInputFieldwithIndex(order.startDateField, 6);
    checkInputFieldwithIndex(order.endDateField, 7);
    checkButtonWithClassTextAndIndex(commonVars.resetButtonClass, commonVars.resetButtonText, 2);
    checkButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.closeButtonText, 3);
    checkButtonWithClassAndIndex(commonVars.infoIconClass);
    checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
    checkButtonWithClassAndIndex(commonVars.tableHeadUserClass, 0);
    clickButtonWithClassAndIndex(order.dropdownClass, 0);
    clickButtonWithClassTextAndIndex(order.selectDropDownClass, commonVars.orderText, 0);
    waitForMillisecond(20000);
    clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.closeButtonText);
    //Ready To Dispatch
    clickButtonWithClassTextAndIndex(commonVars.tabClass, order.readyToDispatchText, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.invoiceNoText, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.outletText, 1);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.originalAmountText, 2)
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.dueText, 3);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.paidText, 4);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.statusText, 5);
    //Ready For Delivery
    clickButtonWithClassTextAndIndex(commonVars.tabClass, order.readyForDeliveryText, 0);
    checkButtonWithClassAndIndex(commonVars.infoIconClass);
    checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
    checkButtonWithClassAndIndex(commonVars.tableHeadUserClass, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.invoiceNoText, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.outletText, 1);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.originalAmountText, 2);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.dueText, 3);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.paidText, 4);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.statusText, 5);
    checkButtonWithClassAndIndex(order.invoiceDetailsclass, 0);
    checkButtonWithClassAndIndex(order.invoiceRevisionListClass, 0);
    checkButtonWithClassAndIndex(order.deliveryButtonClass, 0);
    checkButtonWithClassAndIndex(order.remarkButtonClass, 0);
    clickButtonWithClassAndIndex(order.invoiceDetailsclass, 0);
    checkElementWithClassAndText(order.buyerSellerClass, order.buyerText, 0);
    checkElementWithClassAndText(order.buyerSellerClass, order.sellerText, 0);
    checkElementWithClassAndText(order.invoiceProductsDetailsClass, order.productNameText, 0);
    checkElementWithClassAndText(order.invoiceProductsDetailsClass, order.productBatchText, 0);
    checkElementWithClassAndText(order.invoiceProductsDetailsClass, order.qtyText, 0);
    checkElementWithClassAndText(order.invoiceProductsDetailsClass, order.priceText, 0);
    checkElementWithClassAndText(order.invoiceProductsDetailsClass, order.PDiscount, 0);
    checkElementWithClassAndText(order.invoiceProductsDetailsClass, order.amountText, 0);
    checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassTextAndIndexWithoutdot(order.readyForDeliveryCloseButtonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassAndIndex(order.invoiceRevisionListClass, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.slText, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.amountText, 1);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.discountText, 2)
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.commentText, 3);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentCreatedAtText, 4);
    checkButtonWithClassAndText(commonVars.buttonClass, order.detailsButtonText, 0);
    checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassTextAndIndexWithoutdot(order.invoiceDetailsAnotherCloseButtonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassAndIndex(order.deliveryButtonClass, 0);
    checkButtonWithClassAndIndex(commonVars.levelClass, 0);
    checkButtonWithClassAndText(order.productClass, order.productNameText, 0);
    checkButtonWithClassAndText(order.productClass, order.qtyText, 0);
    checkButtonWithClassAndText(order.productClass, order.priceText, 0);
    checkButtonWithClassAndText(order.productClass, order.amountText, 0);
    checkButtonWithClassAndText(order.productClass, order.freeProductText, 0);
    checkButtonWithClassAndIndex(order.addRequistionButtonClass, 0);
    checkButtonWithClassAndText(commonVars.buttonClass, commonVars.saveButtonText, 0);
    checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText, 0);
    clickButtonWithClassTextAndIndexWithoutdot(order.readyForDeliveryCloseButtonClass, commonVars.closeButtonText, 0);
    //Delivery
    clickButtonWithClassAndTextBeforeText(commonVars.tabClass, order.deliveryText, 6);
    checkButtonWithClassAndIndex(commonVars.infoIconClass);
    checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
    checkButtonWithClassAndIndex(commonVars.tableHeadUserClass, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.orderNoText, 0);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.invoiceNoText, 1);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentAmountText, 2)
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.discountText, 3);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.deliverAtText, 4);
    checkElementWithClassAndText(commonVars.tableHeadUserClass, order.detailsText, 5);
    waitForMillisecond(2000);
    clickButtonWithClassTextAndIndex(order.deliveryCloseButtonClass, order.viewInvoiceText, 0);
    checkElementWithClassAndText(commonVars.popUpBodyClass, order.deliveredProductsText, 0);
    checkButtonWithClassAndText(commonVars.doneButtonClass, order.exportButtonText, 0);
    checkButtonWithClassAndText(commonVars.buttonClass, order.printButtonText, 0);
    checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText, 0);
}