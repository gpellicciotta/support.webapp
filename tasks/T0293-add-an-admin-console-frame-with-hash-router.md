---
id: T0293
owner: "@gemini"
needs: []
branch: task/T0293-add-an-admin-console-frame-with-hash-router
worktree: .plan/work/T0293-add-an-admin-console-frame-with-hash-router
status: active
started_at: "2026-11-24T01:41:54Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0293: Add an admin console frame with hash router, screen registry, and gate pages, promoted from Auth

## Goals
Add an admin console frame: a screen registry with `mount`, `update`, and `dispose`, a hash router, route marks, and screen titles.
Include the shell with its side panel, centered gate pages for session checks and forbidden access, and a signed-out shell.
Auth's and ToDo's admin consoles share this frame in two drifted copies.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Admin Console Frame", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 6 files, 220 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the admin console frame, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Visual]**    Capture the admin console frame across looks and themes at mobile and desktop width.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

