import { ExtensionRuntime } from "../../ExtensionRuntime";
import { Vim } from "../../../types/api";
import { VimHighlightUIAttributes } from "../../../types/something";
import { HighlightGrid } from "../../../utils/Grid";
import { TwoWayDocument } from '../../TwoWayDocument';
import { createWriteStream } from 'fs';
import { noop } from "../../../utils/noop";
import { promisify } from "util";
import { Tabpage, Buffer, Window } from "neovim";
const known: Record<number, TwoWayDocument> = {} as any;
const append = createWriteStream('C:/Projects/evil-mode/logs.log');
function write(text: string) {
    cur = cur.then(() => {
        return new Promise(r => append.write(text, r as any));
    });
}
let cur = Promise.resolve();

export function paint(runtime: ExtensionRuntime, vim: Vim) {
    const highlights = runtime.highlights;
    let lastId: number = -1;
    vim.on('grid_line', (arg: GridlineArgs) => {
        if (runtime.creatingDocument) {
            runtime.creatingDocument(arg);
            return;
        }
        const gridId = arg[0];
        if (gridId === 1) { // main grid events (not our windows)
            return;
        }
        let maybe: TwoWayDocument | undefined;
        if (known[gridId]) {
            maybe = known[gridId];
        } else {
            maybe = runtime.active;
            if (!maybe) {
                return;
            }
            if (maybe.gridId !== gridId) {
                return;
            }
            known[gridId] = maybe;
        }
        maybe.ready.then((active) => process(arg, active.grid));
    });
    vim.on('flush', () => {
        lastId = -1;
        runtime.changes.flush((action) => {
            action();
        });
    });

    function process(arg: GridlineArgs, currentGrid: HighlightGrid) {
        // const currentGrid = active.grid;
        currentGrid.record();


        const row = arg[1];
        let col = arg[2];
        const dataArray = arg[3];

        for (let i = 0; i < dataArray.length; i++) {
            let data = dataArray[i];
            if (data.length > 1) {
                lastId = data[1]!;
            }
            if (lastId === -1) {
                throw new Error('Unreachable!');
            }
            if (lastId === 0) {
                let start = col;
                let end = start;
                while (i < dataArray.length) {
                    data = dataArray[i];
                    if (data.length > 1 && lastId !== data[1]) {
                        break;
                    }

                    if (data.length > 2) {
                        end += data[0].length * data[2]!;
                        i++;
                    } else {
                        end += data[0].length;
                        i++;
                    }
                }

                currentGrid.removeHighlight(row, start, end);
            } else {
                const highlight = highlights[lastId];
                if (highlight && shouldProcess(highlight)) {
                    let start = col;
                    let end = start;
                    while (i < dataArray.length) {
                        data = dataArray[i];
                        if (data.length > 1 && lastId !== data[1]) {
                            break;
                        }

                        if (data.length > 2) {
                            end += data[0].length * data[2]!;
                            i++;
                        } else {
                            end += data[0].length;
                            i++;
                        }
                    }

                    currentGrid.addHighlight(row, start, end);
                }
            }
        }
    }

}
function shouldProcess(hl: VimHighlightUIAttributes) {
    return 'Visual' === hl.hi_name;
    // return 'NonText' !== hl.hi_name &&
    //     'StatusLine' !== hl.hi_name &&
    //     'SpecialKey' !== hl.hi_name &&
    //     'MsgArea' !== hl.hi_name &&
    //     'TabLineSel' !== hl.hi_name &&
    //     'TabLineFill' !== hl.hi_name &&
    //     'TabLine' !== hl.hi_name;
}
type DataType = [string, number?, number?];
type GridlineArgs = [number/*grid*/, number/*row*/, number/*col_start*/, DataType[]/*data*/];
