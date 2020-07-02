import { TextEditor } from "vscode";
import { ExtensionRuntime } from "../../ExtensionRuntime";
import { TwoWayDocument } from "../../TwoWayDocument";
import { Tabpage } from "neovim";

export function get_tab(runtime: ExtensionRuntime): (editor: TextEditor) => Promise<TwoWayDocument> {
    return editor => {
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
    };

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

}
