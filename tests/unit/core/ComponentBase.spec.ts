
import {ComponentBase} from "../../../src/core/ComponentBase";
import {element} from "../../../src/core/decorators";
import {dom} from "../../../src/core/utils/dom";

describe("ComponentBase Specs", () => {

    describe("Component initialization", () => {

        it("should not render anything if render returns null", () => {

            let testComp2;

            @element("test-comp-2")
            class TestComponent2 extends ComponentBase {

                protected testDivComp:HTMLDivElement;
                protected testButton:HTMLButtonElement;

                constructor() {
                    super();
                    testComp2 = this;
                }

                protected initializedCallback(): void {
                    super.initializedCallback();
                    this.testButton.addEventListener("click", () => {

                        if (this._currentState !== "teststate1")
                            this.setCurrentState("teststate1");
                        else
                            this.setCurrentState("");
                    });
                    expect(this.testDivComp instanceof HTMLDivElement).toBe(true);
                }

                render () {

                    return dom`

                        <states>
                           <state name="teststate1"></state>
                           <state name="teststate2"></state>
                        </states>
                        
                        <div id="testDivComp" class="test1">Test comp2 div1</div>
                        <div class="test2"></div>
                        <div style="background-color: antiquewhite" style.teststate1="background-color: red"> 
                            <slot name="testSlot"></slot>
                        </div>
                        <div style="background-color: greenyellow" style.teststate1="background-color: red" > 
                            <slot name="testSlot2"></slot>
                        </div>  
                        <button id="testButton">Test Button</button>                      
                    `;
                }
            }

            @element("test-comp-1")
            class TestComponent extends ComponentBase {

                testComp2:TestComponent2;
                slotDiv1:HTMLDivElement;

                render () {

                    return dom`
                        <test-comp-2 id="testComp2">
                            <div id="slotDiv1" slot="testSlot">I am in test slot</div>
                            
                            <h4 slot="testSlot2">Hi I am in test slot2</h4>
                            <div slot="testSlot2">I am in test slot2</div>
                            
                        </test-comp-2>
                        <div class="test1">Test Div 1</div>
                        <div class="test2">Test Div 2</div>
                    `;
                }
            }

            let testComp:any = new TestComponent();
            testComp.initialize();
            document.body.appendChild(testComp);

            expect(testComp2.children.length > 0).toBe(true);
            expect(testComp.testComp2 instanceof TestComponent2).toBe(true);
            expect(testComp.slotDiv1 instanceof HTMLDivElement).toBe(true);

        });

        it("should not render anything if render function returns undefined", () => {

        });
        
        it("should create child elements", () => {

        });

        it("should create the custom element", () => {

        });

        it("should transclude content", () => {

        });

        it("should parse dom events and attach event listeners", () => {

        });

        it("should not throw error if one view is child of another view", () => {

        });

        it("should let children set from outside should override the child views children", () => {

        });

        it("should set the attributes set from outside onto the root element", () => {

        });

    });

    describe("setCurrentState", () => {

        it("should  apply state change to properties successfully", () => {

        });

        it("should apply state change to state groups successfully", () => {

        });
    });
});