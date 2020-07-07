import { Disposable } from "./disposable";
import { TextEditor, TextEditorDecorationType, ThemeColor, window, commands } from "vscode";
import { Tabpage, Window, Buffer } from "neovim";
import { getDocLines } from "../utils/getLinesFromDoc";
import { ExtensionRuntime } from "./ExtensionRuntime";
import { HighlightGrid } from "../utils/Grid";
import { Vim } from "../types/api";

export class TwoWayDocument extends Disposable {
    ready: Promise<this>;
    readonly editor!: TextEditor;
    readonly tabId!: Tabpage;
    readonly runtime!: ExtensionRuntime;
    readonly buffer!: Buffer;
    readonly window!: Window;
    readonly grid!: HighlightGrid;
    readonly selectDecorator!: TextEditorDecorationType;
    readonly gridId!: number;
    protected vimVer: number = 0;
    protected vscodeVer: number = 0;
    constructor(runtime: ExtensionRuntime, editor: TextEditor) {
        super();
        this.runtime = runtime;
        this.runtime.active = this;
        this.editor = editor;
        this.grid = new HighlightGrid(this, runtime);
        this.selectDecorator = window.createTextEditorDecorationType({
            backgroundColor: new ThemeColor('editor.selectionBackground'),
        });
        this.ready = this.asyncConstructor();
        this.subscribe(this.selectDecorator);
    }
    protected async asyncConstructor() {
        const prom = new Promise<number>(r => {
            this.runtime.creatingDocument = (data: any[]) => {
                if ((data[0] === 1) || !r) {
                    return;
                }

                setReadonly(this, 'gridId', data[0]);
                r();
                r = undefined as any;
            };
        }).then(() => {
            this.runtime.creatingDocument = undefined;
        });
        const lines = getDocLines(this.editor).slice();
        if (lines[lines.length - 1]) {
            await commands.executeCommand('workbench.action.files.save');
        } else {
            lines.pop();
        }
        const [[_, __, tab, window, buf]] = await this.runtime.instance.nvim_call_atomic([
            ['nvim_command', ['tabnew']],
            ['nvim_buf_set_lines', [0, 0, 0, true, lines]],
            ['nvim_get_current_tabpage', []],
            ['nvim_tabpage_get_win', [0]],
            ['nvim_win_get_buf', [0]],
        ]);
        setReadonly(this, 'tabId', tab);
        setReadonly(this, 'window', window);
        setReadonly(this, 'buffer', buf);
        this.runtime.tabsByVimId[buf.id] = this;
        await prom;

        if (process.env.NODE_ENV !== 'production') {
            startLooping(this.buffer, this.editor, this.runtime.instance);
        }
        this.vscodeVer = this.editor.document.version;
        return this;
    }

    activate() {
        return this.runtime.instance.nvim_set_current_tabpage(this.tabId);
    }
}

function setReadonly<T, Key extends keyof T>(val: T, key: Key, value: T[Key]) {
    val[key] = value;
}

function startLooping(buf: Buffer, ed: TextEditor, vim: Vim) {
    setTimeout(fn, 0);
    async function fn() {
        const lines = await vim.nvim_buf_get_lines(buf, 0, -1, true);
        const others = getDocLines(ed);

        others.forEach((text, i) => {
            if (lines[i] !== text) {
                text;
            }
        });
        setTimeout(fn, 1000);
    }
}
