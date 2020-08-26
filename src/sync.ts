/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { readFile, unlink } from 'fs-extra';
import { writeFile } from 'fs';
import * as Zip from "adm-zip";

import { ExtensionInformation, PluginService } from "./service/plugin.service";
import { GiteeOAuthService } from './service/gitee.oauth.service';
import { Environment } from './environmentPath';
import { OsType } from "./enums";
import { eventNames } from 'cluster';
import { ISyncLock } from "./models/state.model";
import { type } from 'os';
import { types } from 'util';
import * as vscode from 'vscode';
import { Commons } from './commons';

export class SyncService {
    public output: any;
    public outputBind: boolean;
    public static zip = new Zip();
    public static ignornExts = ["Alex-Chen.gitee-code-settings-sync"];
    constructor() {
        this.outputBind = false;
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

    public static getAllExt() {
        return PluginService.CreateExtensionList();
    }

    public static writeFile(path: string, content: string) {
        writeFile(path, content, (err: any) => {
            console.log(err);
        });
    }
    public static installExtensions(extSetingPath: string, callback: (msg: string) => any) {
        SyncService.readAnyFile(extSetingPath).then(
            (exts: any) => {
                PluginService.InstallExtensions(exts, SyncService.ignornExts, callback);
            }
        );

    }


    public uploadCMD(giteeServer: GiteeOAuthService, environment: Environment) {
        if (!this.outputBind) {
            Commons.initCommons();
            this.output = Commons.outPut;
            this.outputBind = true;
        }
        var callback = this.output;
        giteeServer.postGist(environment.FILE_SETTING, environment.FILE_SETTING_NAME, false, false, callback);
        var uploadTime = new Date();

        // upload sync.lock
        giteeServer.postGistV2(JSON.stringify({ "lastUploadTime": uploadTime.toISOString() }, null, 2), environment.FILE_SYNC_LOCK_NAME, callback);

        // upload extension setting
        var extendsList = SyncService.getAllExt();
        giteeServer.postGistV2(JSON.stringify(extendsList, null, 2), environment.FILE_EXTENSION_NAME, callback);

        // upload keyboard bind
        var remoteKeyboardFileName = environment.FILE_KEYBINDING_NAME;
        if (environment.OsType === OsType.Mac) {
            remoteKeyboardFileName = environment.FILE_KEYBINDING_MAC;
        }
        giteeServer.postGist(environment.FILE_KEYBINDING, remoteKeyboardFileName, false, false, callback);

        // upload snippets folder
        var snipperZipFile = SyncService.zipFold(environment, callback);
        giteeServer.postGist(snipperZipFile, environment.FILE_SNIPPETS_ZIP_NAME, true, true, callback);

    }
    public async downodCMD(giteeServer: GiteeOAuthService, environment: Environment) {
        if (!this.outputBind) {
            Commons.initCommons();
            this.output = Commons.outPut;
            this.outputBind = true;
        }
        var callback = this.output;
        giteeServer.fetchGist(environment.FILE_SETTING, environment.FILE_SETTING_NAME, false, callback);
        giteeServer.fetchGist(environment.FILE_EXTENSION, environment.FILE_EXTENSION_NAME, false, callback);
        // down keyboard binding
        var remoteKeyboardFileName = environment.FILE_KEYBINDING_NAME;
        if (environment.OsType === OsType.Mac) {
            remoteKeyboardFileName = environment.FILE_KEYBINDING_MAC;
        }
        giteeServer.fetchGist(environment.FILE_KEYBINDING, remoteKeyboardFileName, false, callback);

        // down extension json
        giteeServer.fetchGistExtensions(environment.FILE_EXTENSION_NAME, SyncService.ignornExts, PluginService.InstallExtensions, callback);
        // SyncService.installExtensions(environment.FILE_EXTENSION, callback);
        // // down snippets zip
        await giteeServer.fetchGist(environment.FILE_SNIPPETS_ZIP, environment.FILE_SNIPPETS_ZIP_NAME, true, callback);
        SyncService.unZipFold(environment, callback);
    }

    public static zipFold(environment: Environment, callback: (msg: string) => any) {
        SyncService.zip.addLocalFolder(environment.FOLDER_SNIPPETS);
        SyncService.zip.writeZip(environment.FILE_SNIPPETS_ZIP);
        callback('finished zip');
        return environment.FILE_SNIPPETS_ZIP;
    }

    public static unZipFold(environment: Environment, callback: (msg: string) => any) {
        var _zip = new Zip(environment.FILE_SNIPPETS_ZIP);

        _zip.extractAllTo(environment.FOLDER_SNIPPETS, true);
        callback('finished unzip');
        // remove zip file
        callback(environment.FILE_SNIPPETS_ZIP);
        unlink(environment.FILE_SNIPPETS_ZIP);
    }
    public static watch(giteeServer: GiteeOAuthService): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration(() => {
            let configuration = vscode.workspace.getConfiguration('gitee');
            giteeServer.access_token = configuration.get('access_token');
            giteeServer.gist = configuration.get('gist');
        });
    }
}