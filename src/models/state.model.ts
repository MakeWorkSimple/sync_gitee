import { ExtensionContext } from "vscode";
import { Environment } from "../environmentPath";

export interface IExtensionState {
    context?: ExtensionContext;
    environment?: Environment;
    instanceID: string;
}

export interface ISyncLock {
    lastUploadTime: string;
}