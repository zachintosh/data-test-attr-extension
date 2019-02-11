import * as vscode from 'vscode';
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';

const tags = [
  'button',
  'input',
  'a'
];

const dataTestAttrDecorator = vscode.window.createTextEditorDecorationType({
  borderWidth: '1px',
  borderStyle: 'solid',
  overviewRulerColor: 'blue',
  overviewRulerLane: vscode.OverviewRulerLane.Right,
  borderRadius: '40px',
  light: {
    borderColor: 'darkblue'
  },
  dark: {
    borderColor: 'lightblue'
  },
});

const getExpression = (tagList: String) => `<\s*(${tagList})([^>](?!data\-test(\-|=)))*>`;

export default function updateDecorations() {
  var { activeTextEditor } = vscode.window;
  if (!activeTextEditor) return;

  const { document } = activeTextEditor;
  const fileContents = document.getText();
  const reg = RegExp(getExpression(tags.join('|')), 'g');
  const matches = fileContents.match(reg);

  if (matches) {
    let decorators: vscode.DecorationOptions[] = [];
    let match;
    while (match = reg.exec(fileContents)) {
			const startPos = activeTextEditor.document.positionAt(match.index);
      const endPos = activeTextEditor.document.positionAt(match.index + match[0].length);
      const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: '|Requires a `data-test` attribute:||\n|-|-|\n|`data-test="Example"`|\n|or|\n|`data-test-example`|' };
			decorators.push(decoration);
		}
    activeTextEditor.setDecorations(dataTestAttrDecorator, decorators);
  }
}