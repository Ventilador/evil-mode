import { ExtensionRuntime } from "../../ExtensionRuntime";

export function cursor_style(runtime: ExtensionRuntime) {
    runtime.onModeChanged(mode => {
        if (!runtime.active) {
            return;
        }
        runtime.active.grid.cursorStyle(mode.cursor);
    });
}