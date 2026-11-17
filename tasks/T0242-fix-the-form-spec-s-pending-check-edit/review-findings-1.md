---
task: T0242
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-17T15:12:39Z
reviewed_commit: "d2e5b53"
base_commit: "eadbfe4"
branch: task/T0242-fix-the-form-spec-s-pending-check-edit
---
# Review Findings: Task T0242 (Round 1)

## Summary
Approved. The fix removes the real-timer race in the pending-check edit test.

- The root cause matches the code.
  The gallery's name check awaits `view.setTimeout(600)` in `src/demo/gallery.js`.
  A late edit lets that timer settle first.
- The test installs the clock before navigation, so the gallery's `setTimeout` is controlled.
  It then pauses ahead of page time, so no timer fires before the edit.
- The two `runFor(600)` steps follow `src/js/field.js`.
  The first settles the overtaken check, which re-validates and sets `aria-busy` with "Checking the name.".
  The second settles the new check as "Name is free.".
- The new busy and pending-text assertions strengthen the test's coverage of the overtake path.
- The CHANGELOG `DevEx:` entry matches existing categories.
- Follow-up T0245 exists for the two sibling async-check tests.

Reviewer verification:

- `npx playwright test tests/e2e/form.spec.js --repeat-each 10 --reporter=line`: 280 passed (3.4m), all four projects.
- `npx eslint tests/e2e/form.spec.js`: exit 0.
- `plan tasks validate T0242 --completion`: passed.

## Defects
None.

## Process Gaps
- Non-blocking: the full `devops.py check` failed in the worktree's integration suite because `node_modules` was missing.
  The worker reran the integration suite against the main checkout's `node_modules` (7/7 passed).
  The worker reported this transparently in the validation proof.
  A worktree bootstrap step would avoid this workaround.

## Required Rework
None.
