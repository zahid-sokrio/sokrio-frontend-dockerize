import {
  checkInputField,
  checkButtonWithTypeAndText,
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkInputFieldWithTypeAndText,
} from "../baseTests/validate";
import {
  enterTextInInputField,
  clickButtonWithText,
} from "../baseTests/action";
import {
  landingScreen,
  commonVars,
  login,
} from "../fixtures/constants";

/*
  Test Case ID  : TC-3
  Test Case Name: Login
*/

export function loginTest() {
  checkInputField(landingScreen.domainField);
  checkButtonWithTypeAndText(
    commonVars.submitButtonType,
    commonVars.nextButtonText
  );
  checkElementWithClassAndText(
    landingScreen.registerButtonClass,
    landingScreen.registerButtonValue
  );
  enterTextInInputField(landingScreen.domainField, commonVars.domainName);
  clickButtonWithText(commonVars.nextButtonText);
  checkExtensionInURL(login.loginPageExtension);
  checkInputField(login.emailText);
  checkInputFieldWithTypeAndText(login.password, login.passwordText);
  enterTextInInputField(login.emailText, login.email);
  enterTextInInputField(login.passwordText, login.password);
  checkElementWithClassAndText(commonVars.rememberMeClass, login.rememberMeOption);
  checkButtonWithTypeAndText(
    commonVars.submitButtonType,
    login.signInButtonText
  );
  clickButtonWithText(login.signInButtonText);
  checkExtensionInURL(commonVars.dashboardExtension);
}
