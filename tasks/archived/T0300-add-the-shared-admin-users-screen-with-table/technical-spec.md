## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Shared Admin Screens".
- `webapp/admin/js/users-view.mjs` (564 lines); ToDo `admin/js/users-view.mjs` (270 lines).

### Behavior To Keep
- Extension hooks add detail panel sections and table columns.
- Deletion and restore ask through inline confirmations in the panel's danger zone.
- It mounts in the T0293 frame and builds with the T0294 builders.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- src/demo/shell-admin-console.js
- src/demo/shell-admin-console.html

Added files are not counted: the screen module and its tests.

### Tests
- Unit: table filters and paging, panel content, extension hooks, creation, deletion, and restore.
- Integration: in the admin console demo, selecting a user opens the panel and New user adds a row.

Completion check: `python scripts/devops.py check`, with the new tests green.
