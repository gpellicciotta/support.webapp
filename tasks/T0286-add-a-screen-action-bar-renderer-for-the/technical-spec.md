## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Screen Action Bar".
- `webapp/js/view/app-shell.mjs` lines 367 to 400 (`setScreenActions`, `renderActionBar`).

### Behavior To Keep
- Links get `aria-disabled`; buttons get native `disabled`.
- It redraws when an action's state changes; all text is escaped.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- src/demo/shell-demo.js
- src/demo/shell-portal.html

Added files are not counted: the renderer module and its tests.

### Tests
- Unit: buttons and links, disabled state and hints, removal when empty, redraw on change, and escaping.
- Integration: in a shell demo, a routed view's actions show in the bar and go when the view detaches.

Completion check: `python scripts/devops.py check`, with the new tests green.
