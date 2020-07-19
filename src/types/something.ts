import { TextEditor } from "vscode";
import { Buf, Tab, Win } from "../utils/mappers";
import { HighlightGrid } from "./HighlightGrid";

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
export enum CursorShape {
    Block = "block",
    Horizontal = "horizontal",
    Vertical = "vertical",
}
export enum ModeName {
    normal = "normal",
    visual = "visual",
    insert = "insert",
    replace = "replace",
    cmdline_normal = "cmdline_normal",
    cmdline_insert = "cmdline_insert",
    cmdline_replace = "cmdline_replace",
    operator = "operator",
    visual_select = "visual_select",
    cmdline_hover = "cmdline_hover",
    statusline_hover = "statusline_hover",
    statusline_drag = "statusline_drag",
    vsep_hover = "vsep_hover",
    vsep_drag = "vsep_drag",
    more = "more",
    more_lastline = "more_lastline",
    showmatch = "showmatch",
}
export enum ShortModeName {
    normal = "n",
    visual = "v",
    insert = "i",
    replace = "r",
    cmdline_normal = "c",
    cmdline_insert = "ci",
    cmdline_replace = "cr",
    operator = "o",
    visual_select = "ve",
    cmdline_hover = "e",
    statusline_hover = "s",
    statusline_drag = "sd",
    vsep_hover = "vs",
    vsep_drag = "vd",
    more = "m",
    more_lastline = "ml",
    showmatch = "sm",
}
export interface ModeInfo {
    attr_id: number
    attr_id_lm: number
    blinkoff: number
    blinkon: number
    blinkwait: number
    cell_percentage: number
    cursor_shape: CursorShape
    hl_id: number
    id_lm: number
    mouse_shape: number
    name: ModeName
    short_name: ShortModeName
}

export type DocumentState = {
    grid: HighlightGrid;
    editor: TextEditor;
    buffer: () => Buf;
    tabpage: () => Tab;
    window: () => Win
};
