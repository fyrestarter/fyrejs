import {createElement, dom, VNode} from "../../../../src/core/utils/dom";
import {trim} from "../../../../src/core/utils/string-utils";
import {element} from "../../../../src/core/decorators";
import {PropertySetter} from "../../../../src/core/support_classes/PropertySetter";

@element("dom-spec-test-comp")
class TestComp extends HTMLElement {
}

describe("dom util Specs", () => {

    describe("dom function", () => {

        it("should return null if html is not proper", () => {

            let vnode:VNode = dom`test` as VNode;
            expect(vnode).toBeNull();
        });

        it("should return an Vnode for intrinsic element", () => {

            let vnode:VNode = dom`<div></div>` as VNode;

            expect(typeof vnode.type === "string").toBe(true);
            expect(vnode.type).toEqual("div");
        });

        it("should return an Vnode with properties", () => {

            let vnode = dom`<div humm="interesting" humm1="interesting1"></div>` as VNode;

            expect(vnode.props["humm"]).toEqual("interesting");
            expect(vnode.props["humm1"]).toEqual("interesting1");
        });

        it("should return an Vnode with state managed properties", () => {

            let vnode = dom`<div humm.statename="interesting" humm.statename1="interesting1"></div>` as VNode;
            expect(vnode.stateManagedProps["statename"]["humm"]).toEqual("interesting");
            expect(vnode.stateManagedProps["statename1"]["humm"]).toEqual("interesting1");
        });

        it("should return an Vnode with children", () => {

            let vnode: VNode = dom`<div>
                                <div>TEst</div>
                                child2
                            </div>` as VNode;

            expect(vnode.children.length).toEqual(2);
            expect(trim((vnode.children[1] as VNode).text)).toEqual("child2");

        });

        it("should return an Vnode with properties set using teplate literals", () => {

            let items = ["bing", "bong"];
            let text = "hello";
            let vnode: VNode = dom`<div class="${text}" test="${items}">
                                <div>TEst</div>
                                child2 ${items[0]} ${items[1]}
                             
                            </div>` as VNode;

            expect(vnode.props["test"] instanceof Array).toBe(true);
            expect(vnode.props["class"]).toEqual("hello");
            expect(trim((vnode.children[1] as VNode).text)).toEqual("child2 bing bong");

        });

        it("should return an Vnode with chidren containing repeaters", () => {

            let items = ["bing", "bong"];
            let text = "hello";
            let vnode: VNode = dom`<div class="${text}" test="${items}">
                                <div>TEst</div>
                                child2 ${items[0]} ${items[1]}
                                <ul>
                                     ${items.map(item => {
                                                return dom`<li>${item}</li>`;
                                        })}
                                </ul>
                                
                            </div>` as VNode;

            expect(vnode.props["test"] instanceof Array).toBe(true);
            expect(vnode.props["class"]).toEqual("hello");
            expect(trim((vnode.children[1] as VNode).text)).toEqual("child2 bing bong");
            expect(vnode.children.length).toEqual(3);

            let childVNode1: VNode = (<VNode>(<VNode>vnode.children[2]).children[0]).children[0] as VNode;
            let childVNode2: VNode = (<VNode>(<VNode>vnode.children[2]).children[1]).children[0] as VNode;

            expect(trim(childVNode1.text)).toEqual("bing");
            expect(trim(childVNode2.text)).toEqual("bong");

        });

    });

    describe("createElement", () => {

        it("should return null if tag is not proper", () => {

            let element = createElement("");
            expect(element).toBeNull();
        });

        it("should return an instance of HTMLElement", () => {

            let element = createElement({type: "div"});
            expect(element instanceof HTMLElement).toBe(true);
        });

        it("should return an instance of HTMLElement if VNode is of type string", () => {

            let vnode: VNode = {type: "div"};
            expect(createElement(vnode) instanceof HTMLElement).toBe(true);
        });

        it("should create a text node if VNode is of type text", () => {
            let vnode: VNode = {type: "text", text: "humm"};

            let el: Text = createElement(vnode);

            expect(el instanceof Text).toBe(true);
            expect(el.wholeText).toEqual("humm");
        });

        it("should create and return instance of custom component", () => {

            let vnode: VNode = {type: TestComp};

            let el: HTMLElement = createElement(vnode);

            expect(el instanceof HTMLElement).toBe(true);
            expect(el.nodeName.toLowerCase()).toEqual("dom-spec-test-comp");
        });

        it("should throw an error if custom component is not an instance of UIElement", () => {

            class InvalidComponent {

            }

            let vnode: VNode = {type: InvalidComponent};

            function throws() {
                createElement(vnode);
            }

            expect(throws).toThrowError();

        });

        it("should call setAttribute all the properties on Vnode.props", () => {
            let vnode: VNode = {type: TestComp, props: {humm: "interesting"}};

            let el: TestComp = createElement(vnode) as TestComp;

            expect(el.getAttribute("humm")).toEqual("interesting");

        });

        it("should create children in the VNode", () => {

            let vnode: VNode = {type: TestComp, props: {humm: "interesting"}, children: ["child1", {type: "button"}]};

            let el: TestComp = createElement(vnode) as TestComp;

            expect(el.childNodes.length).toEqual(2);

            expect(el.childNodes[0] instanceof Text).toBe(true);
            expect(el.childNodes[1] instanceof HTMLButtonElement).toBe(true);

        });

        it("should create children for VNode containing repeaters", () => {

            let vnode: VNode = {type: TestComp, props: {humm: "interesting"},
                children: ["child1",
                    {type: "button"},
                    [{type: "li"}, {type: "li"}]
                    ]};

            let el: TestComp = createElement(vnode) as TestComp;

            expect(el.childNodes.length).toEqual(4);

            expect(el.childNodes[2] instanceof HTMLLIElement).toBe(true);

        });

        it("should do transculsion if setFunctionName on parent element Matches vnode type", () => {

            let vnode: VNode = {
                type: TestComp,
                children: [
                    {
                        type: "customContent",
                        children: [{type: "img"}, {type: "button"}]
                    }
                ]
            };

            let el: TestComp = createElement(vnode) as TestComp;

            /*            expect(el.customElements.length).toEqual(2);
             expect(el.customElements[0].getElementRef() instanceof HTMLImageElement).toBe(true);
             expect(el.customElements[1].getElementRef()  instanceof HTMLButtonElement).toBe(true);*/

        });

        it("should register references to the refs object is ref Object is defined", () => {
            let vnode: VNode = {
                type: TestComp, props: {humm: "interesting"}, children: [
                    {
                        type: "button", props: {
                        id: "myButton"
                    }
                    },

                    {
                        type: "button", props: {
                        id: "myButton1"
                    }
                    }]
            };

            let refs: { [id: string]: HTMLElement } = {};
            let el: TestComp = createElement(vnode, refs) as TestComp;
            expect(refs["myButton"] instanceof HTMLButtonElement);
            expect(refs["myButton1"] instanceof HTMLButtonElement);

        });

        it("should update stateManagedProperties if it is defined ", () => {
            let vnode: VNode = {
                type: TestComp, props: {humm: "interesting"}, children: [
                    {
                        type: "button", stateManagedProps: {
                        state1: {
                            humm: "interesting"
                        },
                        state2: {
                            humm: "interesting2"
                        }
                    }
                    },

                    {
                        type: "button", stateManagedProps: {
                        state1: {
                            humm: "interesting"
                        },
                        state2: {
                            humm: "interesting2"
                        }
                    }
                    }]
            };

            let stateManagedProperties: { [stateName: string]: Array<PropertySetter> } = {};
            let el: TestComp = createElement(vnode, null, stateManagedProperties) as TestComp;

            expect(stateManagedProperties["state1"].length).toEqual(2);
            expect(stateManagedProperties["state2"].length).toEqual(2);

            expect(stateManagedProperties["state1"][0] instanceof PropertySetter).toBe(true);

        });
    });
});