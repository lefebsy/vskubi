'use strict';

import * as vscode from 'vscode';
import { CommandManager } from './command_manager';
import { CommandRunner } from './command_runner';
import { VariableManager } from './variable_manager';

export function activate(context: vscode.ExtensionContext) {
	const variableManager = new VariableManager;
	const commandRunner = new CommandRunner(variableManager);
	const commandManager = new CommandManager(commandRunner);
	const warningEOL = <boolean>vscode.workspace.getConfiguration('vs-kubi').get('warningEOL');

	// EOL Warning
	if (!warningEOL) {
		vscode.window.showWarningMessage('VS-Kubi extension v0.0.5 will no longer receive security fix. If you feel concerned, you should uninstall it and switch to "VS-Kubi-lite" instead, a better extension with many more features. By checking this warning in settings you will disable the startup notification and confirm you were warned.', {'modal':true});
	}

	// Initial command registration
	commandManager.registerCustomCommands();

	let onDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration(() => {
		commandManager.registerCustomCommands();
	});

	let runCommand = vscode.commands.registerCommand('vs-kubi', () => commandRunner.runCommand());

	context.subscriptions.push(
		onDidChangeConfiguration,
		runCommand
	);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
