import { window, workspace, TextDocument, TextEditor } from "vscode";
import { attach } from "neovim";
import { spawn } from "child_process";
import { EventEmitter } from "events";
import { UIEvents } from "../types/api";
import { Disposable } from "./disposable";
import { TwoWayDocument } from "./TwoWayDocument";
import { TaskDescriptor } from "./executor/BaseTaskDescriptor";
import { tab_changed } from "./tasks/vscode_to_vim/tab_changed";
import { get_tab } from "./tasks/vscode_to_vim/get_tab";
import { set_active } from "./tasks/vscode_to_vim/set_active";
import { support_mode } from "./tasks/vim_to_vscode/support_mode";
const configRuntime = TaskDescriptor.create<ExtensionRuntime>();
configRuntime
    .and_then(support_mode);

export class ExtensionRuntime extends Disposable {
    instance!: UIEvents;
    docs: Record<string | number, TwoWayDocument | undefined> = {};
    active: TwoWayDocument | undefined;
    editorChangedTaskQueue!: TaskDescriptor<TextEditor | undefined>;
    configNewDocument!: TaskDescriptor<TwoWayDocument>;

    tabsByVscodeFilepath: Record<string, TwoWayDocument> = {};
    tabsByVimId: Record<string, TwoWayDocument> = {};
    protected async asyncConstructor() {
        this.editorChangedTaskQueue = TaskDescriptor.create<TextEditor | undefined>();
        this.editorChangedTaskQueue
            // remove undefineds
            .and_filter<TextEditor>(Boolean)
            .and_filter(tab_changed(this))
            .and_then(get_tab(this))
            .and_then(set_active(this));

        this.configNewDocument = TaskDescriptor.create();
        this.configNewDocument
            .tap(() => { })
            .tap(() => { });


        const nvim_proc = spawn('nvim', ['-u', 'NONE', '-N', '--embed'], {});
        const vim = attach({ proc: nvim_proc });
        const api = await vim.requestApi();
        const data = api[1];
        const fns = data.functions as { name: string }[];

        this.instance = fns.reduce((prev, { name }) => {
            (prev as any)[name] = function () {
                return vim.request(name, Array.from(arguments));
            } as any;
            return prev;
        }, new EventEmitter() as unknown as UIEvents);

        this.subscribe(() => vim.quit());
        this.subscribe(window.onDidChangeActiveTextEditor(this.editorChangedTaskQueue.drop, this.editorChangedTaskQueue));
        this.subscribe(workspace.onDidCloseTextDocument(this.onDocumentClosed, this));
        this.editorChangedTaskQueue.drop(window.activeTextEditor);
        return this;
    }

    // private onChangeEditor(editor?: TextEditor) {
    //     this.editorChangedTaskQueue.drop(editor);
    // if (!editor) {
    //     return;
    // }

    // let tab = this.docs[editor.document.fileName];
    // if (tab) {
    //     if (this.active && this.active === tab) {
    //         return;
    //     }

    //     this.active = tab;
    //     return this.active.activate();
    // }

    // if (this.active) {
    //     await this.instance.nvim_command('tabnew');
    // }
    // const doc = editor.document;
    // const vtab = await this.instance.nvim_get_current_tabpage();

    // // this.docs[vtab.data as number] = this.docs[doc.fileName] = new TwoWayDocument(this.instance, doc, vtab.data as number);
    // const window = await this.instance.nvim_get_current_win();
    // const buf = await this.instance.nvim_win_get_buf(window);
    // const lines = await this.instance.nvim_buf_line_count(buf);
    // return this.instance.nvim_buf_set_lines(buf, 0, lines, false, getDocLines(editor));
    // }

    private onDocumentClosed(doc: TextDocument) {

    }
}