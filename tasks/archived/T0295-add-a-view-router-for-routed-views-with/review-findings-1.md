---
task: T0295
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-24T03:02:35Z
reviewed_commit: "f66c30c"
base_commit: "023d2b9"
branch: task/T0295-add-a-view-router-for-routed-views-with
session: claude-20261124-f012ea
session_agent: claude-code
session_created_at: 2026-11-24T02:53:13Z
---
# Review Findings: Task T0295 (Round 1)

## Summary
Approved. The work meets every goal and acceptance criterion.
- `src/js/view-router.js` exports `createViewRouter` and `attachViewRouter`.
- It registers views in order with a fallback and applies `onlyWhenSignedIn` and `neverWhenSignedIn` guards via `isSignedIn`.
- History uses push or replace, `popstate` makes no history writes, and outside routes use `location.assign`/`replace`.
- It keeps the shell title, `document.title`, and `aria-current="page"` route marks in sync.
- Behavior matches Auth's `App` (`../auth/webapp/js/app.mjs`, View Management region) and counters' `App`.
- The match includes the same-view no-op in `activateSpecificView` and the `return-url` sign-in redirect.
- Hooks are `data-view-router-*` attributes and ARIA state only, as naming.md requires.
- The `view-router` key is in `src/contract.json`, with entries in components.md, ADR-0004, and CHANGELOG.md.
- Unit tests cover the spec list: matching order, fallback, guards, push and replace, `popstate`, and outside routes.
- The Playwright spec moves between two routed portal views with links, Back, and Forward.

Reviewer verification on `f66c30c`:
- Command: `python scripts/devops.py check`, exit code 0.
- Results: lint passed, pytest 61 passed with 1 skipped, Vitest 2477/2477, Playwright 1036 passed with 48 skipped.
- Integration tests: 7/7 passed.

## Defects
None.

## Process Gaps
- Non-blocking: the full `devops.py check` in validation-proof.md exited 1 before `npm ci`.
  - Only `npm run test:integration` was re-run after that.
  - My own full `check` run passed, so the evidence holds.
- Non-blocking: the module is 916 lines against the 200-line size estimate.
  - The Execution Log counts only declared files (138 lines), as the spec allows.
  - Recording the module size would make the overrun visible.
- Non-blocking edge case: an in-root link like `href="/\evil.test"` is treated as an internal route.
  - `history.pushState` then throws `SecurityError` inside the click handler after `preventDefault`.
  - The browser blocks the cross-origin write, so this is not an open redirect.
  - A future hardening could reject paths that start with `/\`.
- Non-blocking demo nit: `shell-portal.html` nests `<nav class="toast-demo-actions">` inside a `div` with the same class.
- Non-blocking demo nit: detaching with the demo toggle and then navigating calls `detach()` twice on the same view.
  - `RoutedView.detach` tolerates this, and nothing visible breaks.

## Required Rework
None.
