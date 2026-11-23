---
id: T0275
owner: "@claude-code"
needs: []
branch: —
worktree: —
status: completed
started_at: "2026-11-23T11:00:30Z"
ended_at: "2026-11-23T11:22:18Z"
review: agent
preview: none
protocol: standard
review_status: approved
review_round: 1
review_requested_at: "2026-11-23T11:13:46Z"
reviewed_by: "@gemini"
review_session: antigravity-20261123-01b786
completion-commit: 241dca0525119adad5fed394713f5a64cd2b6930
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
- [x] **[Read]**      Read Auth's App.startAutoRefresh, refreshNotifications, T0248, and the pull-refresh module from T0274.
- [x] **[Implement]** Author failing unit tests for polling, visibility, absence threshold, and destroy.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add auto-refresh.js and wire it into the shell demo with pull-refresh.
- [x] **[Verify]**    Run the affected tests and the full check suite.
- [x] **[Doc]**       Add the Refresh pattern to ADR-0003, and update components.md and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Read]**
  Read Auth's startAutoRefresh, stopAutoRefresh, refreshNotifications, and their constants at c7129b8, plus pull-refresh.js from T0274.

- [2026-11-23] **[Verify]**
  Added unit tests for polling, visibility, the absence threshold, destroy, and the docs; the file failed to import the missing module.

- [2026-11-23] **[Implement]**
  Added auto-refresh.js and wired the portal demo: a last-check line updates on visible polls and returns, and a long return toasts.

- [2026-11-23] **[Decided]**
  Also updated naming.md, whose utility table must list every new utility module, the style guide's patterns, and the portal page.
  - Six counted files stay below the typical line.

- [2026-11-23] **[Visual]**
  Captured the portal demo before and after at 390 and 1440 px in both themes; a fake clock drove one poll and a long return.

- [2026-11-23] **[Verify]**
  Confirmed python scripts/devops.py check passed linters, unit, browser, integration, and pack checks.
  - 2222 Vitest and 61 pytest tests passed.
  - 858 Playwright and 7 integration tests passed.

- [2026-11-23] **[Doc]**
  Added the Refresh pattern to ADR-0003 and the style guide, and updated components.md, naming.md, and CHANGELOG.md.

- [2026-11-23] **[Verify]**
  Recorded task outcomes.
  - Files touched: 6.
  - Lines touched: 72.
  - Reopenings: 0.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-23] **[Review]**
  Round 1 approved by @gemini: Approved.
  - Findings: [review-findings-1.md](T0275-add-the-refresh-pattern-and-an-auto-refresh/review-findings-1.md).

- [2026-11-23] **[Complete]**
  Task completed successfully.

