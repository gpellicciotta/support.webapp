"""Generate the shared app icon set: SVG sources, PNG renditions, and multi-size .ico files.

Output goes to src/img/app-icons/{style}/. PNG rendering needs Chrome or Edge (override with CHROME_PATH) and
the Pillow package. Run: python scripts/generate-app-icons.py

The hexagon is a polygon with a round-joined stroke, so the corner radius is half the stroke width.
Glyphs are drawn on a 100 x 100 grid and shrunk around their visual center for padding.
"""
# ruff: noqa: E501  (inline SVG markup)
import math
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "src" / "img" / "app-icons"
PNG_SIZES = (32, 64, 128, 192, 256, 512)
ICO_SIZES = (16, 32, 48, 64, 128, 256)
BLUE = "#0e6eb8"
BLUE_LIGHT = "#4aa3e8"
BLUE_DARK = "#08487a"
WHITE = "#ffffff"

APPS = ["meteo", "verkeersregels-quiz", "counters", "todos", "auth", "family-portal"]

# Hexagon: polygon radius + round-joined stroke; corner radius = HEX_STROKE / 2.
HEX_R = 36
HEX_STROKE = 16

# Per glyph: (scale, center-x, center-y). Shrinks the glyph around its visual
# center so that there is breathing room to the hexagon border.
FIT = {
    "meteo": (0.84, 50, 50),
    "verkeersregels-quiz": (0.78, 50, 50),
    "counters": (0.84, 50, 50),
    "todos": (1.0, 50, 50),
    "auth": (0.76, 51.1, 50.5),
    "family-portal": (0.84, 50, 50),
}


def hex_points(r, cx=50, cy=50):
    pts = []
    for i in range(6):
        a = math.radians(-90 + 60 * i)
        pts.append(f"{cx + r * math.cos(a):.2f},{cy + r * math.sin(a):.2f}")
    return " ".join(pts)


def sw(color, w=6):
    return f'fill="none" stroke="{color}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"'


def mask(uid, shapes):
    return (f'<mask id="m{uid}" maskUnits="userSpaceOnUse" x="-50" y="-50" width="200" height="200">'
            f'<rect x="-50" y="-50" width="200" height="200" fill="#fff"/>{shapes}</mask>')


def g_counters(fg, uid):
    bars = ('<line x1="34" y1="31" x2="33" y2="68"/><line x1="45" y1="30" x2="45.5" y2="69"/>'
            '<line x1="56" y1="32" x2="58" y2="68"/><line x1="67" y1="31" x2="69" y2="67"/>'
            '<line x1="24" y1="41" x2="77" y2="61"/>')
    return f'<g {sw(fg, 5)}>{bars}</g>'


def g_todos(fg, uid):
    # Lucide "square-check-big", as used by the todos app icon (24 grid).
    return (f'<g transform="translate(50 50) scale(1.85) translate(-12.5 -12)" {sw(fg, 2.4)}>'
            '<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'
            '<path d="m9 11 3 3L22 4"/></g>')


def g_meteo(fg, uid):
    rays = "".join(
        f'<line x1="{66 + 13 * math.cos(math.radians(d)):.1f}" y1="{34 + 13 * math.sin(math.radians(d)):.1f}" '
        f'x2="{66 + 18 * math.cos(math.radians(d)):.1f}" y2="{34 + 18 * math.sin(math.radians(d)):.1f}"/>'
        for d in range(0, 360, 45))
    sun = f'<circle cx="66" cy="34" r="8" fill="{fg}"/><g {sw(fg, 3.5)}>{rays}</g>'
    cloud = ('<rect x="27" y="46" width="44" height="12" rx="6"/>'
             '<circle cx="39" cy="47" r="8"/><circle cx="53" cy="42" r="10.5"/>')
    drops = (f'<g {sw(fg, 4.5)}><line x1="37" y1="65" x2="34" y2="72"/>'
             '<line x1="49" y1="65" x2="46" y2="72"/><line x1="61" y1="65" x2="58" y2="72"/></g>')
    cut = f'<g fill="#000" stroke="#000" stroke-width="5" stroke-linejoin="round">{cloud}</g>'
    return (f'{mask(uid, cut)}<g transform="translate(0 4)"><g mask="url(#m{uid})">{sun}</g>'
            f'<g fill="{fg}">{cloud}</g>{drops}</g>')


def g_quiz(fg, uid):
    q = ('<path d="M41.5 42.5A8.5 8.5 0 1 1 55 49.5Q50 52.5 50 57" fill="none" stroke="#000" '
         'stroke-width="5.5" stroke-linecap="round"/><circle cx="50" cy="65" r="3.4" fill="#000"/>')
    ring = (f'<polygon points="50,14 86,50 50,86 14,50" fill="none" stroke="{fg}" stroke-width="4" '
            'stroke-linejoin="round"/>')
    inner = (f'<polygon points="50,25 75,50 50,75 25,50" fill="{fg}" stroke="{fg}" stroke-width="5" '
             'stroke-linejoin="round"/>')
    return f'{mask(uid, q)}{ring}<g mask="url(#m{uid})">{inner}</g>'


# Users + key glyph taken from the auth app's own icon (auth/webapp/img/auth-icon.svg).
USERS_PATHS = (
    "M9 0C5.96243 0 3.5 2.46243 3.5 5.5C3.5 8.53757 5.96243 11 9 11C12.0376 11 14.5 8.53757 14.5 5.5"
    "C14.5 2.46243 12.0376 0 9 0ZM5.5 5.5C5.5 3.567 7.067 2 9 2C10.933 2 12.5 3.567 12.5 5.5"
    "C12.5 7.433 10.933 9 9 9C7.067 9 5.5 7.433 5.5 5.5Z",
    "M15.5 0C14.9477 0 14.5 0.447715 14.5 1C14.5 1.55228 14.9477 2 15.5 2C17.433 2 19 3.567 19 5.5"
    "C19 7.433 17.433 9 15.5 9C14.9477 9 14.5 9.44771 14.5 10C14.5 10.5523 14.9477 11 15.5 11"
    "C18.5376 11 21 8.53757 21 5.5C21 2.46243 18.5376 0 15.5 0Z",
    "M19.0837 14.0157C19.3048 13.5096 19.8943 13.2786 20.4004 13.4997C22.5174 14.4246 24 16.538 24 19"
    "V21C24 21.5523 23.5523 22 23 22C22.4477 22 22 21.5523 22 21V19C22 17.3613 21.0145 15.9505 19.5996 15.3324"
    "C19.0935 15.1113 18.8625 14.5217 19.0837 14.0157Z",
    "M6 13C2.68629 13 0 15.6863 0 19V21C0 21.5523 0.447715 22 1 22C1.55228 22 2 21.5523 2 21V19"
    "C2 16.7909 3.79086 15 6 15H12C14.2091 15 16 16.7909 16 19V21C16 21.5523 16.4477 22 17 22"
    "C17.5523 22 18 21.5523 18 21V19C18 15.6863 15.3137 13 12 13H6Z",
)
KEY_PATH = (
    "M15 9H15.01M15 15C18.3137 15 21 12.3137 21 9C21 5.68629 18.3137 3 15 3C11.6863 3 9 5.68629 9 9"
    "C9 9.27368 9.01832 9.54308 9.05381 9.80704C9.11218 10.2412 9.14136 10.4583 9.12172 10.5956"
    "C9.10125 10.7387 9.0752 10.8157 9.00469 10.9419C8.937 11.063 8.81771 11.1823 8.57913 11.4209"
    "L3.46863 16.5314C3.29568 16.7043 3.2092 16.7908 3.14736 16.8917C3.09253 16.9812 3.05213 17.0787 3.02763 17.1808"
    "C3 17.2959 3 17.4182 3 17.6627V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891"
    "C3.75992 21 4.03995 21 4.6 21H6.33726C6.58185 21 6.70414 21 6.81923 20.9724"
    "C6.92127 20.9479 7.01881 20.9075 7.10828 20.8526C7.2092 20.7908 7.29568 20.7043 7.46863 20.5314"
    "L12.5791 15.4209C12.8177 15.1823 12.937 15.063 13.0581 14.9953C13.1843 14.9248 13.2613 14.8987 13.4044 14.8783"
    "C13.5417 14.8586 13.7588 14.8878 14.193 14.9462C14.4569 14.9817 14.7263 15 15 15Z"
)


def g_auth(fg, uid):
    users = "".join(f'<path d="{d}" fill="{fg}" stroke="{fg}" stroke-width="1" stroke-linejoin="round"/>' for d in USERS_PATHS)
    key = f'<path d="{KEY_PATH}" fill="none" stroke="{fg}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    return (f'<g transform="translate(18.7 23) scale(1.83 1.618)">{users}</g>'
            f'<g transform="translate(51.3 48.2) scale(1.54 1.43)">{key}</g>')


def g_family(fg, uid):
    y = 68
    heart = (f'<path d="M50 {y}C40 {y - 7} 36 {y - 12} 36 {y - 17}C36 {y - 21} 39 {y - 23.5} 42.5 {y - 23.5}'
             f'C46 {y - 23.5} 48.5 {y - 21.5} 50 {y - 19}C51.5 {y - 21.5} 54 {y - 23.5} 57.5 {y - 23.5}'
             f'C61 {y - 23.5} 64 {y - 21} 64 {y - 17}C64 {y - 12} 60 {y - 7} 50 {y}Z" '
             'fill="#000" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/>')
    house = (f'<path d="M50 22L80 47H72V75H28V47H20Z" fill="{fg}" stroke="{fg}" stroke-width="4" '
             'stroke-linejoin="round"/>')
    return f'{mask(uid, heart)}<g mask="url(#m{uid})">{house}</g>'


GLYPHS = {"meteo": g_meteo, "verkeersregels-quiz": g_quiz, "counters": g_counters,
          "todos": g_todos, "auth": g_auth, "family-portal": g_family}


def build(app, variant, uid, size=512):
    """variant: inverted | flat | 3d"""
    fg = BLUE if variant in ("white-flat", "white-dimensional") else WHITE
    s, cx, cy = FIT[app]
    glyph = (f'<g transform="translate(50 50) scale({s}) translate({-cx} {-cy})">'
             f'{GLYPHS[app](fg, uid)}</g>')
    pts = hex_points(HEX_R)
    defs, gfilter = "", ""
    if variant == "white-flat":
        base = (f'<polygon points="{pts}" fill="{WHITE}" stroke="{WHITE}" stroke-width="{HEX_STROKE}" '
                'stroke-linejoin="round"/>')
    elif variant == "blue-dimensional":
        defs = (
            f'<linearGradient id="g{uid}" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="{BLUE_LIGHT}"/>'
            f'<stop offset="0.55" stop-color="{BLUE}"/><stop offset="1" stop-color="{BLUE_DARK}"/></linearGradient>'
            f'<linearGradient id="h{uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.8"/>'
            '<stop offset="0.5" stop-color="#fff" stop-opacity="0.1"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></linearGradient>'
            f'<clipPath id="c{uid}"><polygon points="{pts}" stroke-width="{HEX_STROKE}"/></clipPath>'
            f'<filter id="s{uid}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="2" stdDeviation="1.6" flood-color="#04243f" flood-opacity="0.45"/></filter>'
            f'<filter id="t{uid}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.2" stdDeviation="1" flood-color="#04243f" flood-opacity="0.5"/></filter>')
        base = (f'<g filter="url(#s{uid})"><polygon points="{pts}" fill="url(#h{uid})" stroke="url(#h{uid})" '
                f'stroke-width="{HEX_STROKE}" stroke-linejoin="round"/></g>'
                f'<polygon points="{pts}" fill="url(#g{uid})" stroke="url(#g{uid})" '
                f'stroke-width="{HEX_STROKE - 5}" stroke-linejoin="round"/>'
                f'<ellipse cx="42" cy="24" rx="28" ry="12" fill="#fff" opacity="0.13" transform="rotate(-18 42 24)"/>')
        gfilter = f' filter="url(#t{uid})"'
    elif variant == "white-dimensional":
        defs = (
            f'<linearGradient id="g{uid}" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="#ffffff"/>'
            '<stop offset="0.55" stop-color="#e3eef8"/><stop offset="1" stop-color="#b4cde3"/></linearGradient>'
            f'<linearGradient id="h{uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/>'
            '<stop offset="0.5" stop-color="#dbe8f4"/><stop offset="1" stop-color="#6f97bb"/></linearGradient>'
            f'<filter id="s{uid}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="2" stdDeviation="1.6" flood-color="#000" flood-opacity="0.55"/></filter>'
            f'<filter id="t{uid}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="0.9" stdDeviation="0.5" flood-color="#fff" flood-opacity="0.95"/></filter>')
        base = (f'<g filter="url(#s{uid})"><polygon points="{pts}" fill="url(#h{uid})" stroke="url(#h{uid})" '
                f'stroke-width="{HEX_STROKE}" stroke-linejoin="round"/></g>'
                f'<polygon points="{pts}" fill="url(#g{uid})" stroke="url(#g{uid})" '
                f'stroke-width="{HEX_STROKE - 5}" stroke-linejoin="round"/>')
        gfilter = f' filter="url(#t{uid})"'
    else:
        base = (f'<polygon points="{pts}" fill="{BLUE}" stroke="{BLUE}" stroke-width="{HEX_STROKE}" '
                'stroke-linejoin="round"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="{size}" height="{size}" '
            f'role="img" aria-label="{app} icon"><title>{app}</title><defs>{defs}</defs>{base}<g{gfilter}>{glyph}</g></svg>')


VARIANTS = ("white-flat", "white-dimensional", "blue-flat", "blue-dimensional")


def find_chrome():
    candidates = [os.environ.get("CHROME_PATH", "")]
    candidates += [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    ]
    candidates += [shutil.which(name) or "" for name in ("google-chrome", "chromium", "chrome", "msedge")]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return candidate
    raise SystemExit("Chrome or Edge not found; set CHROME_PATH.")


def render_png(chrome, svg_path, png_path):
    subprocess.run(
        [chrome, "--headless", "--disable-gpu", "--hide-scrollbars", "--default-background-color=00000000",
         "--window-size=512,512", f"--screenshot={png_path}", svg_path.resolve().as_uri()],
        check=True, capture_output=True,
    )


def main():
    chrome = find_chrome()
    with tempfile.TemporaryDirectory() as tmp:
        for variant in VARIANTS:
            folder = OUT / variant
            folder.mkdir(parents=True, exist_ok=True)
            for index, app in enumerate(APPS):
                svg_path = folder / f"{app}-icon.svg"
                svg_path.write_text(build(app, variant, f"{variant}{index}") + "\n", encoding="utf-8")
                master_path = Path(tmp) / f"{variant}-{app}.png"
                render_png(chrome, svg_path, master_path)
                master = Image.open(master_path).convert("RGBA")
                for size in PNG_SIZES:
                    master.resize((size, size), Image.LANCZOS).save(folder / f"{app}-icon-{size}.png", optimize=True)
                master.save(folder / f"{app}-icon.ico", sizes=[(size, size) for size in ICO_SIZES])
            print(f"generated {variant}")


if __name__ == "__main__":
    main()
