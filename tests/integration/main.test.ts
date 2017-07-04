
import main = require("../../src/main");

describe("my-manager Integration Test cases", () => {

    describe("sayHello", () => {

        it("should resolve with hello and hi", () => {

            expect(main.sayHelloAndHi()).toEqual("hello and hi");

        });

    });
});