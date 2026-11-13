---
id: T0027
owner: "@codex"
session: codex-20261113-f09fcc
needs: []
branch: task/T0027-add-the-theme-switch-and-service-worker-update
worktree: .plan/work/T0027-add-the-theme-switch-and-service-worker-update
status: active
started_at: "2026-11-13T01:38:28Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 6, duration_s: 2449.4, input: 183360, output: 36394, cache_read: 11348992, cache_write: 0}
  review: {turns: 2, duration_s: 153.6, input: 92126, output: 4412, cache_read: 621824, cache_write: 0}
work_duration: 11399.4
review_status: pending
review_round: 2
---
# T0027: Add the theme switch and service worker update modules, and document the shared patterns

## Goals
Add the shared patterns of [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md) that todos.webapp already implements.
`theme-switch.js` applies System, Light, or Dark to `data-theme` and stores the choice.
`sw-update.js` shows an Update toast for a waiting service worker and reloads on request.
Document the delete and Undo, offline page, and `aria-current` patterns in the style guide.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0003 and the todos.webapp settings view and service worker update module.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Add the theme and update modules and the gallery theme switch on them.
- [x] **[Verify]**    Run the unit tests and the browser test until they pass.
- [x] **[Doc]**       Document all five patterns in the style guide, and update CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-13] **[Implement]**
  Added both modules and gallery persistence. Updated the undeclared gallery unit test to dispatch changes with native checked state. Browser evidence covers 390 and 1440 pixels in both themes.

- [2026-11-13] **[Verify]**
  Ran npx playwright test tests/e2e/theme-switch.spec.js: four passed. Inspected before/after captures linked in validation-proof.md. Full check server PID 76640; focused server PID 76944. Playwright owns server cleanup.

- [2026-11-13] **[Read]**
  Read ADR-0003, the todos settings appearance section, and its worker update watcher. Preserved the skip-waiting message contract and explicit user consent.

- [2026-11-13] **[Verify]**
  Confirmed missing-module failures before implementation. Browser tests reproduced lost preferences after reload in all four projects. Recorded failure excerpts in validation-proof.md.

- [2026-11-13] **[Doc]**
  Documented theme preferences, worker updates, delete and Undo, offline pages, and current navigation. Updated the existing prerelease changelog without changing versions.

- [2026-11-13] **[Verify]**
  Reran python scripts/devops.py check with persistent check-output.txt after the earlier session became unavailable. Session 3539; browser runner PID 87896. Completion validation passed.

- [2026-11-13] **[Decided]**
  Kept the task within its planned shared-pattern scope. Counted changes: three modified text files and 91 changed lines; added files and CHANGELOG.md are excluded. Reopenings: zero.

- [2026-11-13] **[Verify]**
  Full check passed: 2103 unit tests, 614 browser tests, four integration tests, three Python tests, linting, and packaging. Two browser cases were skipped. No test servers remained. Saved complete output and summary evidence.

- [2026-11-13] **[Verify]**
  Committed implementation as 2901a3f. Removed trailing whitespace, reran ESLint and diff checks successfully, and confirmed a clean worktree. Agent review remains pending for the orchestrator.

- [2026-11-13] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-13] **[Review]**
  Round 1 rejected by @codex-2: Rejected for one service worker update lifecycle defect.
  - Findings: [review-findings-1.md](T0027-add-the-theme-switch-and-service-worker-update/review-findings-1.md).

- [2026-11-13] **[Implement]**
  Reproduced review finding with waiting=null after external activation. Replaced stale Update with explicit Reload, invalidated old callbacks, and ensured reload occurs once. All 36 affected unit tests passed.

- [2026-11-13] **[Verify]**
  Full rework check runs as session 45393, browser runner PID 66844. The fast suite passed 2104 tests. Updated the technical specification with the external-activation regression.

- [2026-11-13] **[Verify]**
  Full rework check passed: 2104 unit tests, 614 browser tests, four integration tests, three Python tests, linting, and packaging. Two existing browser cases skipped. No test servers remained. Evidence records red and green regression results.

- [2026-11-13] **[Verify]**
  Addressed round-one finding and committed the rework. Worktree is clean. Final counted scope is three modified text files and 92 changed lines; added files are excluded. Reopenings: zero. Review remains pending for the orchestrator.

- [2026-11-13] **[Review]**
  Round 2 requested (mode: agent).

