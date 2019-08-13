/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as vscode from 'vscode';
// import * as nls from 'vscode-nls';

// const localize = nls.loadMessageBundle();
import { ExtensionInformation, PluginService } from "./service/plugin.service";
import { readFile } from 'fs-extra';
import { resolve } from 'url';
import { rejects } from 'assert';
import { GiteeOAuthService } from './service/gitee.oauth.service';
import { Environment } from './environmentPath';

export class SyncService {
    public static ignornExts = ["Alex.gitee-code-settings-sync"];

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

    public static getAllExt() {
        return PluginService.CreateExtensionList();
    }

    public static installExtensions(extSetingPath: string, callback: (msg: string) => any) {
        SyncService.readExtFile(extSetingPath).then(
            (exts: any) => {
                PluginService.InstallExtensions(exts, SyncService.ignornExts, callback);
            }
        );

    }

    public static dowloadFile(giteeServer: GiteeOAuthService, path: string, fileName: string, callback: (msg: string) => any) {
        giteeServer.fetchGist(path, fileName, callback);
    }

    public static uploadFile(giteeServer: GiteeOAuthService, path: string, fileName: string, callback: (msg: string) => any) {
        giteeServer.postGist(path, fileName, callback);
    }

    public static uploadCMD(giteeServer: GiteeOAuthService, environment: Environment, callback: (msg: string) => any) {
        giteeServer.postGist(environment.FILE_SETTING, environment.FILE_SETTING_NAME, callback);
        giteeServer.postGist(environment.FILE_EXTENSION, environment.FILE_EXTENSION_NAME, callback);
    }
    public static downodCMD(giteeServer: GiteeOAuthService, environment: Environment, callback: (msg: string) => any) {
        giteeServer.fetchGist(environment.FILE_SETTING, environment.FILE_SETTING_NAME, callback);
        giteeServer.fetchGist(environment.FILE_EXTENSION, environment.FILE_EXTENSION_NAME, callback);

        SyncService.installExtensions(environment.FILE_EXTENSION, callback);
    }
}