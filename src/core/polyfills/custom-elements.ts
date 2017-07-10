
if (!window.customElements) {

    (window as any).CEPolyfill = true;

}

require("document-register-element");

type Constructor<T = {}> = new (...args: any[]) => T;

function CustomElement<TBase extends Constructor>(Base: TBase) {

    return class extends Base {
        constructor(...args) {

            if (args.length > 0) {
                return Base.call(args[0]);
            }

            super();

        }
    };
}

if ((window as any).CEPolyfill) {
    let customElementsDefineFn = customElements.define;

    customElements.define = function (...args) {

        let constructor:new () => {} = args[1];

        if (constructor) {

            constructor = args[1] = CustomElement(constructor);
            customElementsDefineFn(args[0], args[1], args[2]);
        }

        return constructor;
    };
}
