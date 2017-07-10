
import "./polyfills/custom-elements";

export function element(name: string):ClassDecorator {
    return (constructor: Function) => {

        let constructorNew = customElements.define(name, constructor);

        if ((window as any).CEPolyfill) {
            return constructorNew;
        }
    };
}