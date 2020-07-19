import { HighlightGrid } from "../utils/Grid";
import { TextEditor } from "vscode";
import { Buf, Tab, Win } from "../utils/mappers";

export interface VimHighlightUIAttributes {
    hi_name: string;
    foreground: number;
    background: number;
    id: number;
    kind: string;
    special: number;
    reverse?: boolean;
    italic?: boolean;
    bold?: boolean;
    strikethrough?: boolean;
    // has special color
    underline?: boolean;
    // has special color
    undercurl?: boolean;
    blend?: number;
}

export type DocumentState = {
    grid: HighlightGrid;
    editor: TextEditor;
    buffer: Buf;
    tabpage: Tab;
    window: Win
};
