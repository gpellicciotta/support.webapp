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
  worker: {turns: 2, duration_s: 3600.6, input: 4, output: 8}
work_duration: 1810.3
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
- [ ] **[Implement]** Add the button, banner, chip, and segmented control partials and their gallery sections.
- [ ] **[Verify]**    Run the control tests and the verifier until both pass.
- [ ] **[Visual]**    Capture the gallery control sections per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Read]**
  Read ADR-0003, the catalog, and todos.webapp controls.css, gallery, and gallery-controls and gallery-danger specs at commit 0cf4981.

- [2026-11-12] **[Verify]**
  Recorded red-phase failures: 27 browser tests and 2 static tests fail before the partials exist.

