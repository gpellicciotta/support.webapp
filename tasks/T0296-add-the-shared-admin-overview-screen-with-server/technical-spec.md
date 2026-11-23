## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Shared Admin Screens".
- `webapp/admin/js/overview-view.mjs` (65 lines); ToDo `admin/js/overview-view.mjs` (56 lines).

### Behavior To Keep
- The reload interval is an option, 30 seconds by default, and stops while the page is hidden.
- It mounts in the T0293 frame and builds with the T0294 builders.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- src/demo/shell-admin-console.js
- src/demo/shell-admin-console.html

Added files are not counted: the screen module and its tests.

### Tests
- Unit: facts from adapter data, reload while visible, no reload while hidden, and failure states.
- Integration: the admin console demo shows the Overview facts from a fake adapter.

Completion check: `python scripts/devops.py check`, with the new tests green.
