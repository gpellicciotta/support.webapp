## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "File Download Helper".
- `webapp/admin/js/ui.mjs` lines 484 to 497 (`saveJson`).
- `webapp/js/view/account-view.mjs` lines 683 to 720 and `app-notices.mjs` lines 614 to 627.

### Behavior To Keep
- The helper clicks a temporary `a[download]` and revokes the URL afterwards.
- The toast action keeps its URL until dismissed, so the user can download later.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/js/toast.js
- src/contract.json
- docs/specs/components.md
- src/demo/visual-style-gallery.html

Added files are not counted: the helper module and its tests.

### Tests
- Unit: the helper creates, clicks, and revokes a URL; a download toast revokes its URL on dismiss.
- Integration: a gallery button triggers a browser download with the given file name.

Completion check: `python scripts/devops.py check`, with the new tests green.
