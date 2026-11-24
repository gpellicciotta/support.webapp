---
id: T0295
owner: "@gemini"
needs: []
branch: task/T0295-add-a-view-router-for-routed-views-with
worktree: .plan/work/T0295-add-a-view-router-for-routed-views-with
status: active
started_at: "2026-11-24T02:24:14Z"
ended_at: —
review: agent
preview: none
protocol: standard
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
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the view router, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

