import {
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkInputFieldWithTypeAndText,
  checkButtonWithClassAndIndex,
  checkElement,
  checkElementWithClassTextAndIndex,
  checkVisibleInputFieldWithTextAndIndex,
  checkButtonWithTypeIndexAndClass,
  checkExistingInputFieldWithTextAndIndex,
  checkVisibleElementWithClassAndText,
  checkDisabledInputFielWithIndex,
  checkEnabledInputFielWithIndex,
  checkButtonWithClassTextAndIndex,
  checkButtonWithCypressSelector,
  checkVisibleElementWithCypressSelector,
} from "../baseTests/validate";
import {
  clickInputField,
  selectFromScrollbar,
  clickButtonWithClassTextAndIndex,
  clickButtonWithClassAndIndex,
  waitForMillisecond,
  selectOptionWithClassAndIndex,
  selectDateFromDatePicker,
  clickButtonWithClassAndText,
  clickButtonWithCypressSelector,
} from "../baseTests/action";
import {
  commonVars,
  dashboard,
} from "../fixtures/constants";

/*
  Test Case ID  : TC-4
  Test Case Name: Dashboard
*/

export function dashboardTest() {
  checkExtensionInURL(commonVars.dashboardExtension);
  checkElementWithClassAndText(commonVars.sideNavClass, commonVars.dashboardText);
  checkElementWithClassAndText(commonVars.sideNavClass, commonVars.userText);
  //checkElementWithClassAndText(commonVars.sideNavClass, commonVars.organizationText);
  checkElementWithClassAndText(commonVars.sideNavClass, commonVars.inventoryText);
  checkElementWithClassAndText(commonVars.sideNavClass, commonVars.trackingText);
  checkElementWithClassAndText(commonVars.sideNavClass, commonVars.attendanceText);
  checkElementWithClassAndText(commonVars.sideNavClass, commonVars.inspectionText);
  checkElementWithClassAndText(commonVars.sideNavClass, commonVars.orderText);
  checkElementWithClassAndText(commonVars.sideNavClass, commonVars.paymentText);
  checkElementWithClassAndText(commonVars.sideNavClass, commonVars.stockText);
  checkElementWithClassAndText(commonVars.sideNavClass, commonVars.reportText);
  checkElementWithClassAndText(commonVars.sideNavClass, commonVars.settingsText);
  checkElementWithClassAndText(commonVars.sideNavClass, commonVars.smsText);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, commonVars.searchFieldText);
  checkButtonWithClassAndIndex(commonVars.dropdownNavIconClass);
  checkButtonWithClassAndIndex(commonVars.userProfileAvatarClass);
  checkElementWithClassAndText(commonVars.tabClass, dashboard.dailyDataText);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.miscellaneousText);
  checkElementWithClassAndText(commonVars.tabClass, dashboard.salesGrowthText);
  checkElement(commonVars.cardHeadClass, commonVars.territoryTypeText);
  checkElement(commonVars.cardHeadClass, commonVars.territoryText);
  checkElement(commonVars.cardHeadClass, commonVars.userText);
  checkElement(commonVars.cardHeadClass, commonVars.dateRange);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, dashboard.dashboardserchField, 1);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, dashboard.dashboardserchField, 2);
  checkDisabledInputFielWithIndex(commonVars.textFieldType, 2)
  checkInputFieldWithTypeAndText(commonVars.textFieldType, dashboard.dashboardserchField, 3);
  checkDisabledInputFielWithIndex(commonVars.textFieldType, 3)
  checkInputFieldWithTypeAndText(commonVars.textFieldType, dashboard.startDateField, 4);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, dashboard.endDdateField, 5);
  checkElementWithClassTextAndIndex(dashboard.cardTitleClass, dashboard.outletVisitCardText, 0);
  checkButtonWithClassAndIndex(dashboard.cardIconsClass, 8);
  checkElementWithClassTextAndIndex(dashboard.cardTitleClass, dashboard.newOutletCardText, 1);
  checkButtonWithClassAndIndex(dashboard.cardIconsClass, 9);
  checkElementWithClassTextAndIndex(dashboard.cardTitleClass, dashboard.deliveryLeadTimeCardText, 2);
  checkButtonWithClassAndIndex(dashboard.cardIconsClass, 10);
  checkElementWithClassTextAndIndex(dashboard.cardTitleClass, dashboard.cancelledOrderAmountCardText, 3);
  checkButtonWithClassAndIndex(dashboard.cardIconsClass, 11);
  checkElementWithClassTextAndIndex(dashboard.cardTitleClass, dashboard.invoiceAmountCardText, 4);
  checkButtonWithClassAndIndex(dashboard.cardIconsClass, 12);
  checkElementWithClassTextAndIndex(dashboard.cardTitleClass, dashboard.totalInvoiceNumberCardText, 5);
  checkButtonWithClassAndIndex(dashboard.cardIconsClass, 13);
  checkElementWithClassTextAndIndex(dashboard.cardTitleClass, dashboard.avgInvoiceCardText, 6);
  checkButtonWithClassAndIndex(dashboard.cardIconsClass, 14);
  checkElementWithClassTextAndIndex(dashboard.cardTitleClass, dashboard.avgInvoiceItemsCardText, 7);
  checkButtonWithClassAndIndex(dashboard.cardIconsClass, 15);
  checkElementWithClassTextAndIndex(dashboard.cardHeadClass, dashboard.invoiceVsDeliveredCardText, 1);
  checkElementWithClassTextAndIndex(dashboard.cardHeadClass, dashboard.revenueCardText, 2);
  checkElementWithClassTextAndIndex(dashboard.cardHeadClass, dashboard.targetVsAchievementCardText, 3);
  checkElementWithClassTextAndIndex(dashboard.cardHeadClass, dashboard.invoiceVsShopVisitedCardText, 4);
  clickInputField(dashboard.dashboardserchField, 0);
  selectFromScrollbar(commonVars.scrollbarViewClass);
  checkEnabledInputFielWithIndex(commonVars.textFieldType, 2)
  checkDisabledInputFielWithIndex(commonVars.textFieldType, 3)
  clickInputField(dashboard.dashboardserchField, 1);
  waitForMillisecond(2000)
  selectFromScrollbar(commonVars.scrollbarViewClass);
  checkEnabledInputFielWithIndex(commonVars.textFieldType, 3)
  clickInputField(dashboard.dashboardserchField, 2);
  waitForMillisecond(2000)
  selectFromScrollbar(commonVars.scrollbarViewClass);
  checkVisibleInputFieldWithTextAndIndex(commonVars.nameField, 0);
  checkVisibleInputFieldWithTextAndIndex(commonVars.codeField, 0);
  checkVisibleInputFieldWithTextAndIndex(commonVars.newUserEmailField, 0);
  checkButtonWithTypeIndexAndClass(commonVars.password, commonVars.confirmPasswordClass, 0)
  checkButtonWithTypeIndexAndClass(commonVars.password, commonVars.confirmPasswordClass, 1)
  checkVisibleInputFieldWithTextAndIndex(commonVars.phoneNumberField, 0);
  checkVisibleInputFieldWithTextAndIndex(commonVars.addressField, 0);
  checkVisibleInputFieldWithTextAndIndex(commonVars.genderField, 0);
  checkVisibleInputFieldWithTextAndIndex(commonVars.territoryField, 0);
  checkExistingInputFieldWithTextAndIndex(commonVars.rolesField, 0);
  checkButtonWithClassAndIndex(commonVars.statusTypeClass, 0);
  checkButtonWithClassAndIndex(commonVars.permissionButtonClass, 0);
  checkVisibleElementWithClassAndText(commonVars.newUserSaveButton, commonVars.saveButtonText);
  checkVisibleElementWithClassAndText(commonVars.newUserCloseButton, commonVars.closeButtonText);
  clickButtonWithClassTextAndIndex(commonVars.newUserCloseButton, commonVars.closeButtonText);
  clickButtonWithClassAndIndex(dashboard.fieldCrossicon, 1);
  clickButtonWithClassAndIndex(dashboard.fieldCrossicon, 2);
  checkDisabledInputFielWithIndex(commonVars.textFieldType, 3)
  clickInputField(dashboard.startDateField, 0);
  selectOptionWithClassAndIndex(commonVars.calanderMonth, 'January', 0)
  selectDateFromDatePicker('January 10, 2021', 0)
  clickInputField(dashboard.endDdateField, 0);
  selectOptionWithClassAndIndex(commonVars.calanderMonth, 'August', 1)
  selectDateFromDatePicker('August 31, 2021', 1)
  waitForMillisecond(10000)
  checkElementWithClassTextAndIndex(dashboard.cardHeadClass, dashboard.invoiceVsDeliveredCardText, 1);
  checkButtonWithClassAndIndex(dashboard.pieChartClass, 0);
  checkElementWithClassTextAndIndex(dashboard.cardHeadClass, dashboard.revenueCardText, 2);
  checkButtonWithClassAndIndex(dashboard.pieChartClass, 1);
  checkElementWithClassTextAndIndex(dashboard.cardHeadClass, dashboard.targetVsAchievementCardText, 3);
  checkButtonWithClassAndIndex(dashboard.pieChartClass, 2);
  checkElementWithClassTextAndIndex(dashboard.cardHeadClass, dashboard.invoiceVsShopVisitedCardText, 4);
  checkButtonWithClassAndIndex(dashboard.pieChartClass, 3);
  clickButtonWithClassAndText(commonVars.tabClass, commonVars.miscellaneousText, null);
  checkButtonWithClassTextAndIndex(dashboard.cardHeadClass, dashboard.miscellaneousTargetVsAchievementText, 1);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  checkButtonWithClassAndIndex(dashboard.pieChartClass, 0);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, commonVars.typeText, 1);
  checkExistingInputFieldWithTextAndIndex(commonVars.territoryText, null);
  checkExistingInputFieldWithTextAndIndex(dashboard.fieldForceText, null);
  checkExistingInputFieldWithTextAndIndex(dashboard.selectProductField, null);
  checkButtonWithClassAndIndex(commonVars.datePickerClass, 0);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.doneButtonText);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.doneButtonText);
  clickButtonWithClassAndText(commonVars.tabClass, dashboard.salesGrowthText, null);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  checkButtonWithCypressSelector(dashboard.salesGrowthFilter, commonVars.filterButtonText);
  checkVisibleElementWithCypressSelector(dashboard.lineChartId);
  checkVisibleElementWithCypressSelector(dashboard.barChartId);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, commonVars.typeText, 1);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, commonVars.typeText, 2);
  checkButtonWithClassAndIndex(commonVars.datePickerClass, 0);
  checkExistingInputFieldWithTextAndIndex(commonVars.territoryText, 0);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, dashboard.fieldForceText, 7);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, dashboard.selectProductField, 9);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.doneButtonText);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.doneButtonText);
  clickButtonWithCypressSelector(dashboard.salesGrowthFilter)
  checkInputFieldWithTypeAndText(commonVars.textFieldType, commonVars.orderText, 10);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, dashboard.valueText, 11);
  checkButtonWithClassAndIndex(commonVars.datePickerClass, 1);
  checkExistingInputFieldWithTextAndIndex(commonVars.territoryText, 1);
  checkButtonWithCypressSelector(dashboard.filterDoneButton, commonVars.doneButtonText);
  checkButtonWithCypressSelector(dashboard.filterCloseButton, commonVars.closeButtonText);
  clickButtonWithCypressSelector(dashboard.filterDoneButton)
}