import { TextEditor, commands } from "vscode";
import { Runtime } from ".";
import { Vim } from "../types/api";
import { getDocLines } from "../utils/getLinesFromDoc";
import { DocumentState } from "../types/something";
import { HighlightGrid } from "../types/HighlightGrid";
import { Tab, Win, Buf } from "../utils/mappers";
import { encode } from "querystring";

export function createLookingForAGrid(editor: TextEditor, runtime: Runtime, vim: Vim, newState: (docState: DocumentState, ready: Promise<any>) => DocumentState) {
    const lines = getDocLines(editor).slice();
    if (lines[lines.length - 1]) {
        commands.executeCommand('workbench.action.files.save');
    } else {
        lines.pop();
    }
    let tab: Tab, win: Win, buf: Buf, ready: Promise<any>;
    if (runtime.activaState) {
        ready = vim.nvim_call_atomic([
            ['nvim_command', ['tabnew']],
            ['nvim_buf_set_lines', [0, 0, 0, true, lines]],
            ['nvim_get_current_tabpage', []],
            ['nvim_tabpage_get_win', [0]],
            ['nvim_win_get_buf', [0]],
        ])
            .then(([[_, __, tabItem, windowItem, bufItem]]) => {
                tab = tabItem;
                win = windowItem;
                buf = bufItem;
            });
    } else {
        ready = vim.nvim_call_atomic([
            ['nvim_buf_set_lines', [0, 0, 0, true, lines]],
            ['nvim_get_current_tabpage', []],
            ['nvim_tabpage_get_win', [0]],
            ['nvim_win_get_buf', [0]],
        ])
            .then(([[_, __, tabItem, windowItem, bufItem]]) => {
                tab = tabItem;
                win = windowItem;
                buf = bufItem;
            });
    }
    return function (id: number, data: [number, number, number, any[]][]) {
        for (let i = 0; i < data.length; i++) {
            const row = data[i][1];
            let cursor = data[i][2];
            const lineData = data[i][3];
            const line = lines[row];
            for (let j = 0; j < lineData.length; j++, cursor++) {
                const cur = lineData[j];
                if (cur[0] !== line[cursor]) {
                    if (cur[0] === ' ' && cursor >= line.length) {
                        break;
                    }
                    return;
                }
                if (cur.length > 2) {
                    // minus one because we already checked this char
                    for (let k = 0; k < cur[2] - 1; k++) {
                        if (cur[0] !== line[++cursor]) {
                            return;
                        }
                    }
                }
            }
        }
        // if (data === lines) {
        //     return newState({
        //         editor,
        //         grid: new HighlightGrid({ runtime, editor, id }),
        //         buffer: () => buf,
        //         tabpage: () => tab,
        //         window: () => win
        //     }, ready);
        // }
        return undefined;
    };
}
