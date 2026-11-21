# Changelog — ContextBoard

## 1.0.0 (2026-11-20)

**Initial public release.**

### Added
- Activity-bar panel with tree view listing all saved contexts (name + git branch).
- **Save Context** command: captures cwd, git branch, open file paths; prompts for name.
- **Switch to Context** command: opens new terminal tab at saved cwd; optionally reopens files.
- Right-click context actions: Edit (rename + add note), Delete.
- Keyboard shortcut: `Ctrl+Alt+C` triggers Save Context.
- Free tier limit: 5 context slots; Pro unlocks unlimited.
- License activation via Paddle verification endpoint.
- Configuration settings: `contextboard.buyoutLink`, `contextboard.verifyEndpoint`.

### Technical
- Modular code: `lib/contexts.js`, `lib/treeProvider.js`, `lib/crypto.js`.
- All data persisted in VS Code `globalState` (JSON serialised).
- Git branch detection via `child_process.execSync('git rev-parse --abbrev-ref HEAD')`.
- Zero external Node.js dependencies.

### Known limitations
- Only the first workspace folder is used as cwd fallback.
- Existing terminal tabs are not switched; a new tab is always created.
- Phase 2 features (custom shortcuts, env vars, AI suggestions) not yet implemented.
