## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Shared Admin Screens".
- `webapp/admin/js/sessions-view.mjs` (256 lines) and `admin.css` lines 421 to 432; ToDo `admin/js/tokens-view.mjs` (82 lines).

### Behavior To Keep
- Table rows select through `selection.js`, adding the table multi-select variant.
- Bulk and expired revocation ask through inline confirmations.
- It mounts in the T0293 frame and builds with the T0294 builders.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- src/demo/shell-admin-console.js
- src/demo/shell-admin-console.html
- src/css/components/selection.css

Added files are not counted: the screen module and its tests.

### Tests
- Unit: own-session protection, bulk selection, expired cleanup, filters, and paging.
- Integration: in the admin console demo, selecting two sessions and revoking them removes both rows.

Completion check: `python scripts/devops.py check`, with the new tests green.
