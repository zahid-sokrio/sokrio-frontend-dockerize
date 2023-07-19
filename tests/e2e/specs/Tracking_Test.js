import { testSetup } from "../helpers/helpers";
import { trackingTest } from "../testCases/tracking";
import { loginTest } from "../testCases/login";

describe("Sokrio web automation", () => {
    beforeEach(() => {
        testSetup();
    });

    it("TC-8: Tracking test", () => {
        loginTest();
        trackingTest();
    });
});