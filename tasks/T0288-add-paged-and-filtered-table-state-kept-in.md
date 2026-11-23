---
id: T0288
owner: ~
needs: ['T0294']
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0288: Add paged and filtered table state kept in the URL, promoted from Auth's and ToDo's admin consoles

## Goals
Add table state that keeps filters and the page in the hash query without adding a history entry.
Support client paging, which cuts pages from loaded rows, and server paging, which builds page parameters.
Wire both to the package pager; Auth pages on the client and ToDo on the server.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Paged and Filtered Table State", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 120 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the table state module, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

