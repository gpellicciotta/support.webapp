## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "View Router".
- `webapp/js/app.mjs` lines 760 to 937 and its click and history handlers; counters `webapp/js/app.mjs`.

### Behavior To Keep
- Views are T0276 `RoutedView` instances; navigation actions come from the T0289 registry.
- Sign-in state comes from an app callback.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- docs/adrs/ADR-0004-app-shell.md
- src/demo/shell-demo.js
- src/demo/shell-portal.html

Added files are not counted: the module and its tests.

### Tests
- Unit: route matching order, the fallback, guards, push and replace, `popstate`, and outside routes.
- Integration: the portal demo moves between two routed views with links and the back and forward buttons.

Completion check: `python scripts/devops.py check`, with the new tests green.
