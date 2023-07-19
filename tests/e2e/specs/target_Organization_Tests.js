import { testSetup } from "../helpers/helpers";
import { loginTest } from "../testCases/login";
import { targetTest } from "../testCases/target";

describe("Sokrio web automation", () => {
  beforeEach(() => {
    testSetup();
  });

  it("TC-7: Target test", () => {
    loginTest();
    targetTest();
  });

  // it("TC-9: Organization test", () => {
  //   loginTest();
  //   organizationTest();
  // });
});