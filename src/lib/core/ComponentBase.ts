
import {UIElement} from "./UIElement";
import {State} from "./support_classes/State";

export abstract class ComponentBase extends UIElement {

    private _viewStates:State[];

    private _stateManagedProperties;

    protected _tempCurrentState:string;

    constructor() {
        super();
        this._viewStates = [];
        this._stateManagedProperties = {};

    }

    protected createChildrenCallback(): void {
        super.createChildrenCallback();
    }

    abstract render();

}