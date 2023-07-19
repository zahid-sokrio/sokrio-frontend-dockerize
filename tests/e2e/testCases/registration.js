import {
  checkInputField,
  checkButtonWithTypeAndText,
  checkElementWithClassAndText,
  checkButtonIsEnabled,
  checkButtonIsDisabled,
  checkExtensionInURL,
  checkElement,
  checkTextareaWithTextAndIndex,
  validataingPostReqResCodeUsingUrlAndBodyProperty,
} from "../baseTests/validate";
import {
  enterTextInInputField,
  clickButtonWithText,
  clickButtonWithClassAndIndex,
  clickButtonWithClassAndText,
  clickAndEnterTextInInputField,
  selectOption,
  waitForMillisecond,
} from "../baseTests/action";
import {
  login,
  commonVars,
  landingScreen,
  registrationScreen,
} from "../fixtures/constants";

import { generateDomain, generateEmail } from "../helpers/helpers";

/*
  Test Case ID  : TC-1
  Test Case Name: Signup
*/
export function registrationTest() {
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
}
