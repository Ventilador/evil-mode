import { Runtime } from "../runtime";
import { Vim } from "../types/api";


export function grid_cursor_goto(runtime: Runtime) {
    const grids = runtime.grids;
    return function (gridId: number, row: number, col: number) {
        const grid = grids[gridId];
        if (grid) {
            grid.moveCursor(row, col);
        }
    };
}
