import { Vim } from "../types/api";
import { Runtime } from "../runtime";

export function grid_line(vim: Vim, runtime: Runtime) {
    const grids = runtime.grids;
    return do_grid_line;
    function do_grid_line(gridId: number, row: number, col: number, data: any[]) {
        const grid = grids[gridId];
        if (grid) {
            grid.update(row, col, data);
        } else if (runtime.lookingForAGrid && runtime.lookingForAGrid(gridId, row, col, data)) {
            grids[gridId].update(row, col, data);
        } 
        // if (runtime.creatingDocument) {
        //     runtime.creatingDocument(arg);
        //     return;
        // }
        // const gridId = arg[0];
        // if (gridId === 1) { // main grid events (not our windows)
        //     return;
        // }
        // let maybe: TwoWayDocument | undefined;
        // if (known[gridId]) {
        //     maybe = known[gridId];
        // } else {
        //     maybe = runtime.active;
        //     if (!maybe) {
        //         return;
        //     }
        //     if (maybe.gridId !== gridId) {
        //         return;
        //     }
        //     known[gridId] = maybe;
        // }
        // maybe.ready.then((active) => process(arg, active.grid));
    };
}
