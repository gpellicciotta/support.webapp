---
id: T0048
owner: "@gemini"
session: antigravity-20261117-80b584
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
- [x] **[Read]**      Read ToDo's admin.css, admin spec, the side panel, list, and chip components.
- [x] **[Decide]**    Fix the keys and skeletons, mapping facts onto definition rows where possible.
- [x] **[Implement]** Author failing browser tests for the three parts and the admin console example.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the parts, gallery specimens, the example page, and catalog entries.
- [ ] **[Verify]**    Run the affected tests and the full check suite.
- [x] **[Doc]**       Update components.md, ADR-0004's setups, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-15] **[Doc]**
  Created by T0025 from the approved auth redesign plan, `docs/plans/auth-redesign.md`.

- [2026-11-17] **[Read]**
  Read ToDo's admin.css, admin spec, and wireframes, plus shell.css, list.css, chip.css, contract.json, ADR-0003, ADR-0004, and naming.md.

- [2026-11-17] **[Decided]**
  Chose key detail-panel, mapped facts onto .list--facts and .list--compact with .list__term and .list__value, and named status chips .chip--status with .chip--warning and .chip--danger.

- [2026-11-17] **[Verify]**
  Running red-phase Playwright browser tests under background task task-147.

- [2026-11-17] **[Verify]**
  Confirmed red-phase failures across 4 Vitest assertions and 38 Playwright checks while existing tests passed and before screenshots landed.

- [2026-11-17] **[Implement]**
  Added detail-panel.css, .list--facts, .chip--status, gallery specimens, and shell-admin-console.html; touched undeclared contract.json, gallery.css, ADR-0004, and visual-style-guide.md.
  - Size note: 12 modified files and 356 lines keep contract and docs synchronized.

- [2026-11-17] **[Verify]**
  Running affected Playwright browser suite under background task task-221.

- [2026-11-17] **[Doc]**
  Updated components.md, ADR-0004-app-shell.md, visual-style-guide.md, and CHANGELOG.md under v0.1.1-pre.

- [2026-11-17] **[Visual]**
  Captured before and after gallery and admin console screenshots across neutral, warm, and bright in light and dark.
  - Chip: [before](T0048-promote-the-detail-panel-facts-list-and-status/before-chip-desktop-light.png), [after](T0048-promote-the-detail-panel-facts-list-and-status/after-chip-neutral-desktop-light.png).
  - List: [before](T0048-promote-the-detail-panel-facts-list-and-status/before-list-desktop-light.png), [after](T0048-promote-the-detail-panel-facts-list-and-status/after-list-neutral-desktop-light.png).
  - Shell and console: [before](T0048-promote-the-detail-panel-facts-list-and-status/before-shell-desktop-light.png), [after](T0048-promote-the-detail-panel-facts-list-and-status/after-admin-console-neutral-desktop-light.png), [dark](T0048-promote-the-detail-panel-facts-list-and-status/after-admin-console-warm-desktop-dark.png).

