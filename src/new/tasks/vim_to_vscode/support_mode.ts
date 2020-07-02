import { ExtensionRuntime } from "../../ExtensionRuntime";
import { commands } from "vscode";

export async function support_mode(runtime: ExtensionRuntime) {
    let prev: { row: number, col: number } | undefined;
    let latestMode: string | undefined;
    runtime.instance.on('grid_cursor_goto', (grid, row, col) => {
        if (prev) {
            switch (latestMode) {
                case 'visual-block':
                    const prevRow = prev.row;
                    if (prevRow !== row) {
                        let length: number;
                        let action: string;
                        if (row > prevRow) {
                            length = row - prevRow;
                            action = 'cursorColumnSelectDown';
                        } else {
                            length = prevRow - row;
                            action = 'cursorColumnSelectUp';
                        }
                        while (length--) {
                            commands.executeCommand(action);
                        }
                    }
                    const prevCol = prev.col;
                    if (prevCol !== col) {
                        let length: number;
                        let action: string;
                        if (col > prevCol) {
                            length = col - prevCol;
                            action = 'cursorColumnSelectRight';
                        } else {
                            length = prevCol - col;
                            action = 'cursorColumnSelectLeft';
                        }
                        while (length--) {
                            commands.executeCommand(action);
                        }
                    }
                    break;
                case 'visual-line':
                    break;
                case 'visual':
                    break;
                default:
                    // selectPosition(row, col);
                    break;
            }
            prev = { row, col };
        } else {
            prev = { row, col };
            // selectPosition(row, col);
        }
    });
    return runtime;
}