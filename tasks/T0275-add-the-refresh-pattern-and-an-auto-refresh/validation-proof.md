## Walkthrough & Validation
### Changes
- Added `src/js/auto-refresh.js` with `attachAutoRefresh`, ported from Auth's `App.startAutoRefresh` at commit `c7129b8`.
- Added the Refresh pattern to ADR-0003's shared patterns, with the sharing rule exception.
- Added the module to the components.md Feedback table and the naming.md utility table.
- Added a Refresh section to the style guide's patterns.
- Wired the portal demo: a last-check line updates on visible polls and returns, and a long return shows a toast.

### Red Phase
Command: `npx vitest run tests/unit/auto-refresh.test.js` (exit code 1).

```text
 ❯ tests/unit/auto-refresh.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/auto-refresh.test.js [ tests/unit/auto-refresh.test.js ]
Error: Cannot find module '../../src/js/auto-refresh.js' imported from C:/Dev-Projects/support.webapp/tests/unit/auto-refresh.test.js
```

### Green Phase
Command: `npx vitest run tests/unit/auto-refresh.test.js` (exit code 0).

```text
      Tests  9 passed (9)
   Duration  291ms (transform 37%, import 28%, tests 25%, worker 10%)
```

Command: `python scripts/devops.py check` (exit code 0).

```text
[... 2 lines omitted ...]
All 27 markdown files passed linting.
[... 2 lines omitted ...]
All checks passed!
[... 21 lines omitted ...]
======================== 61 passed, 1 skipped in 3.25s ========================
[... 5 lines omitted ...]
 Test Files  37 passed (37)
      Tests  2222 passed (2222)
[... 1196 lines omitted ...]
  858 passed (7.0m)
[... 6 lines omitted ...]
      Tests  7 passed (7)
[... 135 lines omitted ...]
gpellicciotta-support.webapp-0.4.0-pre.tgz
```

### Demo Wiring Check
Command: `node auto-shots.mjs http://127.0.0.1:4173 {{task-dir}} after --drive`, a scratch Playwright script (exit code 0).
It installs a fake clock, advances 60 s, hides the tab for 61 s, then shows it again.

```text
mobile/light: HTTP 200
{"first":"Checks for new events every minute while this tab is visible.","polled":"Checked for new events at 12:04:41 PM.","pollChanged":true,"hiddenUnchanged":true,"toast":["Sample page refreshed after a long absence."]}
[... 6 lines omitted ...]
No console, page, or HTTP problems.
```

### Visual Verification
The before captures serve the committed HEAD demo page and script through Playwright routes; the after captures follow the driven check.

| Width   | Theme | Before                                      | After                                      |
| :------ | :---- | :------------------------------------------ | :----------------------------------------- |
| 390 px  | light | [before](before-portal-mobile-light.png)    | [after](after-portal-mobile-light.png)     |
| 390 px  | dark  | [before](before-portal-mobile-dark.png)     | [after](after-portal-mobile-dark.png)      |
| 1440 px | light | [before](before-portal-desktop-light.png)   | [after](after-portal-desktop-light.png)    |
| 1440 px | dark  | [before](before-portal-desktop-dark.png)    | [after](after-portal-desktop-dark.png)     |

After, the sample section shows the last-check time, and the long return's toast sits above the action bar.
