
import parseHTML from "../../../../src/core/utils/html-parser";

describe("html-parser Specs", () => {

    describe("parseHTML", () => {

        it("should return collection of elements based on parsed html", () => {

            let elements:HTMLCollection = parseHTML(`<div>
                <x-comp my-attr="what"></x-comp>
                </div>
                <div>
                <x-comp my-attr="what"></x-comp>
                </div>`);

            expect(elements.length).toEqual(2);
        });

    });
});