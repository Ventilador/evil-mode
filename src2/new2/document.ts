import { Disposable } from "../new/disposable";
import { Vim } from "../types/api";
import { TextEditor, commands } from "vscode";
import { getDocLines } from "../utils/getLinesFromDoc";
import { Runtime } from "../runtime";
import { HighlightGrid } from "../utils/Grid";
import { Tab, Buf } from "../utils/mappers";

export function createDocument({ editor, vim, runtime }: CreateDocumentArgument) {
    if (runtime.lookingForAGrid) {
        throw new Error('Cannot search for grid, already in use');
    }
    const lines = getDocLines(editor).slice();
    let maybeSaving: Thenable<any> | undefined;
    if (lines[lines.length - 1]) {
        maybeSaving = commands.executeCommand('workbench.action.files.save');
    } else {
        lines.pop();
    }

    return vim.nvim_call_atomic([
    /*0*/['nvim_command', ['tabnew']],
    /*1*/['nvim_buf_set_lines', [0, 0, 0, true, lines]],
    /*2*/['nvim_get_current_tabpage', []],
    /*3*/['nvim_tabpage_get_win', [0]],
    /*4*/['nvim_win_get_buf', [0]],
    /*5*/['nvim_buf_attach', [0, false, {}]]
    ]).then((results) => {
        const tab: Tab = results[3];
        const buf: Buf = results[4];
        runtime.lookingForAGrid = function (id: number, row: number, col: number, data: any[]) {
            if (row === 0 && col === 0 && data[0]) {
                const file = editor.document.fileName;
                runtime.grids[file] = runtime.grids[id] = new HighlightGrid({ editor, runtime, tab, buf, id });
                runtime.lookingForAGrid = undefined;
                return true;
            }

            return false;
        };

        return maybeSaving;
    });


}

export type CreateDocumentArgument = {
    editor: TextEditor;
    vim: Vim,
    runtime: Runtime;
};

export class Document extends Disposable {
    constructor() {
        super();
    }
}
