# App Icons
Shared hexagon app icons for every app, existing and planned.

---

## Styles
[src/img/app-icons/](../../src/img/app-icons/) holds one folder per style; the [icon gallery](../../src/demo/app-icon-gallery.html) shows them all.

| Style               | Look                                       | Use                                  |
| :------------------ | :----------------------------------------- | :----------------------------------- |
| `blue-flat`         | Blue hexagon, white glyph                  | Favicons and in-app logos            |
| `blue-dimensional`  | Gradient, rim light, and shadow            | Install icons on devices             |
| `white-flat`        | White hexagon, blue glyph                  | Dark backgrounds                     |
| `white-dimensional` | White gradient, rim, and shadow            | Dark backgrounds at large sizes      |

The flat style stays crisp at 16 and 32 px, where the dimensional shadow blurs the edge.
The dimensional style reads best at home screen sizes.

---

## Files
Each style folder holds these files per app:
- `{{app}}-icon.svg`: the vector source with a transparent background.
- `{{app}}-icon.ico`: frames of 16, 32, 48, 64, 128, and 256 px.
- `{{app}}-icon-{{size}}.png`: 16, 32, 48, 64, 96, 128, 192, 256, and 512 px, transparent.
- `{{app}}-apple-touch-icon.png`: 180 px on an opaque plate, since iOS fills transparency with black.
- `{{app}}-icon-maskable-{{size}}.png`: 192 and 512 px on an opaque plate.

Plates are white behind the blue styles and `#0a1626` behind the white styles.
Maskable icons keep the hexagon inside the safe zone, a centered circle of 40% radius.

---

## Adopting the Icons
Releases leave the icons out, so the `vendor` command does not copy them.
Each app copies only its own files once, from a support.webapp checkout at a release tag.
Apps wire the files up as follows:
- Favicon: `blue-flat` ICO as `favicon.ico`, plus the SVG as `<link rel="icon" type="image/svg+xml">`.
- In-app logo: `blue-flat` SVG in the header or sign-in page.
- Apple touch icon: `blue-dimensional` `{{app}}-apple-touch-icon.png` as `<link rel="apple-touch-icon">`.
- Web app manifest: `blue-dimensional` 192 and 512 px PNGs with `purpose: any`.
- Web app manifest: `blue-dimensional` maskable 192 and 512 px PNGs with `purpose: maskable`.

The todos SVG embeds the Lucide ISC notice of its checkbox glyph; keep it in every copy.
Apps that copy only todos PNGs list the same notice in their own license or notices file.

---

## Regenerating
Run the generator after changing a glyph, a color, or a size:

```bash
python scripts/generate-app-icons.py
```

It needs Chrome or Edge, overridable with `CHROME_PATH`, and Pillow from [requirements.txt](../../scripts/requirements.txt).
[test_generate_app_icons.py](../../tests/test_generate_app_icons.py) checks that every rendition is committed.
