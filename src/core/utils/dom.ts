
import {titleCase, trim} from "./string-utils";
import parseHTML from "./html-parser";
import {PropertySetter} from "../support_classes/PropertySetter";

export const eventMetadata:any = {get:() => {}};

export class VNode {
    type:string|Function;
    children?:Array<VNode|string|VNode[]>;
    props?:any;
    stateManagedProps?:any;
    text?:string;
}

export function dom(template:any, ...args):any {
    let templateHTML:string = "";
    let tpl:string = template[0];
    let n:number = arguments.length;
    let values = [].slice.call(arguments, 1);

    for (let i = 0; i < n; i++) {
        tpl += template[i];
    }

    let i = 0;

    for (n = template.length; i < n; i++) {
        if (i ===  template.length - 1) {
            templateHTML += template[i];
        } else {
            templateHTML += template[i] + "__$props__[" + i + "]";
        }
    }

    let elements:HTMLCollection = parseHTML(templateHTML);
    let el:Element;
    if (elements && elements.length > 0) {
         el = elements.item(0);
        return createVNodeAtRuntime(el, values);
    }

    return null;
}

function getValues(str:string, values):any {

    let index:any = 0;
    let re = /__\$props__\[([0-9]*)\]/;

    let placeholders = str.match(/__\$props__\[([0-9]*)\]/g);

    if (placeholders != null) {

        for (let i = 0; i < placeholders.length; i++) {
            index = re.exec(placeholders[i])[1];

            if (placeholders.length === 1 && trim(str) === placeholders[0])
               return values[index];

            str = str.replace(placeholders[i], values[index]);
        }

        return str;
    }
    return str;
}

function createVNodeAtRuntime(el:Element, values:any[], parentNode?:VNode):VNode {

    let output:VNode;

    if (!el.tagName && el.nodeType === Node.TEXT_NODE) {

        let returnedValues:string|VNode|VNode[] = getValues(el.textContent, values);

        if (returnedValues instanceof VNode || (returnedValues instanceof Array && returnedValues.length > 0 && returnedValues[0] instanceof VNode)) {

            parentNode.children.push(...returnedValues as VNode[]);
            return null;

        } else {
            let strValue:string = returnedValues as string;

            if (strValue && trim(strValue) !== "") {

                output = new VNode();
                output.type = "text";
                output.text = strValue;
            }
        }

    } else {

        let attributes:any = {};

        let stateManagedAttributes:any = {};

        if (el.attributes) {

            for (let i = 0; i < el.attributes.length; i++) {
                let attr = el.attributes[i];
                if (attr.name) {

                    let nameAndState = attr.name.split("__");

                    if (nameAndState.length === 2) {

                        let stateName:string = nameAndState[1].toLowerCase();
                        if (stateManagedAttributes[stateName] === undefined) {
                            stateManagedAttributes[stateName] = {};
                        }

                        stateManagedAttributes[stateName][nameAndState[0]] = attr.value;
                    }
                    else {
                        attributes[attr.name] = getValues(attr.value, values);
                    }

                }
            }
        }

        output = new VNode();
        output.type = el.tagName.toLowerCase();
        output.props = attributes;
        output.stateManagedProps = stateManagedAttributes;
        output.children = [];

        for (let i = 0; i < el.childNodes.length; i++) {

            createVNodeAtRuntime(el.childNodes[i] as HTMLElement, values, output);

        }
    }

    if (parentNode && output) {

        parentNode.children.push(output);
    }
    return output;
}

export function createVNode(ele:string|Function, props?:any, ...args):VNode {

    let elementProps:any = {};
    let stateManagedProperties:any = {};

    for (let prop in props) {

        let nameAndState = prop.split("__");

        if (nameAndState.length === 2) {

            let stateName:string = nameAndState[1];
            if (stateManagedProperties[stateName] === undefined) {
                stateManagedProperties[stateName] = {};
            }

            stateManagedProperties[stateName][nameAndState[0]] = props[prop];
        }
        else {

            elementProps[prop] = props[prop];
        }
    }

    let vnode:VNode = new VNode();

    vnode.type = ele;
    vnode.props = elementProps;
    vnode.stateManagedProps = stateManagedProperties;
    vnode.children = args;

    return  vnode;

}

export function createElement(tag:any, refs?:any, stateManagedProperties?:any, parentElement?:any):any {

    if (!tag)
        return null;

    let element:any;

    let vnode:VNode;

    if (typeof tag === "string") {

        vnode = {type:"text", text:tag as string};
    }
    else {

        vnode = tag as VNode;
    }

    if (vnode.type === "text") {

        element = document.createTextNode(vnode.text);

    } else {

        if (typeof vnode.type === "string") {

            element = document.createElement(vnode.type as string);
        }
        else {
            element = new (vnode.type as new() => any)();
        }

        if (!(element instanceof HTMLElement)) {
            throw TypeError("Custom Component's class must extend HTMLElement.\n" + (element as Object).toString());
        }

        if (vnode.props) {
            for (let attrName in vnode.props) {
                element.setAttribute(attrName, vnode.props[attrName]);
            }
        }

        let children = vnode.children;

        if (children) {

            for (let i = 0; i < children.length; i++) {

                if (children[i] instanceof Array) {

                    for (let j = 0; j < (children[i] as any).length; j++) {
                        createElement(children[i][j], refs, stateManagedProperties, element);
                    }
                } else {
                    createElement(children[i], refs, stateManagedProperties, element);
                }

                /* if (childElement) {

                 let childNode:VNode|string = children[i];

                 if (typeof children[i] !== "string" && typeof (childNode as VNode).type === "string") {
                 let functionName:string = "set" + titleCase((childNode as VNode).type);

                 if (element[functionName]) // checking if we need to transclude content{
                 element[functionName](childElement.getChildren());
                 }
                 else {
                 childElements.push(childElement);
                 }
                 }
                 else {
                 childElements.push(childElement);
                 }

                 }*/
            }

        }

        registerRefs(refs, vnode.props, element);

        registerStateManagedComponent(element, stateManagedProperties, vnode.stateManagedProps);

        registerEvents(element, vnode.props);
    }

    if (parentElement && element) {

        parentElement.appendChild(element);
    }

    return element;
}

function registerEvents(element:HTMLElement, props:any):void {

    let events:string[] = eventMetadata.get(element.constructor);

    if (events) {
        events.forEach((eventName:string) => {

            if (props[eventName]) {
                element.addEventListener(eventName, props[eventName]);
            }
        });
    }
}
function registerRefs(refs:any, props:any, element:HTMLElement) {
    if (refs && props && props.id) {
        refs[props.id] = element;
    }
}

function registerStateManagedComponent(element:HTMLElement, stateManagedProperties:any, stateManagedAttributes:any) {

    if (stateManagedProperties && stateManagedAttributes) {

        for (let stateName in stateManagedAttributes) {

            if (stateManagedProperties[stateName] === undefined) {
                stateManagedProperties[stateName] = [];
            }

            let attributes:any = stateManagedAttributes[stateName];

            for (let attrName in attributes) {

                let propertySetter = new PropertySetter(element, attrName, attributes[attrName]);

                stateManagedProperties[stateName].push(propertySetter);
            }

        }
    }
}