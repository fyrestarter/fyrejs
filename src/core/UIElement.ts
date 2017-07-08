
import "document-register-element";
import "./polyfills/custom-event";

export class UIElement extends HTMLElement {

    protected initialized:boolean = false;

    setAttribute(name: string, value: any): void {
        this[name] = value;
        super.setAttribute(name, value);
    }

    /*
    * This function marks the element Attached to the document, should trigger component initialization life cycle from here
    * */
    connectedCallback(): void {
        this.initialize();
    }

    /*
    * this function should be called before appending the custom element to its parent.
    *
    * The Goal is to trigger the component creation life cycle where the children of the
    * component may be created and initialized
    *
    * */
    private initialize():void {
        this.preInitializeCallback();
        this.createChildrenCallback();
        this.childrenCreatedCallback();
        this.initialized = true;
        this.initializedCallback();
    }

    /* Called before createChildren() method of the element is called
     *
     * */
    protected preInitializeCallback():void {}

    /* trigger creating children of the element
     *
     * */
    protected createChildrenCallback():void {}

    /* Called before createChildren() method of the element is called
     *
     * */
    protected childrenCreatedCallback():void {}

    /*Called after component went through its initialization lifecycle
    *
    * This is the last chance to modify the component before it is attached to its parent
    *
    * */
    protected initializedCallback():void {}

    /*
    * Called after element is removed from a document
    */
    protected disconnectedCallback(): void {

    }

    /*
     * Called when the attribute Value Changes on the element
     */
    protected attributeChangedCallback(attributeName:string, oldValue:string, newValue:string, namespace:string): void {}

}