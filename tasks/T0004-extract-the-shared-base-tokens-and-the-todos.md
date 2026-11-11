---
id: T0004
owner: ~
needs: [T0003]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0004: Extract the shared base tokens, the contract file, and the neutral look from todos.webapp, with the static token test.

## Goals
Create the shared base tokens, `src/contract.json`, and the `neutral` look, following [ADR-0001](../../docs/adrs/ADR-0001-layer-model-and-token-contract.md) and [ADR-0002](../../docs/adrs/ADR-0002-looks.md).
Port the todos.webapp token test, described in [the comparison](../../docs/analysis/ui-design-comparison.md#colors-contrast-and-color-meaning), to check every look.
Keep todos.webapp values exactly; rename only as ADR-0001 lists.
Copy the Inter woff2 files unchanged, and record the todos.webapp commit read.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0001, ADR-0002, and the todos.webapp token files and token test at a recorded commit.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Write the base files, the contract file, and the neutral look with its fonts, filling contract gaps from its primitives.
- [ ] **[Verify]**    Run the token test and the completion check until both pass.
- [ ] **[Doc]**       Write the neutral look page with its gap tokens, and update CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
