
import {UIElement} from "./UIElement";
import {State} from "./support_classes/State";
import {createElement, dom, VNode} from "./utils/dom";

export abstract class ComponentBase extends UIElement {

    private _viewStates:State[] = [];

    private _stateManagedProperties;

    protected _tempCurrentState:string;

    protected slots:{[name:string]:HTMLElement[]};

    constructor() {
        super();
        this._viewStates = [];
        this._stateManagedProperties = {};
    }

    appendChild<T extends Node>(newChild: T): T {
        if ((<any>newChild).initialize)
            (<any>newChild).initialize();
        return super.appendChild(newChild);
    }

    protected createChildrenCallback(): void {

        let vnodes:any = this.render();
        let statesVNode:VNode;

        if (vnodes) {

            if (vnodes instanceof Array) {

                vnodes.forEach((item:VNode) => {

                    if (item.type !== "states") {
                        this.appendChild(createElement(item, this, this._stateManagedProperties));

                    } else if ( !statesVNode ) {
                        statesVNode = item;
                    }
                });

            } else {

                if (vnodes.type !== "states") {
                    this.appendChild(createElement(vnodes, this, this._stateManagedProperties));
                } else if ( !statesVNode ) {
                    statesVNode = vnodes;
                }
            }
        }

        if (this.slots) {
            let slotContainers:any = this.getElementsByTagName("slot");

            if (slotContainers && slotContainers.length > 0) {

                for (let i = 0; i < slotContainers.length ; i++) {

                    let slotContainer:HTMLElement = slotContainers[i];

                    let slotChildren:HTMLElement[] = this.slots[slotContainer.getAttribute("name")];

                    if (slotChildren) {

                        for (let  i = 0; i < slotChildren.length; i++) {
                            let element:any = slotChildren[i];
                            slotContainer.appendChild(element);
                        }

                    }

                }
            }
        }

        if (statesVNode && statesVNode.children) {

            for (let j = 0; j < statesVNode.children.length; j++) {

                let stateNode:VNode = statesVNode.children[j] as VNode;
                if (typeof stateNode === "string")
                    return;

                if (stateNode.props && stateNode.props["name"] !== null && stateNode.props["name"] !== undefined) {
                    let state:State = new State(stateNode.props["name"], stateNode.props["stateGroups"]);
                    this._viewStates.push(state);
                }
            }

            this._viewStates.forEach((state:State) => {

                if (this._stateManagedProperties.hasOwnProperty(state.name)) {

                    state.propertySetters.push.apply(state.propertySetters, this._stateManagedProperties[state.name]);
                }

                state.stateGroups.forEach((stateGroup) => {
                    if (this._stateManagedProperties.hasOwnProperty(stateGroup)) {

                        state.propertySetters.push.apply(state.propertySetters, this._stateManagedProperties[stateGroup]);
                    }
                });

            });
        }

        this.updateState(this._tempCurrentState);

    }

    hasState(stateName):boolean {

        for (let i = 0; i < this._viewStates.length; i++) {
            if (this._viewStates[i].name === stateName)
                return true;
        }
        return false;

    }

    getCurrentState():string {
        if (!this.initialized)
            return this._tempCurrentState;

        return this._currentState;
    }

    setCurrentState(stateName:string):void {

        if (this.initialized) {

           this.updateState(stateName);

        }
        else {
            this._tempCurrentState = stateName;
        }
    }

    protected updateState(stateName:string):void {
        let oldState = this.getState(this._currentState);

        if (this.isBaseState(stateName)) {
            this.removeState(oldState);
            this._currentState = stateName;

        }
        else {

            let destination = this.getState(stateName);

            this.initializeState(stateName);

            // Remove the existing state
            this.removeState(oldState);
            this._currentState = stateName;

            this.applyState(destination);
        }
    }

    protected validateStateCallback(): void {
        super.validateStateCallback();
    }

    protected isBaseState(stateName):boolean {
        return !stateName || stateName === "";
    }

    protected initializeState(stateName):void {
        let state = this.getState(stateName);

        if (state) {
            state.initialize();
        }
    }

    protected removeState(state) {

        if (state) {

            for (let i = 0; i < state.propertySetters.length; i++) {
                state.propertySetters[i].remove();
            }
        }

    }

    protected applyState(state) {

        if (state) {

            for (let i = 0; i < state.propertySetters.length; i++) {
                state.propertySetters[i].apply();
            }
        }

    }

    protected getState(stateName:string):State {
        if (!this._viewStates || this.isBaseState(stateName))
            return null;

        for (let i = 0; i < this._viewStates.length; i++) {
            if (this._viewStates[i].name === stateName)
                return this._viewStates[i];
        }

        throw new ReferenceError("State not Found Exception: The state '" + stateName +
            "' being set on the component is not found in the skin");
    }

    abstract render();

}