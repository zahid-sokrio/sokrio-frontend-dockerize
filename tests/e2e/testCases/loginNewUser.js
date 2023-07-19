import {
  checkInputField,
  checkButtonWithTypeAndText,
  checkElementWithClassAndText,
  checkButtonIsEnabled,
  checkButtonIsDisabled,
  checkExtensionInURL,
  checkElement,
  checkTextareaWithTextAndIndex,
  checkButtonWithClassAndIndex,
  validataingPostReqResCodeUsingUrlAndBodyProperty,
} from "../baseTests/validate";
import {
  enterTextInInputField,
  clickButtonWithText,
  clickButtonWithClassAndIndex,
  clickButtonWithClassAndText,
  clickAndEnterTextInInputField,
  selectOption,
  clickElementWithASelectorAndText,
  waitForMillisecond
} from "../baseTests/action";
import {
  login,
  commonVars,
  landingScreen,
  registrationScreen,
  loginNewUser,
} from "../fixtures/constants";
import { generateDomain, generateEmail } from "../helpers/helpers";

/*
  Test Case ID  : TC-2
  Test Case Name: Login(New user)
*/
export function loginNewUserTest() {
  checkInputField(landingScreen.domainField);
  checkButtonWithTypeAndText(
    commonVars.submitButtonType,
    commonVars.nextButtonText
  );
  checkElementWithClassAndText(
    landingScreen.registerButtonClass,
    landingScreen.registerButtonValue
  );
  clickButtonWithClassAndIndex(landingScreen.registerButtonClass);
  checkExtensionInURL(registrationScreen.registrationPageExtension);
  waitForMillisecond(2000);
  checkButtonIsDisabled(commonVars.nextButtonText);
  checkElementWithClassAndText(
    commonVars.cardBodyClass,
    commonVars.freeText
  );
  checkInputField(commonVars.couponField);
  clickButtonWithClassAndText(
    commonVars.cardBodyClass,
    commonVars.freeText
  );
  checkButtonIsEnabled(commonVars.nextButtonText);
  clickButtonWithText(commonVars.nextButtonText);
  checkExtensionInURL(registrationScreen.registrationPageExtension);
  checkInputField(landingScreen.domainField);
  checkInputField(registrationScreen.organizationNameField, 1);
  checkInputField(commonVars.nameField, 2);
  checkInputField(commonVars.emailField, 3);
  checkInputField(registrationScreen.passwordField, 4);
  checkInputField(registrationScreen.reTypePasswordField, 5);
  checkInputField(registrationScreen.countryField, 6);
  checkInputField(registrationScreen.numberField, 7);
  checkElement(registrationScreen.genderID, registrationScreen.genderPreText);
  checkTextareaWithTextAndIndex(registrationScreen.address);
  checkButtonWithTypeAndText(
    commonVars.submitButtonType,
    registrationScreen.signUpButtonText
  );
  const domain = generateDomain();
  const email = generateEmail();
  enterTextInInputField(landingScreen.domainField, domain);
  enterTextInInputField(registrationScreen.organizationNameField, domain);
  enterTextInInputField(commonVars.nameField, domain);
  enterTextInInputField(commonVars.emailField, email);
  enterTextInInputField(
    registrationScreen.passwordField,
    registrationScreen.pass
  );
  enterTextInInputField(
    registrationScreen.reTypePasswordField,
    registrationScreen.pass
  );
  clickAndEnterTextInInputField(
    registrationScreen.countryField,
    registrationScreen.country
  );
  enterTextInInputField(
    registrationScreen.numberField,
    registrationScreen.number
  );
  selectOption(registrationScreen.genderOption);
  clickButtonWithText(registrationScreen.signUpButtonText);
  // validataingPostReqResCodeUsingUrlAndBodyProperty(
  //   commonVars.orgValidationPostReqUrl,
  //   domain.toLocaleLowerCase()
  // );
  waitForMillisecond(10000)
  checkExtensionInURL(domain.toLocaleLowerCase());
  checkExtensionInURL(login.loginPageExtension);
  enterTextInInputField(login.emailText, email);
  enterTextInInputField(login.passwordText, registrationScreen.pass);
  clickButtonWithText(login.signInButtonText);
  checkExtensionInURL(commonVars.dashboardExtension);
  checkElementWithClassAndText(commonVars.popUpBodyClass, loginNewUser.setUpTerritoryStructureText);
  checkElementWithClassAndText(commonVars.popUpBodyClass, loginNewUser.setUpDistributionStructureText);
  checkElementWithClassAndText(commonVars.popUpBodyClass, loginNewUser.SetUpRoleStructureText);
  checkElementWithClassAndText(commonVars.popUpBodyClass, domain);
  clickButtonWithText(loginNewUser.startButtonText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.countryText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.divisionText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.districtText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.subdistrictText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.cityText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.routeText);
  checkButtonWithClassAndIndex(loginNewUser.addNewClass);
  checkButtonWithClassAndIndex(commonVars.editButtonClass);
  checkButtonWithClassAndIndex(loginNewUser.deleteButtonClass);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.previousButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.nextButtonText);
  clickButtonWithText(commonVars.nextButtonText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.warehouseText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.depoText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.distributortext);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.dealerText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.retailerText);
  checkButtonWithClassAndIndex(loginNewUser.addNewClass);
  checkButtonWithClassAndIndex(commonVars.editButtonClass);
  checkButtonWithClassAndIndex(loginNewUser.deleteButtonClass);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.previousButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.nextButtonText);
  clickButtonWithText(commonVars.nextButtonText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.nationalSalesDirectorText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.divisionalManagerText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.depoManagerText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.regionalManagerText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.distributionManagerText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.areaManagerText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.dealerManagerText);
  checkElementWithClassAndText(commonVars.saveButtonClass, loginNewUser.salesRepresentativeText);
  checkButtonWithClassAndIndex(loginNewUser.addNewClass);
  checkButtonWithClassAndIndex(commonVars.editButtonClass);
  checkButtonWithClassAndIndex(loginNewUser.deleteButtonClass);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.previousButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, loginNewUser.reviewButtonText);
  clickButtonWithText(loginNewUser.reviewButtonText);
  clickElementWithASelectorAndText(loginNewUser.laterbButton, loginNewUser.laterButtonText);
  checkElementWithClassAndText(loginNewUser.summaryColumnClass, loginNewUser.territoryTypeStructureText);
  checkElementWithClassAndText(loginNewUser.summaryColumnClass, loginNewUser.distributionStructureText);
  checkElementWithClassAndText(loginNewUser.summaryColumnClass, loginNewUser.roleStructureText);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  clickElementWithASelectorAndText(commonVars.saveButtonClassWithDot, commonVars.saveButtonText);
  checkExtensionInURL(commonVars.dashboardExtension);
}
