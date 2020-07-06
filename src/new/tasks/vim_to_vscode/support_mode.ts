import { ExtensionRuntime } from "../../ExtensionRuntime";
import { commands, TextEditorCursorStyle } from "vscode";
import { Vim } from "../../../types/api";
import { fromChar } from "../../../keys";
export type ParsedMode = {
    text: string;
    color: string | undefined;
    cursor: TextEditorCursorStyle;
}
export type Mode = 'normal' | 'insert' | 'visual-block' | 'visual-line' | 'visual' | 'replace';
export function support_mode(runtime: ExtensionRuntime, vim: Vim): void {
    vim.on('mode_change', () => {
        getLatestMode().then(parseMode).then(runtime.modeChanged);
    });
    /**
     * switch (mode) {
            case 'replace':
                text = '-- REPLACE --';
                break;
            case 'insert':
                text = '-- INSERT --';
                color = runtime.insertForeground;
                break;
            case 'normal':
                text = '-- NORMAL --';
                break;
            case 'visual':
            case 'visual-block':
            case 'visual-line':
                text = '-- VISUAL --';
                color = runtime.visualForeground;
                break;
        }
     */
    const modesCache = {
        n: {
            text: '-- NORMAL --',
            color: undefined,
            cursor: TextEditorCursorStyle.Block
        },
        i: {
            text: '-- INSERT --',
            color: undefined,
            cursor: TextEditorCursorStyle.Line
        },
        r: {
            text: '-- REPLACE --',
            color: undefined,
            cursor: TextEditorCursorStyle.Underline
        },
        V: {
            text: '-- VISUAL LINE --',
            color: undefined,
            cursor: TextEditorCursorStyle.Block
        },
        v: {
            text: '-- VISUAL --',
            color: undefined,
            cursor: TextEditorCursorStyle.Block
        },
        '<S-r>': {
            text: '-- REPLACE --',
            color: undefined,
            cursor: TextEditorCursorStyle.Underline
        },
        '<C-v>': {
            text: '-- VISUAL BLOCK --',
            color: undefined,
            cursor: TextEditorCursorStyle.Block
        },
    } as Record<string, ParsedMode>;

    function parseMode(a: { mode: string }): ParsedMode {
        const mode = a.mode;
        const result = fromChar(mode);
        const maybeResult = modesCache[result];
        if (maybeResult) {
            return maybeResult;
        }

        debugger;
        throw new Error('Unknown mode');
    }

    function getLatestMode(): Promise<{ mode: string }> {
        return vim.nvim_get_mode() as any;
    }
}
