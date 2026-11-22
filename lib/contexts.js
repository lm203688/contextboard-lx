'use strict';

const vscode = require('vscode');

// ── Storage keys ─────────────────────────────────────────────────────────────

const KEY_CONTEXTS = 'cb_contexts';       // array of context objects
const KEY_PRO =      'cb_pro';
const KEY_LICENSE =  'cb_license';
const MAX_FREE = 5;

// ── Type helpers ──────────────────────────────────────────────────────────────

function isPro(context) {
  return !!context.globalState.get(KEY_PRO, false);
}

function getProGlobal(globalState) {
  return !!globalState.get(KEY_PRO, false);
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

async function loadContexts(context) {
  const raw = context.globalState.get(KEY_CONTEXTS, '[]');
  if (Array.isArray(raw)) return raw;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch (_) { return []; }
}

async function saveContexts(context, list) {
  await context.globalState.update(KEY_CONTEXTS, JSON.stringify(list));
}

async function addContext(context, ctx) {
  const list = await loadContexts(context);
  if (!isPro(context) && list.length >= MAX_FREE) {
    return { ok: false, error: `Free plan limited to ${MAX_FREE} contexts. Upgrade to Pro.` };
  }
  ctx.id = ctx.id || ('ctx_' + Date.now());
  ctx.createdAt = ctx.createdAt || new Date().toISOString();
  ctx.cwd = String(ctx.cwd || '');
  ctx.gitBranch = String(ctx.gitBranch || '');
  ctx.openFiles = Array.isArray(ctx.openFiles) ? ctx.openFiles : [];
  ctx.note = String(ctx.note || '');
  list.push(ctx);
  await saveContexts(context, list);
  return { ok: true, item: ctx };
}

async function removeContext(context, id) {
  const list = await loadContexts(context);
  const idx = list.findIndex(c => c.id === id);
  if (idx < 0) return { ok: false, error: 'Not found' };
  list.splice(idx, 1);
  await saveContexts(context, list);
  return { ok: true };
}

async function editContext(context, id, patch) {
  const list = await loadContexts(context);
  const item = list.find(c => c.id === id);
  if (!item) return { ok: false, error: 'Not found' };
  Object.assign(item, patch);
  item.updatedAt = new Date().toISOString();
  await saveContexts(context, list);
  return { ok: true, item };
}

async function switchTo(context, cwd, openFiles) {
  // Open new terminal tab and run cd + optional file opens
  await vscode.commands.executeCommand('workbench.action.createTerminal');
  if (cwd) {
    await new Promise(r => setTimeout(r, 300));
    // Escape backslashes and double-quotes so the cd command is safe in a shell string
    const safeCwd = cwd.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    await vscode.commands.executeCommand('workbench.action.terminal.sendText', `cd "${safeCwd}"\n`);
  }
  for (const f of (openFiles || [])) {
    try {
      const uri = vscode.Uri.file(require('path').join(cwd || '', f));
      await vscode.window.showTextDocument(uri);
    } catch (_) {}
  }
  return { ok: true };
}

// ── Tree view nodes ──────────────────────────────────────────────────────────

function buildTreeNodes(context) {
  const pro = isPro(context);
  const list = listAll(context).filter(() => true); // trigger recompute
  return list.map(ctx => ({
    id:       ctx.id,
    label:    `${ctx.name || 'Unnamed'}${ctx.gitBranch ? ' (' + ctx.gitBranch + ')' : ''}`,
    description: pro ? '' : `${list.indexOf(ctx) + 1}/${MAX_FREE}`,
    tooltip:  [
      `Path: ${ctx.cwd || '(none)'}`,
      `Branch: ${ctx.gitBranch || '(none)'}`,
      ...(ctx.openFiles.length ? [`Files: ${ctx.openFiles.join(', ')}`] : []),
      ...(ctx.note ? [`Note: ${ctx.note}`] : []),
    ].join('\n'),
    cmdOpen:  { command: 'contextboard.switchTo',   arguments: [ctx.id] },
    cmdEdit:  { command: 'contextboard.editContext', arguments: [ctx.id] },
    cmdDelete:{ command: 'contextboard.deleteContext',arguments: [ctx.id] },
  }));
}

function listAll(context) {
  const raw = context.globalState.get(KEY_CONTEXTS, '[]');
  if (Array.isArray(raw)) return raw;
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v : []; }
  catch (_) { return []; }
}

// ── License ──────────────────────────────────────────────────────────────────

const DEFAULT_VERIFY_ENDPOINT = 'https://snapmark-license.463102527.workers.dev/verify';

function readCfg() {
  const c = vscode.workspace.getConfiguration('contextboard');
  return {
    verifyEndpoint: (c.get('verifyEndpoint') || '').trim() || DEFAULT_VERIFY_ENDPOINT,
    buyoutLink:     (c.get('buyoutLink') || '').trim(),
  };
}

async function verifyLicense(endpoint, license) {
  try {
    const res = await fetch(endpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license }),
    });
    const data = await res.json();
    return { ok: !!data.valid, error: data.valid ? '' : (data.error || 'License is not active.') };
  } catch (e) {
    return { ok: false, error: 'Could not reach license service: ' + String(e.message || e) };
  }
}

module.exports = {
  KEY_CONTEXTS, KEY_PRO, KEY_LICENSE, MAX_FREE,
  isPro, getProGlobal,
  loadContexts, saveContexts,
  addContext, removeContext, editContext, switchTo,
  buildTreeNodes, listAll,
  readCfg, verifyLicense,
};
