import { ExtensionContext, commands, Disposable, workspace } from "vscode";
import { Snitch } from "./snitch";
import { ExtensionRuntime } from "./ExtensionRuntime";
import { createRuntime } from "../runtime";

export function activate(context: ExtensionContext) {
    let extensionRuntime: Disposable | undefined;
    let save = false;
    if (workspace.getConfiguration('files').get('insertFinalNewline') === false) {
        workspace.getConfiguration('files').update('insertFinalNewline', true);
    }

    context.subscriptions.push(commands.registerCommand('evil.enable', () => {
        if (extensionRuntime) {
            Snitch.warn({ text: 'Already running' });
            return;
        }
        workspace.getConfiguration('evil').update('enabled', true);
        createRuntime().then(runtime => context.subscriptions.push(extensionRuntime = runtime));
    }));

    context.subscriptions.push(commands.registerCommand('evil.disable', () => {
        if (!extensionRuntime) {
            Snitch.warn({ text: 'Not running' });
            return;
        }

        workspace.getConfiguration('evil').update('enabled', false);
        const index = context.subscriptions.indexOf(extensionRuntime);
        if (index !== -1) {
            context.subscriptions.splice(context.subscriptions.indexOf(extensionRuntime), 1);
        }
        extensionRuntime.dispose();
        extensionRuntime = undefined;
    }));
    commands.executeCommand('evil.enable');
}
