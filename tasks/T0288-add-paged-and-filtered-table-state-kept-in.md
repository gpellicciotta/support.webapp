---
id: T0288
owner: "@gemini"
session: antigravity-20261124-c1cf78
needs: []
branch: task/T0288-add-paged-and-filtered-table-state-kept-in
worktree: .plan/work/T0288-add-paged-and-filtered-table-state-kept-in
status: active
started_at: "2026-11-24T00:59:24Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0288: Add paged and filtered table state kept in the URL, promoted from Auth's and ToDo's admin consoles

## Goals
Add table state that keeps filters and the page in the hash query without adding a history entry.
Support client paging, which cuts pages from loaded rows, and server paging, which builds page parameters.
Wire both to the package pager; Auth pages on the client and ToDo on the server.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Paged and Filtered Table State", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 120 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the table state module, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-24] **[Read]**
  Read technical-spec, audit section, Auth and ToDo admin UI sources, naming.md, ADR-0003, and admin demo.

- [2026-11-24] **[Decided]**
  Chose key table-state (src/js/table-state.js) exporting createTableState, attachTableState, createPager, hash query helpers, pageOf, pageParams, and offsetParams.

- [2026-11-24] **[Verify]**
  Confirmed red phase: unit test failed on missing table-state.js and browser test failed on missing data-table-state-pager.

- [2026-11-24] **[Implement]**
  Added src/js/table-state.js, registered table-state in contract.json, and wired shell-admin-console demo with URL-persisted filters and paging.

- [2026-11-24] **[Doc]**
  Updated components.md with table-state catalog entry and upgrade notes, ADR-0003 (undeclared, per step 7), and CHANGELOG.md.

- [2026-11-24] **[Verify]**
  All linters, 2456 unit tests, 1012 browser tests, pack, and vendor passed; generate-app failed on missing worktree node_modules.
  - Files touched: 5.
  - Lines touched: 145.
  - Reopenings: 0.

