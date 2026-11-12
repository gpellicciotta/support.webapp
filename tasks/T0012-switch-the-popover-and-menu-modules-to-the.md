---
id: T0012
owner: "@claude"
session: claude-20261112-06db8d
needs: []
branch: task/T0012-switch-the-popover-and-menu-modules-to-the
worktree: .plan/work/T0012-switch-the-popover-and-menu-modules-to-the
status: completed
started_at: "2026-11-12T16:51:47Z"
ended_at: "2026-11-12T17:13:08Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 1970.6, input: 252, output: 105962, cache_read: 16159144, cache_write: 290046}
  review: {turns: 2, duration_s: 553.2, input: 48, output: 14064, cache_read: 1525766, cache_write: 107302}
review_status: approved
review_round: 1
reviewed_by: "@claude-2"
work_duration: 1280.2
completion-commit: 964b20312a2fdab52b38158310c9724395d9c2b7
---
# T0012: Switch the popover and menu modules to the native popover attribute, keeping the anchoring code

## Goals
Replace `hidden` toggling with the native `popover` attribute, as decided in [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md).
Keep the anchoring code for placement, and use the platform's light dismiss and top layer.
Keep every existing keyboard behavior and test passing.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0003 and the extracted menu and popover modules.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Move both modules and their styles to the popover attribute.
- [x] **[Verify]**    Run the menu, popover, and overlay tests until they pass.
- [x] **[Visual]**    Capture the gallery menu sections per theme at 390 and 1440 px.
- [x] **[Doc]**       Update the style guide and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Implement]**
  Moved both modules to the popover attribute; trigger clicks call preventDefault, and toggle events follow platform closes.
  - Added tests/unit/popover-shim.js, since happy-dom lacks showPopover.
  - anchorPanel clears right and bottom insets of popovers.

- [2026-11-12] **[Verify]**
  Unit tests, the completion check, and the devops check passed; evidence is in validation-proof.md.
  - Size note: 13 counted files cross the typical line.
  - Undeclared: anchor.js, gallery HTML, gallery-helpers.js, components.md.
  - Reason: the shared anchor and gallery markup need the attribute.

- [2026-11-12] **[Visual]**
  Captured 24 menu and popover screenshots per look and theme at 390 and 1440 px; panels anchor and paint on top. Evidence: [menu](T0012-switch-the-popover-and-menu-modules-to-the/after-menu-warm-mobile-dark.png).

- [2026-11-12] **[Verify]**
  Recorded task outcomes.
  - Files touched: 13.
  - Lines touched: 313.
  - Reopenings: 0.

- [2026-11-12] **[Read]**
  Read ADR-0003, both modules, anchor.js, and their tests; happy-dom lacks showPopover, so unit tests need a shim.

- [2026-11-12] **[Verify]**
  New unit and browser tests failed first: 13 unit and 24 browser failures, recorded in validation-proof.md.

- [2026-11-12] **[Doc]**
  Updated the style guide, the menu skeleton in components.md, and CHANGELOG.md. Evidence: [before](T0012-switch-the-popover-and-menu-modules-to-the/before-menu-neutral-desktop-light.png), [after](T0012-switch-the-popover-and-menu-modules-to-the/after-menu-neutral-desktop-light.png).

- [2026-11-12] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 1 approved by @claude-2: The work meets the goals and approves.
  - Findings: [review-findings-1.md](T0012-switch-the-popover-and-menu-modules-to-the/review-findings-1.md).

- [2026-11-12] **[Complete]**
  Task completed successfully.

