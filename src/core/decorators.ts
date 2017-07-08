
import "document-register-element";

export function element(name: string):ClassDecorator {
    return (constructor: Function) => {

        customElements.define(name, constructor);
    };
}