import { window, workspace, TextDocument, TextEditor } from "vscode";
import { Vim } from "../types/api";
import { Disposable } from "./disposable";
import { TwoWayDocument } from "./TwoWayDocument";
import { TaskDescriptor } from "./executor/BaseTaskDescriptor";
import { tab_changed } from "./tasks/vscode_to_vim/tab_changed";
import { get_tab } from "./tasks/vscode_to_vim/get_tab";
import { set_active } from "./tasks/vscode_to_vim/set_active";
import { Mode } from "./tasks/vim_to_vscode/support_mode";
import { createEventHandler } from "../types/eventHandler";
import { createVim } from "../types/createVim";


export class ExtensionRuntime extends Disposable {
    instance!: Vim;
    docs: Record<string | number, TwoWayDocument | undefined> = {};
    active: TwoWayDocument | undefined;
    onModeChanged!: (cb: (newMode: Mode) => any) => any;
    modeChanged!: (newMode: Mode) => void;
    editorChangedTaskQueue: TaskDescriptor<TextEditor | undefined> = TaskDescriptor.create<TextEditor | undefined>();
    configNewDocument: TaskDescriptor<TwoWayDocument> = TaskDescriptor.create();
    keyFromVsCode: TaskDescriptor<number> = TaskDescriptor.create();
    modeLock: Promise<void> = Promise.resolve();
    tabsByVscodeFilepath: Record<string, TwoWayDocument> = {};
    tabsByVimId: Record<string, TwoWayDocument> = {};
    protected async asyncConstructor() {
        const modeHandler = createEventHandler();
        this.modeChanged = modeHandler.emit;
        this.onModeChanged = modeHandler.on;
        this.editorChangedTaskQueue
            // remove undefineds
            .and_filter<TextEditor>(Boolean)
            .and_filter(tab_changed(this))
            .and_then(get_tab(this))
            .and_then(set_active(this));

        this.configNewDocument
            .tap(() => { })
            .tap(() => { });


        this.instance = await createVim(this);
        this.subscribe(() => this.instance.quit());
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