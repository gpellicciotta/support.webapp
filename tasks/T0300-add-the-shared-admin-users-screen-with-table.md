---
id: T0300
owner: "@gemini"
session: antigravity-20261124-78ac56
needs: []
branch: task/T0300-add-the-shared-admin-users-screen-with-table
worktree: .plan/work/T0300-add-the-shared-admin-users-screen-with-table
status: completed
started_at: "2026-11-24T05:21:27Z"
ended_at: "2026-11-24T06:00:25Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1720.3, input: 645670, output: 74845, cache_read: 21349120}
  review: {turns: 1, duration_s: 598.9, input: 60, output: 9795, cache_read: 2282387, cache_write: 94492}
review_status: approved
review_round: 1
review_requested_at: "2026-11-24T05:50:19Z"
reviewed_by: "@claude"
review_session: claude-20261124-d854ac
work_duration: 2337.8
completion-commit: c5af6610f728a1c4a929acf9e0830dc5f6f20a0e
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
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the Users screen, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Visual]**    Capture the Users screen across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit after the user decided on 2026-11-23 to ship the shared admin screens.

- [2026-11-24] **[Decided]**
  Chose module key admin-users with attachAdminUsers, createAdminUsers, createAdminUsersScreen, data-admin-users-* hooks, and extraColumns, extraFacts, and extraSections extension hooks.

- [2026-11-24] **[Implement]**
  Added admin-users.js, contract entry, admin console demo route, docs, and CHANGELOG; also updated undeclared docs/adrs/ADR-0003-components-and-patterns.md per Doc step.

- [2026-11-24] **[Visual]**
  Captured and inspected 1 before and 12 after screenshots across looks, themes, and desktop/mobile widths.
  - Before: T0300-add-the-shared-admin-users-screen-with-table/before-admin-console-neutral-desktop-light.png.
  - After: T0300-add-the-shared-admin-users-screen-with-table/after-admin-users-neutral-desktop-light.png.

- [2026-11-24] **[Verify]**
  Verified all linters, 61 pytest, 2555 Vitest, 1116 Playwright, 7 integration, and pack dry-run checks.
  - Files touched: 5.
  - Lines touched: 213.
  - Reopenings: 0.

- [2026-11-24] **[Read]**
  Read technical-spec.md, auth-webapp-ui-audit.md, Auth and ToDo users-view.mjs sources, naming.md, ADR-0003, and sibling admin screens.

- [2026-11-24] **[Doc]**
  Updated docs/specs/components.md, docs/adrs/ADR-0003-components-and-patterns.md, and CHANGELOG.md with admin-users documentation and upgrade notes.

- [2026-11-24] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-24] **[Review]**
  Round 1 approved by @claude: Approved.
  - Findings: [review-findings-1.md](T0300-add-the-shared-admin-users-screen-with-table/review-findings-1.md).

- [2026-11-24] **[Complete]**
  Task completed successfully.

