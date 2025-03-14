// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MyCustomViewProvider } from './viewProvider';



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const viewProvider = new MyCustomViewProvider();
	vscode.window.registerTreeDataProvider("myCustomView", viewProvider);
  
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello Котята!');
	});
	const timing = vscode.commands.registerCommand('helloworld.whatTime', () => {
	const currTime=`${new Date().getHours()}:${new Date().getMinutes()}`;
		vscode.window.showWarningMessage(currTime);
	});

	context.subscriptions.push(disposable,timing,vscode.commands.registerCommand('myCustomView.refresh', () => viewProvider.refresh()));
}

// This method is called when your extension is deactivated
export function deactivate() {}
