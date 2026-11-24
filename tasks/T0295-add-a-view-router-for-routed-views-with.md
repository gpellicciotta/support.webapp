---
id: T0295
owner: "@gemini"
session: antigravity-20261124-b28b22
needs: []
branch: task/T0295-add-a-view-router-for-routed-views-with
worktree: .plan/work/T0295-add-a-view-router-for-routed-views-with
status: active
started_at: "2026-11-24T02:24:14Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1727.9, input: 651635, output: 74160, cache_read: 15707763}
review_status: pending
review_round: 1
review_requested_at: "2026-11-24T02:53:13Z"
---
# T0295: Add a view router for routed views with sign-in guards and a fallback view, promoted from Auth's App

## Goals
Add a view router: register routed views and a fallback, pick a view by route, and guard signed-in and signed-out views.
Activate views with history, keep the shell title and route marks, and open routes outside the app with a full load.
Auth and counters run this in their App classes.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "View Router", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 5 files, 200 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the view router, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-24] **[Decided]**
  Chose component key view-router with createViewRouter, attachViewRouter, and Auth view event constants.
  - Hooks use data-view-router-* and aria-current=page, never classes.
  - Sign-in state, outside routes, and actions integrate via callbacks.

- [2026-11-24] **[Implement]**
  Added view-router module, contract entry, portal demo routed views, unit and Playwright tests, and docs.

- [2026-11-24] **[Visual]**
  Captured before and after portal demo screenshots with HTTP 200 and zero console or layout errors.
  - Before: [before-portal-view-router.png](T0295-add-a-view-router-for-routed-views-with/before-portal-view-router.png).
  - After: [after-portal-view-router.png](T0295-add-a-view-router-for-routed-views-with/after-portal-view-router.png).
  - Notes view: [after-portal-view-router-notes.png](T0295-add-a-view-router-for-routed-views-with/after-portal-view-router-notes.png).

- [2026-11-24] **[Verify]**
  All lint, Python, unit (2477), browser (1036), integration (7), and package build checks passed.
  - Files touched: 5.
  - Lines touched: 138.
  - Reopenings: 0.

- [2026-11-24] **[Read]**
  Reviewed technical spec, Auth audit View Router section, Auth and counters App routing, and package contracts.

- [2026-11-24] **[Review]**
  Round 1 requested (mode: agent).

