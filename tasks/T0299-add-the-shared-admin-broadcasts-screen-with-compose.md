---
id: T0299
owner: "@gemini"
session: antigravity-20261124-a1988e
needs: []
branch: task/T0299-add-the-shared-admin-broadcasts-screen-with-compose
worktree: .plan/work/T0299-add-the-shared-admin-broadcasts-screen-with-compose
status: completed
started_at: "2026-11-24T04:44:29Z"
ended_at: "2026-11-24T05:21:05Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1612.6, input: 427244, output: 76146, cache_read: 19755537}
  review: {turns: 1, duration_s: 566.8, input: 44, output: 8462, cache_read: 1401113, cache_write: 82819}
review_status: approved
review_round: 1
review_requested_at: "2026-11-24T05:11:32Z"
reviewed_by: "@claude"
review_session: claude-20261124-463e03
work_duration: 2196.9
completion-commit: f6ee255fc2ae6cd62957e0972946232b8169ed4b
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
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the Broadcasts screen, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Visual]**    Capture the Broadcasts screen across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit after the user decided on 2026-11-23 to ship the shared admin screens.

- [2026-11-24] **[Decided]**
  Chose key admin-broadcasts exporting attachAdminBroadcasts, createAdminBroadcasts, createAdminBroadcastsScreen, and history/audience/time helpers, plus .app__split and .app__section rules in shell.css.

- [2026-11-24] **[Verify]**
  Confirmed red-phase failures: unit test failed on missing admin-broadcasts.js and e2e test failed on missing [data-admin-broadcasts] screen.

- [2026-11-24] **[Read]**
  Read technical-spec.md, the Auth audit section, Auth and ToDo broadcasts-view.mjs, naming.md, and ADR-0003.

- [2026-11-24] **[Implement]**
  Added admin-broadcasts.js, .app__split and .app__section rules in shell.css, contract entry, admin console demo route, 13 unit tests, and 16 browser tests.

- [2026-11-24] **[Visual]**
  Captured before and after Broadcasts screenshots across neutral, warm, and bright looks in light and dark themes at mobile and desktop widths.

- [2026-11-24] **[Doc]**
  Updated components.md, ADR-0003-components-and-patterns.md (undeclared; required by Doc step), and CHANGELOG.md for admin-broadcasts.

- [2026-11-24] **[Verify]**
  Verified full lint, unit, browser, integration, and pack checks.
  - 59 unit files (2537 tests) and 1100 browser tests passed.
  - 3 integration files (7 tests) and npm pack dry-run passed.
  - Files touched: 6.
  - Lines touched: 205.
  - Reopenings: 0.

- [2026-11-24] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-24] **[Review]**
  Round 1 approved by @claude: The work meets the goals and the technical specification.
  - Findings: [review-findings-1.md](T0299-add-the-shared-admin-broadcasts-screen-with-compose/review-findings-1.md).

- [2026-11-24] **[Complete]**
  Task completed successfully.

