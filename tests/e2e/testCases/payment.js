import {
  checkButtonWithTypeAndText,
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkButtonWithClassAndIndex,
  checkInputFieldwithIndex,
} from "../baseTests/validate";
import {
  clickButtonWithClassTextAndIndex,
  clickButtonWithTypeAndText,
  clickButtonWithClassAndTextBeforeText,
} from "../baseTests/action";
import {
  commonVars,
  payment,
} from "../fixtures/constants";

/* 
Test Case ID  : TC-13
Test Case Name: Payment
*/

export function paymentTest() {
  checkExtensionInURL(commonVars.dashboardExtension);
  clickButtonWithClassTextAndIndex(commonVars.sideNavClass, commonVars.paymentText);
  checkElementWithClassAndText(payment.paymentTabClass, commonVars.paymentText, 0);
  checkElementWithClassAndText(payment.paymentTabClass, payment.advancePaymentText, 1);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithTypeAndText(commonVars.buttonType, payment.createButtontext);
  checkButtonWithClassAndIndex(commonVars.tableHeadUserClass, 0);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.slText, 0);
  //checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.invoiceCodeText, 1);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.lastPaymentDateText, 2)
  checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.invoiceDateText, 3);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.collectedByText, 4);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.departmentIdText, 5);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.departmentNameText, 6);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.invoiceAmtText, 7);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.paidAmtText, 8)
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.dueText, 9);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.statusText, 10);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.actionText, 11);
  clickButtonWithTypeAndText(commonVars.buttonType, payment.createButtontext);
  checkElementWithClassAndText(commonVars.popUpHeadClass, payment.paymentPopUpBodyHeadText)
  checkInputFieldwithIndex(payment.paymentMethodField, 0);
  checkInputFieldwithIndex(commonVars.departmentText, 1);
  checkInputFieldwithIndex(commonVars.invoiceText, 2);
  checkInputFieldwithIndex(commonVars.tableHeadContentAmountText, 3);
  checkButtonWithClassAndIndex(commonVars.datePickerClass, 0);
  checkButtonWithClassAndIndex(commonVars.rememberMeClass, 0);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText, 3);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText, 2);
  clickButtonWithClassTextAndIndex(commonVars.closeButtonClass, commonVars.closeButtonText, null);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithClassAndIndex(commonVars.tableHeadUserClass, 0);
  clickButtonWithClassAndTextBeforeText(commonVars.tabClass, payment.advancePaymentText, 1);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.methodText, 0)
  checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.advanceText, 1);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.createdByText, 2);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.buyerText, 3);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, payment.paidAtText, 4);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentCreatedAtText, 5);
}
