import {
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkButtonWithTypeAndText,
  checkButtonWithClassAndIndex,
  checkInputFieldwithIndex,
} from "../baseTests/validate";
import {
  enterTextInInputField,
  clickButtonWithClassAndIndex,
  clickButtonWithClassTextAndIndex,
  clickButtonWithTypeAndText,
  waitForMillisecond,
  clickAndSelectOptionFromList,
  enterTextInSelectedField,
  clearTextInInputFieldWithIndex,
  clickButtonWithClassAndText,
  selectFromScrollbar,
  clickInputField,
  enterTextInInputFieldWithIndex,
  clickElementWithASelectorAndText,
  selectLastElementFromScrollbar,
  enterTextInTextareaWithPlaceholder,
} from "../baseTests/action";
import {
  commonVars,
  department,
} from "../fixtures/constants";
import { generateName, generateDomain, generatePhoneNo, generateCode, generatepercentage } from "../helpers/helpers";

/* 
Test Case ID  : TC-9
Test Case Name: Department Test
*/

export function departmentTest() {
  checkExtensionInURL(commonVars.dashboardExtension);
  clickButtonWithClassTextAndIndex(commonVars.sideNavClass, commonVars.organizationText);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.territoryTypeText, 0)
  checkElementWithClassAndText(commonVars.tabClass, commonVars.territoryText, 1)
  checkElementWithClassAndText(commonVars.tabClass, department.channelText, 2)
  checkElementWithClassAndText(commonVars.tabClass, commonVars.departmentText, 3)
  checkElementWithClassAndText(commonVars.tabClass, commonVars.badgeText, 4)
  clickButtonWithClassTextAndIndex(commonVars.tabClass, commonVars.departmentText);
  waitForMillisecond(5000);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentNameText, 0);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentCodeText, 1);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.territoryText, 2);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, department.typeText, 3)
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.badgeText, 4);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, department.staffText, 5)
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentCreatedAtText, 6);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, department.visitableText, 7);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  clickButtonWithClassAndIndex(department.filterSearchField, 0);
  clickAndSelectOptionFromList(department.filterDropdownClass, commonVars.tableHeadContentNameText);
  enterTextInSelectedField(department.filterSearchField, 0, department.warehouseText);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  checkElementWithClassAndText(department.tableClass, department.warehouseText);
  waitForMillisecond(1000);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  clearTextInInputFieldWithIndex(department.filterSearchFieldPlaceholder, 0);
  clickAndSelectOptionFromList(department.filterDropdownClass, commonVars.tableHeadContentCodeText);
  enterTextInSelectedField(department.filterSearchField, 0, department.codeNo);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  checkElementWithClassAndText(department.tableClass, department.codeNo);
  waitForMillisecond(1000);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  clearTextInInputFieldWithIndex(department.filterSearchFieldPlaceholder, 0);
  clickButtonWithClassAndIndex(department.filterSearchField, 1);
  clickAndSelectOptionFromList(department.filterDropdownClass, department.creditLimitGreaterThanText);
  enterTextInSelectedField(department.filterSearchField, 1, department.number);
  waitForMillisecond(2000);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  clearTextInInputFieldWithIndex(department.creditLimitPlaceholder, 0);
  clickButtonWithClassAndText(department.filterDropdownClass, department.creditLimitLessThanText);
  enterTextInSelectedField(department.filterSearchField, 1, department.number);
  waitForMillisecond(2000);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  clearTextInInputFieldWithIndex(department.creditLimitPlaceholder, 0);
  clickButtonWithClassAndText(department.filterDropdownClass, department.outstandingBalGreaterThanText);
  enterTextInSelectedField(department.filterSearchField, 1, department.number);
  waitForMillisecond(2000);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  clearTextInInputFieldWithIndex(department.creditLimitPlaceholder, 0);
  clickButtonWithClassAndText(department.filterDropdownClass, department.outstandingBalLessThanText);
  enterTextInSelectedField(department.filterSearchField, 1, department.number);
  waitForMillisecond(2000);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  clearTextInInputFieldWithIndex(department.creditLimitPlaceholder, 0);
  clickButtonWithClassAndIndex(department.filterSearchField, 2);
  clickAndSelectOptionFromList(department.badgeDropDownClass, department.badge);
  waitForMillisecond(2000);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  //checkElementWithClassAndText(department.tableClass, department.badge);
  waitForMillisecond(1000);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.resetButtonText);
  clickButtonWithClassAndIndex(department.filterSearchField, 3);
  clickAndSelectOptionFromList(department.badgeDropDownClass, department.departmentType);
  waitForMillisecond(2000);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  checkElementWithClassAndText(department.tableClass, department.departmentType);
  waitForMillisecond(1000);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.resetButtonText);
  clickButtonWithClassAndIndex(department.filterSearchField, 4);
  clickAndSelectOptionFromList(department.badgeDropDownClass, department.territoryType);
  waitForMillisecond(2000);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  waitForMillisecond(1000);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.resetButtonText);
  clickButtonWithClassAndIndex(department.filterSearchField, 5);
  clickAndSelectOptionFromList(department.badgeDropDownClass, department.territory);
  waitForMillisecond(2000);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  waitForMillisecond(1000);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.resetButtonText);
  clickButtonWithClassAndIndex(department.filterSearchField, 6);
  clickAndSelectOptionFromList(department.badgeDropDownClass, department.manager);
  waitForMillisecond(2000);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  waitForMillisecond(1000);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.resetButtonText);
  clickButtonWithClassAndIndex(department.filterSearchField, 7);
  clickAndSelectOptionFromList(department.badgeDropDownClass, department.createdBy);
  waitForMillisecond(2000);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  waitForMillisecond(1000);
  //Channel
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.addButtontext);
  checkInputFieldwithIndex(department.newDepartmentText, 0);
  checkInputFieldwithIndex(department.bulkDepartmentsText, 0);
  checkInputFieldwithIndex(department.downloadBulkFormatText, 0);
  clickButtonWithClassTextAndIndex(department.addModalClass, department.newDepartmentText)
  checkInputFieldwithIndex(department.departmentNameText, 0);
  checkInputFieldwithIndex(department.departmentCodeText, 0);
  checkInputFieldwithIndex(department.ownerNameText, 0);
  checkInputFieldwithIndex(department.ownerPhoneText, 0);
  checkInputFieldwithIndex(department.channelText, 0);
  checkInputFieldwithIndex(department.badgeOptionalText, 0);
  checkInputFieldwithIndex(commonVars.territoryText, 0);
  checkInputFieldwithIndex(department.supplierText, 0);
  checkInputFieldwithIndex(department.staffText, 0);
  checkInputFieldwithIndex(department.outstandingBalanceOptionalText, 0);
  checkInputFieldwithIndex(department.creditLimitOptional, 0);
  checkInputFieldwithIndex(department.latitudeOptionalText, 0);
  checkInputFieldwithIndex(department.longitudeOptionalText, 0);
  checkInputFieldwithIndex(department.visitableText, 0);
  checkInputFieldwithIndex(department.addressOptionalText, 0);
  checkInputFieldwithIndex(department.imageOptionalText, 0);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  const departmentName = generateDomain();
  enterTextInInputField(department.departmentNameField, departmentName);
  const departmentCode = generateCode();
  enterTextInInputField(department.departmentCodeField, departmentCode);
  const ownerName = generateDomain();
  enterTextInInputFieldWithIndex(commonVars.nameField, 0, ownerName);
  const ownerNumber = generatePhoneNo();
  enterTextInInputField(commonVars.numberField, ownerNumber);
  clickInputField(commonVars.selectButtonText, 0);
  selectFromScrollbar(commonVars.scrollbarViewClass);
  const channelName = generateDomain();
  enterTextInInputField(department.newChannelNameField, channelName);
  const channelLabel = generateDomain();
  enterTextInInputField(department.newChannelLabelField, channelLabel);
  clickElementWithASelectorAndText(department.newChannelSaveButton, commonVars.saveButtonText)
  clickInputField(commonVars.searchField, 0);
  selectFromScrollbar(commonVars.scrollbarViewClass);
  const batchName = generateDomain();
  enterTextInInputField(department.newBadgeNameField, batchName);
  clearTextInInputFieldWithIndex(commonVars.addproductToBatchTextField, 0);
  const mrpDiscount = generatepercentage();
  enterTextInInputField(commonVars.addproductToBatchTextField, mrpDiscount);
  clickElementWithASelectorAndText(department.newBadgeSaveButton, commonVars.saveButtonText)
  clickInputField(department.searchFieldTextWithSpaceIncluded, 0);
  waitForMillisecond(1000);
  selectLastElementFromScrollbar(commonVars.scrollbarViewClass);
  clickInputField(department.searchSupplierField, 0);
  waitForMillisecond(1000);
  selectFromScrollbar(commonVars.scrollbarViewClass);
  clickInputField(department.searchFieldTextWithSpaceIncluded, 1);
  selectLastElementFromScrollbar(commonVars.scrollbarViewClass);
  const outStandingBalance = generateCode();
  enterTextInInputFieldWithIndex(department.outStandingBalanceField, 0, outStandingBalance);
  const creditLimit = generateCode();
  enterTextInInputFieldWithIndex(department.outStandingBalanceField, 1, creditLimit);
  const latitude = generateCode();
  enterTextInInputFieldWithIndex(department.latitudeField, 0, latitude);
  const longitude = generateCode();
  enterTextInInputFieldWithIndex(department.longitudeField, 0, longitude);
  clickButtonWithClassAndIndex(commonVars.statusTypeClass, 1);
  const address = generateDomain();
  enterTextInTextareaWithPlaceholder(commonVars.address, address);
  clickButtonWithClassTextAndIndex(department.newDepartmentSaveButtonClass, commonVars.saveButtonText);
  //Badge
  clickButtonWithClassTextAndIndex(commonVars.tabClass, commonVars.badgeText);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.addButtontext);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentNameText, 0);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, department.mrpDiscountText, 1);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentCreatedAtText, 2);
  checkButtonWithClassAndIndex(commonVars.updateIconClass, 0);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.addButtontext);
  checkElementWithClassAndText(department.modalClass, commonVars.tableHeadContentNameText, 0);
  checkElementWithClassAndText(department.modalClass, department.mrpDiscountText, 1);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  const name = generateName();
  enterTextInSelectedField(commonVars.confirmPasswordClass, 1, name);
  enterTextInSelectedField(commonVars.confirmPasswordClass, 2, department.mrpDiscountPercentage);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  waitForMillisecond(2000);
  checkButtonWithClassAndIndex(commonVars.tableRowClass, 0);
  clickButtonWithClassAndIndex(commonVars.updateIconClass, 0);
  enterTextInSelectedField(commonVars.confirmPasswordClass, 2, department.mrpDiscountPercentageUpdate);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  waitForMillisecond(2000);
  checkButtonWithClassAndIndex(commonVars.tableRowClass, 0);
}