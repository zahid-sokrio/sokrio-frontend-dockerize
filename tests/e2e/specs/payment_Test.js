import { testSetup } from "../helpers/helpers";
import { loginTest } from "../testCases/login";
import { paymentTest } from "../testCases/payment";

describe("Sokrio web automation", () => {
  beforeEach(() => {
    testSetup();
  });

  it("TC-13: Payment test", () => {
    loginTest();
    paymentTest();
  });
});