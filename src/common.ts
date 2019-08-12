import * as vscode from 'vscode';

export class Commons {
    public static outPutChannel: vscode.OutputChannel;
    public static initCommons() {
        Commons.outPutChannel = vscode.window.createOutputChannel('Gitee Code Settings Sync');
        Commons.outPutChannel.show(true);
    }
    public static outPut(msg: string) {
        if (Commons.outPutChannel === null) {
            Commons.outPutChannel = vscode.window.createOutputChannel(
                "Code Settings Sync"
            );
        }
        Commons.outPutChannel.appendLine(msg);
    }
}