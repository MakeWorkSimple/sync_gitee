import * as vscode from 'vscode';

export class Commons {
    public static outPutChannel: vscode.OutputChannel;
    public static initCommons() {
        Commons.outPutChannel = vscode.window.createOutputChannel('Gitee Code Settings Sync');
        Commons.outPutChannel.show(true);
    }
    public static outPut(msg: string) {
        if (Commons.outPutChannel === null) {
            Commons.initCommons();
        }
        Commons.outPutChannel.appendLine(msg);
    }
}

export async function showInputBox() {
    const result = await vscode.window.showInputBox({
        value: 'abcdef',
        valueSelection: [2, 4],
        placeHolder: 'For example: fedcba. But not: 123',
        validateInput: text => {
            vscode.window.showInformationMessage(`Validating: ${text}`);
            return text === '123' ? 'Not 123!' : null;
        }
    });
    vscode.window.showInformationMessage(`Got: ${result}`);
    return result;
}
