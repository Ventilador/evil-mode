import { Runtime } from "..";
import { grid_line } from "./grid_line";
import { grid_cursor_goto } from "./grid_cursor_goto";
export function redraw(runtime: Runtime, args: any[]) {
    return args.some(dispatchRedraw, runtime);
}
const missedEvents: any = {};
function dispatchRedraw(this: Runtime, val: any) {
    const event: string = val[0];
    switch (event) {
        case 'option_set':
        case 'grid_resize':
        case 'grid_clear':
        case 'msg_set_pos':
        case 'mode_change':
        case 'win_pos':
        case 'win_hide':
            return;
        case 'grid_line':
            let from = 1;
            let lastId = val[1][0];
            for (let j = 2; j < val.length; j++) {
                if (val[j][0] !== lastId) {
                    grid_line.call(this, lastId, val.slice(from, j));
                    lastId = val[j][0];
                    from = j;
                }
            }
            grid_line.call(this, lastId, val.slice(from, val.length));
            return;
        case 'default_colors_set':
            const colors = val[1];
            this.defaultColors.foreground = colors[0];
            this.defaultColors.background = colors[1];
            this.defaultColors.special = colors[2];
            return;
        case 'hl_attr_define':
            for (let i = 1; i < val.length; i++) {
                const cur = val[i];
                this.highlights[cur[0]] = Object.assign({}, this.defaultColors, cur[1], cur[3][0]);
            }
            return;
        case 'hl_group_set':
            for (let i = 1; i < val.length; i++) {
                this.highlightGroups[val[i][0]] = val[i][1];
            }
            return;
        case 'grid_cursor_goto':
            grid_cursor_goto.apply(this, val[1]);
            return;
        case 'mode_info_set':
            const data = val[1][1];
            for (let j = 0; j < data.length; j++) {
                this.modes.push(data[j]);
            }
            return;
        case 'flush':
            return true;
    }

    if (process.env.NODE_ENV !== 'production' && !missedEvents[event]) {
        missedEvents[event] = true;
        console.log('Missing:', `[${Object.keys(missedEvents).join(', ')}]`);
        debugger;
    }
}
