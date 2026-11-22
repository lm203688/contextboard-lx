'use strict';

const vscode = require('vscode');
const path = require('path');
const ctxLib = require('./lib/contexts');
const { ContextTreeProvider } = require('./lib/treeProvider');

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getActiveWorkspaceRoot() {
  const ws = vscode.workspace;
  if (!ws.workspaceFolders || !ws.workspaceFolders.length) return '';
  return ws.workspaceFolders[0].uri.fsPath;
}

async function getActiveGitBranch(cwd) {
  try {
    const { execSync } = require('child_process');
    return execSync('git rev-parse --abbrev-ref HEAD', { cwd, encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }).trim();
  } catch (_) { return ''; }
}

async function getCurrentOpenFiles() {
  return vscode.window.visibleTextEditors
    .map(e => e.document.uri.fsPath)
    .filter(Boolean);
}

// ── Commands ─────────────────────────────────────────────────────────────────

function registerCommands(context) {
  const tree = new ContextTreeProvider(context);
  context.subscriptions.push(vscode.window.registerTreeDataProvider('contextboard-tree', tree));

  // VS Code renders a tree view lazily: the panel shows a spinner until the provider fires
  // onDidChangeTreeData at least once *after* the view has mounted. Nothing else fires it for
  // this view, so the panel stayed blank on first open. Run the refresh command on a short
  // timer so at least one refresh lands once the panel exists.
  let refreshTicks = 0;
  const refreshTimer = setInterval(() => {
    void vscode.commands.executeCommand('contextboard.refreshTree');
    if (++refreshTicks >= 40) clearInterval(refreshTimer);
  }, 250);
  context.subscriptions.push({ dispose: () => clearInterval(refreshTimer) });

  // Refresh button
  context.subscriptions.push(vscode.commands.registerCommand('contextboard.refreshTree', () => {
    tree.refresh();
  }));

  // ── Save current workspace as a context ───────────────────────────────
  context.subscriptions.push(vscode.commands.registerCommand('contextboard.saveContext', async () => {
    const cwd = await getActiveWorkspaceRoot();
    const branch = await getActiveGitBranch(cwd);
    const files = await getCurrentOpenFiles();
    const name = await vscode.window.showInputBox({
      prompt: 'Name this context (e.g. "Project Alpha – backend")',
      placeHolder: 'My context …',
      ignoreFocusOut: true,
    });
    if (!name) return;
    const result = await ctxLib.addContext(context, { name, cwd, gitBranch: branch, openFiles: files, note: '' });
    if (!result.ok) {
      vscode.window.showWarningMessage(result.error);
      return;
    }
    tree.refresh();
    vscode.window.showInformationMessage(`ContextBoard: saved "${name}".`);
  }));

  // ── Switch to a saved context ─────────────────────────────────────────
  context.subscriptions.push(vscode.commands.registerCommand('contextboard.switchToContext', async (ctxId) => {
    const list = ctxLib.listAll(context);
    const ctx = list.find(c => c.id === ctxId);
    if (!ctx) { vscode.window.showErrorMessage('ContextBoard: context not found.'); return; }
    if (!ctx.cwd) { vscode.window.showErrorMessage('ContextBoard: this context has no saved path.'); return; }
    await ctxLib.switchTo(context, ctx.cwd, ctx.openFiles);
    tree.refresh();
  }));

  // ── Edit context name / note ──────────────────────────────────────────
  context.subscriptions.push(vscode.commands.registerCommand('contextboard.editContext', async (ctxId) => {
    const list = ctxLib.listAll(context);
    const ctx = list.find(c => c.id === ctxId);
    if (!ctx) return;
    const newName = await vscode.window.showInputBox({
      prompt: 'Edit context name',
      value: ctx.name,
      ignoreFocusOut: true,
    });
    if (newName === undefined) return;
    const newNote = await vscode.window.showInputBox({
      prompt: 'Add or update a note (optional)',
      value: ctx.note || '',
      ignoreFocusOut: true,
    });
    if (newNote === undefined) return;
    await ctxLib.editContext(context, ctxId, { name: newName, note: newNote });
    tree.refresh();
    vscode.window.showInformationMessage('ContextBoard: context updated.');
  }));

  // ── Delete context ────────────────────────────────────────────────────
  context.subscriptions.push(vscode.commands.registerCommand('contextboard.deleteContext', async (ctxId) => {
    const r = await ctxLib.removeContext(context, ctxId);
    if (!r.ok) { vscode.window.showErrorMessage(r.error); return; }
    tree.refresh();
    vscode.window.showInformationMessage('ContextBoard: context deleted.');
  }));

  // ── Upgrade to Pro ────────────────────────────────────────────────────
  context.subscriptions.push(vscode.commands.registerCommand('contextboard.upgradeToPro', async () => {
    const cfg = ctxLib.readCfg();
    if (!cfg.buyoutLink) {
      vscode.window.showWarningMessage('ContextBoard: set contextboard.buyoutLink in settings before upgrading.');
      return;
    }
    await vscode.env.openExternal(vscode.Uri.parse(cfg.buyoutLink));
  }));

  // ── Activate Pro license ──────────────────────────────────────────────
  context.subscriptions.push(vscode.commands.registerCommand('contextboard.activatePro', async () => {
    const license = await vscode.window.showInputBox({
      prompt:         'Enter your ContextBoard Pro license key',
      placeHolder:    'e.g. cb-xxxxxxxxxxxxxxxxxxxx',
      ignoreFocusOut: true,
    });
    if (!license) return;
    const cfg   = ctxLib.readCfg();
    const result = await ctxLib.verifyLicense(cfg.verifyEndpoint, license.trim());
    if (result.ok) {
      await context.globalState.update(ctxLib.KEY_PRO, true);
      await context.globalState.update(ctxLib.KEY_LICENSE, license.trim());
      tree.refresh();
      vscode.window.showInformationMessage('ContextBoard: Pro license active! Unlimited contexts unlocked.');
    } else {
      vscode.window.showErrorMessage(`ContextBoard: ${result.error || 'Invalid license key.'}`);
    }
  }));
}

// ── Lifecycle ────────────────────────────────────────────────────────────────

function activate(context) {
  registerCommands(context);

  if (!context.globalState.get('cb_welcomed', false)) {
    context.globalState.update('cb_welcomed', true);
    vscode.window.showInformationMessage(
      'ContextBoard installed! Open the ContextBoard panel from the activity bar to save and switch your workspace contexts.'
    );
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
