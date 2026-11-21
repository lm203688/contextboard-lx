'use strict';

const vscode = require('vscode');
const ctxLib = require('./contexts');

class ContextTreeProvider {
  constructor(context) {
    this._ctx = context;
    this._onDidChange = new vscode.EventEmitter();
  }
  get onDidChangeTreeData() { return this._onDidChange.event; }
  refresh() { this._onDidChange.fire(); }

  resolveTreeItem(element) { return element; }
  getTreeItem(el) { return el; }

  async getChildren(/*el*/) {
    const nodes = ctxLib.buildTreeNodes(this._ctx);
    return nodes.map(n => {
      // VS Code's TreeDataProvider requires real TreeItem instances; returning
      // plain objects triggers "_dataDidBecomeTreeItemIt is not a function" and
      // the tree renders empty.
      const item = new vscode.TreeItem(n.label, vscode.TreeItemCollapsibleState.None);
      item.id = n.id;
      item.description = n.description;
      item.tooltip = n.tooltip;
      item.contextValue = 'contextboard_item';
      item.iconPath = new vscode.ThemeIcon('symbol-namespace');
      item.command = n.cmdOpen;
      return item;
    });
  }
}

module.exports = { ContextTreeProvider };
