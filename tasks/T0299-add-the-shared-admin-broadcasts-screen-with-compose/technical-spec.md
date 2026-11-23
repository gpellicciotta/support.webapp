## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Shared Admin Screens".
- `webapp/admin/js/broadcasts-view.mjs` (522 lines); ToDo `admin/js/broadcasts-view.mjs` (193 lines).

### Behavior To Keep
- The compose and preview split stacks below the shell's narrow breakpoint.
- Retraction asks through an inline confirmation.
- It mounts in the T0293 frame and builds with the T0294 builders.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- src/demo/shell-admin-console.js
- src/demo/shell-admin-console.html
- src/css/shell.css

Added files are not counted: the screen module and its tests.

### Tests
- Unit: preview from form values, recipient selection, publish payload, history, and retraction.
- Integration: in the admin console demo, composing updates the preview and a retraction removes the history row.

Completion check: `python scripts/devops.py check`, with the new tests green.
