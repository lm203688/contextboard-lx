#!/usr/bin/env python3
"""Generate 3 ContextBoard VS Code screenshot mockups (PNG) using Pillow."""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = r"C:\Users\ThinkPad\.dsh\bot\workspace\build_B5\materials"
os.makedirs(OUT, exist_ok=True)

def rgb(c):
    c = c.lstrip('#')
    return tuple(int(c[i:i+2], 16) for i in (0, 2, 4))

def load_font(size):
    try:
        return ImageFont.truetype("arial.ttf", size)
    except Exception:
        return ImageFont.load_default()

FT  = load_font(14)   # title
FB  = load_font(12)   # body
FL  = load_font(11)   # label
FS  = load_font(10)   # small

W, H = 1366, 768

# ── Screenshot 1: Context list panel ──────────────────────────────────────────
img = Image.new("RGB", (W, H), rgb("#1e1e1e"))
d = ImageDraw.Draw(img)

d.rectangle([0, 0, W, 35], fill=rgb("#3c3c3c"))
d.text((12, 9), "ContextBoard — Saved Contexts", font=FT, fill=rgb("#cccccc"))
d.rectangle([0, 35, 48, H], fill=rgb("#252526"))
d.rectangle([10, 300, 38, 328], fill=rgb("#007acc"))

rows = [
    ("frontend-app",     "main",     "1/5"),
    ("backend-api",      "feature/auth","2/5"),
    ("shared-lib",       "develop",  "3/5"),
    ("docs-site",        "(none)",   "4/5"),
    ("cli-tool",         "bugfix/12","5/5"),
]
for i, (name, branch, limit) in enumerate(rows):
    y = 55 + i * 52
    bg = rgb("#252526") if i % 2 == 0 else rgb("#1e1e1e")
    d.rectangle([50, y, W, y+50], fill=bg)
    d.rectangle([55, y+12, 70, y+28], fill=rgb("#007acc"))
    d.text((78, y+12), name, font=FB, fill=rgb("#cccccc"))
    col = rgb("#ce9178") if branch != "(none)" else rgb("#858585")
    d.text((420, y+12), branch, font=FL, fill=col)
    d.text((700, y+12), limit, font=FL, fill=rgb("#858585"))
    d.text((1180, y+12), "Switch", font=FL, fill=rgb("#007acc"))

d.rectangle([0, H-28, W, H], fill=rgb("#007acc"))
d.text((12, H-22), "Free plan  ·  5/5 contexts used", font=FS, fill=rgb("#ffffff"))
img.save(os.path.join(OUT, "screenshot-01-context-list.png"), "PNG")
print("OK screenshot-01-context-list.png")

# ── Screenshot 2: Save-context dialog ────────────────────────────────────────
img = Image.new("RGB", (W, H), rgb("#1e1e1e"))
d = ImageDraw.Draw(img)
dx, dy, dw, dh = 380, 220, 600, 340
d.rectangle([dx, dy, dx+dw, dy+dh], fill=rgb("#2d2d2d"), outline=rgb("#858585"))
d.text((dx+20, dy+16), "Save Current Workspace as Context", font=FB, fill=rgb("#cccccc"))
d.text((dx+20, dy+60), "Name:", font=FL, fill=rgb("#aaaaaa"))
d.rectangle([dx+90, dy+52, dx+dw-20, dy+92], fill=rgb("#3c3c3c"), outline=rgb("#858585"))
d.text((dx+100, dy+58), "backend-api · feature/auth", font=FB, fill=rgb("#cccccc"))
d.text((dx+20, dy+115), "Git branch:", font=FL, fill=rgb("#aaaaaa"))
d.text((dx+130, dy+115), "feature/auth", font=FB, fill=rgb("#4ec9b0"))
d.text((dx+20, dy+160), "Open files:", font=FL, fill=rgb("#aaaaaa"))
d.text((dx+130, dy+160), "3 files detected", font=FB, fill=rgb("#cccccc"))
d.rectangle([dx+dw-130, dy+250, dx+dw-20, dy+300], fill=rgb("#007acc"))
d.text((dx+dw-118, dy+260), "Save", font=FL, fill=rgb("#ffffff"))
d.rectangle([dx+dw-270, dy+250, dx+dw-140, dy+300], fill=rgb("#3c3c3c"))
d.text((dx+dw-258, dy+260), "Cancel", font=FL, fill=rgb("#cccccc"))
img.save(os.path.join(OUT, "screenshot-02-save-dialog.png"), "PNG")
print("OK screenshot-02-save-dialog.png")

# ── Screenshot 3: Switch confirmation toast ──────────────────────────────────
img = Image.new("RGB", (W, H), rgb("#1e1e1e"))
d = ImageDraw.Draw(img)
tx, ty, tw, th = 420, H-230, 700, 190
d.rectangle([tx, ty, tx+tw, ty+th], fill=rgb("#2d2d2d"), outline=rgb("#4ec9b0"), width=2)
d.text((tx+20, ty+12), "\u2713  ContextBoard: switched to 'backend-api'", font=FB, fill=rgb("#4ec9b0"))
d.text((tx+20, ty+50), "  Terminal opened at /home/dev/projects/backend-api", font=FL, fill=rgb("#cccccc"))
d.text((tx+20, ty+80), "  Branch: feature/auth  |  Files reopened: app.js, config.ts", font=FL, fill=rgb("#cccccc"))
d.text((tx+20, ty+110), "  You can press Esc to close this message.", font=FS, fill=rgb("#858585"))
cx = tx + tw - 70
d.rectangle([cx, ty+12, cx+50, ty+52], fill=rgb("#3c3c3c"))
d.text((cx+18, ty+20), "\u2715", font=FL, fill=rgb("#858585"))
img.save(os.path.join(OUT, "screenshot-03-switch-result.png"), "PNG")
print("OK screenshot-03-switch-result.png")

print("\nAll 3 screenshots generated.")
