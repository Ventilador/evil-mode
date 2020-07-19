import { Runtime } from "..";

export function grid_line(this: Runtime, gridId: number, calls: [number, number, number, any[]][]) {
    if (gridId === 1) { return; }

    const state = this.getStateByGridId(gridId) || this.lookingForAGrid(gridId, calls);
    if (state) {
        state.grid.update(calls);
    }
}
