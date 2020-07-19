import { ExtensionRuntime } from "../../ExtensionRuntime";
import { commands } from "vscode";
import { Vim } from "../../../types/api";
import { fromChar, fromCode } from "../../../keys";
const cache: any = {};
function log() {

}
export function override_keyboard(runtime: ExtensionRuntime, vim: Vim): void {
    runtime.subscribe(commands.registerCommand('type', ({ text }: { text: string }) => {
        if (text.length > 1) {
            vim.nvim_input(text.split('').map(mapInvalidKeys).join(''));
        } else {
            vim.nvim_input(mapInvalidKeys(text));
        }
    }));

    function mapInvalidKeys(key: string) {
        switch (key) {
            case '<':
                return '<lt>';
            case '|':
                return '<Bar>';
            case '\\':
                return '<Bslash>';
            case ' ':
                return '<Space>';
            case '\r':
            case '\n':
                return '<CR>';
            case '\t':
                return '<Tab>';
            default:
                return key;
        }
    }

    runtime.subscribe(commands.registerCommand('evil.nvim_input', ev => {
        vim.nvim_input(ev);
    }));
}
