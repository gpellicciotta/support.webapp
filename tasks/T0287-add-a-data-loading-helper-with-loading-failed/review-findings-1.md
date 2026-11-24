---
task: T0287
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-24T00:55:26Z
reviewed_commit: "cda1790"
base_commit: "3e04ab5"
branch: task/T0287-add-a-data-loading-helper-with-loading-failed
---
# Review Findings: Task T0287 (Round 1)

## Summary
Approved.
`src/js/data-loader.js` matches Auth's `loadInto` (`webapp/admin/js/ui.mjs` lines 499 to 533) and keeps its positional signature.
It also fixes two upstream gaps:
- Superseded calls abort their `AbortSignal` and resolve to `false`; upstream resolved `true` for a dropped run.
- Non-quiet status lines sit outside `aria-busy`.

Every goal and specified test has a matching implementation:
- Newest call wins: WeakMap run tokens plus `AbortController`; unit tests cover stale resolution and stale rejection.
- Quiet mode keeps content under `aria-busy="true"`; an empty container still shows the status line.
- A 401 renders a primary Sign in button through the app callback; other failures render Retry with the `refresh` icon.
- States use the T0294 builders (`statusLine`, `errorBanner`, `button`) with `data-data-loader-*` hooks, per naming.md.
- The admin console demo fails once, recovers through Retry, shows 401 Sign in, and runs a quiet refresh.
- Contract entry, components.md catalog row and upgrade note, ADR-0003 decision, and CHANGELOG entry are present.

Checks the reviewer reran in the worktree:
- `npx vitest run`: 52 files, 2438 tests passed.
- `npx eslint .`: exit 0.
- `lint-markdown check --offline`: 28 files passed.
- `npx playwright test tests/e2e/data-loader.spec.js tests/e2e/dom-builders.spec.js tests/e2e/verify-ui.spec.js`: 126 passed, 14 skipped (mobile widths).

## Defects
None.

## Process Gaps
- `python scripts/devops.py check` exited 1 in the worker's run.
  Only `tests/integration/generate-app.test.js` failed.
  The test junctions `resolve('node_modules')`, which does not exist in a plan worktree, so `@stylistic/eslint-plugin` cannot resolve.
  The failure is environmental and unrelated to this change, but the completion check never ran green.
- The after screenshots show only the success state.
  The failed, 401, and quiet states are proven by Playwright assertions, not by images.
- `cancel()` after a non-quiet load leaves the "Loading …" status line in place.
  No spec item covers this; consider rendering nothing or the previous content in a follow-up.

## Required Rework
None.
