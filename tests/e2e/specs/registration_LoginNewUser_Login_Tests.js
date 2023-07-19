import { testSetup } from "../helpers/helpers";
import { registrationTest } from "../testCases/registration";
import { loginNewUserTest } from "../testCases/loginNewUser";
import { loginTest } from "../testCases/login";

describe("Sokrio web automation", () => {
    beforeEach(() => {
        testSetup();
    });

    it("TC-1: Registration test", () => {
        registrationTest();
    });

    it("TC-2: Login(New user) test", () => {
        loginNewUserTest();
    });

    it("TC-3: Login test", () => {
        loginTest();
    });
});
