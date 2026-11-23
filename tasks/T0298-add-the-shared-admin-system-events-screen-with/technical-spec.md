## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Shared Admin Screens".
- `webapp/admin/js/system-events-view.mjs` (266 lines); ToDo `admin/js/system-events-view.mjs` (114 lines).

### Behavior To Keep
- Type, severity, limit, and offset go to the adapter; the search filters loaded rows.
- A details toggle shows the event's metadata as formatted JSON in the entry card.
- It mounts in the T0293 frame and builds with the T0294 builders.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- src/demo/shell-admin-console.js
- src/demo/shell-admin-console.html

Added files are not counted: the screen module and its tests.

### Tests
- Unit: adapter query parameters, search, paging, and the details toggle's ARIA state.
- Integration: in the admin console demo, an event's details expand and collapse.

Completion check: `python scripts/devops.py check`, with the new tests green.
