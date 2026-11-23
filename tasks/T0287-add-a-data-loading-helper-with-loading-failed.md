---
id: T0287
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
# T0287: Add a data loading helper with loading, failed, and sign-in states, promoted from Auth's admin console

## Goals
Add a helper that loads data into a container with loading, failed with Retry, and expired-session states.
The newest call on a container wins, and a quiet mode keeps the shown content while polling.
Auth's and ToDo's admin consoles each carry a copy.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Data Loading Helper", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 3 files, 60 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the data loading helper, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

