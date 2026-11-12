---
id: T0011
owner: "@codex"
session: codex-20261112-bdbb20
needs: []
branch: task/T0011-extract-the-menu-and-popover-modules-from-todos
worktree: .plan/work/T0011-extract-the-menu-and-popover-modules-from-todos
status: active
started_at: "2026-11-12T15:56:30Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0011: Extract the menu and popover modules from todos.webapp as they are, with keyboard support and anchoring

## Goals
Extract `attachMenu`, `attachPopover`, and `anchorPanel` of todos.webapp unchanged in behavior, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md).
Keep roving focus, type-ahead, RTL-aware anchoring, and the `hidden` attribute for now.
A separate task moves popovers to the native attribute afterwards.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0003 and the todos.webapp menu and popover modules and tests at a recorded commit.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the menu and popover partials, both modules, and their gallery sections.
- [ ] **[Verify]**    Run the menu and popover tests and the verifier until they pass.
- [ ] **[Visual]**    Capture the gallery menu sections per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
