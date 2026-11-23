## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Install Prompt Module".
- `webapp/js/app.mjs` lines 254 to 332 and `webapp/js/auth.mjs` lines 67 to 73.
- counters `webapp/js/model/installer.mjs`; meteo `js/pwa.js`.

### Behavior To Keep
- The module owns no button; it reports state through a callback, and the app shows or hides its action.
- `prompt()` resolves to the user's choice and clears the kept event.
- Injected `window` and `matchMedia` keep it testable without a browser.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/contract.json
- docs/specs/components.md
- src/demo/shell-demo.js

Added files are not counted: the module and its tests.

### Tests
- Unit: state changes on `beforeinstallprompt` and `appinstalled`, the prompt outcome, standalone detection, and `destroy`.
- Integration: a shell demo receives a synthetic `beforeinstallprompt` and shows its install action.

Completion check: `python scripts/devops.py check`, with the new tests green.
