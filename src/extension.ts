
import { Vim } from './types/api';

import { workspace, commands, ExtensionContext, Disposable } from 'vscode';
import { Snitch } from './utils/snitch';
import { createRuntime } from './runtime';
export function activate(context: ExtensionContext) {
	let extensionRuntime: Disposable | undefined;
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

		extensionRuntime.dispose();
		extensionRuntime = undefined;
	}));
	commands.executeCommand('evil.enable');
}

export function deactivate() { }
