import { workspace, TextDocument, window, ThemeColor, TextEditorDecorationType } from "vscode";
import { Vim } from "../types/api";
import { Disposable } from "./disposable";
import { TwoWayDocument } from "./TwoWayDocument";
import { TaskDescriptor } from "./executor/BaseTaskDescriptor";
import { Mode, ParsedMode } from "./tasks/vim_to_vscode/support_mode";
import { createEventHandler } from "../utils/eventHandler";
import { createVim } from "../utils/createVim";
import { VimHighlightUIAttributes } from "../types/something";
import { FIFOQueue } from "../utils/queue";
import { Tabpage, Window } from "neovim";


export class ExtensionRuntime extends Disposable {
    instance!: Vim;
    docs: Record<string | number, TwoWayDocument | undefined> = {};
    active: TwoWayDocument | undefined;
    creatingDocument?: (val: any[]) => any;
    onModeChanged!: (cb: (newMode: ParsedMode) => any) => any;
    modeChanged!: (newMode: ParsedMode) => void;
    changes = new FIFOQueue<() => any>();
    mainTab!: Tabpage;
    highlights: Record<number, VimHighlightUIAttributes> = {};
    visualForeground?: string;
    insertForeground?: string;
    selectDecorator!: TextEditorDecorationType;
    configNewDocument: TaskDescriptor<TwoWayDocument> = TaskDescriptor.create();
    keyFromVsCode: TaskDescriptor<number> = TaskDescriptor.create();
    modeLock: Promise<void> = Promise.resolve();
    tabsByVscodeFilepath: Record<string, TwoWayDocument> = {};
    tabsByVimId: Record<string, TwoWayDocument> = {};
    
    constructor() {
        super();
        this.asyncConstructor();
    }
    protected async asyncConstructor() {
        const modeHandler = createEventHandler();
        this.modeChanged = modeHandler.emit;
        this.onModeChanged = modeHandler.on;


        this.configNewDocument
            .tap(() => { })
            .tap(() => { });


        await createVim(this);

        this.subscribe(() => this.instance.quit());
        this.subscribe(workspace.onDidCloseTextDocument(this.onDocumentClosed, this));
        return this;
    }

    buf_attach(ev: any) {

    }

    private onDocumentClosed(doc: TextDocument) {

    }
}
