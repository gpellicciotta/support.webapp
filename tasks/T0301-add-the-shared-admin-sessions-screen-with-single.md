---
id: T0301
owner: "@gemini"
session: antigravity-20261124-a081f6
needs: []
branch: task/T0301-add-the-shared-admin-sessions-screen-with-single
worktree: .plan/work/T0301-add-the-shared-admin-sessions-screen-with-single
status: active
started_at: "2026-11-24T06:00:47Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1741.8, input: 443124, output: 62109, cache_read: 15494828}
review_status: pending
review_round: 1
review_requested_at: "2026-11-24T06:30:00Z"
---
# T0301: Add the shared admin Sessions screen with single, bulk, and expired token revocation, promoted from Auth's and ToDo's consoles

## Goals
Add the shared Sessions screen: tokens filtered and paged, with single, bulk, and expired revocation.
The console's own session can be neither selected nor revoked.
The screen takes a data adapter of fetch functions, so each app keeps its own endpoints.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Shared Admin Screens", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 5 files, 160 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the Sessions screen, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Visual]**    Capture the Sessions screen across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit after the user decided on 2026-11-23 to ship the shared admin screens.

- [2026-11-24] **[Decided]**
  Chose key admin-sessions with createAdminSessionsScreen, attachAdminSessions, createAdminSessions, and .selection--table in selection.css.

- [2026-11-24] **[Verify]**
  Confirmed new unit and Playwright tests fail before implementation.
  - Vitest failed: missing src/js/admin-sessions.js.
  - Playwright failed: missing [data-admin-sessions] in demo.

- [2026-11-24] **[Implement]**
  Implemented admin-sessions.js, table multi-select in selection.css, contract.json entry, and admin console demo.
  - Undeclared file touched: docs/adrs/ADR-0003-components-and-patterns.md (2 lines).

- [2026-11-24] **[Visual]**
  Captured before and 12 after screenshots across looks, themes, and widths in validation-proof.md.
  - Before: before-admin-sessions-neutral-desktop-light.png.
  - After: after-admin-sessions-{neutral,warm,bright}-{desktop,mobile}-{light,dark}.png.

- [2026-11-24] **[Verify]**
  Verified linters, 2572 unit tests, 1132 Playwright tests, and 7 integration tests pass.
  - Files touched: 5.
  - Lines touched: 209.
  - Reopenings: 0.

- [2026-11-24] **[Read]**
  Read technical-spec.md, Auth sessions-view.mjs, ToDo tokens-view.mjs, admin.css, naming.md, and ADR-0003.

- [2026-11-24] **[Review]**
  Round 1 requested (mode: agent).

