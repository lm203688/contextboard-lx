# ContextBoard — Store Description

## One-line tagline
**Stop losing your place. Save your whole workspace context in one click.**

## Full description

### Overview
Switching between projects means restoring terminal directories, git branches, and open files every time. **ContextBoard** snapshots your entire workspace state as a named context — cwd, branch, file list — and restores it with one click. No cloud, no Gist, no manual `cd`-ing.

### Key features (Free)
- Save any active workspace as a named context with one keyboard shortcut (`Ctrl+Alt+C`).
- One-click switch: opens a new terminal tab at the saved directory; optionally reopens prior files.
- Edit names and add notes to any saved context.
- Right-click menu for quick delete.
- Fully offline after install: no analytics, no telemetry.

### Pro upgrade ($7 one-time)
Unlock additional capabilities:
- Unlimited context slots (free tier: 5 max).
- [Phase 2 - Upcoming] Custom keyboard shortcuts per context slot (`Ctrl+Alt+1`..`9`).
- [Phase 2 - Upcoming] Attach environment variable notes to each context.
- [Phase 2 - Upcoming] AI-powered context suggestions (bring your own OpenAI/Claude API key).

### Why not just use `tmux` or `screen`?
| Concern | tmux/screen | ContextBoard |
|---|---|---|
| VS Code integration | Requires shell setup | Native panel inside VS Code |
| File list preservation | Manual tracking | Auto-saved on context creation |
| Cross-project switching | Session-bound | Named contexts you pick from a tree |
| Git branch awareness | Needs plugin | Auto-detected on save |

### Technical details
- CWD captured from `vscode.workspace.workspaceFolders[0].uri.fsPath`.
- Git branch via `git rev-parse --abbrev-ref HEAD` run locally.
- All data stored in VS Code `globalState` — local JSON only.
- License verification: single POST to `snapmark-license.463102527.workers.dev/verify`; transmits only the license key string.

### Who is this for?
Developers who juggle multiple repositories daily — frontend/backend pairs, monorepos with independent services, or feature branches that require separate terminal setups.

### License
MIT licensed. Free tier available indefinitely. Pro is a $7 one-time purchase via Paddle.

---

## Viral hook (for social media)
> "Stop cd-ing between 5 project folders. Save your whole dev context in one click. 🎯 Works inside VS Code — free + $7 Pro lifetime."

---

## X / Twitter post draft
🔄 Tired of manually switching terminals between projects?  
ContextBoard saves your cwd, git branch & open files as named contexts. Switch back in one click.  
Inside VS Code. Free. Zero cloud.  

https://marketplace.visualstudio.com/items?itemName=LxStudio.contextboard-lx  
#VSCode #Productivity #DevTools

---

## LinkedIn post draft
I built ContextBoard because I was tired of alt-tabbing between 6 terminal windows, each `cd`-ed into a different project.  
It snapshots your VS Code workspace state — cwd, git branch, open files — as a named context. One click to switch back.  
All data stays local. No cloud dependency. Free tier covers up to 5 contexts; Pro ($7 lifetime) unlocks unlimited.  
Check it out: https://marketplace.visualstudio.com/items?itemName=LxStudio.contextboard-lx
