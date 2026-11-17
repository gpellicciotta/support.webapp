---
id: T0245
owner: "@claude"
session: claude-20261117-2dfe3c
needs: []
branch: task/T0245-pause-the-page-clock-in-the-form-spec
worktree: .plan/work/T0245-pause-the-page-clock-in-the-form-spec
status: active
started_at: "2026-11-17T19:12:31Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1491.3, input: 98, output: 18252, cache_read: 3491565, cache_write: 83509}
review_status: pending
review_round: 1
review_requested_at: "2026-11-17T19:37:44Z"
---
# T0245: Pause the page clock in the form spec's other async-check tests, which share the 600 ms timing race

## Goals
Pause the page clock in the form spec's other async-check tests, which share the 600 ms timing race.

## Task Execution Steps
- [x] **[Implement]** Implement required changes for T0245.
- [x] **[Verify]**    Verify implementation with automated test suites.
- [x] **[Doc]**       Update documentation and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-17] **[Implement]**
  Reproduced the race with a 1.5 s stall, which failed both real-clock tests, then paused the clock in them through a shared helper.
  - Helper: openPausedGallery, also used by the two paused tests.

- [2026-11-17] **[Verify]**
  Full check passed; the form spec passed 280 of 280 in ten repeats across four projects.
  - Files touched: 1.
  - Lines touched: 51.
  - Reopenings: 0.

- [2026-11-17] **[Doc]**
  Added a DevEx bullet under v0.2.2-pre in CHANGELOG.md.

- [2026-11-17] **[Review]**
  Round 1 requested (mode: agent).

