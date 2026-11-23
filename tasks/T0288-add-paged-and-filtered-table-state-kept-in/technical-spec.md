## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Paged and Filtered Table State".
- `webapp/admin/js/ui.mjs` lines 103 to 129 and 419 to 465; ToDo `admin/js/ui.mjs` `pageParams`, `mountPagedTable`.

### Behavior To Keep
- Empty filter values drop out of the query; a reload or shared link restores the table.
- Page numbers clamp to the available pages.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- src/demo/shell-admin-console.js
- src/demo/shell-admin-console.html

Added files are not counted: the module and its tests.

### Tests
- Unit: filter round trips without history entries, page clamping, and server page parameters.
- Integration: in the admin console demo, a filter and a page survive a reload.

Completion check: `python scripts/devops.py check`, with the new tests green.
