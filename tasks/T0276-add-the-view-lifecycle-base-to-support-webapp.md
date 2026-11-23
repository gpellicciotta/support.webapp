---
id: T0276
owner: "@claude-code"
needs: []
branch: —
worktree: —
status: completed
started_at: "2026-11-23T10:35:19Z"
ended_at: "2026-11-23T12:37:48Z"
review: human
preview: none
protocol: standard
review_status: approved
review_round: 5
review_requested_at: "2026-11-23T12:37:25Z"
reviewed_by: "@giova"
completion-commit: 25ef5316c3e9101cb01e24de710d1cee675e95c6
---
# T0276: Add the view lifecycle base to support.webapp, promoted from Auth's Component and AppView, which support.js v4 removed

## Goals
Provide the attach, detach, refresh, wait, and error lifecycle of a routed view as a support.webapp module.
support.js v4.0.0 deleted `component.mjs` and `app-view.mjs` and named no replacement, so Auth (T0251) and counters have nowhere to move.
The user decided on 2026-11-23 that every UI and view feature apps can share belongs in support.webapp, overriding the ADR-0003 second-app rule.
Follow the naming rules: `data-*` hooks and ARIA state, no style classes as hooks.
Record the exception in ADR-0003, document the module in components.md, and release it so Auth T0251 can proceed.
Size estimate: 6 files, 150 lines.
Completion check: `python scripts/devops.py check` passes, with the new unit tests green.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, Auth's `component.mjs` and `app-view.mjs` at `c7129b8`, and naming.md.
- [x] **[Decide]**    Choose the module key, exported API, and how views reach overlays, actions, and the shell action bar.
- [x] **[Implement]** Author failing unit tests for lifecycle, long-running operations, overlays, and action registration.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the module, its overlay styles, the contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and the full check suite.
- [x] **[Visual]**    Capture the error and wait overlays across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update ADR-0003, components.md, the upgrade note for apps, and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from Auth's T0251 after the user asked for the base to live in support.webapp.

- [2026-11-23] **[Read]**
  Read Auth's and support.js v3.1.0 Component and AppView, naming.md, pull-refresh.js, and Auth's overlay styles.

- [2026-11-23] **[Decided]**
  One module view.js with View and RoutedView; hooks are data-view attributes; overlays use empty-state and spinner; no new CSS.

- [2026-11-23] **[Decided]**
  Keep Auth's member names (mainUIEl, refreshComponentUI, log); back link, labels, icon, delay, log are options or overridable hooks.

- [2026-11-23] **[Doc]**
  Work runs in worktree .plan/work/T0276-* on branch task/T0276-*, created by hand at the user's request.

- [2026-11-23] **[Verify]**
  Wrote tests/unit/view.test.js; it fails because src/js/view.js does not exist.

- [2026-11-23] **[Implement]**
  Added view.js, shell.css hidden rule, portal sample view, unit and browser tests, and docs; visual check found and fixed a stray back button.

- [2026-11-23] **[Verify]**
  Check passed: lint, 2241 unit tests, 866 browser tests, 7 package tests.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-23] **[Review]**
  Review raised from agent to human.

- [2026-11-23] **[Review]**
  Round 2 approved by @giova.

- [2026-11-23] **[Verify]**
  Recorded task outcomes.
  - Files touched: 6.
  - Lines touched: 98.
  - Reopenings: 0.

- [2026-11-23] **[Review]**
  Round 3 approved by @giova.

- [2026-11-23] **[Verify]**
  Merged main into the task branch; check passed on 0ed37d6: 2258 unit, 866 browser tests.

- [2026-11-23] **[Review]**
  Round 4 requested (mode: human); the work changed after the round 3 approval of commit 3b6b720.

- [2026-11-23] **[Review]**
  Round 4 approved by @giova.

- [2026-11-23] **[Verify]**
  Merged main again; check passed on 2984fc4.

- [2026-11-23] **[Review]**
  Round 5 requested (mode: human); the work changed after the round 4 approval of commit 0ed37d6.

- [2026-11-23] **[Review]**
  Round 5 approved by @giova.

- [2026-11-23] **[Complete]**
  Task completed successfully.

