---
id: T0007
owner: "@claude"
session: claude-20261112-855208
needs: []
branch: task/T0007-extract-the-button-icon-button-banner-chip-and
worktree: .plan/work/T0007-extract-the-button-icon-button-banner-chip-and
status: active
started_at: "2026-11-12T11:03:09Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 6, duration_s: 4661.0, input: 136, output: 26800, cache_read: 15098796, cache_write: 580958}
  review: {turns: 2, duration_s: 371.4, input: 76, output: 23942, cache_read: 2372544, cache_write: 153346}
work_duration: 7321.5
review_status: rejected
review_round: 1
reviewed_by: "@claude-2"
---
# T0007: Extract the button, icon button, banner, chip, and segmented control components from todos.webapp

## Goals
Extract the CSS-only controls of todos.webapp under the markup contract of [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md).
Cover every state: default, hover, focus-visible, active, disabled, and error where it applies.
Keep 44 px targets, the danger focus ring, and native radio semantics in the segmented control.
Show every variant and state in the gallery.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0003 and the todos.webapp controls stylesheet and gallery tests at a recorded commit.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Add the button, banner, chip, and segmented control partials and their gallery sections.
- [x] **[Verify]**    Run the control tests and the verifier until both pass.
- [x] **[Visual]**    Capture the gallery control sections per theme at 390 and 1440 px.
- [x] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Read]**
  Read ADR-0003, the catalog, and todos.webapp controls.css, gallery, and gallery-controls and gallery-danger specs at commit 0cf4981.

- [2026-11-12] **[Verify]**
  Recorded red-phase failures: 27 browser tests and 2 static tests fail before the partials exist.

- [2026-11-12] **[Implement]**
  Added five partials, the global focus ring in reset.css, gallery sections, and a sunken-ground hover fix with regression tests.
  - Undeclared: icon-button.css, gallery-helpers.js, reset.css, gallery.css.
  - Undeclared: tokens.test.js, gallery.test.js, components.md.

- [2026-11-12] **[Decided]**
  Deferred the link button, which the catalog assigned here but the title, roadmap, and spec omit, to new task T0034.
  - Banner error variant is banner--danger, matching the danger tokens.
  - Segmented keeps the segmented__options wrapper; the catalog skeleton gained it.

- [2026-11-12] **[Verify]**
  The completion check passed 108 tests; devops check passed 543 unit, 132 browser, and 4 integration tests.

- [2026-11-12] **[Visual]**
  Captured the control sections per theme at 390 and 1440 px; see validation-proof.md.
  - [after light 1440](T0007-extract-the-button-icon-button-banner-chip-and/after-controls-light-1440.png).
  - [after dark 1440](T0007-extract-the-button-icon-button-banner-chip-and/after-controls-dark-1440.png).
  - [after light 390](T0007-extract-the-button-icon-button-banner-chip-and/after-controls-light-390.png).
  - [after dark 390](T0007-extract-the-button-icon-button-banner-chip-and/after-controls-dark-390.png).

- [2026-11-12] **[Verify]**
  Recorded task outcomes.
  - Files touched: 8.
  - Lines touched: 363.
  - Reopenings: 0.

- [2026-11-12] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 1 rejected by @claude-2: The work is high quality and nearly complete.
  - Findings: [review-findings-1.md](T0007-extract-the-button-icon-button-banner-chip-and/review-findings-1.md).

- [2026-11-12] **[Implement]**
  Addressed review round 1: single disabled radios now dim their option, with a gallery specimen, a regression test, and updated catalog and guide lines.
  - Undeclared: verify-ui.spec.js skips labels of disabled controls, per WCAG 1.4.3.

- [2026-11-12] **[Verify]**
  Size note: the rework touched verify-ui.spec.js, the ninth counted file; splitting one skip rule would not merge alone.

- [2026-11-12] **[Verify]**
  Rework verified: 2 tests failed first, then the completion check passed 116 and devops check passed 543, 136, and 4.
  - Files touched: 9.
  - Lines touched: 382.
  - Reopenings: 0.

