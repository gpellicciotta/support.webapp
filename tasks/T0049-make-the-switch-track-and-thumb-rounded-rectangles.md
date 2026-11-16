---
id: T0049
owner: "@gemini"
session: antigravity-20261117-537c92
needs: []
branch: task/T0049-make-the-switch-track-and-thumb-rounded-rectangles
worktree: .plan/work/T0049-make-the-switch-track-and-thumb-rounded-rectangles
status: active
started_at: "2026-11-16T23:02:04Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 4, duration_s: 1732.0, input: 493044, output: 49674, cache_read: 10399220}
work_duration: 1887.5
---
# T0049: Make the switch track and thumb rounded rectangles, since the 50% round radius turns the track into an ellipse

## Goals
Make the switch read as a crisp control instead of an egg shape, as reported from ToDo's Settings.
- Cause: `.switch__control` is 2.5rem by 1.5rem with `--radius-round`, which is 50% in every look, so the track is an ellipse.
- Give the track `--radius-control` and the thumb a radius that stays concentric inside it.
- Keep sizes, colors, states, forced-colors rules, and the 44 px label target unchanged.
- Check every look in light and dark, and release so ToDo's can vendor the change.
- Tests: [technical-spec.md](T0049-make-the-switch-track-and-thumb-rounded-rectangles/technical-spec.md).

Completion check: `python scripts/devops.py check` passes.

### Declared Files
- src/css/components/switch.css
- tests/unit/switch.test.js
- tests/e2e/switch.spec.js

Size estimate: 3 files, 60 lines.

## Task Execution Steps
- [x] **[Implement]** Author a failing test that the track and thumb use the control radius, not 50%.
- [x] **[Verify]**    Run the switch tests and confirm the new test fails for the right reason.
- [x] **[Implement]** Change the track and thumb radii in switch.css.
- [x] **[Verify]**    Run `python scripts/devops.py check` and confirm it passes.
- [x] **[Visual]**    Capture the switch gallery sample, off and on, in every look, light and dark.
- [x] **[Doc]**       Update CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-16] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-16] **[Doc]**
  Filed from ToDo's, whose Settings switch looks egg-shaped; the cause is the 50% round radius.

- [2026-11-17] **[Verify]**
  Added unit and Playwright switch radius tests and confirmed both fail against the 50% round radius.

- [2026-11-17] **[Implement]**
  Updated switch.css so the track uses --radius-control and the thumb uses a concentric inner radius.

- [2026-11-17] **[Doc]**
  Documented the rounded-rectangle switch track and concentric thumb under v0.1.1-pre in CHANGELOG.md.

- [2026-11-17] **[Visual]**
  Captured before and after switch gallery specimens across every look and theme.
  - Neutral: [before light](T0049-make-the-switch-track-and-thumb-rounded-rectangles/before-neutral-light.png), [after light](T0049-make-the-switch-track-and-thumb-rounded-rectangles/after-neutral-light.png), [before dark](T0049-make-the-switch-track-and-thumb-rounded-rectangles/before-neutral-dark.png), [after dark](T0049-make-the-switch-track-and-thumb-rounded-rectangles/after-neutral-dark.png).
  - Warm: [before light](T0049-make-the-switch-track-and-thumb-rounded-rectangles/before-warm-light.png), [after light](T0049-make-the-switch-track-and-thumb-rounded-rectangles/after-warm-light.png), [before dark](T0049-make-the-switch-track-and-thumb-rounded-rectangles/before-warm-dark.png), [after dark](T0049-make-the-switch-track-and-thumb-rounded-rectangles/after-warm-dark.png).
  - Bright: [before light](T0049-make-the-switch-track-and-thumb-rounded-rectangles/before-bright-light.png), [after light](T0049-make-the-switch-track-and-thumb-rounded-rectangles/after-bright-light.png), [before dark](T0049-make-the-switch-track-and-thumb-rounded-rectangles/before-bright-dark.png), [after dark](T0049-make-the-switch-track-and-thumb-rounded-rectangles/after-bright-dark.png).

- [2026-11-17] **[Verify]**
  Started `python scripts/devops.py check` under background task `task-144` and installed worktree dependencies via `npm.cmd ci`.

- [2026-11-17] **[Verify]**
  Started supervised `python scripts/devops.py check` job `20261116T233108-46924-05797e` (PID 28184).

- [2026-11-17] **[Verify]**
  Running `python scripts/devops.py check` synchronously under background task `task-218`.

- [2026-11-17] **[Verify]**
  Confirmed `python scripts/devops.py check` passed all linters, unit, browser, integration, and pack checks.
  - 41 pytest and 2109 Vitest unit tests passed.
  - 626 Playwright browser and 7 integration tests passed.

- [2026-11-17] **[Verify]**
  Recorded task outcomes.
  - Files touched: 3.
  - Lines touched: 59.
  - Reopenings: 0.

