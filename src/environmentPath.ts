"use strict";
import { normalize, resolve } from "path";

export class Environment {
    public PATH: string = '';
    public FILE_SETTING: string = '';

    public FILE_SETTING_NAME: string = "settings.json";

    // public FILE_LAUNCH_NAME: string = "launch.json";
    // public FILE_KEYBINDING_NAME: string = "keybindings.json";
    // public FILE_KEYBINDING_MAC: string = "keybindingsMac.json";
    // public FILE_KEYBINDING_DEFAULT: string = "keybindings.json";
    // public FILE_EXTENSION_NAME: string = "extensions.json";
    // public FILE_LOCALE_NAME: string = "locale.json";
    // public FILE_SYNC_LOCK_NAME: string = "sync.lock";

    // public FILE_CLOUDSETTINGS_NAME: string = "cloudSettings";

    // public FOLDER_SNIPPETS: string = '';

    constructor() {
        // state.context.globalState.update("_", undefined); 
        this.PATH = resolve(state.context.globalStoragePath, "../../..").concat(
            normalize("/")
        );
        this.FILE_SETTING
    }
}