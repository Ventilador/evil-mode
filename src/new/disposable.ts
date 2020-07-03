import * as v from 'vscode';

export class Disposable<T extends any[] = any[]> implements v.Disposable {
    private _$subs: v.Disposable[] = [];
    protected asyncConstructor(...args: T): Promise<this> { return Promise.resolve(this); }
    public readonly ready: Promise<this>;
    constructor(...args: T) {
        this.ready = Promise.resolve().then(() => this.asyncConstructor(...args));
    }

    subscribe(dispose: (() => any) | v.Disposable) {
        if (typeof dispose === 'function') {
            this._$subs.push({ dispose });
        } else {
            this._$subs.push(dispose);
        }
    }

    dispose() {
        this._$subs.forEach(dispose);
    }
}

function dispose(i: v.Disposable) {
    i.dispose();
}