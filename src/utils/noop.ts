export function noop(...args: any[]): any;
export function noop(): any { }
let i = noop;
export function tryCatchVoid<T extends (...args: any[]) => void>(fn: T): T {
    i = fn;
    return runVoid as any;
}

function runVoid(this: any) {
    try {
        i.apply(this, arguments as any);
    } catch (err) {
        err;
        debugger;
    } finally {
        i = noop;
    }
}
