import { TaskDescriptor } from "./BaseTaskDescriptor";

export class MapTaskDescriptor<TCurrent, T> extends TaskDescriptor<T>{
    constructor(private cb: (v: TCurrent) => T) {
        super();
    }
    drop(value: TCurrent): void {
        const next = this._next;
        if (next) {
            Promise.resolve(this.cb(value)).then(c => next.drop(c));
        }
    }

}