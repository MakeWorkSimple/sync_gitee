/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as vscode from 'vscode';
// import * as nls from 'vscode-nls';

// const localize = nls.loadMessageBundle();
import { ExtensionInformation, PluginService } from "./plugin.service";

export class SyncService {
    public static async isntallExt(exts: string, callback: (msg: string) => any) {
        let name = 'hollowtree.vue-snippets';
        await vscode.commands.executeCommand(
            "workbench.extensions.installExtension",
            name
        );
        // PluginService.InstallWithAPI(exts, (info) => {
        //     console.log(info);
        //     console.log('set install with api');

        // });
    }

}