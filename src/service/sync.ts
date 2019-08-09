/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';

const localize = nls.loadMessageBundle();

export function syncCommand() {
    const message = localize('cmd.upload.settings.title', 'cmd.upload.settings.title');
    // vscode.window.showInformationMessage(message);
}