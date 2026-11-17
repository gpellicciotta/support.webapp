## Technical Specifications

### Declared Files
- src/css/shell.css
- src/demo/shell-toolbar.html
- src/demo/shell-demo.js
- tests/e2e/shell.spec.js
- tests/unit/icon.test.js
- docs/adrs/ADR-0004-app-shell.md
- docs/specs/visual-style-guide.md

Mechanical command: `perl -0pi -e 's/(<symbol id="icon-more" viewBox="0 0 24 24">\s*)<circle cx="5" cy="12" r="1"\/>(\s*)<circle cx="12" cy="12" r="1"\/>(\s*)<circle cx="19" cy="12" r="1"\/>/$1<circle cx="12" cy="5" r="1"\/>$2<circle cx="12" cy="12" r="1"\/>$3<circle cx="12" cy="19" r="1"\/>/' src/looks/{neutral,bright,warm,_template}/icons.svg`
Mechanical files: src/looks/neutral/icons.svg, src/looks/bright/icons.svg, src/looks/warm/icons.svg, src/looks/_template/icons.svg

Size estimate: 7 files, 150 lines

### Design
- `.app__top-bar` pads with `max(var(--gutter), (100% - var(--_app-width)) / 2, env(safe-area-inset-*))` on each side, as the action bar does.
- `--_app-glyph-inset` is `(var(--target-min) - var(--icon-md)) / 2`, so warm's larger glyphs get a smaller inset.
- The first `.icon-button` child of the bar gets a negative start margin of that inset.
- The last `.icon-button`, directly in the bar or last in a last `.app__top-actions`, gets a negative end margin.
  "Last" ignores following `[popover]` and `[hidden]` siblings, which take no room, so a menu after its button is fine.
- **[Decided]** The pull applies to icon buttons only, as the goal states; the account menu's avatar button keeps its box edge.
- **[Decided]** The toolbar's overflow button drops `app__menu-button`, which names the start-side navigation button, and is labeled "More actions".
- **[Decided]** The template's start-side navigation menu button keeps `icon-more`; T0240 replaces it with a menu glyph.

### Tests
- Unit: every look's sprite draws `icon-more` as circles at (12, 5), (12, 12), and (12, 19) (`tests/unit/icon.test.js`).
- Unit: the top bar and action bar rules pad both sides with the main column formula and their own safe-area inset (`tests/e2e/shell.spec.js`).
- Integration: each shell demo, at 390 and 1440 px in light and dark, measures under 0.5 px between the top bar's first and last item and the main content edges; icon buttons count by their glyph box.
- Integration: the toolbar demo's last top bar item is the "More actions" `icon-more` button, and it still opens its menu.

Completion check: `python scripts/devops.py check`
