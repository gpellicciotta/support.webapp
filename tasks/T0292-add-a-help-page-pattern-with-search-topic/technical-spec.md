## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Help Page".
- `webapp/js/view/help-view.mjs`, apart from Auth's help text; counters `webapp/js/view/help-view.mjs`.

### Behavior To Keep
- Sections name their topics in a `data-*` hook; matching FAQ entries expand during a search.
- Release notes come from T0279 when the app has them.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- src/css/style.css
- docs/specs/components.md
- src/demo/visual-style-gallery.html

Added files are not counted: the module, its CSS partial, a demo page, and its tests.

### Tests
- Unit: topic and search filtering, FAQ expansion on match, reset, query parameters, and the feedback link.
- Integration: on the demo page, a search narrows the sections and opens a matching FAQ answer.

Completion check: `python scripts/devops.py check`, with the new tests green.
