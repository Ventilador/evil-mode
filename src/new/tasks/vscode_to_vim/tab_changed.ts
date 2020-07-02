import { ExtensionRuntime } from "../../ExtensionRuntime";
import { TextEditor } from "vscode";

export function tab_changed(runtime: ExtensionRuntime) {
    return (editor: TextEditor) => {
        return !runtime.active || editor !== runtime.active.editor;
    };
}