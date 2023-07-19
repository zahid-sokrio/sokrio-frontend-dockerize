import {
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkButtonWithClassTextAndIndex,
  checkElementWithClass,
  checkInputFieldwithIndex,
  checkButtonWithTypeAndText,
} from "../baseTests/validate";
import {
  enterTextInInputField,
  clickButtonWithClassAndIndex,
  clickButtonWithClassTextAndIndex,
  clickButtonWithTypeAndText,
} from "../baseTests/action";
import {
  commonVars,
  organization,
} from "../fixtures/constants";

/* 
Test Case ID  : TC-9
Test Case Name: Organization
*/

export function organizationTest() {
  checkExtensionInURL(commonVars.dashboardExtension);
  clickButtonWithClassTextAndIndex(commonVars.sideNavClass, commonVars.organizationText);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.territoryTypeText, 0)
  checkElementWithClassAndText(commonVars.tabClass, commonVars.territoryText, 1)
  checkElementWithClassAndText(commonVars.tabClass, organization.channelText, 2)
  checkElementWithClassAndText(commonVars.tabClass, commonVars.departmentText, 3)
  checkElementWithClassAndText(commonVars.tabClass, commonVars.badgeText, 4)
  checkButtonWithClassTextAndIndex(organization.draggableButtonClass, organization.draggableButtonText, 0);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.addButtontext);
  checkButtonWithClassTextAndIndex(commonVars.tableHeadUserClass, commonVars.tableHeadContentNameText, 0);
  checkElementWithClass(organization.tableHeadContentLevelClass, 0);
  checkElementWithClass(commonVars.tableHeadContentNameClass, 1);
  checkElementWithClass(commonVars.tableHeadContentDescriptionClass, 2);
  checkElementWithClass(commonVars.tableHeadContentHasOutletClass, 3);
  checkElementWithClass(commonVars.tableHeadContentCreatedAtClass, 4);
  checkElementWithClass(commonVars.tableHeadContentUpdateIconClass, 5);
  clickButtonWithClassTextAndIndex(organization.draggableButtonClass, organization.draggableButtonText, 0);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.addButtontext, 0);
  checkInputFieldwithIndex(organization.nameText, 2)
  checkInputFieldwithIndex(organization.descriptionText, 3)
  checkElementWithClass(commonVars.levelClass, 4)
  checkButtonWithClassTextAndIndex(commonVars.closeButtonClass, commonVars.closeButtonText, 1);
  checkButtonWithClassTextAndIndex(commonVars.saveButtonClass, commonVars.saveButtonText, 1);
  enterTextInInputField(organization.nameText, organization.name);
  enterTextInInputField(organization.descriptionText, organization.description);
  clickButtonWithClassAndIndex(commonVars.levelClass, 0);
  clickButtonWithClassAndIndex(commonVars.selectedLevelFieldClass, 0);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  checkButtonWithClassTextAndIndex(commonVars.tableRowClass, organization.name, 0);
  clickButtonWithClassAndIndex(commonVars.updateIconClass, 0);
  checkInputFieldwithIndex(organization.nameText, 2);
  checkInputFieldwithIndex(organization.descriptionText, 3);
  checkElementWithClass(commonVars.levelClass, 4);
  checkButtonWithClassTextAndIndex(commonVars.closeButtonClass, commonVars.closeButtonText, 1);
  checkButtonWithClassTextAndIndex(commonVars.saveButtonClass, commonVars.saveButtonText, 1);
  enterTextInInputField(organization.nameText, organization.cityName);
  enterTextInInputField(organization.descriptionText, organization.descriptionUpdated);
  clickButtonWithClassAndIndex(commonVars.levelClass, 0);
  clickButtonWithClassAndIndex(commonVars.selectedLevelFieldClass, 0);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.closeButtonText);
  //checkButtonWithClassTextAndIndex(organization.fullTableClass, organization.UpdatedCityName, 0);
}
