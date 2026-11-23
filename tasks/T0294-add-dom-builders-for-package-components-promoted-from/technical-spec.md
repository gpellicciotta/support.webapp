## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "DOM Builders".
- `webapp/admin/js/ui.mjs`; ToDo `admin/js/ui.mjs`.

### Behavior To Keep
- `on*` props add listeners; `value`, `checked`, `disabled`, `hidden`, `open`, and `selected` set properties.
- Every builder's output matches its skeleton in components.md.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- docs/adrs/ADR-0003-components-and-patterns.md
- src/demo/shell-admin-console.js

Added files are not counted: the module and its tests.

### Tests
- Unit: `h` props, listeners, and properties, and each builder against its catalog skeleton.
- Integration: the admin console demo, rebuilt with the builders, still passes the shell browser tests.

Completion check: `python scripts/devops.py check`, with the new tests green.
