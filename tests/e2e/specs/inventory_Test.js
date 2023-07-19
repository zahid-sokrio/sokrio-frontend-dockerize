import { testSetup } from "../helpers/helpers";
import { loginTest } from "../testCases/login";
import { inventoryTest } from "../testCases/inventory";

describe("Sokrio web automation", () => {
    beforeEach(() => {
        testSetup();
    });

    it("TC-10: Inventory test", () => {
        loginTest();
        inventoryTest();
    });
});
