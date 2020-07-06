import { ExtensionRuntime } from "../../ExtensionRuntime";
import { commands } from "vscode";
import { Vim } from "../../../types/api";
import { fromChar, fromCode } from "../../../keys";
const cache: any = {};
export function override_keyboard(runtime: ExtensionRuntime, vim: Vim): void {
    runtime.subscribe(commands.registerCommand('type', ({ text }: { text: string }) => {
        vim.nvim_input(text.split('').map(mapInvalidKeys).join(''));
    }));

    function mapInvalidKeys(key: string) {
        switch (key) {
            case '<':
                return '<lt>';
            case '|':
                return '<Bar>';
            case '\\':
                return '<Bslash>';
            default:
                return key;
        }
    }

    runtime.subscribe(commands.registerCommand('evil.key', ev => {
        vim.nvim_input(fromCode(+ev));
    }));
}
