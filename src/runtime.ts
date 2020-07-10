import { runVim, OnEvent } from './utils/run-nvim';
import { VimHighlightUIAttributes } from './types/something';
import { grid_line } from './listeners/grid_line';
import { mode_change } from './listeners/mode_change';
import { TwoWayDocument } from './new/TwoWayDocument';
import { tryCatchVoid } from './utils/noop';
import { FIFOQueue } from './utils/queue';
import { Disposable, window, TextEditor } from 'vscode';
import { Disposable as D } from './new/disposable';
export function createRuntime() {
    let first = null as Node<() => void> | null;
    let last = null as Node<() => void> | null;
    const subs = new FIFOQueue<Disposable>();
    const listeners = {
        grid_line: undefined,
        mode_change: undefined,
        flush: flushQueue,
    } as Record<string, Function | undefined>;
    const highlights: Record<number, VimHighlightUIAttributes> = {};
    const grids: Record<number, Grid> = {
        1: {
            update(ev, args) { },
            flush() { },
        }
    };
    const runtime: Runtime = { listeners, grids, highlights, nextTick, dispose, subs };
    subs.add(window.onDidChangeActiveTextEditor(tabChanged));
    return runVim(dispatcher).then((vim) => {
        listeners.grid_line = grid_line(vim, runtime);
        listeners.mode_change = mode_change(vim, runtime);
    });

    function tabChanged(editor?: TextEditor) {
        if (!editor) {
            return;
        }


    }

    function dispose() {
        subs.flush(D.Dispose);
    }

    function flushQueue() {
        let cur = first;
        first = last = null;
        while (cur) {
            if (process.env.NODE_ENV !== 'production') {
                tryCatchVoid(cur.value)();
            } else {
                cur.value();
            }
            cur = cur.next;
        }
    }

    function nextTick(cb: () => void) {
        if (last) {
            last.next = last = new Node(cb);
        } else {
            first = last = new Node(cb);
        }
    }

    function dispatcher(ev: string, args: any[]) {
        if (ev === 'redraw') {
            args.forEach(dispatchRedraw);
        }
    }

    function dispatchRedraw(val: any) {
        const event: string = val[0];
        const listener = listeners[event];
        if (listener) {
            for (let j = 1; j < val.length; j++) {
                listener.apply(null, val[j]);
            }
        }
    }
}
export type Runtime = {
    listeners: Record<string, Function | undefined>;
    grids: Record<number, Grid>;
    highlights: Record<number, VimHighlightUIAttributes>;
    nextTick: (cb: () => void) => void;
    lookingForAGrid?: (id: number, row: number, col: number, data: any[]) => void;
    subs: FIFOQueue<Disposable>;
} & Disposable;
export type Grid = {
    update(row: number, col: number, data: any[]): void;
    flush(): void;
};



class Node<T>{
    next: Node<T> | null;
    value: T;
    constructor(val: T) {
        this.value = val;
        this.next = null;
    }
}
