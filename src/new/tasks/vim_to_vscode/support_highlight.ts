import { ExtensionRuntime } from "../../ExtensionRuntime";
import { Vim } from "../../../types/api";
import { noop } from "../../../utils/noop";
import { VimHighlightUIAttributes } from "../../../types/something";
import { window, Selection, Position } from "vscode";

export function support_highlight(runtime: ExtensionRuntime, vim: Vim) {
    const defaultItems = {
        foreground: 0,
        background: 0,
        special: 0
    };
    vim.on('hl_attr_define', ([id, rgb_attrs, _, info]: [number/*id*/, Record<string, any>/*rgb_attrs*/, Record<string, any>/*cterm_attrs*/, any[]/*info*/]) => {
        const item: VimHighlightUIAttributes = runtime.highlights[id] = Object.assign({}, defaultItems, rgb_attrs, info[0]);
        const name: string = item.hi_name?.toLowerCase();
        if (name?.includes('visual')) {
            runtime.visualForeground = "#" + item.foreground.toString(16);
        } else if (name?.includes('inse')) {
            runtime.insertForeground = "#" + item.foreground.toString(16);
        }
    });

    vim.on('default_colors_set', ([rgb_fg, rgb_bg, rgb_sp, cterm_fg, cterm_bg, ...more]: [number/*rgb_fg*/, number/*rgb_bg*/, number/*rgb_sp*/, number/*cterm_fg*/, number/*cterm_bg*/]) => {
        defaultItems.foreground = rgb_fg;
        defaultItems.background = rgb_bg;
        defaultItems.special = rgb_sp;
    });
}

