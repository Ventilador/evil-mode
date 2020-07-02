import { ExtensionRuntime } from "../../ExtensionRuntime";
import { commands } from "vscode";

export function override_keyboard(runtime: ExtensionRuntime): ExtensionRuntime {
    runtime.subscribe(commands.registerCommand('type', ev => {
        runtime.keyFromVsCode.drop(ev.text);
    }));
    runtime.subscribe(commands.registerCommand('evil.key', ev => {
        debugger;
    }));
    return runtime;
}