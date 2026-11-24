## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Data Loading Helper".
- `webapp/admin/js/ui.mjs` lines 499 to 533 (`loadInto`); ToDo `admin/js/ui.mjs` `loadInto`.

### Behavior To Keep
- It draws its states with the T0294 builders: status line, error banner, and buttons.
- A 401 offers Sign in through an app callback; other failures offer Retry.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- src/demo/shell-admin-console.js

Added files are not counted: the helper module and its tests.

### Tests
- Unit: the newest call wins, quiet mode keeps content, 401 offers Sign in, and Retry reloads.
- Integration: an admin console demo screen fails once and recovers through Retry.

Completion check: `python scripts/devops.py check`, with the new tests green.
