import { ExtensionRuntime } from "../../ExtensionRuntime";
import { commands } from "vscode";
import { Keystroke, Vim } from "../../../types/api";
import { KEYS } from "../../../keys/Keys";
const cache: any = {};
export function override_keyboard(runtime: ExtensionRuntime, vim: Vim): ExtensionRuntime {
    runtime.subscribe(commands.registerCommand('type', ({ text }: { text: string }) => {
        for (let i = 0; i < text.length; i++) {
            vim.nvim_input(KEYS.fromKeyCode(text.charCodeAt(i)));
        }
    }));
    runtime.subscribe(commands.registerCommand('evil.key', ev => {
        debugger;
    }));
    return runtime;
    function send(key: Keystroke) {
        // keyFromVsCode.drop(key);
    }
}
