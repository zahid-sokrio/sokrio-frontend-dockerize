import {
  checkButtonWithTypeAndText,
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkInputFieldWithTypeAndText,
  checkButtonWithClassAndIndex,
  checkElement,
  checkButtonWithClassIndexAndPlaceholder,
  checkElementWithClassTextAndIndex,
} from "../baseTests/validate";
import {
  clickButtonWithClassAndText,
  clickButtonWithClassAndIndex,
  enterTextInInputFieldWithIndex,
} from "../baseTests/action";
import {
  commonVars,
  stock,
} from "../fixtures/constants";

/*
 Test Case ID  : TC-14
 Test Case Name: Stock
*/

export function stockTest() {
  checkExtensionInURL(commonVars.dashboardExtension);
  clickButtonWithClassAndText(commonVars.sideNavClass, commonVars.stockText);
  checkExtensionInURL(stock.stockExtension);
  checkElement(commonVars.cardHeadClass, stock.tableHeadText);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.filterButtonText);
  checkElement(commonVars.tableHeadClass, commonVars.productText);
  checkElement(commonVars.tableHeadClass, commonVars.departmentText);
  checkElement(commonVars.tableHeadClass, stock.tableHeadContentMrpText);
  checkElement(commonVars.tableHeadClass, stock.tableHeadContentDeliveredText);
  checkElement(commonVars.tableHeadClass, commonVars.pendingText);
  checkElement(commonVars.tableHeadClass, stock.tableHeadContentAvalilableText);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  checkButtonWithClassIndexAndPlaceholder(commonVars.levelClass, commonVars.departmentText, 0);
  checkButtonWithClassIndexAndPlaceholder(commonVars.levelClass, commonVars.productBrandFieldText, 1);
  checkButtonWithClassIndexAndPlaceholder(commonVars.levelClass, commonVars.productCategoryFieldText, 3);
  checkButtonWithClassIndexAndPlaceholder(commonVars.levelClass, stock.varientCategoryFieldText, 5);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, commonVars.productFieldText, 14);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, stock.productBatchText, 15);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, stock.varientFieldText, 16);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, stock.pendingPercentFieldText, 17);
  checkElementWithClassAndText(commonVars.rememberMeClass, stock.withPromotionOptionText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  enterTextInInputFieldWithIndex(commonVars.productFieldText, 0, stock.cameliaSoapText);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.doneButtonText);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, stock.cameliaSoapText, 0);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.resetButtonText);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.doneButtonText);
  clickButtonWithClassAndIndex(stock.userTableCellClass, 0);
  checkElementWithClassAndText(commonVars.popUpHeadClass, stock.productDetailsText);
  checkElementWithClassAndText(stock.productDetailCloseButtonClass, commonVars.closeButtonText);
  clickButtonWithClassAndIndex(stock.productDetailCloseButtonClass);
  clickButtonWithClassAndIndex(stock.userTableCellClass, 1);
  checkElementWithClassAndText(commonVars.popUpHeadClass, stock.departmentDetailsText);
  checkElementWithClassAndText(stock.productDetailCloseButtonClass, commonVars.closeButtonText);
  clickButtonWithClassAndIndex(stock.productDetailCloseButtonClass);
};