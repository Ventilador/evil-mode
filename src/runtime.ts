import { runVim, OnEvent } from './utils/run-nvim';
import { VimHighlightUIAttributes } from './types/something';
import { grid_line } from './listeners/grid_line';
import { mode_change } from './listeners/mode_change';
import { TwoWayDocument } from './new/TwoWayDocument';
import { tryCatchVoid, noop } from './utils/noop';
import { FIFOQueue } from './utils/queue';
import { Disposable, window, TextEditor } from 'vscode';
import { Disposable as D } from './new/disposable';
import { HighlightGrid } from './utils/Grid';
import { createDocument } from './new2/document';
export function createRuntime() {
    let first = null as Node<() => void> | null;
    let last = null as Node<() => void> | null;
    const subs = new FIFOQueue<Disposable>();
    const missedEvents: Record<string, boolean> = {};
    const defaultItems = {
        foreground: 0,
        background: 0,
        special: 0
    };
    const listeners = {
        grid_line: undefined,
        mode_change: undefined,
        option_set: noop,
        default_colors_set: function (rgb_fg: number, rgb_bg: number, rgb_sp: number) {
            defaultItems.foreground = rgb_fg;
            defaultItems.background = rgb_bg;
            defaultItems.special = rgb_sp;
        },
        hl_attr_define: function (id: number, rgb_attrs: Record<string, any>, _: unknown, info: any[]) {
            highlights[id] = Object.assign({}, defaultItems, rgb_attrs, info[0]);
        },
        hl_group_set: function (a: unknown, b: unknown, c: unknown, d: unknown, e: unknown) { debugger; },
        grid_resize: function (a: unknown, b: unknown, c: unknown, d: unknown, e: unknown) { debugger; },
        grid_clear: function (a: unknown, b: unknown, c: unknown, d: unknown, e: unknown) { debugger; },
        msg_set_pos: function (a: unknown, b: unknown, c: unknown, d: unknown, e: unknown) { debugger; },
        win_pos: function (a: unknown, b: unknown, c: unknown, d: unknown, e: unknown) { debugger; },
        grid_cursor_goto: function (a: unknown, b: unknown, c: unknown, d: unknown, e: unknown) { debugger; },
        mode_info_set: function (a: unknown, b: unknown, c: unknown, d: unknown, e: unknown) { debugger; },
        win_hide: function (a: unknown, b: unknown, c: unknown, d: unknown, e: unknown) { debugger; },
        flush: flushQueue,
    } as Record<string, Function | undefined>;
    const editors: Record<string, HighlightGrid> = {};
    const highlights: Record<number, VimHighlightUIAttributes> = {};
    const grids: Record<number | string, HighlightGrid> = {
        1: {
            update(ev: unknown, args: unknown) { },
            flush() { },
        } as any
    };
    let active: TextEditor;
    const runtime: Runtime = { listeners, grids, highlights, nextTick, dispose, subs };
    return runVim(dispatcher).then((vim) => {
        listeners.grid_line = grid_line(vim, runtime);
        listeners.mode_change = mode_change(vim, runtime);
        subs.add(window.onDidChangeActiveTextEditor(tabChanged));
        return vim.nvim_ui_attach(200, 200, {
            ext_hlstate: true,
            ext_linegrid: true,
            ext_multigrid: true,

            ext_cmdline: false,
            ext_tabline: false,
            ext_popupmenu: false,
            ext_messages: false,
            ext_termcolors: false,
            rgb: false,
        } as any).then(() => {
            tabChanged(window.activeTextEditor);
            return runtime;
        });
        function tabChanged(editor?: TextEditor) {
            if (!editor) {
                return;
            }

            if (isActive(editor)) {
                return;
            }

            const found = find(editor);
            if (found) {
                vim.vim_set_current_tabpage(found.tab);
                return;
            }

            createDocument({ editor, vim, runtime });
        }
    });


    function isActive(editor: TextEditor) {
        return active === editor;
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
        } else if (process.env.NODE_ENV !== 'production' && !missedEvents[event]) {
            missedEvents[event] = true;
            console.log('Missing:', `[${Object.keys(missedEvents).join(', ')}]`);
        }
    }

    function find(editor: TextEditor) {
        return editors[editor.document.fileName];
    }
}
export type Runtime = {
    listeners: Record<string, Function | undefined>;
    grids: Record<number | string, HighlightGrid>;
    highlights: Record<number, VimHighlightUIAttributes>;
    nextTick: (cb: () => void) => void;
    lookingForAGrid?: (id: number, row: number, col: number, data: any[]) => void;
    subs: FIFOQueue<Disposable>;
} & Disposable;




class Node<T>{
    next: Node<T> | null;
    value: T;
    constructor(val: T) {
        this.value = val;
        this.next = null;
    }
}
