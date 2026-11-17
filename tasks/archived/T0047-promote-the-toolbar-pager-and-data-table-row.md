---
id: T0047
owner: "@gemini"
session: antigravity-20261117-34b426
needs: []
branch: task/T0047-promote-the-toolbar-pager-and-data-table-row
worktree: .plan/work/T0047-promote-the-toolbar-pager-and-data-table-row
status: completed
started_at: "2026-11-16T23:50:40Z"
ended_at: "2026-11-17T00:48:57Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 3, duration_s: 3002.7, input: 531051, output: 95093, cache_read: 27682788}
  review: {turns: 1, duration_s: 426.1, input: 12, output: 1654, cache_read: 224996, cache_write: 34308}
work_duration: 3496.4
review_status: approved
review_round: 1
review_requested_at: "2026-11-17T00:41:40Z"
reviewed_by: "@claude"
review_session: claude-20261117-ca03ff
completion-commit: 0d50110bd3d660ea727ae91afbc6c2ca8069eac8
---
# T0047: Promote the toolbar, pager, and data table row states from ToDo's admin console into the package

## Goals
Move three admin-only parts of ToDo's admin console into the package, since auth's console needs them too.
They are the toolbar, the pager, and the data table's hover and selected row states.
Follow the sharing rule of ADR-0003 and the auth redesign plan in `docs/plans/auth-redesign.md`.
Name them by `docs/specs/naming.md`; ToDo's class names may change.

## Task Execution Steps
- [x] **[Read]**      Read ToDo's admin.css, admin spec, the package table, and the components catalog.
- [x] **[Decide]**    Fix the component keys, class names, and markup skeletons by naming.md.
- [x] **[Implement]** Author failing browser and unit tests for toolbar, pager, and table row states.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the components, gallery specimens, and catalog entries.
- [x] **[Verify]**    Run the affected tests and the full check suite.
- [x] **[Doc]**       Update components.md, the style guide, and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-15] **[Doc]**
  Created by T0025 from the approved auth redesign plan, `docs/plans/auth-redesign.md`.

- [2026-11-17] **[Read]**
  Read ToDo's admin.css and admin spec, package table.css, contract.json, tokens.test.js, and components.md.

- [2026-11-17] **[Decided]**
  Chose keys toolbar and pager, renamed table-wrap to .table__frame, and put hover and aria-selected row states on .table.

- [2026-11-17] **[Verify]**
  Added unit and Playwright tests for toolbar, pager, and table row states and confirmed expected red-phase failures.

- [2026-11-17] **[Implement]**
  Added toolbar.css, pager.css, .table__frame and row states, gallery specimens, and catalog entries; updated undeclared src/contract.json (7 modified files).

- [2026-11-17] **[Doc]**
  Updated components.md, visual-style-guide.md, and CHANGELOG.md under v0.1.1-pre.

- [2026-11-17] **[Visual]**
  Captured before and after gallery specimens across neutral, warm, and bright in light and dark.
  - Neutral: [before](T0047-promote-the-toolbar-pager-and-data-table-row/before-table-neutral-desktop-light.png), [table](T0047-promote-the-toolbar-pager-and-data-table-row/after-table-neutral-desktop-light.png), [toolbar](T0047-promote-the-toolbar-pager-and-data-table-row/after-toolbar-neutral-desktop-light.png), [pager](T0047-promote-the-toolbar-pager-and-data-table-row/after-pager-neutral-desktop-light.png).
  - Warm dark: [before](T0047-promote-the-toolbar-pager-and-data-table-row/before-table-warm-desktop-dark.png), [table](T0047-promote-the-toolbar-pager-and-data-table-row/after-table-warm-desktop-dark.png), [toolbar](T0047-promote-the-toolbar-pager-and-data-table-row/after-toolbar-warm-desktop-dark.png), [pager](T0047-promote-the-toolbar-pager-and-data-table-row/after-pager-warm-desktop-dark.png).
  - Bright mobile: [before](T0047-promote-the-toolbar-pager-and-data-table-row/before-table-bright-mobile-light.png), [table](T0047-promote-the-toolbar-pager-and-data-table-row/after-table-bright-mobile-light.png), [toolbar](T0047-promote-the-toolbar-pager-and-data-table-row/after-toolbar-bright-mobile-light.png), [pager](T0047-promote-the-toolbar-pager-and-data-table-row/after-pager-bright-mobile-light.png).

- [2026-11-17] **[Verify]**
  Running python scripts/devops.py check synchronously under background task task-262.

- [2026-11-17] **[Verify]**
  Confirmed python scripts/devops.py check passed all linters, unit, browser, integration, and pack checks.
  - 41 pytest and 2123 Vitest unit tests passed.
  - 662 Playwright browser and 7 integration tests passed.

- [2026-11-17] **[Verify]**
  Recorded task outcomes.
  - Files touched: 7.
  - Lines touched: 266.
  - Reopenings: 0.

- [2026-11-17] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-17] **[Review]**
  Round 1 approved by @claude: The work meets the goals.
  - Findings: [review-findings-1.md](T0047-promote-the-toolbar-pager-and-data-table-row/review-findings-1.md).

- [2026-11-17] **[Complete]**
  Task completed successfully.

