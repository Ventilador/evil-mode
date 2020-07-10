export function noop(...args: any[]): any { }
let i = noop;
export function tryCatchVoid<T extends (...args: any[]) => any>(fn: T): T {
    i = fn;
    return runVoid as any;
}

function runVoid(this: any) {
    try {
        i.apply(this, arguments as any);
    } catch (err) {
        err;
        debugger;
        return;
    }
}
