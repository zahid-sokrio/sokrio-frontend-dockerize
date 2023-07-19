import {
  checkButtonWithTypeAndText,
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkInputFieldWithTypeAndText,
  checkButtonWithClassAndIndex,
  checkElement,
  checkElementWithClassTextAndIndex,
} from "../baseTests/validate";
import {
  clickButtonWithClassAndText,
  clickButtonWithClassAndIndex,
  clickButtonWithIdAndIndex,
  enterTextInInputFieldWithIndex,
  waitForMillisecond,
  clearTextInInputFieldWithIndex,
} from "../baseTests/action";
import {
  commonVars,
  role,
} from "../fixtures/constants";
import { generateDomain } from "../helpers/helpers";

/* 
  Test Case ID  : TC-6
  Test Case Name: Role
*/

export function roleTest() {
  checkExtensionInURL(commonVars.dashboardExtension);
  clickButtonWithClassAndText(commonVars.sideNavClass, commonVars.userText);
  checkExtensionInURL(role.userExtension);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.roleText, 0);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.userText, 1);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.targetText, 2);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.travelAllowanceText, 3);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.transportText, 4);
  clickButtonWithClassAndText(commonVars.tabClass, commonVars.roleText, 0);
  checkExtensionInURL(role.userRoleExtension);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.addButtontext);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentNameText);
  checkElement(commonVars.tableHeadClass, role.tableHeadContentLabelText);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentCreatedAtText);
  checkButtonWithClassAndIndex(commonVars.eyeButtonClass, null);
  checkButtonWithClassAndIndex(commonVars.editButtonClass, null);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.addButtontext);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, role.nameFieldText, 3);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, role.labelFieldText, 4);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.permissionsButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  const roleName = generateDomain();
  const roleLabel = generateDomain();
  enterTextInInputFieldWithIndex(role.nameFieldText, 0, roleName);
  enterTextInInputFieldWithIndex(role.labelFieldText, 0, roleLabel);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.permissionsButtonText);
  checkElementWithClassAndText(commonVars.popUpHeadClass, role.permissionPopUpBodyHeadText, 1);
  checkElementWithClassAndText(role.permissionSelectionHeadClass, role.webApplicationText);
  checkElementWithClassAndText(role.permissionSelectionHeadClass, role.mobileApplicationText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  clickButtonWithClassAndIndex(role.permissionCheckBoxClass, 1);
  waitForMillisecond(2000);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.saveButtonText);
  clickButtonWithClassAndText(role.addRolePopUpSaveButtonClass, commonVars.saveButtonText);
  waitForMillisecond(2000);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, roleName, 0);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, roleLabel, 0);
  clickButtonWithClassAndIndex(commonVars.eyeButtonClass);
  checkElementWithClassAndText(commonVars.listClass, role.dailyDataDashboardText)
  checkElementWithClassAndText(commonVars.listClass, role.miscellaneousDashboardText);
  checkElementWithClassAndText(commonVars.listClass, role.salesGrowthDashboardText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkElementWithClassAndText(commonVars.popUpHeadClass, commonVars.permissionsButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.cornerCloseButtonText);
  clickButtonWithIdAndIndex(role.closeButton);
  clickButtonWithClassAndIndex(commonVars.editButtonClass);
  checkElementWithClassAndText(commonVars.popUpHeadClass, role.roleUpdatePopUpHead);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, role.nameFieldText, 3);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, role.labelFieldText, 4);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.permissionsButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  clearTextInInputFieldWithIndex(role.nameFieldText, 0);
  clearTextInInputFieldWithIndex(role.labelFieldText, 0);
  const updatedRoleName = generateDomain();
  const updatedRoleLabel = generateDomain();
  enterTextInInputFieldWithIndex(role.nameFieldText, 0, updatedRoleName);
  enterTextInInputFieldWithIndex(role.labelFieldText, 0, updatedRoleLabel);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.permissionsButtonText);
  checkElementWithClassAndText(commonVars.popUpHeadClass, role.permissionPopUpBodyHeadText, 1);
  checkElementWithClassAndText(role.permissionSelectionHeadClass, role.webApplicationText);
  checkElementWithClassAndText(role.permissionSelectionHeadClass, role.mobileApplicationText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  clickButtonWithClassAndIndex(role.permissionCheckBoxClass, 5);
  waitForMillisecond(2000);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.saveButtonText);
  clickButtonWithClassAndText(role.addRolePopUpSaveButtonClass, commonVars.saveButtonText);
  waitForMillisecond(2000);
  clickButtonWithClassAndIndex(commonVars.eyeButtonClass);
  checkElementWithClassAndText(commonVars.listClass, role.dailyDataDashboardText);
  checkElementWithClassAndText(commonVars.listClass, role.miscellaneousDashboardText);
  checkElementWithClassAndText(commonVars.listClass, role.salesGrowthDashboardText);
  checkElementWithClassAndText(commonVars.listClass, role.CreateTerritoryTypeText);
  checkElementWithClassAndText(commonVars.listClass, role.ViewTerritoryTypeText);
  checkElementWithClassAndText(commonVars.listClass, role.updateTerritoryTypeText);
  checkElementWithClassAndText(commonVars.listClass, role.deleteTerritoryTypeText);
  checkElementWithClassAndText(commonVars.listClass, role.createTerritoryText);
  checkElementWithClassAndText(commonVars.listClass, role.viewTerritoryText);
  checkElementWithClassAndText(commonVars.listClass, role.updateTerritoryText);
  checkElementWithClassAndText(commonVars.listClass, role.deleteTerritoryText);
  checkElementWithClassAndText(commonVars.listClass, role.createChannelText);
  checkElementWithClassAndText(commonVars.listClass, role.viewChannelText);
  checkElementWithClassAndText(commonVars.listClass, role.updateChannelText);
  checkElementWithClassAndText(commonVars.listClass, role.deleteChannelText);
  checkElementWithClassAndText(commonVars.listClass, role.createDepartmentText);
  checkElementWithClassAndText(commonVars.listClass, role.viewDepartmentText);
  checkElementWithClassAndText(commonVars.listClass, role.updateDepartmentText);
  checkElementWithClassAndText(commonVars.listClass, role.deleteDepartmentText);
  clickButtonWithIdAndIndex(role.closeButton);
};