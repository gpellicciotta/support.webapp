## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Notices".
- `webapp/js/view/app-notices.mjs` and the notification store in `webapp/js/app.mjs` lines 632 to 759.
- counters `webapp/js/view/app-notification-bar.mjs` and `toast-manager.mjs`.

### Behavior To Keep
- Toasts use `toast.js`; banners use the `banner` component in the shell's banner area.
- A toast pushed out by a newer one never shows twice.
- Inbox discard goes through an app callback.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- docs/adrs/ADR-0003-components-and-patterns.md
- src/demo/shell-demo.js
- src/demo/shell-portal.html

Added files are not counted: the module and its tests.

### Tests
- Unit: routing by type, the banner cap, the inbox pick by severity then age, safe URLs, dismissal, and no duplicate toasts.
- Integration: a shell demo raises an error and an info notice, shows a banner and a toast, and dismissal removes them.

Completion check: `python scripts/devops.py check`, with the new tests green.
