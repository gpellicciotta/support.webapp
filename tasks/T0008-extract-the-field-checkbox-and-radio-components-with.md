---
id: T0008
owner: ~
needs: [T0007]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0008: Extract fields, checkboxes, radios, and createField from todos.webapp, adding forms, validation states, help toggles, and error summaries.

## Goals
Extract the field contract and `createField` of todos.webapp, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md).
`createField` toggles `aria-invalid` and merges `aria-describedby` for hints, counters, and errors.
Add checkbox and radio styles with `accent-color` and visible focus.
Add the form, field group, help toggle, valid and pending states, and error summary of [components.md](../../docs/specs/components.md).
Validation icons come from the shared sprite; show every field and form state in the gallery.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0003 and the todos.webapp field styles and createField at a recorded commit.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the field and choice partials, the field module, and their gallery sections.
- [ ] **[Verify]**    Run the field tests and the verifier until both pass.
- [ ] **[Visual]**    Capture the gallery field sections per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
