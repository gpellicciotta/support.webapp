---
task: T0293
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-24T02:23:49Z
reviewed_commit: "e86e3fe"
base_commit: "259dcfa"
branch: task/T0293-add-an-admin-console-frame-with-hash-router
session: claude-20261124-22cb06
session_agent: claude-code
session_created_at: 2026-11-24T02:18:56Z
---
# Review Findings: Task T0293 (Round 1)

## Summary
Approved.
The work meets every goal in the task file and the technical specification:
- Screen registry with `mount`, `update`, and `dispose`.
- Hash router (`parseRoute`), `aria-current` route marks, and screen and document titles.
- Shell with side panel, centered `.app__gate` pages for checking, failure, and forbidden states, and a signed-out shell.
- Session and account checks stay with the app as callbacks.
- The skip link calls `preventDefault` and focuses `#main`, so the route hash stays unchanged.
- JavaScript hooks use only `data-admin-console-*` attributes and ARIA state.

The unit tests cover route parsing, marks and titles, update versus remount, dispose on change, gate pages, `start()` paths, and attach mode.
The e2e spec drives the demo by hash and the Back button, shows the forbidden gate, and checks the signed-out shell.
Reviewer reruns on `e86e3fe`:
- `python scripts/devops.py lint`: exit 0.
- `python scripts/devops.py tests`: exit 0; 61 pytest passed, 1 skipped, 2469 Vitest passed.
- `npx playwright test` on the 8 e2e specs that load `shell-admin-console.html`, including `admin-console.spec.js` and `verify-ui.spec.js`: 340 passed, 44 skipped, exit 0.

The screenshots show the gate and overview correctly across looks, themes, and widths.
The `.app__gate` rules match Auth's `.gate` rules at `eeb9439`, `admin.css` lines 100 to 126.
The "6 files, 295 lines" metric in the log counts the declared files only, as the spec defines, and matches the diff.

## Defects
None.

## Process Gaps
- Non-blocking: scope is far above the estimate.
  `src/js/admin-console.js` has 1234 lines (46.8 kB), against an estimate of 220 lines and about 200 lines in the Auth source.
  Unrequested extras include `attachAdminConsole` with DOM save and restore, nav badges, `createContext`, `beforeStart`, `requiredRealm`, `renderSignedOutSlot`, and `registerScreen`.
  It works and has tests, but the larger surface makes the package API harder to maintain.
  The log records the `attachAdminConsole` decision but gives no reason for the size.
- Non-blocking: `tests/e2e/admin-console.spec.js` writes screenshots when a task-specific `T0293_CAPTURE_DIR` variable is set.
  That ties committed test code to one task.
  A generic capture variable, or a separate capture script, would avoid that.
- Non-blocking: the same-screen `update` path in `dispatchRoute` rewrites history with `replaceState` to carry the old hash query over to the new detail id.
  The behavior is documented and tested, but it is an implicit side effect that apps cannot turn off.
- Non-blocking: the proof shows `python scripts/devops.py check` stage by stage, not as one green run.
  The integration stage needed `npm ci` in the worktree and was rerun separately.
  Each stage passed, so this changes no deliverable.
- Non-blocking: before screenshots cover only the neutral look, while the after screenshots cover all three looks.

## Required Rework
None.
