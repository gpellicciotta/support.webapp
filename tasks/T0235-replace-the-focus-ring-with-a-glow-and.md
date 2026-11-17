---
id: T0235
owner: "@gemini"
session: antigravity-20261117-a3b972
needs: []
branch: task/T0235-replace-the-focus-ring-with-a-glow-and
worktree: .plan/work/T0235-replace-the-focus-ring-with-a-glow-and
status: active
started_at: "2026-11-17T09:55:39Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0235: Replace the focus ring with a glow, and give menu items room so focus never overlaps neighbors or edges

## Goals
Replace the fixed focus outline in `reset.css` with a glow: a thin focus-colored contour plus a soft halo, keeping a transparent outline for forced colors.
Keep danger controls glowing in the danger color, and keep the contour at 3:1 against every ground.
In menus, the focus indicator overlaps the previous and next items; add spacing between items or use an inset indicator.
Menu focus also nearly touches the menu's side borders; add horizontal room inside the panel.
Apply the same treatment to the gallery's `.is-focus` specimens.
The user requested this after reviewing the gallery on 2026-11-17.

## Task Execution Steps
- [ ] **[Implement]** Implement required changes for T0235.
- [ ] **[Verify]**    Verify implementation with automated test suites.
- [ ] **[Doc]**       Update documentation and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Companion task file scaffolded at task creation.
