import {
  checkButtonWithTypeAndText,
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkButtonWithClassAndIndex,
  checkTextareaWithTextAndIndex,
  checkElementWithClassTextAndIndex,
  checkElement,
} from "../baseTests/validate";
import {
  clickButtonWithClassAndText,
  clickButtonWithClassAndIndex,
  clickButtonWithCypressSelector,
  enterTextInTextareaWithPlaceholder,
  waitForMillisecond,
} from "../baseTests/action";
import {
  commonVars,
  attendance,
} from "../fixtures/constants";
import { generateDomain } from "../helpers/helpers";

/*
 Test Case ID  : TC-12
 Test Case Name: Attendance
*/

export function attendanceTest() {
  checkExtensionInURL(commonVars.dashboardExtension);
  clickButtonWithClassAndText(commonVars.sideNavClass, commonVars.attendanceText);
  checkExtensionInURL(attendance.attendanceExtention);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.attendanceText);
  checkElementWithClassAndText(commonVars.tabClass, attendance.leaveText);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithClassAndIndex(attendance.calanderLeftArrowClass);
  checkButtonWithClassAndIndex(attendance.calanderRightArrowClass);
  checkButtonWithClassAndIndex(attendance.calanderCardClass);
  clickButtonWithCypressSelector(attendance.date);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentNameText);
  checkElement(commonVars.tableHeadClass, attendance.firstCheckInText);
  checkElement(commonVars.tableHeadClass, attendance.lastCheckInText);
  clickButtonWithClassAndIndex(commonVars.backArrowClass);
  clickButtonWithClassAndIndex(attendance.calanderLeftArrowClass);
  clickButtonWithClassAndIndex(attendance.calanderRightArrowClass);
  clickButtonWithClassAndIndex(attendance.calanderRightArrowClass);
  clickButtonWithClassAndIndex(attendance.calanderLeftArrowClass);
  clickButtonWithClassAndText(commonVars.tabClass, attendance.leaveText);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithTypeAndText(commonVars.buttonType, attendance.takeLeaveButtonText);
  checkElementWithClassAndText(commonVars.cardClass, attendance.leaveTableHead);
  checkElement(commonVars.tableHeadClass, attendance.reasonText);
  checkElement(commonVars.tableHeadClass, commonVars.statusText);
  checkElement(commonVars.tableHeadClass, attendance.approvedAtText);
  checkElement(commonVars.tableHeadClass, attendance.actorText);
  checkElement(commonVars.tableHeadClass, attendance.requestedAtText);
  waitForMillisecond(10);
  checkButtonWithClassAndIndex(commonVars.editButtonClass, null);
  checkButtonWithClassAndIndex(attendance.crossIconClass, null);
  clickButtonWithClassAndText(commonVars.buttonClass, attendance.takeLeaveButtonText);
  checkTextareaWithTextAndIndex(attendance.leaveReasonTextField);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.submitButtontext);
  const leaveReason = generateDomain();
  enterTextInTextareaWithPlaceholder(attendance.leaveReasonTextField, leaveReason);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.submitButtontext);
  waitForMillisecond(500);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, leaveReason, 0);
  checkElementWithClassTextAndIndex(attendance.badgeClass, commonVars.pendingText);
  checkButtonWithClassAndIndex(attendance.approveLeaveRequestClass, 0);
  clickButtonWithClassAndIndex(attendance.approveLeaveRequestClass, 0);
  checkElementWithClassAndText(commonVars.popUpBodyClass, attendance.approvePopUpText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, attendance.approveButtonText);
  clickButtonWithClassAndText(commonVars.buttonClass, attendance.approveButtonText);
  checkElementWithClassTextAndIndex(attendance.badgeClass, attendance.approvedStatusText);
  checkButtonWithClassAndIndex(attendance.crossIconClass, 0);
  clickButtonWithClassAndIndex(attendance.crossIconClass, 0);
  checkElementWithClassAndText(commonVars.popUpBodyClass, attendance.rejectPopUpText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, attendance.rejectButtonText);
  clickButtonWithClassAndText(commonVars.buttonClass, attendance.rejectButtonText);
  checkElementWithClassTextAndIndex(attendance.badgeClass, attendance.rejectedText);
  checkButtonWithClassAndIndex(attendance.approveLeaveRequestClass, 0);
};
