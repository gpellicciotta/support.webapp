## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Release Notes Renderer".
- `webapp/js/view/help-view.mjs` lines 459 to 504 (`renderChangelog`).
- `webapp/admin/js/changelog-view.mjs` (`describeRelease`, `inlineMarkdown`, release blocks, paging).

### Behavior To Keep
- Input is plain release objects, so the package imports nothing from support.js.
- All text is escaped; only backtick code spans become `code`; Markdown links show as their label.
- Collapsibles reuse `collapsible.js`; chips and badges reuse the catalog variants.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- src/css/style.css
- docs/specs/components.md
- src/demo/visual-style-gallery.html

Added files are not counted: the renderer module, its CSS partial, and its tests.

### Tests
- Unit: badges per category and Breaking, the highlights filter, area groups, release status, escaping, and code spans.
- Integration: a gallery section where a release expands and collapses and the filter chips switch the entries.

Completion check: `python scripts/devops.py check`, with the new tests green.
