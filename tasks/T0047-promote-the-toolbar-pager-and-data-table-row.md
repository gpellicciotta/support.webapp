---
id: T0047
owner: "@gemini"
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
- [ ] **[Read]**      Read ToDo's admin.css, admin spec, the package table, and the components catalog.
- [ ] **[Decide]**    Fix the component keys, class names, and markup skeletons by naming.md.
- [ ] **[Implement]** Author failing browser and unit tests for toolbar, pager, and table row states.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the components, gallery specimens, and catalog entries.
- [ ] **[Verify]**    Run the affected tests and the full check suite.
- [ ] **[Doc]**       Update components.md, the style guide, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-15] **[Doc]**
  Created by T0025 from the approved auth redesign plan, `docs/plans/auth-redesign.md`.
