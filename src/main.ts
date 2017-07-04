
import {sayHello, sayHi} from "./lib/hello-hi";

export function sayHelloAndHi():string {
    return sayHello() + " and " + sayHi();
}
