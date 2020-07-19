import { TextEditor } from "vscode";

export function getDocLines(editor: TextEditor): string[] {
    return (editor as any)._documentData._lines;
}