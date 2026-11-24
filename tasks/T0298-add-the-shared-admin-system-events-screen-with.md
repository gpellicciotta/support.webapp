---
id: T0298
owner: "@gemini"
session: antigravity-20261124-b9bf9a
needs: []
branch: task/T0298-add-the-shared-admin-system-events-screen-with
worktree: .plan/work/T0298-add-the-shared-admin-system-events-screen-with
status: active
started_at: "2026-11-24T04:11:46Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0298: Add the shared admin System events screen with filters, paging, and JSON details, promoted from Auth's and ToDo's consoles

## Goals
Add the shared System events screen: audit records with type and severity filters, server paging, a search, and JSON details.
The screen takes a data adapter of fetch functions, so each app keeps its own endpoints.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Shared Admin Screens", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 120 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the System events screen, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Visual]**    Capture the System events screen across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit after the user decided on 2026-11-23 to ship the shared admin screens.

- [2026-11-24] **[Decided]**
  Chose admin-system-events key with attachAdminSystemEvents, createAdminSystemEvents, createAdminSystemEventsScreen, adapter.fetchEvents/fetchUsers, URL hash table-state filters, offset paging, and data-admin-system-events-* hooks.

- [2026-11-24] **[Verify]**
  Confirmed red-phase failures before implementation.
  - Vitest failed on missing admin-system-events.js.
  - Playwright failed on missing data-admin-system-events hook.

- [2026-11-24] **[Doc]**
  Updated components.md, ADR-0003-components-and-patterns.md (undeclared; required by Doc step), and CHANGELOG.md for admin-system-events.

- [2026-11-24] **[Visual]**
  Captured before and after screenshots of System events across neutral, warm, and bright looks at mobile and desktop widths in light and dark themes.

- [2026-11-24] **[Verify]**
  Verified full lint, unit, browser, integration, and pack checks.
  - 58 unit files (2524 tests) and 1084 browser tests passed.
  - 3 integration files (7 tests) and npm pack dry-run passed.
  - Files touched: 4.
  - Lines touched: 193.
  - Reopenings: 0.

- [2026-11-24] **[Read]**
  Read technical-spec.md, the Auth audit section, Auth and ToDo system-events-view.mjs, naming.md, and ADR-0003.

- [2026-11-24] **[Implement]**
  Added admin-system-events.js, contract entry, admin console demo integration, 17 unit tests, and 16 browser tests.

