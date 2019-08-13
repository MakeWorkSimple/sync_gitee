"use strict";
import { normalize, resolve } from "path";
import { ExtensionContext } from "vscode";

// TODO 插件配置文件
export class Environment {
    public context: ExtensionContext;
    public PATH: string = '';
    public FILE_SETTING: string = '';
    public USER_FOLDER: string = '';
    public FILE_EXTENSION: string = '';

    public FILE_SETTING_NAME: string = 'settings.json';

    // public FILE_LAUNCH_NAME: string = "launch.json";
    // public FILE_KEYBINDING_NAME: string = "keybindings.json";
    // public FILE_KEYBINDING_MAC: string = "keybindingsMac.json";
    // public FILE_KEYBINDING_DEFAULT: string = "keybindings.json";
    public FILE_EXTENSION_NAME: string = "extensions.json";
    // public FILE_LOCALE_NAME: string = "locale.json";
    // public FILE_SYNC_LOCK_NAME: string = "sync.lock";

    // public FILE_CLOUDSETTINGS_NAME: string = "cloudSettings";
    public FOLDER_SNIPPETS_NAME: string = 'snippets';
    public FILE_SNIPPETS_ZIP_NAME: string = 'snippets.zip';
    public FOLDER_SNIPPETS: string = '';

    public FILE_SNIPPETS_ZIP: string = '';

    constructor(context: ExtensionContext) {
        // state.context.globalState.update("_", undefined); 
        this.context = context;
        this.PATH = resolve(this.context.globalStoragePath, "../../..").concat(
            normalize("/")
        );
        this.USER_FOLDER = resolve(this.PATH, "User").concat(normalize("/"));
        this.FILE_SETTING = this.USER_FOLDER.concat(this.FILE_SETTING_NAME);
        this.FILE_EXTENSION = this.USER_FOLDER.concat(this.FILE_EXTENSION_NAME);
        this.FOLDER_SNIPPETS = this.USER_FOLDER.concat("snippets");
        this.FILE_SNIPPETS_ZIP = this.USER_FOLDER.concat(this.FILE_SNIPPETS_ZIP_NAME);
    }
}