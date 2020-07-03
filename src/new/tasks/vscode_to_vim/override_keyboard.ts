import { ExtensionRuntime } from "../../ExtensionRuntime";
import { commands } from "vscode";
import { Keystroke } from "../../../types/api";
import { KEYS } from "../../../keys/Keys";
const cache: any = {};
export function override_keyboard(runtime: ExtensionRuntime): ExtensionRuntime {
    const keyFromVsCode = runtime.keyFromVsCode;
    runtime.subscribe(commands.registerCommand('type', ({ text }: { text: string }) => {
        for (let i = 0; i < text.length; i++) {
            send(KEYS.fromKeyCode(text.charCodeAt(i)));
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
