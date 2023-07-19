import { testSetup } from "../helpers/helpers";
import { loginTest } from "../testCases/login";
import { reportTest } from "../testCases/report";
import { settingsTest } from "../testCases/settings";
import { departmentTest } from "../testCases/department";

describe("Sokrio web automation", () => {
  beforeEach(() => {
    testSetup();
  });

  it("TC-15: Report test", () => {
    loginTest();
    reportTest();
  });

  it("TC-17: Settings test", () => {
    loginTest();
    settingsTest();
  });

  // it("TC-15: Department test", () => {
  //   loginTest();
  //   departmentTest();
  // });
});