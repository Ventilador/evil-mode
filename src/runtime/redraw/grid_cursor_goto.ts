import { Runtime } from "..";

export function grid_cursor_goto(this: Runtime, gridId: number, row: number, col: number) {
    const state = this.getStateByGridId(gridId);
    if (state) {
        state.grid.moveCursor(row, col);
    }
}
