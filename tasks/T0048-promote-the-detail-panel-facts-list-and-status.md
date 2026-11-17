---
id: T0048
owner: "@gemini"
needs: []
branch: task/T0048-promote-the-detail-panel-facts-list-and-status
worktree: .plan/work/T0048-promote-the-detail-panel-facts-list-and-status
status: active
started_at: "2026-11-17T00:49:19Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0048: Promote the detail panel, facts list, and status chip, and add an admin console shell example

## Goals
Move the detail panel, facts list, and status chip of ToDo's admin console into the package.
Add an admin console example page to the gallery, using T0047's parts with these three.
Follow ADR-0003's sharing rule, ADR-0004, and the auth redesign plan in `docs/plans/auth-redesign.md`.
After review, release the promoted parts as a minor version with the user's approval.

## Task Execution Steps
- [ ] **[Read]**      Read ToDo's admin.css, admin spec, the side panel, list, and chip components.
- [ ] **[Decide]**    Fix the keys and skeletons, mapping facts onto definition rows where possible.
- [ ] **[Implement]** Author failing browser tests for the three parts and the admin console example.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the parts, gallery specimens, the example page, and catalog entries.
- [ ] **[Verify]**    Run the affected tests and the full check suite.
- [ ] **[Doc]**       Update components.md, ADR-0004's setups, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-15] **[Doc]**
  Created by T0025 from the approved auth redesign plan, `docs/plans/auth-redesign.md`.
