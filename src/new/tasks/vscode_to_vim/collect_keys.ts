import { ExtensionRuntime } from "../../ExtensionRuntime";
import { Keystroke, Vim } from "../../../types/api";

export function collect_keys(runtime: ExtensionRuntime, vim: Vim) {
    let lock: Function | undefined;
    let lockPromise: Promise<void> | undefined;
    let collected: number[] | undefined;
    runtime.keyFromVsCode
        .and_then(debounce)
        .and_then(map_keys)
        .and_then(sendToVim);

    function debounce(text: number) {
        if (lockPromise) {
            collected!.push(text);
        } else {
            collected = [text];
            lockPromise = new Promise(save_lock);
        }

        return lockPromise;
    }
    function sendToVim(keystrokes: string) {
        if (keystrokes) {
            runtime.instance.nvim_input(keystrokes);
        }
    }
    function map_keys() {
        if (collected) {

        }
        return '';
    }
    function save_lock(s: Function) {
        lock = s;
    }
}