# ContextBoard — Workspace Context Switcher

**Version:** 1.0.1  
**Publisher:** LxStudio  
**License:** MIT (see LICENSE.md)

## What it does

ContextBoard lets you **save** your current workspace state (terminal working directory, git branch, open files) as a named context, then **switch back** to it in one click. No cloud sync — all contexts are stored locally in VS Code's global state.

Perfect for developers juggling multiple projects or switching between feature branches.

## Key features (Free)

- Save named contexts: captures cwd, git branch, and open file list.
- One-click switch: opens a terminal at the saved directory; optionally reopens prior files.
- One-click switch via Command Palette (`Ctrl+Shift+P` → ContextBoard: Switch to Saved Context).
- Edit or delete any context through Command Palette (`Ctrl+Shift+P` → ContextBoard: Edit / Delete Context).
- Keyboard shortcut: `Ctrl+Alt+C` to save current workspace; `Ctrl+Alt+Shift+C` to switch to last context.

## Pro upgrade ($7 one-time)

- Unlimited context slots (free is limited to 5).
- [Phase 2 - Upcoming] Custom keyboard shortcuts per context (`Ctrl+Alt+1`..`9`).
- [Phase 2 - Upcoming] Environment variable notes attached to each context.
- [Phase 2 - Upcoming] AI-powered context suggestions (bring your own API key).

## Quick start

1. Open the **ContextBoard** panel from the activity bar (workflow icon).
2. Click **+ Save Context** (or press `Ctrl+Alt+C`) to capture your current workspace.
3. Open Command Palette (`Ctrl+Shift+P`) and choose **ContextBoard: Switch to Saved Context** — a new terminal tab opens at the saved directory.
4. Edit or delete contexts via Command Palette (`Ctrl+Shift+P` → ContextBoard: Edit / Delete Context).

## Privacy & data handling

- All contexts are stored locally in VS Code's `globalState`. Nothing leaves your machine.
- The only network call is to the license verification endpoint (`snapmark-license.61960005.workers.dev`) when activating a Pro license key.
- See [privacy-policy.html](privacy-policy.html) for full details.

## Tech details

- Reads `cwd` via active VS Code workspace folder (`workspaceFolders[0].uri.fsPath`).
- Detects git branch by running `git rev-parse --abbrev-ref HEAD` in the project root.
- Stores everything in VS Code `globalState` (JSON serialised), no external database.

## Limitations

- Switching requires a fresh terminal tab; existing terminals are not moved.
- File paths are absolute on save and resolved relative to cwd on switch.
- Requires VS Code 1.80+.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
