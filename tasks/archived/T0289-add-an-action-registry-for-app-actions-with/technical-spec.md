## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Action Registry".
- `webapp/js/app.mjs` lines 409 to 631 (events and actions); counters `webapp/js/app.mjs` lines 404 to 625.

### Behavior To Keep
- An action has an id, title, description, `href` or handler, `disabled`, and `disabled-reason`.
- Running an `href` action navigates through an app callback, so routing stays outside.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- docs/adrs/ADR-0004-app-shell.md
- src/demo/shell-demo.js

Added files are not counted: the module and its tests.

### Tests
- Unit: add and remove, enable and disable with reasons, toggle, run, events, and click delegation.
- Integration: a shell demo's routed view registers actions through the registry, and a disabled one shows its reason.

Completion check: `python scripts/devops.py check`, with the new tests green.
