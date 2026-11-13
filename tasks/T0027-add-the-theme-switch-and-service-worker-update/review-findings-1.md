---
task: T0027
round: 1
verdict: rejected
reviewer: "@codex-2"
reviewed_at: 2026-11-13T04:48:25Z
reviewed_commit: "2901a3f"
base_commit: "3661290"
branch: task/T0027-add-the-theme-switch-and-service-worker-update
---
# Review Findings: Task T0027 (Round 1)

## Summary
Rejected for one service worker update lifecycle defect.
Theme persistence, gallery integration, and the five documented patterns otherwise meet the task goals.
Reviewed the task specification, execution log, validation evidence, commit history, and complete branch diff.
Independent verification passed 35 affected unit tests, four browser cases, ESLint, and Git whitespace checks.
Recorded full-check evidence also reports passing unit, browser, integration, Python, lint, and packaging checks.
The browser runner exited, and process inspection found no remaining review test server.

## Defects
- P2: The Update toast remains actionable after another tab activates its waiting worker.
  In [sw-update.js](../../../src/js/sw-update.js), the `controllerchange` handler neither dismisses nor replaces the existing toast.
  Its action falls back to the captured worker when `registration.waiting` becomes null.
  That worker is already activated; sending `skip-waiting` cannot produce another activation event.
  Clicking Update therefore dismisses the notification without reloading, leaving the tab on its previous application version.
  A read-only Node probe reproduced this sequence with the default `onUpdatedElsewhere` callback.
  It reported zero dismissals after external activation, then messaged an activated worker with zero reloads.
  The existing unit test substitutes another waiting worker after external activation, masking this normal lifecycle transition.

## Process Gaps
No additional blocking process gaps identified.

## Required Rework
- Invalidate or replace the stale toast when another tab activates the update.
- Preserve user consent and provide a working explicit reload action when offering an already activated update.
- Add regression coverage with `registration.waiting = null` after external activation.
- Assert that stale workers receive no update message and that any offered reload action works exactly once.
- Rerun affected tests and update task validation evidence.
