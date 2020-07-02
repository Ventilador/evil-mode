// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Vim } from './types/api';
// import { connect } from './vim';
// import { SupportKeyboard } from './support/keyboard';
// import { TabController } from './support/tabs';
// import { SupportCursor } from './support/cursor';
// import { SupportMode } from './support/mode';
// import { SupportHighlight } from './support/highlight';
let instance: Promise<Vim> | undefined;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	return import('./new/extension').then(({ activate }) => activate(context)).catch(console.error);
	// if (instance) {
	// 	return;
	// }

	// const asd =vscode.workspace.getConfiguration('evil').update('enabled', true);
	// const myInstance = instance = connect();
	// const modeSupport = new SupportMode(myInstance);
	// const keyboardSupport = new SupportKeyboard(myInstance);
	// const tabSupport = new TabController(myInstance);
	// const cursorSupport = new SupportCursor(myInstance, modeSupport);
	// context.subscriptions.push(keyboardSupport);
	// context.subscriptions.push(tabSupport);
	// context.subscriptions.push(modeSupport);
	// // context.subscriptions.push(new SupportHighlight(myInstance));
	// context.subscriptions.push(cursorSupport);
	// myInstance.then(instance => {
	// 	instance.nvim_ui_attach(1920, 1080, {
	// 		ext_cmdline: false,
	// 		ext_linegrid: true,
	// 		ext_hlstate: true,
	// 		// ext_messages: false,
	// 		// ext_multigrid: false,
	// 		ext_popupmenu: false,
	// 		ext_tabline: false,
	// 		ext_wildmenu: false,
	// 		rgb: false
	// 	} as any);
	// });
}

// this method is called when your extension is deactivated
export async function deactivate() {
	if (instance) {
		const prom = (await instance).quit();
		instance = undefined;
		return prom;
	}
}
