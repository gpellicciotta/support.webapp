---
id: T0291
owner: ~
needs: ['T0290']
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0291: Add the notifications inbox pattern and the unread count button, promoted from Auth

## Goals
Add the notifications inbox: one selectable row per notification with type badge, unread mark, source and time chips, and row actions.
Add bulk Mark Read and Discard, Discard All, an empty state, and a summary line.
Add the top bar button whose badge and accessible name carry the unread count, capped at 99+.
Remove "Inbox panel" from the catalog's not-in-package list.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Notifications Inbox and Unread Button", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 7 files, 220 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the inbox pattern and unread button, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Visual]**    Capture the inbox pattern and unread button across looks and themes at mobile and desktop width.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

