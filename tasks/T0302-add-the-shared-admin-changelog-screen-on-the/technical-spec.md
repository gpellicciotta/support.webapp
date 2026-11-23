## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Shared Admin Screens".
- `webapp/admin/js/changelog-view.mjs` (132 lines); ToDo `admin/js/changelog-view.mjs` (115 lines).

### Behavior To Keep
- Auth loads `/CHANGELOG.md` and ToDo `/changelog`; the adapter hides that difference.
- It mounts in the T0293 frame and builds with the T0294 builders.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- src/demo/shell-admin-console.js
- src/demo/shell-admin-console.html

Added files are not counted: the screen module and its tests.

### Tests
- Unit: adapter loading, paging, and failure states.
- Integration: the admin console demo shows two pages of releases from a fake adapter.

Completion check: `python scripts/devops.py check`, with the new tests green.
