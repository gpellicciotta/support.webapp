---
id: T0009
owner: ~
needs: [T0008]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0009: Extract the dialog component and its three confirmation tiers from todos.webapp

## Goals
Extract the native `<dialog>` component, `openDialog`, and `confirmDialog` of todos.webapp, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md).
Keep the focus trap, Escape, focus return, and the sheet layout below 64rem.
Document the three confirmation tiers: modal, in-place, and typing a word.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0003 and the todos.webapp dialog module, styles, and tests at a recorded commit.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the dialog partial, the dialog module, and the gallery section with all tiers.
- [ ] **[Verify]**    Run the dialog tests and the verifier until both pass.
- [ ] **[Visual]**    Capture the gallery dialog section per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
