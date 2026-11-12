---
id: T0031
owner: "@codex"
session: codex-20261112-605570
needs: []
branch: task/T0031-design-and-add-the-list-and-data-table
worktree: .plan/work/T0031-design-and-add-the-list-and-data-table
status: suspended
started_at: "2026-11-12T20:02:57Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0031: Design and add the list and data table components on native list and table elements

## Goals
Design and add the `list` and `table` components on native list and table elements, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md) and [components.md](../../docs/specs/components.md).
They build on the row base of T0016, and data tables keep header cells and captions.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0003, components.md, naming.md, and the WAI-ARIA pattern the component follows.
- [ ] **[Decide]**    Record the markup skeleton, keyboard model, and states in components.md for user approval.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the list and table partials and their gallery sections.
- [ ] **[Verify]**    Run the named tests and the gallery verifier until both pass.
- [ ] **[Visual]**    Capture the new gallery sections per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide, components.md, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 round 2 from the review findings F18 to F20.

- [2026-11-12] **[Decide]**
  Prepared native list/table markup, keyboard behavior, states, and scroll-region proposal in components.md. User approval remains required before implementation.

- [2026-11-12] **[Verify]**
  Offline Markdown lint passed. Online link checks received W3C HTTP 403 responses. Completion validation remains unsuccessful; implementation awaits design approval. Evidence: companion validation-proof.md.

- [2026-11-12] **[Decide]**
  Committed proposal as 4ccf95d. Approve the proposed native markup, static keyboard model, and focusable table scroll region before implementation.

