
import {sayHello, sayHi} from "../../../src/lib/hello-hi";

describe("hello-hi Spec", () => {

    describe("sayHello", () => {

        it("should resolve with 'hello' ", () => {
            expect(sayHello()).toEqual("hello");

        });

    });

    describe("sayHi", () => {

        it("should resolve retrun 'hi' ", () => {

            expect(sayHi()).toEqual("hi");
        });
    });
});