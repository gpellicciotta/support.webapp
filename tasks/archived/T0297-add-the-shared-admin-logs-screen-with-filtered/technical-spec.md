## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Shared Admin Screens".
- `webapp/admin/js/logs-view.mjs` (148 lines, with `stripIndent`); ToDo `admin/js/logs-view.mjs` (38 lines).

### Behavior To Keep
- Messages keep their line breaks without the formatter's shared indent.
- Filters and the page live in the URL through T0288.
- It mounts in the T0293 frame and builds with the T0294 builders.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- src/demo/shell-admin-console.js
- src/demo/shell-admin-console.html

Added files are not counted: the screen module and its tests.

### Tests
- Unit: indent stripping, level and text filters, paging, and the empty state.
- Integration: in the admin console demo, a level filter narrows the cards and survives a reload.

Completion check: `python scripts/devops.py check`, with the new tests green.
