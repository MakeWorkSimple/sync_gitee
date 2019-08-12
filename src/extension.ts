// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Environment } from './environmentPath';
// import { state } from './state';
import { GiteeOAuthService } from './service/gitee.oauth.service';
import { SyncService } from './service/sync';
import { ExtensionInformation } from './service/plugin.service';
import * as nls from 'vscode-nls';
import { Commons, showInputBox } from './commons';
import { Context } from 'mocha';
import { sync } from 'glob';
import { writeFile } from 'fs';
const localize = nls.config({ messageFormat: nls.MessageFormat.file })();
// import { extensions } from "vscode";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	// state.context = context;

	let environment = new Environment(context);
	let configuration = vscode.workspace.getConfiguration('gitee');
	var gist = configuration.get('gist');
	var aoth = configuration.get('access_token');
	let giteeService = new GiteeOAuthService(aoth, gist);
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "simple-extension" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let push = vscode.commands.registerCommand('extension.uploadSetting', () => {
		// The code you place here will be executed every time your command is executed
		// upload user's global settings 
		// giteeService.postGist(environment.FILE_SETTING, environment.FILE_SETTING_NAME, vscode.window.showInformationMessage);

		// upload user's extends file
		// giteeService.postGist(environment.FILE_EXTENSION, environment.FILE_EXTENSION_NAME, vscode.window.showInformationMessage);
		const test_path = '/Users/chenxin/tools/vs_plugin/simple-extension/test.json';
		const allExts = SyncService.getAllExt();
		writeFile(test_path, JSON.stringify(allExts, null, 2), (err) => {
			console.log(err);
		});
	});

	let pull = vscode.commands.registerCommand('extension.downloadSetting', async () => {
		// The code you place here will be executed every time your command is executed
		// download user settings file
		// giteeService.fetchGist(environment.FILE_SETTING, environment.FILE_SETTING_NAME, vscode.window.showInformationMessage);
		// download extendtion file
		// giteeService.fetchGist(environment.FILE_EXTENSION, environment.FILE_EXTENSION_NAME, vscode.window.showInformationMessage);
		// install extendtion 
		// SyncService.installExt(environment.FILE_EXTENSION, vscode.window.showInformationMessage);

		// how to use output
		// Commons.initCommons();
		// Commons.outPut('-----------');
		// Commons.outPut('-----2-----');
		// Commons.outPut('-----3-----');

		// use intput box


		// const options: { [key: string]: (context: vscode.ExtensionContext) => Promise<any> } = {
		// 	showInputBox,
		// };
		// const quickPick = vscode.window.createQuickPick();
		// quickPick.items = Object.keys(options).map(label => ({ label }));
		// quickPick.onDidChangeSelection(selection => {
		// 	if (selection[0]) {

		// 		options[selection[0].label](context).then(data => {

		// 			Commons.outPut(`-------${data}-------`);
		// 			return data;

		// 		}
		// 		).catch(console.error);
		// 	}
		// });
		// quickPick.onDidHide(() => quickPick.dispose());
		// quickPick.show();

		// let set_value = 10;
		// Commons.outPut(`-------${set_value}-------`);
	});

	context.subscriptions.push(push);
	context.subscriptions.push(pull);

}

// this method is called when your extension is deactivated
export function deactivate() { }
