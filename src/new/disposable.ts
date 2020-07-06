import * as v from 'vscode';

export class Disposable implements v.Disposable {
    private _$subs: v.Disposable[] = [];
    static Dispose(val: Disposable) {
        val.dispose();
    }
    constructor() {
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