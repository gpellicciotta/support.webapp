---
id: T0299
owner: "@gemini"
needs: []
branch: task/T0299-add-the-shared-admin-broadcasts-screen-with-compose
worktree: .plan/work/T0299-add-the-shared-admin-broadcasts-screen-with-compose
status: active
started_at: "2026-11-24T04:44:29Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0299: Add the shared admin Broadcasts screen with compose, live preview, history, and retraction, promoted from Auth's and ToDo's consoles

## Goals
Add the shared Broadcasts screen: compose an announcement with a live preview and recipient selection, publish it, and review and retract earlier ones.
Banner announcements preview as banners; others preview as inbox rows.
The screen takes a data adapter of fetch functions, so each app keeps its own endpoints.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Shared Admin Screens", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 5 files, 200 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the Broadcasts screen, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Visual]**    Capture the Broadcasts screen across looks and themes at mobile and desktop width.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit after the user decided on 2026-11-23 to ship the shared admin screens.

