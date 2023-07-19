import {
  checkButtonWithTypeAndText,
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkButtonWithClassAndIndex,
  checkInputFieldwithIndex,
  checkElementWithClass,
} from "../baseTests/validate";
import {
  clickButtonWithClassAndIndex,
  clickButtonWithClassTextAndIndex,
  enterTextInInputField,
  enterTextInSelectedField,
  clickButtonWithClassAndText,
} from "../baseTests/action";
import {
  commonVars,
  user,
  order,
} from "../fixtures/constants";
import { generatePhoneNo, generateEmail, generateCode } from "../helpers/helpers";

/* 
Test Case ID  : TC-5
Test Case Name: User
*/

export function userTest() {
  checkExtensionInURL(commonVars.dashboardExtension);
  clickButtonWithClassTextAndIndex(commonVars.sideNavClass, commonVars.userText);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.roleText, 0);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.userText, 1);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.targetText, 2)
  checkElementWithClassAndText(commonVars.tabClass, commonVars.travelAllowanceText, 3);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.transportText, 4)
  clickButtonWithClassTextAndIndex(commonVars.tabClass, commonVars.userText, 0);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.filterButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.addButtontext);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentNameText, 0);
  checkElementWithClassAndText(commonVars.tableHeadUserClass, user.tableHeadContentCodeText, 1)
  checkElementWithClassAndText(commonVars.tableHeadUserClass, user.tableHeadContentEmailText, 2)
  checkElementWithClassAndText(commonVars.tableHeadUserClass, user.tableHeadContentPhoneText, 3)
  checkElementWithClassAndText(commonVars.tableHeadUserClass, user.tableHeadContentAddressText, 4)
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.territoryText, 5)
  checkElementWithClassAndText(commonVars.tableHeadUserClass, commonVars.tableHeadContentCreatedAtText, 6)
  checkButtonWithClassAndIndex(user.tableNumberClass, 0);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.filterButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.addButtontext);
  checkElementWithClass(commonVars.eyeButtonClass, 0);
  checkElementWithClass(commonVars.roleUpdateButtonClass, 0);
  clickButtonWithClassAndIndex(commonVars.eyeButtonClass, 0);
  checkElementWithClassAndText(user.modalClass, user.rolesAndPermissions);
  clickButtonWithClassAndIndex(user.rolePermissionCloseButtonClass, 0);
  clickButtonWithClassAndIndex(commonVars.roleUpdateButtonClass, 0);
  checkInputFieldwithIndex(commonVars.nameField, 0);
  checkInputFieldwithIndex(user.codeField, 1);
  checkInputFieldwithIndex(user.emailField, 2);
  checkButtonWithClassAndIndex(user.passwordClass, 0);
  checkButtonWithClassAndIndex(user.passwordClass, 1);
  checkInputFieldwithIndex(user.phoneNumberField, 5);
  checkInputFieldwithIndex(user.addressField, 6);
  checkInputFieldwithIndex(user.genderField, 7);
  checkInputFieldwithIndex(user.territoryField, 8);
  checkInputFieldwithIndex(user.rolesField, 9);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  enterTextInSelectedField(user.updateSaveButtonClass, 0, user.updatedName);
  clickButtonWithClassTextAndIndex(user.newUserSaveButton, commonVars.saveButtonText, 0);
  checkElementWithClassAndText(order.successClass, user.updatedSuccessText);
  //checkElementWithClassAndText(user.tableBodyClass, user.newName);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.filterButtonText, 0);
  checkInputFieldwithIndex(user.userNameField, 0)
  checkInputFieldwithIndex(user.userCodeField, 1)
  checkInputFieldwithIndex(user.userPhoneField, 2)
  checkInputFieldwithIndex(commonVars.territoryText, 3)
  checkInputFieldwithIndex(user.roleField, 4)
  checkInputFieldwithIndex(user.allField, 5);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.resetButtonText);
  checkButtonWithClassAndIndex(commonVars.cornerCloseButtonClass, 0);
  enterTextInInputField(user.userNameField, user.filteredName);
  clickButtonWithClassAndIndex(commonVars.cornerCloseButtonClass, 0);
  checkElementWithClassAndText(user.tableBodyClass, user.filteredName);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.addButtontext);
  checkInputFieldwithIndex(commonVars.newUserButtonText, 0);
  checkInputFieldwithIndex(user.bulkUserButtonText, 0);
  clickButtonWithClassTextAndIndex(user.newUserButtonClass, user.newUserButtonText);
  checkInputFieldwithIndex(commonVars.nameField, 0);
  checkInputFieldwithIndex(user.codeField, 1);
  checkInputFieldwithIndex(user.emailField, 2);
  checkButtonWithClassAndIndex(user.passwordClass, 0);
  checkButtonWithClassAndIndex(user.passwordClass, 1);
  checkInputFieldwithIndex(user.phoneNumberField, 5);
  checkInputFieldwithIndex(user.addressField, 6);
  checkInputFieldwithIndex(user.genderField, 7);
  checkInputFieldwithIndex(user.territoryField, 8);
  checkInputFieldwithIndex(user.rolesField, 9);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  const email = generateEmail();
  const phoneNo = generatePhoneNo();
  const code = generateCode();
  enterTextInInputField(commonVars.nameField, user.name);
  enterTextInInputField(user.codeField, code);
  enterTextInInputField(user.emailField, email);
  enterTextInSelectedField(user.passwordClass, 1, user.password);
  enterTextInSelectedField(user.confirmPasswordClass, 5, user.password);
  enterTextInInputField(user.phoneNumberField, phoneNo);
  enterTextInInputField(user.addressField, user.address);
  clickButtonWithClassAndIndex(commonVars.levelClass, 0);
  clickButtonWithClassAndText(commonVars.selectedLevelFieldClass, user.femaleText);
  clickButtonWithClassAndIndex(commonVars.levelClass, 1);
  clickButtonWithClassAndText(commonVars.selectedLevelFieldClass, user.newAddressText);
  clickButtonWithClassAndIndex(commonVars.levelClass, 2);
  clickButtonWithClassAndText(commonVars.selectedLevelFieldClass, user.newRoleText);
  clickButtonWithClassAndIndex(user.permissionButtonClass, 0);
  clickButtonWithClassAndText(user.webApplicationClass, commonVars.organizationText);
  clickButtonWithClassAndText(user.webApplicationClass, user.viewTerritoryTypeText);
  clickButtonWithClassTextAndIndex(commonVars.saveButtonClass, commonVars.saveButtonText, 0);
  clickButtonWithClassAndText(user.newUserSaveButton, commonVars.saveButtonText);
  checkElementWithClassAndText(order.successClass, order.successText);
}