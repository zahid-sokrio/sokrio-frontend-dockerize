import {
    checkButtonWithTypeAndText,
    checkElementWithClassAndText,
    checkExtensionInURL,
    checkButtonWithClassAndIndex,
    checkButtonWithClassTextAndIndex,
    checkElement,
    checkInputFieldwithIndex,
    checkVisibleElementWithClassAndText,
} from "../baseTests/validate";
import {
    clickButtonWithClassAndIndex,
    clickButtonWithClassTextAndIndex,
    clickButtonWithTypeAndText,
    clickButtonWithClassAndText,
    waitForMillisecond,
    enterTextInInputFieldWithIndex,
    clickInputField,
    selectFromScrollbar,
    clearTextInInputFieldWithTypeAndIndex,
    selectOptionWithClassAndIndex,
    selectDateFromDatePicker,
} from "../baseTests/action";
import {
    commonVars,
    target
} from "../fixtures/constants";

/*
Test Case ID  : TC-7
Test Case Name: Target
*/

export function targetTest() {
    checkExtensionInURL(commonVars.dashboardExtension);
    clickButtonWithClassAndIndex(commonVars.shortcutIconClass, 0);
    checkButtonWithClassTextAndIndex(target.shortcutIconClass, commonVars.departmentText, 0);
    checkButtonWithClassTextAndIndex(target.shortcutIconClass, target.productsText, 0);
    checkButtonWithClassTextAndIndex(target.shortcutIconClass, target.requisitionText, 0);
    checkButtonWithClassTextAndIndex(target.shortcutIconClass, commonVars.territoryText, 0);
    checkButtonWithClassTextAndIndex(target.shortcutIconClass, target.invoicesText, 0);
    checkButtonWithClassTextAndIndex(target.shortcutIconClass, commonVars.targetText, 0);
    clickButtonWithClassTextAndIndex(commonVars.targetButtonClass, commonVars.targetButtonText, 0);
    checkElementWithClassAndText(target.targetTableHeadClass, commonVars.tableHeadContentNameText, 0);
    checkButtonWithClassAndIndex(commonVars.infoIconClass);
    checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
    checkButtonWithTypeAndText(commonVars.buttonType, commonVars.filterButtonText);
    checkButtonWithTypeAndText(commonVars.buttonType, commonVars.addButtontext);
    checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentNameText);
    checkElement(commonVars.tableHeadClass, target.tableHeadContentTypeText);
    checkElement(commonVars.tableHeadClass, target.tableHeadContentSchemeText);
    checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentAmountText);
    checkElement(commonVars.tableHeadClass, target.tableHeadContentAchievedText);
    checkElement(commonVars.tableHeadClass, target.tableHeadContentStartfromText);
    checkElement(commonVars.tableHeadClass, target.tableHeadContentExpiersAtText);
    checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
    clickButtonWithClassAndIndex(commonVars.rolePermissionButtonClass, 0);
    clickButtonWithClassAndText(target.closeButtonClass, commonVars.closeButtonText);
    waitForMillisecond(2000);
    clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
    checkInputFieldwithIndex(target.tableHeadContentTypeText, 0);
    checkInputFieldwithIndex(target.tableHeadContentTypeText, 1);
    checkInputFieldwithIndex(target.targetTargetTypeField, 2);
    checkInputFieldwithIndex(target.targetNameTypeField, 3);
    checkInputFieldwithIndex(target.targetAssigneeRoleTypeField, 4);
    checkInputFieldwithIndex(commonVars.datePickerClass, 5);
    checkInputFieldwithIndex(commonVars.datePickerClass, 6);
    checkInputFieldwithIndex(target.targetUnitTypeField, 7);
    checkInputFieldwithIndex(commonVars.statusText, 8);
    checkButtonWithClassTextAndIndex(target.doneButtonClass, commonVars.doneButtonText, 2);
    checkButtonWithClassTextAndIndex(commonVars.resetButtonClass, commonVars.resetButtonText, 3);
    clickButtonWithClassAndIndex(commonVars.selectedLevelFieldClass, 2);
    clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.doneButtonText, 0);
    clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.addButtontext);
    checkInputFieldwithIndex(target.targetTypeField, 0);
    checkInputFieldwithIndex(target.schemeTypeField, 1);
    checkInputFieldwithIndex(target.amountTypeField, 2);
    checkInputFieldwithIndex(target.targetTypeField, 3);
    checkInputFieldwithIndex(target.dateTypeClass, 4);
    checkInputFieldwithIndex(target.dateTypeClass, 5);
    checkInputFieldwithIndex(target.assignToTypeClass, 6);
    checkButtonWithClassAndIndex(target.statusTypeClass, 0);
    checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText, 0)
    checkButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText, 0)
    clickButtonWithClassAndIndex(target.targetTypeClass, 0);
    clickButtonWithClassAndText(target.scemeTypeClass, commonVars.deliveryText);
    clickButtonWithClassAndIndex(target.targetTypeClass, 1);
    clickButtonWithClassAndText(target.scemeTypeClass, target.onetimeText);
    clearTextInInputFieldWithTypeAndIndex(commonVars.numberType, 0);
    enterTextInInputFieldWithIndex(target.amountPlaceHolder, 0, target.cost);
    clickButtonWithClassAndIndex(target.targetTypeClass, 2);
    clickButtonWithClassAndText(target.scemeTypeClass, target.amountText);
    clickButtonWithClassAndIndex(target.amountClass, 2);
    clickButtonWithClassAndIndex(target.nextMonth, 0);
    clickButtonWithClassAndIndex(target.startDateClass, 10);
    clickButtonWithClassAndIndex(commonVars.datePickerClass, 1);
    selectOptionWithClassAndIndex(commonVars.calanderMonth, 'December', 1);
    selectDateFromDatePicker('December 31, 2021', 1);
    clickButtonWithClassAndIndex(target.targetTypeClass, 3);
    clickButtonWithClassAndText(commonVars.selectedLevelFieldClass, target.assignName);
    clickButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
    checkElementWithClassAndText(target.successClass, target.successText);
    waitForMillisecond(2000);
    clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.addButtontext);
    clickButtonWithClassAndIndex(target.targetTypeClass, 0);
    clickButtonWithClassAndText(target.scemeTypeClass, commonVars.invoiceText);
    clickButtonWithClassAndIndex(target.targetTypeClass, 1);
    clickButtonWithClassAndText(target.scemeTypeClass, target.onetimeText);
    clearTextInInputFieldWithTypeAndIndex(commonVars.numberType, 0);
    enterTextInInputFieldWithIndex(target.amountPlaceHolder, 0, target.cost);
    clickButtonWithClassAndIndex(target.targetTypeClass, 2);
    clickButtonWithClassAndText(target.scemeTypeClass, target.amountText);
    clickButtonWithClassAndIndex(target.amountClass, 2);
    clickButtonWithClassAndIndex(target.nextMonth, 0);
    clickButtonWithClassAndIndex(target.startDateClass, 10);
    clickButtonWithClassAndIndex(commonVars.datePickerClass, 1);
    selectOptionWithClassAndIndex(commonVars.calanderMonth, 'December', 1);
    selectDateFromDatePicker('December 31, 2021', 1);
    clickButtonWithClassAndIndex(target.targetTypeClass, 3);
    clickButtonWithClassAndText(commonVars.selectedLevelFieldClass, target.assignName);
    clickButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
    checkElementWithClassAndText(target.successClass, target.successText);
    waitForMillisecond(2000);
    clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.addButtontext);
    clickButtonWithClassAndIndex(target.targetTypeClass, 0);
    clickButtonWithClassAndText(target.scemeTypeClass, commonVars.productText);
    clickButtonWithClassAndIndex(target.targetTypeClass, 1);
    clickButtonWithClassAndText(target.scemeTypeClass, target.onetimeText);
    clickButtonWithClassAndIndex(target.targetTypeClass, 2);
    clickButtonWithClassAndText(target.scemeTypeClass, target.amountText);
    clickInputField(target.fieldPlaceholder, 0);
    selectFromScrollbar(commonVars.scrollbarViewClass);
    enterTextInInputFieldWithIndex(target.productAmountPlaceHolder, 0, target.cost);
    clickButtonWithClassAndIndex(commonVars.levelButtonClass, 4);
    selectFromScrollbar(commonVars.scrollbarViewClass);
    clickButtonWithClassAndIndex(target.nextMonth, 0);
    clickButtonWithClassAndIndex(target.startDateClass, 10);
    clickButtonWithClassAndIndex(target.amountClass, 3);
    clickButtonWithClassAndIndex(target.nextMonth, 1);
    clickButtonWithClassAndIndex(commonVars.datePickerClass, 1);
    selectOptionWithClassAndIndex(commonVars.calanderMonth, 'December', 1);
    selectDateFromDatePicker('December 31, 2021', 1);
    clickButtonWithClassAndIndex(target.targetTypeClass, 3);
    clickButtonWithClassAndText(commonVars.selectedLevelFieldClass, target.assignName);
    clickButtonWithClassAndText(commonVars.saveButtonClass, commonVars.saveButtonText);
    checkElementWithClassAndText(target.successClass, target.successText);
    waitForMillisecond(2000);
    clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.addButtontext);
    clickButtonWithClassAndIndex(target.targetTypeClass, 0);
    clickButtonWithClassAndText(target.scemeTypeClass, commonVars.visitText);
    clickButtonWithClassAndIndex(target.targetTypeClass, 1);
    clickButtonWithClassAndText(target.scemeTypeClass, target.onetimeText);
    clearTextInInputFieldWithTypeAndIndex(commonVars.numberType, 0);
    enterTextInInputFieldWithIndex(target.amountPlaceHolder, 0, target.cost);
    clickButtonWithClassAndIndex(target.amountClass, 2);
    clickButtonWithClassAndIndex(target.nextMonth, 0);
    clickButtonWithClassAndIndex(target.startDateClass, 10);
    clickButtonWithClassAndIndex(target.amountClass, 3);
    clickButtonWithClassAndIndex(target.nextMonth, 1);
    clickButtonWithClassAndIndex(commonVars.datePickerClass, 1);
    selectOptionWithClassAndIndex(commonVars.calanderMonth, 'December', 1);
    selectDateFromDatePicker('December 31, 2021', 1);
    clickButtonWithClassAndIndex(target.targetTypeClass, 3);
    clickButtonWithClassAndText(commonVars.selectedLevelFieldClass, target.assignName);
    clickButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
    checkElementWithClassAndText(target.successClass, target.successText);
}
