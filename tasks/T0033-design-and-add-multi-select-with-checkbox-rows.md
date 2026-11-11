---
id: T0033
owner: ~
needs: [T0008, T0016]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0033: Design and add multi-select with checkbox rows, range selection, and a bulk action bar

## Goals
Design and add multi-select with checkbox rows, range selection, and a bulk action bar, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md) and [components.md](../../docs/specs/components.md).
No accessible reference exists in the siblings, so the task records the design for approval first.
Selection uses native checkboxes, Shift for ranges, and announces the selected count.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0003, components.md, naming.md, and the WAI-ARIA pattern the component follows.
- [ ] **[Decide]**    Record the markup skeleton, keyboard model, and states in components.md for user approval.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the selection partials, `attachSelection` in `selection.js`, and the gallery section.
- [ ] **[Verify]**    Run the named tests and the gallery verifier until both pass.
- [ ] **[Visual]**    Capture the new gallery sections per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide, components.md, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 round 2 from the review findings F18 to F20.
