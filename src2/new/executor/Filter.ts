import { TaskDescriptor } from "./BaseTaskDescriptor";

export class FilterTaskDescriptor<TCurrent> extends TaskDescriptor<TCurrent>{
    constructor(private exp: ((v: TCurrent) => boolean | Promise<boolean>)) {
        super();
    }
    drop(value: TCurrent): void {
        const next = this._next;
        if (next) {
            Promise.resolve(this.exp(value)).then(c => c && next.drop(value));
        }
    }

}