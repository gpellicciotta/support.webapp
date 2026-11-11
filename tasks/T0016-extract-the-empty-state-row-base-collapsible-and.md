---
id: T0016
owner: ~
needs: ['T0007']
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0016: Extract the empty state and the row base components from todos.webapp

## Goals
Extract the empty state and the container-query row base of todos.webapp, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md).
The empty state holds an icon, a title, a text, and at most two actions.
The row base adapts to its column width through a container query, without task-specific parts.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0003 and the todos.webapp empty state and row styles at a recorded commit.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the empty state and row partials and their gallery sections.
- [ ] **[Verify]**    Run the browser test and the verifier until both pass.
- [ ] **[Visual]**    Capture the new gallery sections per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
