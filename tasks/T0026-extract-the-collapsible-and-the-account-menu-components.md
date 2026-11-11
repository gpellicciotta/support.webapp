---
id: T0026
owner: ~
needs: [T0012]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0026: Extract the collapsible and the account menu components from todos.webapp

## Goals
Extract the `aria-expanded` collapsible and the account menu of todos.webapp, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md).
The account menu opens a native popover panel, works by keyboard, and marks the current route.
Its placement in the top bar follows ADR-0004.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0003, ADR-0004, and the todos.webapp user menu and collapsibles at a recorded commit.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the collapsible and account menu partials, modules, and gallery sections.
- [ ] **[Verify]**    Run the unit tests and the browser test until they pass.
- [ ] **[Visual]**    Capture the new gallery sections per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
