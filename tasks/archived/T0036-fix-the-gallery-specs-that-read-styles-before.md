---
id: T0036
owner: "@codex"
session: codex-20261113-bdddfa
needs: []
branch: task/T0036-fix-the-gallery-specs-that-read-styles-before
worktree: .plan/work/T0036-fix-the-gallery-specs-that-read-styles-before
status: completed
started_at: "2026-11-12T23:50:36Z"
ended_at: "2026-11-13T00:06:57Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 1803.8, input: 106840, output: 14400, cache_read: 5953792, cache_write: 0}
  review: {turns: 2, duration_s: 136.4, input: 72342, output: 3272, cache_read: 576512, cache_write: 0}
review_status: approved
review_round: 1
reviewed_by: "@codex-2"
work_duration: 981.7
completion-commit: b272882c99396b2a0c64d16576acbd9bac3f48d0
---
# T0036: Fix the gallery specs that read styles before a look switch settles, seen failing under load in bright and card

## Goals
Make `bright.spec.js` and `card.spec.js` wait until a look switch and its color transitions settle before reading styles.
Under load, `bright.spec.js:47` read `--color-primary` as black, and `card.spec.js:5` measured an unstyled 300x17 tile.
Both passed 40 of 40 runs in isolation, during T0013 on 2026-11-12.
Reuse the transition wait in `verify-ui.spec.js` through a shared helper in `gallery-helpers.js`.
Completion check: `python scripts/devops.py check` passes twice in a row, exit code 0.
### Declared Files
- tests/e2e/gallery-helpers.js
- tests/e2e/bright.spec.js
- tests/e2e/card.spec.js
### Tests
- Unit test: none (browser timing only; the specs themselves are the tests)
- Integration: run both specs with `--repeat-each 20` while the full browser suite runs.
Size estimate: 3 files, 40 lines

## Task Execution Steps
- [x] **[Implement]** Add a settle helper to gallery-helpers.js and call it after each look switch in both specs.
- [x] **[Verify]**    Run both specs with repeat-each 20 under load and the full check twice.
- [x] **[Doc]**       Update CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-12] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-13] **[Decided]**
  Reuse the verifier transition wait inside selectGalleryLook. Add a deterministic browser regression before implementation; existing stylesheet synchronization already covers imports.

- [2026-11-13] **[Verify]**
  Regression failed with rgb(17, 0, 0), then passed after sharing the transition wait. Concurrent commands: python scripts/devops.py check (session 69434); npx playwright test bright.spec.js card.spec.js --repeat-each 20 --reporter line (session 99097).

- [2026-11-13] **[Implement]**
  Shared the verifier transition wait with look selection, added a failing-first regression, and documented synchronization. Bright and card already call selectGalleryLook after each look change.

- [2026-11-13] **[Verify]**
  First full check passed, exit 0: 2062 unit tests, 534 browser tests, two skipped cases, and four integration tests. Second full check started in session 4288: python scripts/devops.py check.

- [2026-11-13] **[Verify]**
  Stress run passed all 400 cases, exit 0, while the full browser suite ran concurrently. Both full checks used unchanged code.

- [2026-11-13] **[Verify]**
  Both consecutive python scripts/devops.py check runs passed, exit 0. Full logs and verbatim summaries accompany validation-proof.md. Changes: five files, 35 lines touched; no reopenings. Agent review remains pending.

- [2026-11-13] **[Verify]**
  Completion validation passed. Committed 9d81716 on the task branch. Implementation, verification, and documentation steps are checked; the orchestrator must open agent review.

- [2026-11-13] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-13] **[Review]**
  Round 1 approved by @codex-2: [Decided]** Approved after inspecting the commit, diff, task specifications, execution log, and validation artifacts.
  - Findings: [review-findings-1.md](T0036-fix-the-gallery-specs-that-read-styles-before/review-findings-1.md).

- [2026-11-13] **[Complete]**
  Task completed successfully.

