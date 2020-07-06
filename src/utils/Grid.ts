import { Disposable } from "../new/disposable";
import { ExtensionRuntime } from "../new/ExtensionRuntime";
import { Position, Range, commands, Selection, TextEditorCursorStyle } from "vscode";
import { TwoWayDocument } from "../new/TwoWayDocument";

export class HighlightGrid extends Disposable {
    private cachedLines: CachedLine[] = [];
    private queued = false;
    moveCursor: (row: number, col: number) => any;
    constructor(private doc: TwoWayDocument, private runtime: ExtensionRuntime) {
        super();
        const editor = doc.editor;
        this.moveCursor = (row, col) => {
            if (row === editor.selection.active.line && col === editor.selection.active.character) {
                return;
            }

            tryMovin(row, col).then(after(row, col));
        };
        function after(row: number, col: number) {
            return function () {
                if (row >= editor.document.lineCount) {
                    debugger;
                }
                if (editor.selection.active.character !== col || editor.selection.active.line !== row) {
                    editor.selection = new Selection(new Position(row, col), new Position(row, col));
                }
            };
        }
        function tryMovin(row: number, col: number) {
            const selected = editor.selection.active;
            const vertical = selected.line - row;
            const horizontal = selected.character - col;
            const proms = [];

            if (vertical) {
                proms.push(commands.executeCommand('cursorMove', {
                    to: vertical > 0 ? 'up' : 'down',
                    value: Math.abs(vertical)
                }));
            }

            if (horizontal) {
                proms.push(commands.executeCommand('cursorMove', {
                    to: horizontal > 0 ? 'left' : 'right',
                    value: Math.abs(horizontal)
                }));
            }

            if (proms.length === 0) {
                throw new Error('No action');
            }

            if (proms.length === 1) {
                return proms[0];
            }
            return Promise.all(proms);
        }
    }

    cursorStyle(style: TextEditorCursorStyle) {
        this.doc.editor.options.cursorStyle = style;
    }

    addHighlight(row: number, col: number, span: number) {
        this.getCachedLine(row).highlight(col, span);
    }
    removeHighlight(row: number, col: number, span: number) {
        this.getCachedLine(row).remove(col, span);
    }

    record() {
        if (!this.queued) {
            this.queued = true;
            this.runtime.changes.add(this.flush);
        }
    }

    private getCachedLine(row: number) {
        let cur: CachedLine;
        if (row < this.cachedLines.length) {
            cur = this.cachedLines[row];
        } else {
            while (row > this.cachedLines.length) {
                this.cachedLines.push(new CachedLine(this.cachedLines.length));
            }
            // the "while" completes the array *UP TO* the row in question, not the row itself
            // thats why we need to push (if its the first time reaching _out fo bounds_)
            cur = new CachedLine(this.cachedLines.length);
            this.cachedLines.push(cur);
        }
        return cur;
    }

    private flush = () => {
        this.queued = false;
        this.doc.editor.setDecorations(this.doc.selectDecorator, this.cachedLines.reduce((prev, cur) => {
            return prev.concat(cur.selections());
        }, [] as Range[]));
    };
}

class CachedLine {
    tentatives: number[] = [];
    private changed = false;
    private last: Range[] = [];
    constructor(private row: number) { }
    highlight(from: number, to: number) {
        while (this.tentatives.length < to) {
            this.tentatives.push(0);
        }
        for (let i = from; i < to; i++) {
            if (!this.changed && !this.tentatives[i]) {
                this.changed = true;
            }
            this.tentatives[i] = 1;
        }
    }

    remove(from: number, to: number) {
        while (to > this.tentatives.length) {
            this.tentatives.push(0);
        }
        for (let i = from; i < to; i++) {
            if (!this.changed && this.tentatives[i]) {
                this.changed = true;
            }
            this.tentatives[i] = 0;
        }
    }

    selections() {
        if (this.changed) {
            this.recalculate();
        }

        return this.last;
    }

    private recalculate() {
        let i = 0;
        this.last = [];
        this.changed = false;
        while (i < this.tentatives.length) {
            if (this.tentatives[i]) {
                const from = new Position(this.row, i);
                while (i < this.tentatives.length) {
                    if (this.tentatives[i]) {
                        i++;
                    } else {
                        break;
                    }
                }
                this.last.push(new Range(from, new Position(this.row, i)));
            } else {
                i++;
            }
        }
    }
}
interface CachedLine extends Disposable {
    isTentative: boolean;
}





