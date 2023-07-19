import { testSetup } from "../helpers/helpers";
import { loginTest } from "../testCases/login";
import { attendanceTest } from "../testCases/attendance";
import { stockTest } from "../testCases/stock";

describe("Sokrio web automation", () => {
    beforeEach(() => {
        testSetup();
    });

    it("TC-12: Attendance test", () => {
        loginTest();
        attendanceTest();
    });

    it("TC-14: Stock test", () => {
        loginTest();
        stockTest();
    });
});
