## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Notifications Inbox and Unread Button".
- `webapp/js/view/notifications-view.mjs`, `webapp/styles/app.css` lines 464 to 522, `app-shell.mjs` lines 122 to 139.
- counters `webapp/js/view/notifications-view.mjs`.

### Behavior To Keep
- Rows reuse `selection.js`; actions reach the app through events, so the package knows no API.
- The count comes from the T0290 store.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- src/css/style.css
- src/css/shell.css
- docs/specs/components.md
- docs/adrs/ADR-0003-components-and-patterns.md
- src/demo/shell-portal.html
- src/demo/shell-demo.js

Added files are not counted: the module, its CSS partial, and its tests.

### Tests
- Unit: row markup per type and read state, the 99+ label, bulk action events, and escaping.
- Integration: in the portal demo, selecting two rows and choosing Mark Read updates the unread count.

Completion check: `python scripts/devops.py check`, with the new tests green.
