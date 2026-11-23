---
id: T0289
owner: ~
needs: []
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0289: Add an action registry for app actions with enabled state and disabled reasons, promoted from Auth's App

## Goals
Add an action registry: add, remove, get, enable, disable with a reason, toggle, and run actions, with state change events.
Clicks on `data-action` elements run their action, and disabled actions do nothing.
T0276's `RoutedView` calls `addAction` and `removeAction` on an app the package does not provide; Auth and counters both run such an App.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Action Registry", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 150 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the action registry, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

