import { ExtensionRuntime } from "../../ExtensionRuntime";
import { Vim } from "../../../types/api";
import { window, TextEditor } from "vscode";
import { TaskDescriptor } from "../../executor/BaseTaskDescriptor";
import { TwoWayDocument } from "../../TwoWayDocument";
import { Tabpage } from "neovim";
import { noop } from "../../../utils/noop";

export function tab_switch(runtime: ExtensionRuntime, vim: Vim): void {
    runtime.subscribe(window.onDidChangeActiveTextEditor(tabChanged));
    const task = TaskDescriptor.create<TextEditor | undefined>();
    let released = noop;
    task.and_filter<TextEditor>(Boolean)
        .and_filter(tab_changed)
        .and_then(get_tab)
        .and_then(activate_and_sync)
        .and_then(release);

    task.drop(window.activeTextEditor);


    function tabChanged(editor?: TextEditor) {
        task.drop(editor);
    }

    function release() {
        released();
    }



    function tab_changed(editor: TextEditor) {
        return !runtime.active || editor !== runtime.active.editor;
    }

    function get_tab(editor: TextEditor) {
        let item = runtime.tabsByVscodeFilepath[editor.document.fileName];
        if (runtime.tabsByVscodeFilepath[editor.document.fileName]) {
            return item.ready;
        }

        const doc = editor.document;
        item = new TwoWayDocument(runtime, editor);
        runtime.active = item;
        runtime.tabsByVscodeFilepath[doc.fileName] = item;
        return item.ready;

    }


    function activate_and_sync(doc: TwoWayDocument) {
        return doc.activate();
    }

}