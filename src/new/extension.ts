import { ExtensionContext, commands, Disposable, workspace } from "vscode";
import { Snitch } from "./snitch";
import { ExtensionRuntime } from "./ExtensionRuntime";

export function activate(context: ExtensionContext) {
    let extensionRuntime: Disposable | undefined;
    context.subscriptions.push(commands.registerCommand('evil.enable', () => {
        if (extensionRuntime) {
            Snitch.warn({ text: 'Already running' });
            return;
        }
        workspace.getConfiguration('evil').update('enabled', true);
        extensionRuntime = new ExtensionRuntime();
    }));

    context.subscriptions.push(commands.registerCommand('evil.disable', () => {
        if (!extensionRuntime) {
            Snitch.warn({ text: 'Not running' });
            return;
        }

        workspace.getConfiguration('evil').update('enabled', false);
        extensionRuntime.dispose();
        extensionRuntime = undefined;
    }));
    commands.executeCommand('evil.enable');
}