import { Disposable } from "./disposable";
import { TextDocument, TextEditor, Position } from "vscode";
import { UIEvents } from "../types/api";
import { Tabpage, Window, Buffer } from "neovim";
import { getDocLines } from "../utils/getLinesFromDoc";
import { ExtensionRuntime } from "./ExtensionRuntime";

export class TwoWayDocument extends Disposable<[ExtensionRuntime, TextEditor, Tabpage]> {
    readonly editor!: TextEditor;
    readonly tabId!: Tabpage;
    readonly runtime!: ExtensionRuntime;
    readonly buffer!: Buffer;
    readonly window!: Window;
    protected vimVer: number = 0;
    protected vscodeVer: number = 0;
    protected async asyncConstructor(runtime: ExtensionRuntime, editor: TextEditor, tab: Tabpage) {
        (this as { editor: TextEditor }).editor = editor;
        (this as { tabId: Tabpage }).tabId = tab;
        (this as { runtime: ExtensionRuntime }).runtime = runtime;
        (this as { window: Window }).window = await runtime.instance.nvim_tabpage_get_win(tab);
        (this as { buffer: Buffer }).buffer = await runtime.instance.nvim_win_get_buf(this.window);
        const lines = await runtime.instance.nvim_buf_line_count(this.buffer);
        await this.runtime.instance.nvim_buf_set_lines(this.buffer, 0, lines, false, getDocLines(editor));
        this.vscodeVer = editor.document.version;
        this.vimVer = await runtime.instance.nvim_buf_get_changedtick(this.buffer);
        return this;
    }

    async sync() {
        if (this.vscodeVer < this.editor.document.version) {
            if (process.env.NODE_ENV !== 'production') {
                debugger;
            }
            // somehow we lost track and we need to start again
            const lines = await this.runtime.instance.nvim_buf_line_count(this.buffer);
            await this.runtime.instance.nvim_buf_set_lines(this.buffer, 0, lines, false, getDocLines(this.editor));
            this.vimVer = await this.runtime.instance.nvim_buf_get_changedtick(this.buffer);
            this.vscodeVer = this.editor.document.version;
            return;
        }

        const vimVer = await this.runtime.instance.nvim_buf_get_changedtick(this.buffer);
        if (this.vimVer < vimVer) {
            if (process.env.NODE_ENV !== 'production') {
                debugger;
            }
            // somehow we lost track and we need to start again
            const content = await this.runtime.instance.nvim_buf_get_lines(this.buffer, 0, await this.runtime.instance.nvim_buf_line_count(this.buffer), false);
            await this.editor.edit((editor) => {
                editor.replace(new Position(0, this.editor.document.lineCount), content.join('\r\n'));
            });
            this.vscodeVer = this.editor.document.version;
            this.vimVer = vimVer;
        }
    }

    activate() {
        return this.runtime.instance.nvim_set_current_tabpage(this.tabId);
    }
}