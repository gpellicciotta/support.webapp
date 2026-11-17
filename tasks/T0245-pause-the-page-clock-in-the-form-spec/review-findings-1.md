---
task: T0245
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-17T19:37:45Z
reviewed_commit: "f914cd2"
base_commit: "81f06e6"
branch: task/T0245-pause-the-page-clock-in-the-form-spec
---
# Review Findings: Task T0245 (Round 1)

## Summary
Approved.
Both remaining real-clock tests in `tests/e2e/form.spec.js` now run on a paused page clock.
They are `an async check shows the pending state, then its error` and `a valid submit sets the busy state, then confirms the save`.
One `openPausedGallery` helper now serves all four async-check tests, as the spec decided.

Clock steps checked against the sources:
- The name check waits 600 ms (`src/demo/gallery.js:120`).
- The live region sets its message 100 ms after clearing (`src/js/live-region.js:41`).
- The save waits 800 ms from the busy start (`src/demo/gallery.js:128`).
- The valid submit test advances 600 + 100 + 700 ms, so the save settles at exactly 800 ms after busy starts.

The new assertions are stronger, not weaker:
- The form stays idle during the name check.
- The Save button loses `aria-disabled` after the save.
- The second check shows its busy state before it settles.

The submit-time check test dropped its fixed 2026 epoch for the shared relative pause.
No test asserts wall-clock dates, so this changes no behavior.

The red and green evidence is consistent with the logs in the companion directory.
`red.log` shows both old tests failing under a 1.5 s stall.
`green-stalled.log` shows 28 of 28 passing with stalls.
`repeat.log` shows 280 of 280 passing.
`check.log` holds the full check.

Reviewer verification on `f914cd2`:
- `npx playwright test tests/e2e/form.spec.js --repeat-each 5 --reporter=dot`: 140 passed, exit 0.
- `npm run lint`: exit 0.
- `lint-markdown check --offline`: all 27 files passed.
- `plan tasks validate T0245 --completion`: passed.

`tests/e2e/field.spec.js` asserts only static gallery markup for `aria-busy`, so it has no timer race in scope.

## Defects
None.

## Process Gaps
None.

## Required Rework
None.
