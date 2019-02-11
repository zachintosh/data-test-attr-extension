import * as vscode from 'vscode';
import updateDecorations from './update-decorations';

export function activate(context: vscode.ExtensionContext) {

  var { activeTextEditor } = vscode.window;

  if (activeTextEditor) {
    triggerUpdateDecorations();
  }

  // Update decorations when we switch editors
  vscode.window.onDidChangeActiveTextEditor(editor => {
		activeTextEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
  }, null, context.subscriptions);

  // Update decorations when text is edited in current editor
  vscode.workspace.onDidChangeTextDocument(event => {
		if (activeTextEditor && event.document === activeTextEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);
  
  // Update decorations every half-second
  var timeout : NodeJS.Timer | null = null;
	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(updateDecorations, 500);
	}

  
  vscode.window.showInformationMessage('Extension Active');
}

export function deactivate() {}
