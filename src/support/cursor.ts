// import { Vim } from "../types/api";
// import { Disposable, window, commands, Position, Selection } from "vscode";

// import { BaseDisposable } from "../utils/dispose";
// import { SupportMode, ValidMode } from "./mode";
// export class SupportCursor extends BaseDisposable {
//     private prev?: { col: number; row: number };
//     constructor(instance: Promise<Vim>, mode: SupportMode) {
//         super();
//         let latestMode = '';
//         mode.onChanged = function (newMode: ValidMode) {
//             latestMode = newMode;
//         };
//         instance.then(vim => {
//             vim.on('grid_cursor_goto', (grid, row, col) => {
//                 if (this.prev) {
//                     switch (latestMode) {
//                         case 'visual-block':
//                             const prevRow = this.prev.row;
//                             if (prevRow !== row) {
//                                 let length: number;
//                                 let action: string;
//                                 if (row > prevRow) {
//                                     length = row - prevRow;
//                                     action = 'cursorColumnSelectDown';
//                                 } else {
//                                     length = prevRow - row;
//                                     action = 'cursorColumnSelectUp';
//                                 }
//                                 while (length--) {
//                                     commands.executeCommand(action);
//                                 }
//                             }
//                             const prevCol = this.prev.col;
//                             if (prevCol !== col) {
//                                 let length: number;
//                                 let action: string;
//                                 if (col > prevCol) {
//                                     length = col - prevCol;
//                                     action = 'cursorColumnSelectRight';
//                                 } else {
//                                     length = prevCol - col;
//                                     action = 'cursorColumnSelectLeft';
//                                 }
//                                 while (length--) {
//                                     commands.executeCommand(action);
//                                 }
//                             }
//                             break;
//                         case 'visual-line':
//                             break;
//                         case 'visual':
//                             break;
//                         default:
//                             selectPosition(row, col);
//                             break;
//                     }
//                     this.prev = { row, col };
//                 } else {
//                     this.prev = { row, col };
//                     selectPosition(row, col);
//                 }
//             });
//             vim.on('cursor_goto', (row, col) => {
//                 debugger;
//             });

//             function selectPosition(row: number, col: number) {
//                 const edit = window.activeTextEditor;
//                 if (edit) {
//                     edit.selection = new Selection(new Position(row, col), new Position(row, col));
//                 }
//             }

//             function diffs(row: number, col: number) {

//             }
//         });


//     }
// }
