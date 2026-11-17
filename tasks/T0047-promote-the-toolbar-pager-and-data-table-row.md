---
id: T0047
owner: "@gemini"
session: antigravity-20261117-34b426
needs: []
branch: task/T0047-promote-the-toolbar-pager-and-data-table-row
worktree: .plan/work/T0047-promote-the-toolbar-pager-and-data-table-row
status: active
started_at: "2026-11-16T23:50:40Z"
ended_at: —
review: agent
preview: none
protocol: standard
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
- [ ] **[Verify]**    Run the affected tests and the full check suite.
- [ ] **[Doc]**       Update components.md, the style guide, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

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

