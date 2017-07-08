
const myWindow:any = window;

try {
    new myWindow.CustomEvent("test");
} catch (e) {
    let CustomEventFuntion = function(typeArg: string, eventInitDict?: CustomEventInit) {
        let evt;
        eventInitDict = eventInitDict || {
                bubbles: false,
                cancelable: false,
                detail: undefined
            };

        evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(typeArg, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
        return evt;
    };

    CustomEventFuntion.prototype = Event.prototype;
    myWindow.CustomEvent = CustomEventFuntion; // expose definition to window
}