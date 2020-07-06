import { ExtensionRuntime } from "../../ExtensionRuntime";
import { Vim } from "../../../types/api";

export function move_cursor(runtime: ExtensionRuntime, vim: Vim) {
    vim.on('grid_cursor_goto', ([grid, row, col]) => {
        if (!runtime.active) {
            return;
        }

        if (runtime.active.gridId !== grid) {
            return;
        }

        runtime.active.ready.then((c) => c.grid.moveCursor(row, col));
    });


}
