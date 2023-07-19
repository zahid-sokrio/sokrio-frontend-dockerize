import { testSetup } from "../helpers/helpers";
import { loginTest } from "../testCases/login";
import { userTest } from "../testCases/user";
import { organizationTest } from "../testCases/organization";

describe("Sokrio web automation", () => {
  beforeEach(() => {
    testSetup();
  });

  it("TC-5: User test", () => {
    loginTest();
    userTest();
  });
});