import { testSetup } from "../helpers/helpers";
import { loginTest } from "../testCases/login";
import { orderTest } from "../testCases/order";

describe("Sokrio web automation", () => {
  beforeEach(() => {
    testSetup();
  });

  it("TC-11: Order test", () => {
    loginTest();
    orderTest();
  });
});