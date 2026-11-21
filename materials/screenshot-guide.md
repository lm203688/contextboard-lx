# ContextBoard Screenshot Guide

Describe three mockup screenshots to generate (or capture real ones from a test install).

## Screenshot 1 — Context list panel
Shows the ContextBoard activity-bar panel inside VS Code.  
Title bar: "ContextBoard — Saved Contexts".  
Tree rows showing 5 contexts with columns: Name | Git Branch | Limit indicator | Switch button.  
Status bar at bottom: "Free plan · 5/5 contexts used".  
Left activity bar strip shows the workflow icon highlighted.

**Alt-text:** *ContextBoard panel listing saved workspace contexts with their git branches and slot count.*

## Screenshot 2 — Save-context dialog
Modal dialog titled "Save Current Workspace as Context".  
Fields: Name (text input with value "backend-api · feature/auth"), Git branch read-only ("feature/auth"), Open files summary ("3 files detected").  
Buttons: Save (blue) / Cancel (grey).

**Alt-text:** *Save-context dialog capturing the current VS Code workspace name, branch, and open files.*

## Screenshot 3 — Switch confirmation toast
Toast notification banner at bottom-right after clicking Switch.  
Green checkmark + "ContextBoard: switched to 'backend-api'".  
Sub-lines: terminal path, branch, reopened files.  
Dismiss ✕ button.

**Alt-text:** *Import result toast confirming successful context switch with terminal path and reopened files.*

---

To regenerate these programmatically:
```bash
python materials/generate_screenshots.py
```

Replace with real screenshots before publishing.
