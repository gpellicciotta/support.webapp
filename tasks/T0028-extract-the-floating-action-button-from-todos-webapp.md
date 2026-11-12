---
id: T0028
owner: "@codex"
session: codex-20261112-8121f7
needs: []
branch: task/T0028-extract-the-floating-action-button-from-todos-webapp
worktree: .plan/work/T0028-extract-the-floating-action-button-from-todos-webapp
status: active
started_at: "2026-11-12T21:18:06Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0028: Extract the floating action button from todos.webapp into the overlay layer of the shell

## Goals
Extract todos.webapp's floating action button as the `fab` component, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md) and [components.md](../../docs/specs/components.md).
It is the one fixed control, placed in the overlay layer of the shell of ADR-0004.
todos.webapp needs it for a lossless switch, so it lands before the todos.webapp adoption.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0003, components.md, naming.md, and the source app at a recorded commit.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Add the fab partial, its shell placement, and its gallery section.
- [ ] **[Verify]**    Run the named tests and the gallery verifier until both pass.
- [ ] **[Visual]**    Capture the new gallery sections per theme at 390 and 1440 px.
- [x] **[Doc]**       Update the style guide, components.md, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 round 2 from the review findings F18 to F20.

- [2026-11-12] **[Read]**
  Read ADR-0003, ADR-0004, naming, catalog, and todos.webapp at 0cf4981f2fa235a4d48d143b83db24e1f46bd48a. Added shell-todos.html and components.md to declared scope for placement evidence and catalog documentation.

- [2026-11-12] **[Verify]**
  All eight browser cases failed because the fab gallery section and shell overlay control were absent. Captured before screenshots at both widths in both themes.

- [2026-11-12] **[Implement]**
  Added the fab partial, shell placement, gallery states, catalog documentation, and changelog. Browser runs used npx playwright test tests/e2e/fab.spec.js --workers 2; sessions 97258 and 62617 reported server PIDs 23656 and 16864.

