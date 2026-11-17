## Technical Specifications

### Design
- **[Decided]** The wide grid puts the top bar and the action bar on full-width rows; the sidebar and side panel sit between them.
- **[Decided]** A new top bar part `app__nav-toggle` is the hamburger; `app__menu-button` keeps its popup-menu meaning.
- **[Decided]** The glyph id is `icon-nav-menu`, because warm's `icon-menu` is a utensils glyph that family-portal's week-menu tile uses.
  It joins the core ids of `contract.json`, so every look sprite must draw it.
- **[Decided]** State uses native states and ARIA only, as `naming.md` requires:
  - Wide open: toggle `aria-expanded="true"`.
  - Wide rail: toggle `aria-expanded="false"`, sidebar shown.
  - Wide hidden: sidebar `hidden`.
  - Narrow drawer: the sidebar is an `auto` popover; `:popover-open` shows the drawer under the bar, with a `::backdrop`.
- **[Decided]** The toggle carries `popovertarget`, so without the script it still opens the drawer and stays out of light dismiss.
  The new `src/js/app-nav.js` module (`attachAppNav`) cancels the native toggle, cycles wide states, and drives the drawer.
- **[Decided]** Below 64rem the toggle hides when a bottom bar exists, since the bottom bar already holds the navigation.
- **[Decided]** With a sidebar in the wide layout, both bars start at the nav icons' glyph column; the drawer aligns its icons with the bar gutter.

### Declared Files
- src/css/shell.css
- src/demo/shell-admin-console.html
- src/demo/shell-admin-console.js
- src/demo/shell-list-editor.html
- src/demo/shell-demo.js
- src/contract.json
- src/looks/neutral/icons.svg, src/looks/warm/icons.svg, src/looks/bright/icons.svg, src/looks/_template/icons.svg
- docs/adrs/ADR-0004-app-shell.md
- docs/specs/visual-style-guide.md
- docs/specs/components.md
- tests/e2e/shell.spec.js
- tests/unit/icon.test.js
- New: src/js/app-nav.js, tests/unit/app-nav.test.js

Size estimate: 15 files, 600 lines.
Size note: one UI concern spans CSS, a module, demos, sprites, and docs; a split would leave a half-built bar.

### Tests
- Unit: `tests/unit/app-nav.test.js` covers the wide cycle, `aria-expanded` and labels, `hidden`, drawer open and close, Escape, focus return, link close, and media changes.
- Unit: `tests/unit/icon.test.js` checks that every look draws `icon-nav-menu` as three horizontal lines.
- Integration: `tests/e2e/shell.spec.js` checks the full-width bars, glyph alignment, the wide cycle widths, and the admin console drawer at 390 px.

Completion check: `python scripts/devops.py check`.
