---
id: T0235
owner: "@claude"
session: claude-20261117-9b1540
needs: []
branch: task/T0235-replace-the-focus-ring-with-a-glow-and
worktree: .plan/work/T0235-replace-the-focus-ring-with-a-glow-and
status: completed
started_at: "2026-11-17T09:55:39Z"
ended_at: "2026-11-17T11:08:04Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 5, duration_s: 4027.5, input: 182056, output: 11936, cache_read: 4195758, cache_write: 13072}
  review: {turns: 1, duration_s: 213.0, input: 136730, output: 2851, cache_read: 938880, cache_write: 0}
work_duration: 4345.1
contributors: "@gemini"
review_status: approved
review_round: 1
review_requested_at: "2026-11-17T11:04:27Z"
reviewed_by: "@codex"
review_session: codex-20261117-922d33
completion-commit: 4c9deb7714655f858edf1c58f1f95f7d59036eff
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
- [x] **[Implement]** Implement required changes for T0235.
- [x] **[Verify]**    Verify implementation with automated test suites.
- [x] **[Doc]**       Update documentation and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-17] **[Implement]**
  Replaced the focus outline with a contour-and-halo glow from four base tokens, with inset menu and collapsible variants and wider menu padding.

- [2026-11-17] **[Decided]**
  Lowered the halo to 20%, since 25% left the neutral dark contour at 2.80:1 on active grounds; danger glows are fixed tokens.

- [2026-11-17] **[Doc]**
  Size note: 31 counted files and about 420 lines cross the large line; each component partial owns its focus override.
  - Human size approval is needed before integration.

- [2026-11-17] **[Verify]**
  Full devops check exited 0; a load-related form test flake passed 20 of 20 reruns.
  - Unit: 2163 passed.
  - Browser: 728 passed, 28 skipped.
  - Committed as 52f480c.

- [2026-11-17] **[Verify]**
  Recorded task outcomes.
  - Files touched: 31.
  - Lines touched: 418.
  - Reopenings: 0.

- [2026-11-17] **[Visual]**
  Captured before and after gallery screenshots in light and dark, linked in [validation-proof.md](T0235-replace-the-focus-ring-with-a-glow-and/validation-proof.md#screenshots).
  - [Menu after](T0235-replace-the-focus-ring-with-a-glow-and/after-menu-desktop-light.png).
  - [Menu before](T0235-replace-the-focus-ring-with-a-glow-and/before-menu-desktop-light.png).

- [2026-11-17] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-17] **[Review]**
  Round 1 approved by @codex: [Decided]** Approved.
  - Findings: [review-findings-1.md](T0235-replace-the-focus-ring-with-a-glow-and/review-findings-1.md).

- [2026-11-17] **[Complete]**
  Task completed successfully.

