---
id: T0275
owner: ~
needs: [T0274]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0275: Add the Refresh pattern and an auto-refresh module, promoted from Auth's SPA

## Goals
Add a Refresh pattern to ADR-0003's shared patterns, and an `auto-refresh` utility module that times it.
The pattern drops manual Refresh buttons: apps refresh on return to the tab, and poll only while it is visible.
Refreshes never reload a view with a form, and update the UI only when the data changed.
Auth's SPA built this app-locally in T0248; promote its timing logic and keep the data rules as pattern text.
The user chose on 2026-11-23 to promote it before a second app needs it, overriding the ADR-0003 sharing rule.
Completion check: `python scripts/devops.py check` passes, with the new unit tests green.

## Task Execution Steps
- [ ] **[Read]**      Read Auth's App.startAutoRefresh, refreshNotifications, T0248, and the pull-refresh module from T0274.
- [ ] **[Implement]** Author failing unit tests for polling, visibility, absence threshold, and destroy.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add auto-refresh.js and wire it into the shell demo with pull-refresh.
- [ ] **[Verify]**    Run the affected tests and the full check suite.
- [ ] **[Doc]**       Add the Refresh pattern to ADR-0003, and update components.md and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.
