import { testSetup } from "../helpers/helpers";
import { dashboardTest } from "../testCases/dashboard";
import { roleTest } from "../testCases/role";
import { loginTest } from "../testCases/login";

describe("Sokrio web automation", () => {
    beforeEach(() => {
        testSetup();
    });

    it("TC-4: Dashboard test", () => {
        loginTest();
        dashboardTest();
    });

    it("TC-6: Role test", () => {
        loginTest();
        roleTest();
    });
});
