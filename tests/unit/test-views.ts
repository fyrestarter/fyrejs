
import {ComponentBase} from "../../src/core/ComponentBase";
import {element} from "../../src/core/decorators";

@element("test-view-1")
export class TestView1 extends ComponentBase {

    render() {

        return this.dom`
<div class="testDiv">
    <span style="color:red">Test View 1</span>
</div>`;
    }
}

@element("test-view-2")
export class TestView2 extends ComponentBase {

    render() {

        return this.dom`
<div class="testDiv">
    <test-view-1></test-view-1>
    <span style="color:blue">Test View 2</span>
</div>`;
    }
}