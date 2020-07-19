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
export class SyncService {
    public static zip = new Zip();
    public static ignornExts = ["Alex-Chen.gitee-code-settings-sync"];

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


    public static uploadCMD(giteeServer: GiteeOAuthService, environment: Environment, callback: (msg: string) => any) {
        giteeServer.postGist(environment.FILE_SETTING, environment.FILE_SETTING_NAME, false, false, callback);

        var extendsList = SyncService.getAllExt();
        var uploadTime = new Date();

        // upload sync.lock
        // SyncService.readAnyFile(environment.SYNC_LOCK).then(
        //     (lock: any) => {
        //         let lk: ISyncLock = JSON.parse(lock);
        //         console.info(lk);
        //         console.info(lk.lastUploadTime);
        //     }
        // );
        SyncService.writeFile(environment.SYNC_LOCK, JSON.stringify({ "lastUploadTime": uploadTime.toISOString() }, null, 2));
        giteeServer.postGist(environment.SYNC_LOCK, environment.FILE_SYNC_LOCK_NAME, false, false, callback);

        // upload extension setting
        SyncService.writeFile(environment.FILE_EXTENSION, JSON.stringify(extendsList, null, 2));
        giteeServer.postGist(environment.FILE_EXTENSION, environment.FILE_EXTENSION_NAME, false, true, callback);

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
    public static async downodCMD(giteeServer: GiteeOAuthService, environment: Environment, callback: (msg: string) => any) {
        giteeServer.fetchGist(environment.FILE_SETTING, environment.FILE_SETTING_NAME, false, callback);
        giteeServer.fetchGist(environment.FILE_EXTENSION, environment.FILE_EXTENSION_NAME, false, callback);
        // down keyboard binding
        var remoteKeyboardFileName = environment.FILE_KEYBINDING_NAME;
        if (environment.OsType === OsType.Mac) {
            remoteKeyboardFileName = environment.FILE_KEYBINDING_MAC;
        }
        giteeServer.fetchGist(environment.FILE_KEYBINDING, remoteKeyboardFileName, false, callback);


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
}