import { ExtensionRuntime } from "../../ExtensionRuntime";
import { Vim } from "../../../types/api";
import { TextDocumentSaveReason, Position, Range } from "vscode";
import { TwoWayDocument } from "../../TwoWayDocument";

export function buffer_changes(runtime: ExtensionRuntime, vim: Vim) {
    vim.addListener('nvim_buf_changedtick_event', () => {

    });
    vim.addListener('nvim_buf_lines_event', (args) => {
        const [buffer, tick, from, to, chars] = args;
        const doc = runtime.tabsByVimId[buffer.id];
        const eol = doc.editor.document.eol === 1 ? '\n' : '\r\n';
        const text = chars.join(eol) + eol;
        doc.ready = doc.editor.edit(edit => {
            edit.replace(new Range(new Position(from, 0), new Position(to, 0)), text);
        }).then(() => {
            return doc;
        }) as Promise<TwoWayDocument>;
    });
}
