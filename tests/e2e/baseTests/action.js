/*
  This method is for entering text in input field using placeholder value
*/
export function enterTextInInputField(selector, text) {
  cy.get(`input[placeholder="${selector}"]`).type(text);
}

/*
  This method is for entering text in input field using placeholder value annd index
*/
export function enterTextInInputFieldWithIndex(selector, index, text) {
  cy.get(`input[placeholder="${selector}"]`).eq(index).type(text);
}

/*
  This method is for clear text in input field using placeholder value annd index
*/
export function clearTextInInputFieldWithIndex(selector, index) {
  cy.get(`input[placeholder="${selector}"]`).eq(index).clear()
}

/*
  This method is for clicking a text field otion and entering text in input field
*/
export function clickAndEnterTextInInputField(selector, text) {
  cy.get(`input[placeholder="${selector}"]`)
    .click({ force: true })
    .type(text);
}

/*
  This method is for clicking a button using class and index
*/
export function clickButtonWithClassAndIndex(selector, index = 0) {
  cy.get(`.${selector}`)
    .eq(index)
    .click({ force: true })
    .wait(500);
}

/*
  This method is for clicking a button using ID and index
*/
export function clickButtonWithIdAndIndex(selector, index = 0) {
  cy.get(`#${selector}`)
    .eq(index)
    .should('be.visible')
    .click({ force: true });
}

/*
  This method is for clicking a button using class and text
*/
export function clickButtonWithClassAndText(selector, text) {
  cy.get(`.${selector}`)
    .contains(text)
    .click({ force: true })
    .wait(500);
}

/*
  This method is for clicking a element using selecetor and text
*/
export function clickElementWithASelectorAndText(selector, text) {
  cy.get(`${selector}`)
    .contains(text)
    .click({ force: true });
}

/*
  This method is for clicking a button using class, index and text
*/
export function clickButtonWithClassIndexAndText(selector, text, index = 0) {
  cy.get(`.${selector}`)
    .contains(text)
    .eq(index)
    .click({ force: true })
    .wait(500);
}

/*
  This method is for clicking a button using text
*/
export function clickButtonWithText(text) {
  cy.get('button')
    .should('contain', text)
    .last()
    .click({ force: true });
}

/*
  This method is for select a option for dropdown menu
*/
export function selectOption(option) {
  cy.get('select').select(option);
}

/*
  This method is for clicking a button using type and text
*/
export function clickButtonWithTypeAndText(typeName, text) {
  cy.get(`button[type=${typeName}]`)
    .contains(text)
    .click({ force: true });
}

/*
  This method is for date selection
*/
export function selectDate(date) {
  cy.get(`td[data-date="${date}"]`, { timeout: 5000 })
    .first()
    .click({ force: true });
}

/*
  This method is for entering text in textarea
*/
export function enterTextInTextareaWithPlaceholder(selector, text) {
  cy.get(`textarea[placeholder="${selector}"]`).type(text);
}

/*
  This method is for clicking a button using class and text
*/
export function clickButtonWithClassAndTextBeforeText(selector, text, index = 0) {
  cy.get(`.${selector}`)
    .eq(index)
    .contains(text)
    .click({ force: true });
}

/*
  This method is for clicking a button using Class and an option from dropdown menu
*/
export function clickButtonWithClassAndselectOption(selector, option) {
  cy.get(`.${selector}`).select(option);
}

/*
  This method is for clicking a button using Class, Text and Index
*/
export function clickButtonWithClassTextAndIndex(selector, text, index = 0) {
  cy.get(`.${selector}`)
    .contains(text)
    .eq(index)
    .click({ force: true });
}

/*
  This method is for clicking a text field option and entering text in input field
*/
export function enterTextInSelectedField(selector, index, text) {
  cy.get(`.${selector}`)
    .eq(index)
    .type(text);
}

/*
  This method is for waiting for millisecond
*/
export function waitForMillisecond(time) {
  cy.wait(time)
}


/*
  This method is for clicking a button using Class, Text and Index
*/
export function clickButtonWithClassTextAndIndexWithoutdot(selector, text, index = 0) {
  cy.get(`${selector}`)
    .contains(text)
    .eq(index)
    .click({ force: true })
    .wait(500);
}
/*
  This method is for clicking a input field with text and index
*/
export function clickInputField(selector, index) {
  cy.get(`input[placeholder="${selector}"]`).eq(index).click({ force: true });
}

/*
 This method is for select a option for dropdown menu
*/
export function clickAndSelectOptionFromList(selector, option) {
  cy.get(`.${selector}`).find('li').contains(option).click();
}

/*
 This method is for clicking element with cypress selector
*/
export function clickButtonWithCypressSelector(selector) {
  cy.get(`${selector}`).click()
}

/*
 This method is for clicking element with class and scroll into view
*/
export function clickButtonWithClassIndexAndScrollIntoView(selector, index) {
  cy.get(`.${selector}`).eq(index).scrollIntoView().click()
}

/*
 This method is for entering tex in text field using cypress selector
*/
export function enterTextWithCypressSelector(selector, text) {
  cy.get(`${selector}`).type(text)
}

/*
 This method is for clicking element with selector, text and index
*/
export function clickElementWithASelectorTextAndIndex(selector, text, index) {
  cy.get(`${selector}`)
    .eq(index)
    .contains(text)
    .click({ force: true });
}

/*
  This method is for selecting first element from scrollbar options
*/
export function selectFromScrollbar(selector) {
  cy.get(`.${selector}`).last().find('li').first().click();
}

/*
 This method is for selecting options from select list
*/
export function selectOptionWithClassAndIndex(selector, option, index) {
  cy.get(`.${selector}`).eq(index).select(option);
}

/*
 This method is for selecting particular date from date picker
*/
export function selectDateFromDatePicker(date, index) {
  cy.get('.dayContainer').eq(index).find(`span[aria-label="${date}"]`).click()
}

/*
 This method is for selecting last element from scrollbar options
*/
export function selectLastElementFromScrollbar(selector) {
  cy.get(`.${selector}`).last().find('li').last().click();
}

/*
  This method is for clear text in input field using type and index
*/
export function clearTextInInputFieldWithTypeAndIndex(selector, index) {
  cy.get(`input[type="${selector}"]`).eq(index).clear()
}

/*
  This method is for entering text in input field using type and index
*/
export function enterTextInInputFieldWithTypeAndIndex(selector, text, index) {
  cy.get(`input[type="${selector}"]`).eq(index).type(text)
}