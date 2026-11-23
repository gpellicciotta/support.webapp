## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "View Header".
- `webapp/styles/app.css` lines 49 to 64; `webapp/admin/css/admin.css` lines 59 to 63.

### Behavior To Keep
- The title uses the heading font and the page title size; the level stays with the app.
- An empty summary line takes no room.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- src/css/style.css
- docs/specs/components.md
- src/demo/visual-style-gallery.html

Added files are not counted: the CSS partial and its tests.

### Tests
- Unit: the contract lists the component and its parts.
- Integration: the gallery shows a header with and without a summary in each look and theme.

Completion check: `python scripts/devops.py check`, with the new tests green.
