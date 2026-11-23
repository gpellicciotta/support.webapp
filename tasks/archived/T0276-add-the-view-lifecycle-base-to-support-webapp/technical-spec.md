## Technical Specifications
Source: Auth T0246 and T0251, and support.js v3.1.0 (`src/component.mjs`, `src/app-view.mjs`), the last release that shipped the base.
Consumers: Auth (a thin subclass today) and counters (uses support.js `app-view.mjs` through v3), so the second-app rule is met in fact.

### Behavior To Keep
`Component` (support.js v3.1.0, 405 lines; Auth's older copy, 237 lines):
- `attach(el)` clones the template once, wires overlays, and re-attaches the same element; `detach()` removes tracked listeners.
- `registerEventListener(target, type, cb)` tracks listeners and `unregisterEventListeners()` clears them.
- `createComponentUIHtml()` builds the outer markup: error overlay, wait overlay, main area; `createMainUIHtml()` and `updateMainUI(info)` are the hooks.
- `showMainUI`, `showWaitOverlay`, `showErrorOverlay(errInfo)`; `refreshData()` and `refreshComponentUI()`.
- `startLongRunningOperation(op)` shows the wait overlay only after a delay (700 ms default), maps failures to the error overlay, and always runs `always`.
- Progress start and stop on the app when it provides `startProgress` and `stopProgress`.
`AppView` adds `title`, `routeRegex` (default `^/{id}(/.*)?$`), `getActions()`, and registering and unregistering actions with the app.

### Behavior Auth Needs (T0231)
- The error overlay is an empty state with a "Try again" button and a way back; the back link is the dashboard when signed in and the start page when not.
- View actions not marked `'context-bar': false` go to the shell's action bar; separators are dropped.
- Configurable error icon, and the wait delay, without subclassing.

### Design Constraints
- Follow naming.md: hooks as `data-view-*` attributes, state in ARIA or native attributes; no `.error-overlay` style classes as hooks.
- Visuals come from support.webapp CSS and tokens; no inline styles.
- Pure JavaScript, no framework, no build step; testable with the existing mock DOM in `tests/unit`.
- Translation keys per i18n.md for the default texts ("Try again", "Back to dashboard", "Waiting for data...").
- Decide in the **[Decide]** step whether this is one module or two (lifecycle base and routed view), and record it in ADR-0003.

### Declared Files
- src/contract.json
- docs/specs/components.md
- docs/adrs/ADR-0003-components-and-patterns.md
- src/js/app-nav.js
- src/css/shell.css
- package.json

Added files are not counted: the new module, its CSS partial, its unit tests, and its demo.

### Tests
- Unit: attach, re-attach, and detach; long-running operation success, failure, and delayed wait overlay; error overlay content and back link; action registration and unregistration.
- Integration: a shell demo page where a view fails and recovers through Try again, run in the browser suite.

Completion check: `python scripts/devops.py check`, with the new tests green.
