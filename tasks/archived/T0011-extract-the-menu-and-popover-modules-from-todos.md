---
id: T0011
owner: "@claude"
session: claude-20261112-511d4d
needs: []
branch: task/T0011-extract-the-menu-and-popover-modules-from-todos
worktree: .plan/work/T0011-extract-the-menu-and-popover-modules-from-todos
status: completed
started_at: "2026-11-12T15:56:30Z"
ended_at: "2026-11-12T16:27:20Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 6, duration_s: 2765.6, input: 440, output: 116770, cache_read: 33366206, cache_write: 423412}
  review: {turns: 4, duration_s: 832.4, input: 100, output: 22794, cache_read: 3957538, cache_write: 175078}
work_duration: 1849.8
contributors: "@codex"
review_status: approved
review_round: 2
reviewed_by: "@claude-2"
completion-commit: b81a316c1b0b7a5dcbfef36fd890403f469eeaa9
---
# T0011: Extract the menu and popover modules from todos.webapp as they are, with keyboard support and anchoring

## Goals
Extract `attachMenu`, `attachPopover`, and `anchorPanel` of todos.webapp unchanged in behavior, under [ADR-0003](../../../docs/adrs/ADR-0003-components-and-patterns.md).
Keep roving focus, type-ahead, RTL-aware anchoring, and the `hidden` attribute for now.
A separate task moves popovers to the native attribute afterwards.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0003 and the todos.webapp menu and popover modules and tests at a recorded commit.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Add the menu and popover partials, both modules, and their gallery sections.
- [x] **[Verify]**    Run the menu and popover tests and the verifier until they pass.
- [x] **[Visual]**    Capture the gallery menu sections per theme at 390 and 1440 px.
- [x] **[Doc]**       Update the style guide and CHANGELOG.md.
- [x] **[Implement]** Add an e2e assertion that open menus and popovers paint above gallery specimens.
- [x] **[Verify]**    Record the failing topmost assertion in validation-proof.md.
- [x] **[Implement]** Keep static overlay specimens below open panels and at natural height.
- [x] **[Verify]**    Rerun the specs and the check, then recapture and inspect all screenshots.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Read]**
  Read ADR-0003 and the todos.webapp menu, popover, CSS, and tests at commit 0cf4981.

- [2026-11-12] **[Verify]**
  Ported the todos unit tests, added anchor, blur, and destroy cases, and wrote two gallery specs; all failed before implementation.

- [2026-11-12] **[Decided]**
  Kept menu.js on attachPopover as in todos, and recorded that dependency in the components.md menu skeleton.

- [2026-11-12] **[Implement]**
  Added both partials, the three modules, and gallery sections; mapped todos tokens to contract tokens and radius roles.

- [2026-11-12] **[Doc]**
  Touched undeclared files: gallery.js for wiring, gallery-helpers.js for the shared anchoring check, and components.md for the dependency note.

- [2026-11-12] **[Verify]**
  Unit, completion check, and devops check passed; 24 screenshots stored beside validation-proof.md.
  - Files touched: 6.
  - Lines touched: 132.
  - Reopenings: 0.

- [2026-11-12] **[Visual]**
  Menus and popovers anchor inside the viewport, flipping above near the bottom. Evidence: [before](T0011-extract-the-menu-and-popover-modules-from-todos/before-desktop-light.png), [menu](T0011-extract-the-menu-and-popover-modules-from-todos/after-menu-neutral-mobile-light.png), [after](T0011-extract-the-menu-and-popover-modules-from-todos/after-popover-bright-mobile-dark.png).

- [2026-11-12] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 1 rejected by @claude-2: The module extraction is faithful.
  - Findings: [review-findings-1.md](T0011-extract-the-menu-and-popover-modules-from-todos/review-findings-1.md).

- [2026-11-12] **[Verify]**
  Added expectOnTop with elementFromPoint; desktop menu runs failed because the static popover specimen covered the open menu.

- [2026-11-12] **[Implement]**
  Added an overlay-specimens gallery class with z-index auto and align-items start; component CSS stays unchanged.

- [2026-11-12] **[Visual]**
  Inspected all 24 recaptured screenshots; open panels paint on top and specimens keep natural height. Evidence: [before](T0011-extract-the-menu-and-popover-modules-from-todos/before-desktop-light.png), [after](T0011-extract-the-menu-and-popover-modules-from-todos/after-menu-bright-desktop-light.png).

- [2026-11-12] **[Verify]**
  Completion check and devops check passed after rework.
  - Files touched: 7.
  - Lines touched: 154.
  - Reopenings: 0.

- [2026-11-12] **[Review]**
  Round 2 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 2 approved by @claude-2: Commit `c2b6161` resolves all round 1 findings, and the module extraction from round 1 is unchanged.
  - Findings: [review-findings-2.md](T0011-extract-the-menu-and-popover-modules-from-todos/review-findings-2.md).

- [2026-11-12] **[Complete]**
  Task completed successfully.

