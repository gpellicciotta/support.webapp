## Technical Specifications
### Source
Auth (`../auth`, commit `c7129b8`) holds the app-local version, built in its task T0248:
- `App.startAutoRefresh` and `App.stopAutoRefresh` in `webapp/js/app.mjs`, with `NOTIFICATIONS_POLL_MILLIS`
  and `VIEW_REFRESH_AFTER_HIDDEN_MILLIS`, both 60 seconds.
- `App.refreshNotifications` notifies listeners only when the inbox's JSON signature changed.
- `DashboardView.autoRefresh = true` opts the dashboard in; views with forms stay out.
- Tests: `webapp/test/browser/spa-shell.test.mjs`, the five tests after "the Notifications button has a plain name".
- Task record: `.plan/tasks/T0248-remove-the-spa-s-refresh-button-and-refresh.md` and its companion folder.

### Refresh pattern text for ADR-0003 "Shared patterns"
- Screens have no manual Refresh button.
- Apps refresh when the user returns to the tab, and poll only while the tab is visible.
- A return after a longer absence also reloads the current screen, when that screen opts in.
- A refresh never reloads a screen with a form, so typed input survives.
- A refresh updates the UI only when the data changed, so selections and scroll positions survive.
- Installed apps also refresh on pull-down, through `pull-refresh.js` (T0274).

### Contract
Utility module `src/js/auto-refresh.js`, following the ADR-0003 JavaScript approach:
- `attachAutoRefresh({ document, onPoll, onReturn, interval = 60000, longAbsence = 60000, now = Date.now })`
  returns `{ destroy() }`.
- Every `interval` while `document.visibilityState` is `visible`, it calls `onPoll()`.
- On `visibilitychange` to visible, it calls `onReturn({ away, long })`, where `away` is the hidden time in
  milliseconds and `long` is `away >= longAbsence`.
- It never calls either callback while hidden; `destroy` clears the timer and the listener.
- Injected `document` and `now` let unit tests run without a browser or real time.
- What to refresh, change detection, and screen opt-in stay with the app.

### Declared Files
- src/demo/shell-demo.js
- docs/adrs/ADR-0003-components-and-patterns.md
- docs/specs/components.md

Added files, not counted: `src/js/auto-refresh.js`, `tests/unit/auto-refresh.test.js`.

Size estimate: 3 files, 90 lines

### Tests
- Unit: `tests/unit/auto-refresh.test.js` with fake timers and an injected document:
  polls each interval while visible and not while hidden; a return calls `onReturn` with the hidden time;
  `long` turns true at the threshold; `destroy` stops polls and returns.
- Integration: none (a timing utility with no UI; T0274's browser tests cover the shell demo, and Auth's adoption task covers an app).

Completion check: `python scripts/devops.py check`
