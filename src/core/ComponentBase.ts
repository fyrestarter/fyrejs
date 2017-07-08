
import {UIElement} from "./UIElement";
import {State} from "./support_classes/State";
import {dom} from "./utils/dom";

export abstract class ComponentBase extends UIElement {

    private _viewStates:State[];

    private _stateManagedProperties;

    protected _tempCurrentState:string;

    protected dom:Function = dom;

    constructor() {
        super();
        this._viewStates = [];
        this._stateManagedProperties = {};

    }

    protected createChildrenCallback(): void {

    }

    abstract render();

}