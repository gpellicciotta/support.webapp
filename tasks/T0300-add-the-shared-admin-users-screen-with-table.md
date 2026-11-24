---
id: T0300
owner: "@gemini"
needs: []
branch: task/T0300-add-the-shared-admin-users-screen-with-table
worktree: .plan/work/T0300-add-the-shared-admin-users-screen-with-table
status: active
started_at: "2026-11-24T05:21:27Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0300: Add the shared admin Users screen with table, detail panel, creation, and deletion, promoted from Auth's and ToDo's consoles

## Goals
Add the shared Users screen: the account table with filters and paging, the detail panel, the New user panel, and deletion with undo.
Auth's credentials, grants, and password sections stay app-local, joined through extension hooks.
The screen takes a data adapter of fetch functions, so each app keeps its own endpoints.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Shared Admin Screens", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 220 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the Users screen, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Visual]**    Capture the Users screen across looks and themes at mobile and desktop width.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit after the user decided on 2026-11-23 to ship the shared admin screens.

