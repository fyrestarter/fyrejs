
require("../polyfills/dom-parser");

let parser;

parser = new DOMParser();

export default function parseHTML(html:string):HTMLCollection {
    let result = parser.parseFromString(html, "text/html");

    let el:HTMLElement = result.getElementsByTagName("body")[0] as HTMLElement;
    return el.children;
}