import { ExtensionRuntime } from "../../ExtensionRuntime";

export function collect_keys(runtime: ExtensionRuntime) {
    runtime.keyFromVsCode
        .and_then(text => {

        });


    function sendToVim(keystrokes: string) {
        runtime.instance.nvim_input(keystrokes);
    }
}