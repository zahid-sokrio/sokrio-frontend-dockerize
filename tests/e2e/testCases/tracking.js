import {
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkElementWithClassTextAndIndex,
  checkButtonWithCypressSelector,
  checkButtonWithClassAndIndex,
  checkLastElementWithClassAndText,
  checkButtonWithClassIndexAndScrollIntoView,
  checkElement,
  checkButtonWithClassAndText,
  checkInputFieldWithTypeAndText,
  checkElementWithClass
} from "../baseTests/validate";
import {
  clickButtonWithClassAndText,
  enterTextInInputFieldWithIndex,
  enterTextInInputField,
  clickInputField,
  clickAndSelectOptionFromList,
  clickButtonWithClassAndIndex,
  waitForMillisecond,
  enterTextInSelectedField,
  clickButtonWithCypressSelector,
  clickButtonWithTypeAndText,
  clearTextInInputFieldWithIndex,
  clickButtonWithClassIndexAndScrollIntoView,
  selectDateFromDatePicker
} from "../baseTests/action";
import {
  commonVars,
  tracking,
} from "../fixtures/constants";
import { generateDomain, generateEmail } from "../helpers/helpers";
/*
Test Case ID  : TC-8
Test Case Name: Tracking
*/

export function trackingTest() {
  checkExtensionInURL(commonVars.dashboardExtension);
  clickButtonWithClassAndText(commonVars.sideNavClass, commonVars.trackingText);
  checkExtensionInURL(tracking.trackingExtension);
  checkElementWithClassAndText(commonVars.tabClass, tracking.visitPlanText, 0);
  checkElementWithClassAndText(commonVars.tabClass, tracking.ProposedVisitPlanText, 1);
  checkElementWithClassAndText(commonVars.tabClass, tracking.fieldForceText, 2);
  checkElementWithClassAndText(commonVars.tabClass, tracking.mapViewText, 3);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  checkButtonWithClassAndText(commonVars.buttonClass, commonVars.addButtontext);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.addButtontext);
  const newVisitPlanName = generateDomain();
  enterTextInInputField(tracking.newVisitPlanNameField, newVisitPlanName);
  clickInputField(tracking.timeSpanFieldText, 0);
  clickAndSelectOptionFromList(tracking.scrollbarClass, tracking.weeklyOptionText);
  clickInputField(tracking.selectDayText, 0);
  clickAndSelectOptionFromList(tracking.scrollbarClass, tracking.dayOptionText);
  clickButtonWithClassAndIndex(commonVars.datePickerClass);
  clickButtonWithClassAndIndex(tracking.amPmClass);
  clickButtonWithClassAndIndex(commonVars.datePickerClass, 1);
  selectDateFromDatePicker('October 31, 2021', 0)
  clickInputField(tracking.searchField, 0);
  clickAndSelectOptionFromList(tracking.scrollbarClass, commonVars.territoryMirpur);
  clickInputField(tracking.searchField, 1);
  clickButtonWithClassAndIndex(tracking.createNewTextPath);
  const newUserNameField = generateDomain();
  const newUserCodeField = generateDomain();
  const newUserEmailField = generateEmail();
  enterTextInInputField(commonVars.nameField, newUserNameField);
  enterTextInInputField(commonVars.codeField, newUserCodeField);
  enterTextInInputField(commonVars.newUserEmailField, newUserEmailField);
  enterTextInSelectedField(commonVars.passwordClass, 3, commonVars.password);
  enterTextInSelectedField(commonVars.confirmPasswordClass, 8, commonVars.password);
  clickButtonWithClassAndIndex(tracking.addNewUserSaveButton);
  waitForMillisecond(3000);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.saveButtonText);
  waitForMillisecond(1000);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, newVisitPlanName, 0);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, newUserNameField, 0);
  checkElementWithClassTextAndIndex(commonVars.badgeClass, tracking.activeText, 0);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.editButtonClass, 0);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.viewOutletButtonText);
  checkElementWithClassAndText(commonVars.popUpHeadClass, tracking.viewOutletPopUpText);
  checkElementWithClassTextAndIndex(commonVars.tableHeadClassWithoutDot, commonVars.outletText, 1);
  checkElementWithClassTextAndIndex(commonVars.tableHeadClassWithoutDot, commonVars.tableHeadContentCodeText, 1);
  checkElementWithClassTextAndIndex(commonVars.tableHeadClassWithoutDot, commonVars.tableHeadContentAddressText, 1);
  checkElementWithClassTextAndIndex(commonVars.tableHeadClassWithoutDot, commonVars.viewOutletOwnerNameText, 1);
  checkElementWithClassTextAndIndex(commonVars.tableHeadClassWithoutDot, commonVars.viewOutletOwnerPhoneNumberText, 1);
  waitForMillisecond(1000);
  checkElementWithClassTextAndIndex(commonVars.tableNumberClass, commonVars.tableNavNumber, 1);
  checkButtonWithCypressSelector(tracking.viewOutletCloseButtonClass, commonVars.closeButtonText);
  clickButtonWithCypressSelector(tracking.viewOutletCloseButtonClass);
  clickButtonWithClassAndText(commonVars.buttonClass, tracking.viewDaysButtonText);
  waitForMillisecond(500);
  checkLastElementWithClassAndText(tracking.viewDaysPopperClass, tracking.viewDayPopperHead);
  checkLastElementWithClassAndText(tracking.dayTagClass, tracking.viewDaySunday);
  checkElementWithClassTextAndIndex(commonVars.badgeClass, tracking.activeText, 0);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.editButtonClass, 0);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  enterTextInInputField(tracking.filterByVisitPlanNameField, newVisitPlanName)
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, newVisitPlanName);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, newUserNameField);
  clickButtonWithClassIndexAndScrollIntoView(commonVars.editButtonClass, 0);
  clearTextInInputFieldWithIndex(tracking.newVisitPlanNameField, 0);
  const updatdVisitPlanName = generateDomain();
  enterTextInInputFieldWithIndex(tracking.newVisitPlanNameField, 0, updatdVisitPlanName);
  checkButtonWithCypressSelector(tracking.visitPlanUpdatSaveButton, commonVars.saveButtonText);
  clickButtonWithCypressSelector(tracking.visitPlanUpdatSaveButton);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, updatdVisitPlanName, 0);
  clickButtonWithClassAndText(commonVars.tabClass, tracking.ProposedVisitPlanText);
  checkExtensionInURL(tracking.proposedVisitPlansExtention);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText, 0);
  checkButtonWithClassAndIndex(tracking.checkboxClass);
  checkElement(commonVars.tableHeadClass, tracking.tableHeadContedId);
  checkElement(commonVars.tableHeadClass, tracking.tableHeadContedProposedBy);
  checkElement(commonVars.tableHeadClass, tracking.tableHeadContedTimespan);
  checkElement(commonVars.tableHeadClass, commonVars.routeText);
  checkElement(commonVars.tableHeadClass, tracking.tableHeadContedProposedDate);
  checkElement(commonVars.tableHeadClass, tracking.tableHeadContedReportingTime);
  checkElement(commonVars.tableHeadClass, tracking.tableHeadContedStartingPoint);
  checkElement(commonVars.tableHeadClass, tracking.tableHeadContedDayToVisit);
  checkElement(commonVars.tableHeadClass, commonVars.statusText);
  checkElementWithClass(commonVars.backArrowClass);
  checkButtonWithClassAndText(tracking.proposedVisitPlanViewDaysButton, tracking.viewDaysButtonText);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  checkButtonWithClassAndText(commonVars.userPopUpHeadClass, commonVars.targetPopUpBodyHeadText);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, tracking.selectNameField, 1);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, commonVars.statusText, 2)
  checkButtonWithCypressSelector(tracking.filterDoneButton, commonVars.doneButtonText);
  checkButtonWithCypressSelector(tracking.filterResetButton, commonVars.resetButtonText);
  clickButtonWithCypressSelector(tracking.filterDoneButton);
  clickButtonWithClassAndText(commonVars.tabClass, tracking.fieldForceText);
  checkExtensionInURL(tracking.fieldForceExtention);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentNameText);
  checkElement(commonVars.tableHeadClass, tracking.tableHeadContentMobileNumber);
  checkElement(commonVars.tableHeadClass, tracking.tableHeadContentTodaysPlans);
  checkElement(commonVars.tableHeadClass, commonVars.statusText);
  checkElement(commonVars.tableHeadClass, tracking.tableHeadContentTodaysTrackings);
  checkElement(commonVars.tableHeadClass, tracking.tableHeadContentTodaysAssignedOutlets);
  checkButtonWithClassAndText(commonVars.buttonClass, tracking.showTracksText);
  checkButtonWithClassAndText(commonVars.buttonClass, tracking.assignedOutletButtonText);
  clickButtonWithClassAndText(commonVars.tabClass, tracking.mapViewText, null);
  checkExtensionInURL(tracking.trackingViewMapExtension);
};