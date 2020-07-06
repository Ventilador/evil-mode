import { Vim } from "../types/api";
import { EventEmitter } from "events";
import { spawn } from "child_process";
import { attach } from "neovim";
import { ExtensionRuntime } from "../new/ExtensionRuntime";
import { support_mode } from "../new/tasks/vim_to_vscode/support_mode";
import { override_keyboard } from "../new/tasks/vscode_to_vim/override_keyboard";
import { tab_switch } from "../new/tasks/vscode_to_vim/tab_switch";
import { patch_events } from "../new/tasks/vim_to_vscode/patch_events";
import { patch_keybindings } from "../new/tasks/inits/patch_keybindings";
import { update_mode } from "../new/tasks/vscode_status_bar/update_mode";
import { support_highlight } from "../new/tasks/vim_to_vscode/support_highlight";
import { paint } from "../new/tasks/vim_to_vscode/paint";
import { noop } from "./noop";
import { baseOptions } from "./vimrc";
import { move_cursor } from "../new/tasks/vim_to_vscode/move_cursor";
import { cursor_style } from "../new/tasks/vim_to_vscode/cursor_style";
import { buffer_changes } from "../new/tasks/vim_to_vscode/buffer_changes";
import { run } from "./run-nvim";
export function createVim(runtime: ExtensionRuntime): Promise<any> {
    return run().then(instance => {
        runtime.instance = instance;
        update_mode(runtime);
        cursor_style(runtime);

        buffer_changes(runtime, instance);
        paint(runtime, instance);
        support_mode(runtime, instance);
        move_cursor(runtime, instance);
        support_highlight(runtime, instance);
        override_keyboard(runtime, instance);
        tab_switch(runtime, instance);
        patch_keybindings(runtime, instance);
        return instance.nvim_call_atomic(baseOptions.map(i => ['nvim_command', [i]])).then(attachUI);
        function attachUI() {
            return instance.nvim_ui_attach(200, 100, {
                ext_hlstate: true,
                ext_linegrid: true,
                ext_multigrid: true,

                ext_cmdline: false,
                ext_tabline: false,
                ext_popupmenu: false,
                ext_messages: false,
                ext_termcolors: false,
                rgb: false,
            } as any);
        }
    });
}
