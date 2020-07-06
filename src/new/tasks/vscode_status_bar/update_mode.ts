import { ExtensionRuntime } from "../../ExtensionRuntime";
import { workspace, window, StatusBarAlignment, ThemeColor } from "vscode";
import { VimHighlightUIAttributes } from "../../../types/something";

export function update_mode(runtime: ExtensionRuntime) {
    const statusBar = window.createStatusBarItem(StatusBarAlignment.Left, 100);
    statusBar.show();
    runtime.subscribe(statusBar);
    runtime.onModeChanged(mode => {
        statusBar.text = mode.text;
        statusBar.color = mode.color;
    });
}
