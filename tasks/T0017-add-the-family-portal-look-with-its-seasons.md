---
id: T0017
owner: ~
needs: [T0006]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0017: Add the family-portal look with its seasons variant, glyph set, and the look template

## Goals
Extract the family-portal look and its `data-season` variant, add its sprite, and create `src/looks/_template/` from the two looks.
Follow [ADR-0001](../../docs/adrs/ADR-0001-layer-model-and-token-contract.md) and [ADR-0002](../../docs/adrs/ADR-0002-looks.md) and the roadmap.
Refine declared files, size estimate, and tests in the technical specification before starting.

## Task Execution Steps
- [ ] **[Read]**      Read the named ADRs and the source app at a recorded commit.
- [ ] **[Decide]**    Write declared files, size estimate, tests, and the completion check into the technical specification.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Implement the component or look and its gallery specimens.
- [ ] **[Verify]**    Run the tests, the verifier, and the completion check until they pass.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
