
let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

let SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
let MOZ_HACK_REGEXP = /^moz([A-Z])/;

export function titleCase(str) {

    let names:string[] = str.split("-");

    let propName:string = "";

    if (names.length > 0) {
        names.forEach((name) => {
            name = name.charAt(0).toUpperCase() + name.slice(1);
            propName = propName + name;
        });
    }

    return propName;
}

export function camelCase(name) {
    return name.
    replace(SPECIAL_CHARS_REGEXP, (_, separator, letter, offset) => {
        return offset ? letter.toUpperCase() : letter;
    }).
    replace(MOZ_HACK_REGEXP, "Moz$1");
}

export function trim( text ) {
    return text == null ?
        "" :
        ( text + "" ).replace( rtrim, "" );
}