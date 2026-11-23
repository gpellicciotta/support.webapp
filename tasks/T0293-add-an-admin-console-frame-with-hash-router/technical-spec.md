## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Admin Console Frame".
- `webapp/admin/js/main.mjs` and `webapp/admin/css/admin.css` lines 100 to 126; ToDo `admin/js/main.mjs`.

### Behavior To Keep
- Session lookup and the account check stay with the app, passed in as callbacks.
- The skip link focuses the main area, since a `#main` hash would change the route.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- src/css/shell.css
- docs/specs/components.md
- docs/adrs/ADR-0004-app-shell.md
- src/demo/shell-admin-console.html
- src/demo/shell-admin-console.js

Added files are not counted: the module and its tests.

### Tests
- Unit: route parsing, marks and titles, update versus remount, dispose on change, and gate pages.
- Integration: the admin console demo moves between screens by hash and back button, and shows the forbidden gate.

Completion check: `python scripts/devops.py check`, with the new tests green.
