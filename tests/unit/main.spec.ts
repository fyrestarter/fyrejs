
import {sayHelloAndHi} from "../../src/main";
import helloHI = require("../../src/lib/hello-hi");

describe("main Spec", () => {

    describe("sayHelloAndHi", () => {

        it("should resolve with hello and hi", () => {

            spyOn(helloHI, "sayHello").and.returnValue("helloStub");
            spyOn(helloHI, "sayHi").and.returnValue("hiStub");

            expect(sayHelloAndHi()).toEqual("helloStub and hiStub");

        });

    });
});