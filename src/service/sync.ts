/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as vscode from 'vscode';
// import * as nls from 'vscode-nls';

// const localize = nls.loadMessageBundle();
import { ExtensionInformation, PluginService } from "./plugin.service";
import { readFile } from 'fs-extra';
import { resolve } from 'url';
import { rejects } from 'assert';

export class SyncService {
    public static async isntallExt(exts: ExtensionInformation[], callback: (msg: string) => any) {
        let name = 'hollowtree.vue-snippets';
        // await vscode.commands.executeCommand(
        //     "workbench.extensions.installExtension",
        //     name
        // );
        PluginService.InstallWithAPI(exts, () => {
            console.log('set install with api');

        });
    }

    public static readAnyFile(path: string) {
        return new Promise((resolve, reject) => {
            readFile(path, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    public static async readExtFile(path: string) {
        return SyncService.readAnyFile(path).then(
            (data: any) => {
                let exts = ExtensionInformation.fromJSONList(data);
                return exts;
            }
        );

    }
    public static installExt(path: string, callback: (msg: string) => any) {
        SyncService.readExtFile(path).then(
            (exts: any) => {
                SyncService.isntallExt(exts, callback);
            }
        );
    }


}