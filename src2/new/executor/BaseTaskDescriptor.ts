import { MapTaskDescriptor } from "./Map";
import { FilterTaskDescriptor } from "./Filter";
import { RepeaterDescriptor } from "./Repeater";

let filter = (): typeof FilterTaskDescriptor => {
    const data = require('./Filter');
    filter = () => data.FilterTaskDescriptor;
    return data.FilterTaskDescriptor;
};
let map = (): typeof MapTaskDescriptor => {
    const data = require('./Map');
    map = () => data.MapTaskDescriptor;
    return data.MapTaskDescriptor;
};
let repeat = (): typeof RepeaterDescriptor => {
    const data = require('./Repeater');
    repeat = () => data.RepeaterDescriptor;
    return data.RepeaterDescriptor;
};
export abstract class TaskDescriptor<TCurrent> {
    static create<T>() {
        return new Initial<T>();
    }
    protected _next: TaskDescriptor<any> | null = null;
    abstract drop(value: any): void;

    and_filter<T = TCurrent>(cb: (value: T) => boolean | Promise<boolean>): TaskDescriptor<T> {
        return this.into(new (filter())(cb));
    }

    and_then<T>(cb: (value: TCurrent) => T | Promise<T>): TaskDescriptor<T> {
        return this.into(new (map())(cb));
    }

    tap(cb: (value: TCurrent) => any) {
        this.drop = tap(this.drop, cb);
        return this;
    }

    for_each(cb: (value: TCurrent) => void): void {
        this.into(new (map())(cb));
    }

    many(): TaskDescriptor<TCurrent> {
        return this.into(new (repeat())());
    }

    into_task<T>(cb: (t: TaskDescriptor<TCurrent>) => TaskDescriptor<T>): TaskDescriptor<T> {
        const t = new Initial<TCurrent>();
        return this.into(cb(t));
    }

    private into(item: TaskDescriptor<any>) {
        if (this._next) {
            throw new Error('cannot reattach');
        }
        return this._next = item;
    }
}
class Initial<T> extends TaskDescriptor<T>{
    drop(value: T) {
        if (this._next) {
            this._next.drop(value);
        }
    }
}

function tap<TCurrent, TNext>(cur: any, fn: any): (value: TCurrent) => TNext | Promise<TNext> {
    if (cur.next) {
        if (fn.next) {
            throw new Error("Cannot reuse fn (might be used by someone else)");
        }
        fn.next = cur;
        cur.next = fn;
        return cur;
    }

    const wrapper = (value: TCurrent) => {
        let cur = wrapper.next;
        while (cur && cur.next) {
            tryCatch(cur, value);
        }
        return cur(value);
    };

    wrapper.next = cur;
    return tap(wrapper, fn);
}

function tryCatch(cb: Function, v: any) {
    try {
        cb(v);
    } catch{ }
}
