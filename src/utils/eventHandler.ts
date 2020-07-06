import { noop } from "./noop";

export function createEventHandler() {
    let fn = noop;
    let reg = function (cb: typeof noop) {
        fn = cb;
        reg = function (cb: typeof noop) {
            const arr = [fn, cb];
            fn = function (val) {
                arr.forEach(callFn, val);
            };
            reg = function (cb: typeof noop) {
                arr.push(cb);
            };
        };
    };
    return { emit, on };

    function emit(val: any) {
        fn(val);
    }
    function on(cb: typeof noop) {
        reg(cb);
    }
}

function callFn(this: any, cb: Function) {
    cb(this);
}
