function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makenumberid(length) {
  let result = '';
  const characters = '123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Generates a random sokrio.com email address.
 */
export function generateEmail() {
  const id = makeid(32);
  return `${id}-cypress@sokrio.com`;
}

/**
 * Generates a random domain name.
 */
export function generateDomain() {
  const id = makeid(10);
  return `${id}`;
}

/*
This method is for clearing a cookies & visiting the base url
*/
export function testSetup() {
  cy.clearCookies();
  cy.visit('/');
}

/**
* Generates a random phone No.
*/
export function generatePhoneNo() {
  const id = makenumberid(11);
  return `${id}`;
}

/**
* Generates a random Code.
*/
export function generateCode() {
  const id = makenumberid(5);
  return `${id}`;
}

/**
 * Generates a random badge name.
 */
export function generateName() {
  const id = makeid(5);
  return `${id}`;
}

/**
* Generates a random Percentage.
*/
export function generatepercentage() {
  const id = makenumberid(2);
  return `${id}`;
}
