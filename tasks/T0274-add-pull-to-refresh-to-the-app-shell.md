---
id: T0274
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
# T0274: Add pull-to-refresh to the app shell, promoted from Auth's installed SPA

## Goals
Add pull-to-refresh to the app shell as the `pull-refresh` module and the `.app__pull-indicator` shell part.
It works only while the app runs installed; browser tabs keep their native pull-down reload.
Auth's SPA built it app-locally in T0249; keep its behavior, and move the indicator styles into `shell.css`.
The user chose on 2026-11-23 to promote it before a second app needs it, overriding the ADR-0003 sharing rule.
Record that exception in ADR-0003, document the part in ADR-0004, and show it in a shell demo.
Completion check: `python scripts/devops.py check` passes, with the new unit and browser tests green.

## Task Execution Steps
- [ ] **[Read]**      Read Auth's pull-to-refresh module, styles, tests, and T0249, plus app-nav.js and ADR-0004.
- [ ] **[Implement]** Author failing unit and browser tests for the gesture, threshold, indicator, and inactive cases.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add pull-refresh.js, the shell indicator styles, and the shell demo wiring.
- [ ] **[Verify]**    Run the affected tests and the full check suite.
- [ ] **[Visual]**    Capture the shell demo mid-pull across looks and themes at mobile width, before and after.
- [ ] **[Doc]**       Update ADR-0003, ADR-0004, components.md, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.
