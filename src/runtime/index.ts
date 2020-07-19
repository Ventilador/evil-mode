import { DocumentState, VimHighlightUIAttributes, ModeInfo } from "../types/something";
import { runVim } from "../utils/run-nvim";
import { redraw } from "./redraw";
import { FIFOQueue } from "../utils/queue";
import { tryCatchVoid } from "../utils/noop";
import { TextEditor, window } from "vscode";
import { focus } from "./focus";
import { createLookingForAGrid } from "./newGrid";
import { stat } from "fs";

export function createRuntime() {
    const stateByGrid: Record<number, DocumentState | undefined> = {};
    const stateByFile: Record<string, DocumentState | undefined> = {};
    const stateByBuffer: Record<number, DocumentState | undefined> = {};
    const stateByTab: Record<number, DocumentState | undefined> = {};
    const queue = new FIFOQueue<() => any>();
    const defaultColors = {} as any;
    const highlights = {};
    const highlightGroups = {};
    const modes: ModeInfo[] = [];
    const runtime: Runtime = { getStateByGridId, lookingForAGrid, dispose, nextTick, defaultColors, highlights, highlightGroups, modes };
    return runVim(dispatcher)
        .then(vim => {
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
                window.onDidChangeActiveTextEditor(documentChanged);
                documentChanged(window.activeTextEditor);
                function documentChanged(editor?: TextEditor) {
                    if (!editor) {
                        return;
                    }

                    const fileName = editor.document.fileName;
                    const state = stateByFile[fileName];
                    if (state) {
                        if (state === runtime.activaState) {
                            return;
                        }

                        focus(state, vim);
                        runtime.activaState = state;
                        return;
                    }

                    runtime.lookingForAGrid = createLookingForAGrid(editor, runtime, vim, onCreateNewState);
                }
                return runtime;
            });
        });
    function onCreateNewState(state: DocumentState, ready: Promise<any>) {
        stateByGrid[state.grid.id] = state;
        stateByFile[state.editor.document.fileName] = state;
        ready.then(() => {
            stateByBuffer[state.buffer().id] = state;
            stateByTab[state.tabpage().id] = state;
        });
        runtime.activaState = state;
        return state;
    }
    function lookingForAGrid() {
        return undefined;
    }
    function getStateByGridId(id: number) {
        return stateByGrid[id];
    }
    function dispatcher(ev: string, args: any[]) {
        if (ev === 'redraw') {
            if (redraw(runtime, args)) {
                queue.flush(callEach);
            }
        }
    }
    function nextTick(cb: () => any) {
        queue.add(cb);
    }
    function dispose() {

    }

}
function callEach(cb: () => any) {
    if (process.env.NODE_ENV !== 'production') {
        tryCatchVoid(cb)();
    } else {
        cb();
    }
}
export type Runtime = {
    defaultColors: {
        foreground: number;
        background: number;
        special: number;
    };
    activaState?: DocumentState;
    modes: ModeInfo[];
    highlightGroups: Record<string, number>;
    highlights: Record<string, VimHighlightUIAttributes>;
    lookingForAGrid: (gridId: number, data: [number, number, number, any[]][]) => DocumentState | undefined;
    getStateByGridId: (id: number) => DocumentState | undefined;
    dispose: () => void;
    nextTick: (cb: () => any) => void;
};
