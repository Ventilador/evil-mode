import { ExtensionRuntime } from "../../ExtensionRuntime";
import { Vim } from "../../../types/api";
import { window, TextEditor } from "vscode";
import { TaskDescriptor } from "../../executor/BaseTaskDescriptor";
import { TwoWayDocument } from "../../TwoWayDocument";
import { Tabpage } from "neovim";
import { noop } from "../../../utils/noop";

export function override_keyboard(runtime: ExtensionRuntime, vim: Vim): ExtensionRuntime {
    runtime.subscribe(window.onDidChangeActiveTextEditor(tabChanged));
    const task = TaskDescriptor.create<TextEditor | undefined>();
    let locked = Promise.resolve();
    let released = noop;
    task.and_filter<TextEditor>(Boolean)
        .and_filter(tab_changed)
        .and_then(adquire)
        .and_then(get_tab)
        .and_then(activate)
        .and_then(release);

    return runtime;

    function tabChanged(editor?: TextEditor) {
        task.drop(editor);
    }

    function release() {
        released();
    }

    function adquire(editor: TextEditor) {
        return locked.then(() => {
            locked = new Promise(setLock);
            return editor;
        });
    }

    function tab_changed(editor: TextEditor) {
        return !runtime.active || editor !== runtime.active.editor;
    }

    function get_tab(editor: TextEditor) {
        const item = runtime.tabsByVscodeFilepath[editor.document.fileName];
        if (runtime.tabsByVscodeFilepath[editor.document.fileName]) {
            return item.ready;
        }

        if (runtime.active) {
            return createNewTab().then(withTabId).then(ready);
        }

        return getCurrentTab().then(withTabId).then(ready);

        function withTabId(id: Tabpage) {
            const doc = editor.document;
            const item = new TwoWayDocument(runtime, editor, id);
            return runtime.tabsByVscodeFilepath[doc.fileName] = runtime.tabsByVimId[id.data as number] = item;
        }
    }

    function ready(item: TwoWayDocument) {
        return item.ready;
    }

    function createNewTab() {
        return runtime.instance.nvim_command('tabnew')
            .then(getCurrentTab);
    }

    function getCurrentTab() {
        return runtime.instance.nvim_get_current_tabpage();
    }

    function activate(doc: TwoWayDocument) {
        runtime.active = doc;
        return Promise.all([doc.activate(), doc.sync()])
            .then(() => doc);
    }

    function setLock(fn: typeof noop) {
        released = fn;
    }
}