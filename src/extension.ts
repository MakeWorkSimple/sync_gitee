// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Environment } from './environmentPath';
// import { state } from './state';
import { GiteeOAuthService } from './service/gitee.oauth.service';
import { SyncService } from './sync';
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
	Commons.initCommons();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let push = vscode.commands.registerCommand('extension.giteeUploadSetting', () => {
		// The code you place here will be executed every time your command is executed
		SyncService.uploadCMD(giteeService, environment, Commons.outPut);



	});

	let pull = vscode.commands.registerCommand('extension.giteeDownloadSetting', async () => {
		// The code you place here will be executed every time your command is executed
		SyncService.downodCMD(giteeService, environment, Commons.outPut);
	});

	context.subscriptions.push(push);
	context.subscriptions.push(pull);

}

// this method is called when your extension is deactivated
export function deactivate() { }
