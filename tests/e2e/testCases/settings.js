import {
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkButtonWithClassAndIndex,
  checkInputFieldwithIndex,
  checkButtonWithClassTextAndIndex,
  checkButtonWithClassAndText,
} from "../baseTests/validate";
import {
  clickButtonWithClassAndIndex,
  clickButtonWithClassTextAndIndex,
  clickButtonWithTypeAndText,
} from "../baseTests/action";
import {
  commonVars,
  settings,
} from "../fixtures/constants";

/* 
Test Case ID  : TC-17
Test Case Name: Settings
*/

export function settingsTest() {
  checkExtensionInURL(commonVars.dashboardExtension);
  clickButtonWithClassTextAndIndex(commonVars.sideNavClass, commonVars.settingsText);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.miscellaneousText, 0);
  checkElementWithClassAndText(commonVars.tabClass, settings.taxonomyText, 1);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.smsText, 2);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.attendanceText, 3);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.productText, 4);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.trackingText, 5);
  checkButtonWithClassAndIndex(settings.orderApprovalButtonClass, 0);
  checkButtonWithClassAndIndex(commonVars.levelClass, 0);
  clickButtonWithClassAndIndex(settings.orderApprovalButtonClass, 0);
  clickButtonWithClassAndIndex(commonVars.levelClass, 0);
  clickButtonWithClassAndIndex(commonVars.selectedLevelFieldClass, 3);
  clickButtonWithClassTextAndIndex(commonVars.tabClass, commonVars.smsText, 0);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithClassTextAndIndex(commonVars.saveButtonClass, commonVars.saveButtonText, 0)
  checkButtonWithClassAndText(settings.smsTypeClassAnother, settings.smsTypeText);
  checkButtonWithClassAndText(settings.smsTypeClassAnother, settings.paidText);
  checkButtonWithClassAndText(settings.smsTypeClassAnother, settings.onTheWayText);
  checkButtonWithClassAndText(settings.smsTypeClassAnother, settings.deliveredText);
  checkButtonWithClassAndText(settings.smsTypeClassAnother, settings.orderAcceptedText);
  checkButtonWithClassAndText(settings.smsTypeClassAnother, settings.orderPaidText);
  checkButtonWithClassAndText(settings.smsTypeClassAnother, settings.orderOnTheWayText);
  checkButtonWithClassAndText(settings.smsTypeClassAnother, settings.orderDeliveredText);
  clickButtonWithClassTextAndIndex(settings.smsTypeClass, settings.smsTypeText, 0);
  checkButtonWithClassAndIndex(settings.enableButtonClass, 0);
  checkInputFieldwithIndex(settings.messageTypeField, 1);
  checkButtonWithClassAndIndex(settings.buyerClass, 0);
  clickButtonWithClassAndIndex(settings.enableButtonClass, 0);
  clickButtonWithClassAndIndex(settings.buyerClass, 0);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  checkButtonWithClassAndIndex(settings.promptClass, 0);
}