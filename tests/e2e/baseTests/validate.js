/*
  This method is for asserting a input field using placejolder & index value
*/
export function checkInputField(selector, index = 0) {
  cy.get("input", { timeout: 5000 })
    .eq(index)
    .invoke("attr", "placeholder")
    .should("contain", selector);
}

/*
  This method is for asserting a input field using type and text
*/
export function checkInputFieldWithTypeAndText(type, selector, index = 0) {
  cy.get(`input[type=${type}]`, { timeout: 5000 })
    .eq(index)
    .invoke("attr", "placeholder")
    .should("contain", `${selector}`);
}

/*
  This method is for asserting button using type and text
*/
export function checkButtonWithTypeAndText(selector, text) {
  cy.get(`button[type=${selector}]`, { timeout: 5000 }).should("contain", `${text}`);
}

/*
  This method is for asserting an element using class and text
*/
export function checkElementWithClassAndText(selector, text) {
  cy.get(`.${selector}`, { timeout: 5000 }).should("contain", text);
}

/*
  This method is for asserting an element using class and text and includes index
*/
export function checkElementWithClassTextAndIndex(selector, text, index = 0) {
  cy.get(`.${selector}`, { timeout: 5000 }).eq(index).should("contain", text);
}

/*
  This method is for asserting a extention/value in a url
*/
export function checkExtensionInURL(extension) {
  cy.url().should("contain", `${extension}`);
}

/*
  This method is for asserting a disabled button using text
*/
export function checkButtonIsDisabled(text) {
  cy.get("button").last().should("have.text", text).should("be.disabled");
}

/*
  This method is for asserting a enabled button using text
*/
export function checkButtonIsEnabled(text) {
  cy.get("button").last().should("have.text", text).should("not.be.disabled");
}

/*
  This method is for asserting an elemnet using a selector & value
*/
export function checkElement(selector, value = "") {
  cy.get(`${selector}`).should("contain", value);
}

/*
  This method is for asserting a textarea using placeholder
*/
export function checkTextareaWithTextAndIndex(text, index = 0) {
  cy.get("textarea").eq(index).should("have.attr", "placeholder", `${text}`);
}

/*
  This method is for asserting visibility of an element using class and index
*/
export function checkButtonWithClassAndIndex(selector, index = 0) {
  cy.get(`.${selector}`).eq(index).should("be.visible");
}

/*
  This method is for asserting input field using class and placeholder
*/
export function checkButtonWithClassIndexAndPlaceholder(selector, text, index = 0) {
  cy.get(`.${selector}`).eq(index).should('have.attr', 'placeholder', `${text}`)
}

/*
  This method is for asserting input field using type id
*/
export function checkButtonWithTypeAndId(type, id) {
  cy.get(`input[type=${type}]`, { timeout: 5000 }).should("have.id", `${id}`);
}

/*
  This method is for asserting input field using type, index and class
*/
export function checkButtonWithTypeIndexAndClass(type, selector, index = 0) {
  cy.get(`input[type=${type}]`, { timeout: 5000 }).eq(index).should("have.class", `${selector}`);
}

/*
  This method is for validating newly created organization
*/
export function validataingPostReqResCodeUsingUrlAndBodyProperty(url, domainName) {
  cy.intercept('POST', `${url}`, {
    body: {
      domain: `${domainName}`,
    },
  }).as('validOrg')
  cy.wait('@validOrg').its('response.statusCode').should('eq', 200 || 201)
}

/*
  This method is for asserting a textarea using Class, Text And Index
*/
export function checkButtonWithClassTextAndIndex(selector, text, index = 0) {
  cy.get(`.${selector}`, { timeout: 5000 }).eq(index).should("contain", text);
}

/*
  This method is for asserting a textarea using Class and Index
*/
export function checkInputFieldwithIndex(selector, index = 0) {
  cy.get("input", { timeout: 5000 })
    .eq(index)
    .invoke("attr", "placeholder")
}

/*
  This method is for asserting a textarea using Class
*/
export function checkElementWithClass(selector) {
  cy.get(`.${selector}`, { timeout: 5000 });
}

/*
  This method is for asserting a textarea using Class and Text
*/
export function checkButtonWithClassAndText(selector, text) {
  cy.get(`.${selector}`).should("contain", text);
}

/*
  This method is for asserting a textarea using Class, Text And Index
*/
export function checkButtonWithClassIndexAndText(selector, index, text) {
  cy.get(`.${selector}`, { timeout: 5000 }).eq(index).should("contain", text);
}

/*
  This method is for asserting element with class, index and scroll into view
*/
export function checkButtonWithClassIndexAndScrollIntoView(selector, index = 0) {
  cy.get(`.${selector}`).eq(index).scrollIntoView().should("be.visible");
}

/*
  This method is for asserting element with text
*/
export function checkButtonWithCypressSelector(selector, text) {
  cy.get(`${selector}`).should("contain", text);
}

/*
  This method is for asserting last element with class and text
*/
export function checkLastElementWithClassAndText(selector, text) {
  cy.get(`.${selector}`, { timeout: 5000 }).last().should("contain", text);
}

/*
  This method is for asserting visible element with class and text
*/
export function checkVisibleElementWithClassAndText(selector, text) {
  cy.get(`.${selector}`, { timeout: 5000 }).contains(text).should('be.visible');
}

export function checkVisibleElementWithClassAndTextAndIndex(selector, text, index) {
  cy.get(`.${selector}`, { timeout: 5000 }).contains(text).eq(index).should('be.visible');
}

/*
  This method is for asserting visible input field with texts and index
*/
export function checkVisibleInputFieldWithTextAndIndex(selector, index) {
  cy.get(`input[placeholder="${selector}"]`)
    .eq(index)
    .should('be.visible');
}

/*
  This method is for asserting existance of input field with text and index
*/
export function checkExistingInputFieldWithTextAndIndex(selector, index) {
  cy.get(`input[placeholder="${selector}"]`)
    .eq(index)
    .should('exist');
}

/*
  This method is for asserting disabled inpit field with type and index
*/
export function checkDisabledInputFielWithIndex(type, index = 0) {
  cy.get(`input[type=${type}]`, { timeout: 5000 })
    .eq(index)
    .should("be.disabled");
}

/*
  This method is for asserting enabled inpit field with type and index
*/
export function checkEnabledInputFielWithIndex(type, index = 0) {
  cy.get(`input[type=${type}]`, { timeout: 5000 })
    .eq(index)
    .should("not.be.disabled");
}

/*
  This method is for asserting element with cypress selector
*/
export function checkVisibleElementWithCypressSelector(selector) {
  cy.get(`${selector}`).should("be.visible");
}
